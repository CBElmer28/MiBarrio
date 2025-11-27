import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import io from 'socket.io-client';
import polyline from '@mapbox/polyline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { API_URL, GOOGLE_MAPS_API_KEY } from "../../config";
import categorystyles from '../../styles/CategoryStyles';
import homestyles from '../../styles/HomeStyles';

const { height } = Dimensions.get('window');
const SOCKET_URL = API_URL.replace('/api', '');
const ROUTE_REFETCH_INTERVAL = 2000;

// Coordenadas por defecto (Lima)
const DEFAULT_LOCATION = { latitude: -12.0464, longitude: -77.0428 };

export default function TrackingScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const order = route.params?.order || {};

    // Estados
    const [driverPos, setDriverPos] = useState(null);
    const [clientPos, setClientPos] = useState(order.destination || DEFAULT_LOCATION);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [routeInfo, setRouteInfo] = useState({ distance: null, duration: null });
    const [loading, setLoading] = useState(true);

    const mapRef = useRef(null);
    const socketRef = useRef(null);
    const lastRouteFetchTime = useRef(0);

    //  Geocodificar Dirección (Texto -> Coordenadas) ---
    const geocodeAddress = async (address) => {
        if (!GOOGLE_MAPS_API_KEY || !address) return null;
        try {
            let searchAddress = address;
            if (!searchAddress.toLowerCase().includes("peru")) {
                searchAddress += ", Lima, Peru";
            }

            console.log(`📍 Cliente buscando coordenadas para: ${searchAddress}`);
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const json = await response.json();

            if (json.status === 'OK' && json.results.length > 0) {
                const location = json.results[0].geometry.location;
                return {
                    latitude: location.lat,
                    longitude: location.lng
                };
            }
        } catch (error) {
            console.error("Error geocodificando en cliente:", error);
        }
        return null;
    };

    // --- Función de Ruta ---
    const fetchRoute = async (origin, dest) => {
        if (!GOOGLE_MAPS_API_KEY || !origin || !dest) return;
        if (!origin.latitude || !dest.latitude) return;

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${dest.latitude},${dest.longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const json = await response.json();
            if (json.status === 'OK' && json.routes.length > 0) {
                const points = polyline.decode(json.routes[0].overview_polyline.points);
                const coords = points.map(point => ({ latitude: point[0], longitude: point[1] }));
                setRouteCoordinates(coords);

                if (json.routes[0].legs) {
                    setRouteInfo({
                        distance: json.routes[0].legs[0].distance?.text,
                        duration: json.routes[0].legs[0].duration?.text
                    });
                }
            }
        } catch (error) {
            console.error("Error calculando ruta:", error);
        }
    };

    // --- Inicialización ---
    useEffect(() => {
        let isMounted = true;

        const initTracking = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert("Sesión Expirada", "Por favor inicia sesión nuevamente.");
                    navigation.replace('Login');
                    return;
                }
                if (!order.destination && order.direccion_entrega) {
                    const coords = await geocodeAddress(order.direccion_entrega);

                    if (coords && isMounted) {
                        setClientPos(coords);
                    } else {
                        console.warn("No se pudo geocodificar, usando ubicación por defecto");
                    }
                }
                if (isMounted) {
                    socketRef.current = io(SOCKET_URL, {
                        auth: { token },
                        transports: ['websocket'],
                        reconnection: true,
                    });

                    socketRef.current.on('connect', () => {
                        console.log("🟢 Cliente conectado a Socket");
                        socketRef.current.emit('join_order_room', { orderId: order.id });
                    });

                    // Si el tracking ya empezó, el server nos puede mandar el destino calculado también
                    socketRef.current.on('orden:tracking_started', (data) => {
                        if (data.destination && isMounted) {
                            console.log("📍 Destino actualizado por servidor");
                            setClientPos(data.destination);
                        }
                    });

                    socketRef.current.on('driver_position_update', (data) => {
                        const { coords } = data;
                        if (coords && isMounted) {
                            setDriverPos(coords);

                            mapRef.current?.animateCamera({
                                center: coords,
                                zoom: 16,
                            }, { duration: 1000 });

                            const now = Date.now();
                            if (now - lastRouteFetchTime.current > ROUTE_REFETCH_INTERVAL) {
                                lastRouteFetchTime.current = now;
                            }
                        }
                    });
                }

            } catch (err) {
                console.error("Error general init:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        initTracking();

        return () => {
            isMounted = false;
            socketRef.current?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (driverPos && clientPos) {
            fetchRoute(driverPos, clientPos);
        }
    }, [driverPos, clientPos]);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF6600" />
                <Text style={{ marginTop: 10, color: '#666' }}>Cargando mapa...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header con Navegación Segura */}
            <View style={categorystyles.headerContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Main', { screen: 'Orders' })}
                    style={categorystyles.iconButton}
                >
                    <Image source={require('../../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
                </TouchableOpacity>
                <Text style={homestyles.headerTitle}>Rastreo de Pedido</Text>
            </View>

            {/* Mapa */}
            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: clientPos.latitude,
                        longitude: clientPos.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.015,
                    }}
                >
                    <Marker coordinate={clientPos} title="Destino de Entrega" description={order.direccion_entrega}>
                        <View style={styles.markerClient}>
                            <Ionicons name="home" size={20} color="white" />
                        </View>
                    </Marker>

                    {driverPos && (
                        <Marker coordinate={driverPos} title="Repartidor" anchor={{ x: 0.5, y: 0.5 }}>
                            <View style={styles.markerDriver}>
                                <Ionicons name="bicycle" size={22} color="white" />
                            </View>
                        </Marker>
                    )}

                    {routeCoordinates.length > 0 && (
                        <Polyline coordinates={routeCoordinates} strokeColor="#FF6600" strokeWidth={4} />
                    )}
                </MapView>

                {!driverPos && (
                    <View style={styles.waitingBox}>
                        <ActivityIndicator size="small" color="#FF6600" />
                        <Text style={styles.waitingText}>Esperando al repartidor...</Text>
                    </View>
                )}
            </View>

            {/* Panel Info */}
            <View style={styles.summary}>
                <View style={styles.statusHeader}>
                    <Text style={homestyles.sectionTitle}>Estado del Pedido</Text>
                    {routeInfo.duration && (
                        <View style={styles.etaBadge}>
                            <Ionicons name="time" size={14} color="#fff" />
                            <Text style={styles.etaText}>{routeInfo.duration}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.restName}>{order.restaurante?.nombre || order.restaurantName || 'Restaurante'}</Text>
                <Text style={styles.statusText}>{order.estado?.toUpperCase() || 'EN CAMINO'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    mapContainer: { height: height * 0.6, width: '100%' },
    map: { ...StyleSheet.absoluteFillObject },
    summary: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -25,
        elevation: 10
    },
    statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    markerClient: { padding: 6, borderRadius: 20, backgroundColor: '#007AFF', borderWidth: 2, borderColor: 'white' },
    markerDriver: { padding: 8, borderRadius: 20, backgroundColor: '#FF6600', borderWidth: 2, borderColor: 'white' },
    waitingBox: { position: 'absolute', top: 20, alignSelf: 'center', backgroundColor: 'white', padding: 10, borderRadius: 20, flexDirection: 'row', elevation: 4 },
    waitingText: { marginLeft: 10, fontSize: 12, color: '#666' },
    etaBadge: { backgroundColor: '#28a745', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    etaText: { color: 'white', fontSize: 12, marginLeft: 4, fontWeight: 'bold' },
    restName: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
    statusText: { color: '#FF6600', fontWeight: '600', marginBottom: 10 }
});