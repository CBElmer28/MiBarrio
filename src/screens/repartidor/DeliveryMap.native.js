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
const PROXIMITY_THRESHOLD = 30;
const ROUTE_REFETCH_INTERVAL = 1000; // 1 segundo para actualización fluida

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
    const isAlertShown = useRef(false);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeDistance, setRouteDistance] = useState(null);

    const mapRef = useRef(null);
    const lastRouteFetchTime = useRef(0);
    const socketRef = useRef(null);
    const destinationRef = useRef(destination);
    useEffect(() => {
        destinationRef.current = destination;
    }, [destination]);

    // Canal de Notificación (Android)
    useEffect(() => {
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('delivery-channel', {
                name: 'Alertas de Entrega',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: 'default',
                enableVibrate: true,
            });
        }
    }, []);

    const sendProximityNotification = async () => {
        console.log("🔔 Enviando notificación única de llegada...");

        await Notifications.scheduleNotificationAsync({
            content: {
                title: "📍 ¡Llegaste al Destino!",
                body: `Estás en el punto de entrega de ${order.cliente?.nombre || 'el cliente'}.`,
                data: { orderId: order.id },
                sound: true,
                color: '#FF6600',
                vibrate: [0, 250, 250, 250],
            },
            trigger: {
                channelId: 'delivery-channel',
                seconds: null
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
            }
        } catch (error) {
            console.error("❌ Error ruta:", error);
        }
    };

    useEffect(() => {
        if (location && destination) {
            fetchRoute(location, destination);
        }
    }, [destination]);

    useEffect(() => {
        let locationSubscription = null;

        const initSocketAndTracking = async () => {
            // Resetear alerta al iniciar tracking de una orden
            isAlertShown.current = false;

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

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permiso de ubicación denegado');
                return;
            }

            await Notifications.requestPermissionsAsync();

            let initialLocation = await Location.getLastKnownPositionAsync({});
            if (!initialLocation) {
                initialLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            }

            if (initialLocation) {
                setLocation(initialLocation.coords);
                if (destinationRef.current) {
                    fetchRoute(initialLocation.coords, destinationRef.current);
                    lastRouteFetchTime.current = Date.now();
                }
            }

            locationSubscription = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
                timeInterval: 2000,
                distanceInterval: 2,
            }, (newLocation) => {
                const currentLocation = newLocation.coords;
                setLocation(currentLocation);

                const now = Date.now();
                if (destinationRef.current && now - lastRouteFetchTime.current > ROUTE_REFETCH_INTERVAL) {
                    fetchRoute(currentLocation, destinationRef.current);
                    lastRouteFetchTime.current = now;
                }

                mapRef.current?.animateToRegion({
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.015,
                }, 1000);

                socketRef.current?.emit('location_update', {
                    orderId: order.id,
                    coords: currentLocation,
                });

                //  LÓGICA  DE ALERTA
                if (destinationRef.current) {
                    const distance = getDistance(currentLocation, destinationRef.current);
                    if (distance < PROXIMITY_THRESHOLD && !isAlertShown.current) {
                        sendProximityNotification();
                        isAlertShown.current = true;
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
                        strokeWidth={6}
                        zIndex={1}
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