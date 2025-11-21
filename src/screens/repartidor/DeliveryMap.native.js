import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform, Alert } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { io } from "socket.io-client";
import { getDistance } from 'geolib';
import polyline from '@mapbox/polyline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, GOOGLE_MAPS_API_KEY } from '../../config';
import { MaterialIcons } from '@expo/vector-icons';

const SOCKET_URL = API_URL.replace('/api', '');
const PROXIMITY_THRESHOLD = 50; // 50 metros
const ROUTE_REFETCH_INTERVAL = 15000;

// 1. Configuración global de notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function DeliveryMap({ route, navigation }) {
    const { order } = route.params;

    const [destination, setDestination] = useState(order.destination || null);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isAlertShown, setIsAlertShown] = useState(false);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeDistance, setRouteDistance] = useState(null);

    const mapRef = useRef(null);
    const lastRouteFetchTime = useRef(0);
    const socketRef = useRef(null);

    // 2. Crear Canal de Notificación (Android) - Ejecutar solo una vez
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('delivery-channel', {
                name: 'Alertas de Entrega',
                importance: Notifications.AndroidImportance.MAX, // 🔥 IMPORTANTE: MAX para banner flotante
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default',
                enableVibrate: true,
            });
        }
    }, []);

    const sendProximityNotification = async () => {
        console.log("🔔 Enviando notificación de llegada...");

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "📍 ¡Llegaste al Destino!",
                body: `Estás en el punto de entrega de ${order.cliente?.nombre || 'el cliente'}.`,
                data: { orderId: order.id },
                sound: true, // Sonido por defecto
                // 🔥 CLAVE: Asignar el canal de prioridad máxima creado arriba
                color: '#FF6600',
                vibrate: [0, 250, 250, 250],
            },
            trigger: {
                channelId: 'delivery-channel', // 🔥 Vincular con el canal configurado
                seconds: 1 // Disparar casi inmediatamente
            },
        });
    };

    const fetchRoute = async (origin, dest) => {
        if (!GOOGLE_MAPS_API_KEY || !dest) return;

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const json = await response.json();

            if (json.status === 'OK' && json.routes.length > 0) {
                const points = polyline.decode(json.routes[0].overview_polyline.points);
                const coords = points.map(point => ({
                    latitude: point[0],
                    longitude: point[1],
                }));
                setRouteCoordinates(coords);

                if (json.routes[0].legs && json.routes[0].legs[0].distance) {
                    setRouteDistance(json.routes[0].legs[0].distance.text);
                }
            } else {
                console.warn(`⚠️ Error API Rutas: ${json.status}`);
            }
        } catch (error) {
            console.error("❌ Error obteniendo ruta:", error);
        }
    };

    // Efecto inicial para cargar ruta si ya hay datos
    useEffect(() => {
        if (location && destination) {
            fetchRoute(location, destination);
        }
    }, [destination]); // Solo si cambia el destino (o al cargar ubicación inicial abajo)

    useEffect(() => {
        let locationSubscription = null;

        const initSocketAndTracking = async () => {
            // Socket
            const token = await AsyncStorage.getItem('token');
            socketRef.current = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                console.log("Socket conectado:", socketRef.current.id);
                socketRef.current.emit('start_tracking', { orderId: order.id });
            });

            socketRef.current.on('orden:tracking_started', (data) => {
                if (data.destination) {
                    setDestination(data.destination);
                }
            });

            // Permisos
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }

            // Permisos Notificaciones
            await Notifications.requestPermissionsAsync();

            // Ubicación Inicial
            let initialLocation = await Location.getLastKnownPositionAsync({});
            if (!initialLocation) {
                initialLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            }

            if (initialLocation) {
                setLocation(initialLocation.coords);
                if (destination) {
                    fetchRoute(initialLocation.coords, destination);
                    lastRouteFetchTime.current = Date.now();
                }
            }

            // Tracking en tiempo real
            locationSubscription = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 4000,
                distanceInterval: 10,
            }, (newLocation) => {
                const currentLocation = newLocation.coords;
                setLocation(currentLocation);

                // Actualizar ruta cada cierto tiempo
                const now = Date.now();
                if (destination && now - lastRouteFetchTime.current > ROUTE_REFETCH_INTERVAL) {
                    fetchRoute(currentLocation, destination);
                    lastRouteFetchTime.current = now;
                }

                // Mover cámara
                mapRef.current?.animateToRegion({
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                }, 1000);

                // Emitir socket
                socketRef.current?.emit('location_update', {
                    orderId: order.id,
                    coords: currentLocation,
                });

                // Verificar llegada
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
            socketRef.current?.disconnect();
            locationSubscription?.remove();
        };
    }, [order.id]);

    if (errorMsg) return <View style={styles.center}><Text>{errorMsg}</Text></View>;
    if (!location) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6600" /></View>;

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
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
                        strokeWidth={5}
                        zIndex={1} // Asegura que esté encima del mapa
                    />
                )}
            </MapView>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigate('RepartidorDashboard')}
            >
                <MaterialIcons name="arrow-back" size={24} color="#333" />
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
                        {routeDistance && (
                            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
                                <MaterialIcons name="linear-scale" size={16} color="#666" />
                                <Text style={styles.distanceText}> Distancia: {routeDistance}</Text>
                            </View>
                        )}
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    map: { width: '100%', height: '100%' },
    backButton: {
        position: 'absolute', top: Platform.OS === 'ios' ? 50 : 40, left: 20,
        backgroundColor: 'white', borderRadius: 25, padding: 8, elevation: 5, zIndex: 10
    },
    infoBox: {
        position: 'absolute', bottom: 30, left: 20, right: 20,
        backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 10
    },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    address: { fontSize: 14, color: '#666' },
    distanceText: { fontSize: 14, color: '#FF6600', fontWeight: 'bold' },
    iconContainer: { backgroundColor: '#FFF0E6', padding: 10, borderRadius: 50, marginLeft: 10 }
});