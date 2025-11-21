import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { io } from "socket.io-client";
import { getDistance } from 'geolib';
import polyline from '@mapbox/polyline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, GOOGLE_MAPS_API_KEY } from '../../config';
import { MaterialIcons } from '@expo/vector-icons';

// Asegurar que la URL del socket sea la base (sin /api)
const SOCKET_URL = API_URL.replace('/api', '');
const PROXIMITY_THRESHOLD = 200;
const ROUTE_REFETCH_INTERVAL = 5000;

// Configuración de notificaciones en primer plano
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function DeliveryMap({ route, navigation }) {
    const { order } = route.params;

    // 1. NUEVO STATE: Para manejar el destino dinámicamente (si el socket lo actualiza)
    const [destination, setDestination] = useState(order.destination || null);

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isAlertShown, setIsAlertShown] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const mapRef = useRef(null);
    const lastRouteFetchTime = useRef(0);
    const socketRef = useRef(null);

    const sendProximityNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Estás Cerca del Destino",
                body: `Has llegado a la ubicación de ${order.cliente?.nombre || 'Cliente'}.`,
                data: { orderId: order.id },
            },
            trigger: null,
        });
    };

    const fetchRoute = async (origin, dest) => {
        if (!GOOGLE_MAPS_API_KEY || !dest) return;
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const json = await response.json();
            if (json.routes && json.routes.length > 0) {
                const points = polyline.decode(json.routes[0].overview_polyline.points);
                const coords = points.map(point => ({
                    latitude: point[0],
                    longitude: point[1],
                }));
                setRouteCoordinates(coords);
            }
        } catch (error) {
            console.error("Error al obtener la ruta:", error);
        }
    };

    // Efecto extra: Si cambia el destino (por el socket) y ya tengo ubicación, recalcular ruta
    useEffect(() => {
        if (location && destination) {
            fetchRoute(location, destination);
        }
    }, [destination]);

    useEffect(() => {
        let locationSubscription = null;

        const initSocketAndTracking = async () => {
            // --- 1. Configuración del Socket ---
            const token = await AsyncStorage.getItem('token');

            socketRef.current = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                console.log("Repartidor conectado al socket:", socketRef.current.id);
                socketRef.current.emit('start_tracking', { orderId: order.id });
            });

            // --- NUEVO: Escuchar evento de inicio de tracking para recibir coordenadas del servidor ---
            socketRef.current.on('orden:tracking_started', (data) => {
                // Si el servidor nos devuelve un objeto 'destination' (geocodificado), actualizamos el mapa
                if (data.destination) {
                    console.log("Coordenadas recibidas del servidor:", data.destination);
                    setDestination(data.destination);
                }
            });

            // --- 2. Permisos ---
            const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
            if (locationStatus !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado. Actívalo en configuración.');
                return;
            }

            const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
            if (notificationStatus !== 'granted') {
                console.warn('Permiso notificaciones denegado');
            }

            // --- 3. Obtener Ubicación Inicial ---
            let initialLocation = null;
            try {
                initialLocation = await Promise.race([
                    Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                        timeout: 5000
                    }),
                    new Promise((_, reject) => setTimeout(() => reject("timeout"), 6000))
                ]);
            } catch (e) {
                console.log("GPS tardó demasiado, usando última ubicación conocida...");
                initialLocation = await Location.getLastKnownPositionAsync({});
            }

            if (!initialLocation) {
                initialLocation = { coords: { latitude: -12.0464, longitude: -77.0428 } };
                Alert.alert("Aviso", "No se pudo obtener ubicación precisa. Usando referencia.");
            }

            setLocation(initialLocation.coords);

            // Trazar ruta inicial (Usamos la variable de estado 'destination')
            if (destination) {
                fetchRoute(initialLocation.coords, destination);
                lastRouteFetchTime.current = Date.now();
            }

            // --- 4. Seguimiento en tiempo real ---
            locationSubscription = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 3000,
                distanceInterval: 10,
            }, (newLocation) => {
                const currentLocation = newLocation.coords;
                setLocation(currentLocation);

                const now = Date.now();
                // Usamos 'destination' (estado) en lugar de 'order.destination'
                if (destination && now - lastRouteFetchTime.current > ROUTE_REFETCH_INTERVAL) {
                    fetchRoute(currentLocation, destination);
                    lastRouteFetchTime.current = now;
                }

                if (mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 1000);
                }

                if (socketRef.current && socketRef.current.connected) {
                    socketRef.current.emit('location_update', {
                        orderId: order.id,
                        coords: currentLocation,
                    });
                }

                if (destination) {
                    const distance = getDistance(currentLocation, destination);
                    if (distance < PROXIMITY_THRESHOLD && !isAlertShown) {
                        sendProximityNotification();
                        setIsAlertShown(true);
                    }
                }
            });
        };

        initSocketAndTracking();

        return () => {
            if (socketRef.current) {
                socketRef.current.emit('stop_tracking', { orderId: order.id });
                socketRef.current.disconnect();
            }
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, [order.id]); // Nota: No añadimos 'destination' aquí para evitar reiniciar todo el socket

    if (errorMsg) {
        return (
            <View style={styles.loadingContainer}>
                <MaterialIcons name="error-outline" size={50} color="red" />
                <Text style={{marginTop: 10, textAlign: 'center'}}>{errorMsg}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: 20}}>
                    <Text style={{color: 'blue'}}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!location) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF6600" />
                <Text style={{ marginTop: 10 }}>Obteniendo ubicación...</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>(Asegúrate de tener el GPS activado)</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* Usamos el state 'destination' en lugar de 'order.destination' */}
                {destination && (
                    <Marker
                        coordinate={destination}
                        title="Destino"
                        description={order.direccion_entrega}
                        pinColor="#1E90FF"
                    />
                )}

                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#FF6600"
                        strokeWidth={4}
                    />
                )}
            </MapView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('RepartidorDashboard')}>
                <MaterialIcons name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <View style={{flex: 1}}>
                        <Text style={styles.title}>
                            Entregar a: {order.cliente?.nombre || 'Cliente'}
                        </Text>
                        <Text style={styles.address} numberOfLines={2}>
                            {order.direccion_entrega}
                        </Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <MaterialIcons name="delivery-dining" size={30} color="#FF6600" />
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    map: { width: '100%', height: '100%' },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 40,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 10
    },
    infoBox: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    address: { fontSize: 14, color: '#666' },
    iconContainer: {
        backgroundColor: '#FFF0E6',
        padding: 10,
        borderRadius: 50,
        marginLeft: 10
    }
});