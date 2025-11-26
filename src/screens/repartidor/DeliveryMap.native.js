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
const PROXIMITY_THRESHOLD = 50;
const ROUTE_REFETCH_INTERVAL = 5000;

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function DeliveryMap({ route, navigation }) {
    const { order } = route.params;

    // Estados
    const [destination, setDestination] = useState(null);
    const [location, setLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeDistance, setRouteDistance] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const mapRef = useRef(null);
    const socketRef = useRef(null);
    const isAlertShown = useRef(false);
    const lastRouteFetchTime = useRef(0);
    const destRef = useRef(null);

    useEffect(() => {
        destRef.current = destination;
        if (location && destination) {
            fetchRoute(location, destination);
        }
    }, [destination]);

    // Canal Notificación
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('delivery-channel', {
                name: 'Alertas de Entrega',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }, []);

    const sendProximityNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "📍 Llegaste al Destino",
                body: `Ubicación de entrega para ${order.cliente?.nombre || 'el cliente'}.`,
                data: { orderId: order.id },
            },
            trigger: null,
        });
    };

    const fetchRoute = async (origin, dest) => {
        if (!GOOGLE_MAPS_API_KEY || !dest || !origin) return;
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
            }
        } catch (error) {
            console.error("Error ruta:", error);
        }
    };

    useEffect(() => {
        let locationSubscription = null;

        const init = async () => {
            const token = await AsyncStorage.getItem('token');

            // 1. Socket Config
            socketRef.current = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                console.log("Repartidor conectado Socket");
                socketRef.current.emit('start_tracking', { orderId: order.id });
            });

            socketRef.current.on('orden:tracking_started', (data) => {
                console.log("📍 Destino recibido del servidor:", data.destination);
                if (data.destination) {
                    setDestination(data.destination);
                }
            });

            // 2. Permisos
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }

            // 3. Ubicación Inicial
            let initialLocation = await Location.getLastKnownPositionAsync({});
            if (!initialLocation) {
                initialLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            }

            if (initialLocation) {
                setLocation(initialLocation.coords);
            }

            // 4. Tracking en vivo
            locationSubscription = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 2000,
                distanceInterval: 5,
            }, (newLocation) => {
                const currentLoc = newLocation.coords;
                setLocation(currentLoc);
                const now = Date.now();
                const currentDest = destRef.current;

                if (currentDest && now - lastRouteFetchTime.current > ROUTE_REFETCH_INTERVAL) {
                    fetchRoute(currentLoc, currentDest);
                    lastRouteFetchTime.current = now;
                }

                mapRef.current?.animateToRegion({
                    latitude: currentLoc.latitude,
                    longitude: currentLoc.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                }, 1000);

                // Enviar al servidor
                socketRef.current?.emit('send_location', {
                    orderId: order.id,
                    coords: currentLoc,
                });

                // Alerta llegada
                if (currentDest) {
                    const distance = getDistance(currentLoc, currentDest);
                    if (distance < PROXIMITY_THRESHOLD && !isAlertShown.current) {
                        sendProximityNotification();
                        isAlertShown.current = true;
                    }
                }
            });
        };

        init();

        return () => {
            socketRef.current?.disconnect();
            locationSubscription?.remove();
        };
    }, [order.id]);

    if (!location) return <View style={styles.center}><ActivityIndicator size="large" color="#FF6600" /><Text>Obteniendo GPS...</Text></View>;

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
                    />
                )}
            </MapView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('RepartidorDashboard')}>
                <MaterialIcons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <View style={styles.infoBox}>
                <Text style={styles.title}>Entregar a: {order.cliente?.nombre || 'Cliente'}</Text>
                <Text style={styles.address}>{order.direccion_entrega}</Text>
                {routeDistance && <Text style={styles.distance}>Distancia: {routeDistance}</Text>}
                {!destination && <Text style={{ color: 'red', fontSize: 12 }}>Calculando destino...</Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    map: { width: '100%', height: '100%' },
    backButton: {
        position: 'absolute', top: 50, left: 20,
        backgroundColor: 'white', borderRadius: 25, padding: 8, elevation: 5
    },
    infoBox: {
        position: 'absolute', bottom: 30, left: 20, right: 20,
        backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 10
    },
    title: { fontSize: 16, fontWeight: 'bold' },
    address: { fontSize: 14, color: '#666' },
    distance: { fontSize: 14, color: '#FF6600', fontWeight: 'bold', marginTop: 5 }
});