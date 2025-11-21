import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapWebView from '../../components/mapwebview';
import categorystyles from '../../styles/CategoryStyles';
import homestyles from '../../styles/HomeStyles';
import io from 'socket.io-client';
import { API_URL } from "../../config";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage'; // [Importante]

const { height } = Dimensions.get('window');
const SOCKET_URL = API_URL.replace('/api', '');

export default function TrackingScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const order = route.params?.order || {};

    // Ubicación inicial (puede ser la del restaurante si no hay driver aún)
    const startCoords = order.coords || { latitude: -12.0464, longitude: -77.0428 };
    const [driverPos, setDriverPos] = useState(order.driverCoords || startCoords);
    const [myLocation, setMyLocation] = useState(null);

    const webRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        const initTracking = async () => {
            // 1. Permisos y ubicación propia
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
                return;
            }
            const ubicacion = await Location.getCurrentPositionAsync({});
            const clienteCoords = {
                latitude: ubicacion.coords.latitude,
                longitude: ubicacion.coords.longitude,
            };
            setMyLocation(clienteCoords);

            // Actualizar mapa con mi posición (cliente)
            webRef.current?.postMessage(JSON.stringify({
                type: 'cliente',
                lat: clienteCoords.latitude,
                lng: clienteCoords.longitude
            }));

            // 2. Conexión Socket
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            socketRef.current = io(SOCKET_URL, {
                auth: { token }
            });

            socketRef.current.on('connect', () => {
                console.log("Cliente conectado para tracking");
                // Unirse a la sala de la orden
                socketRef.current.emit('join_order', { orderId: order.id });
            });

            // 3. Escuchar actualización del repartidor
            socketRef.current.on('driver_location', (data) => {
                const { coords } = data;
                if (coords) {
                    console.log("Nueva ubicación repartidor:", coords);
                    setDriverPos(coords);

                    // Enviar nueva posición al Webview del mapa
                    // Asumimos que MapWebView maneja mensajes tipo 'driver'
                    webRef.current?.postMessage(JSON.stringify({
                        type: 'driver', // Asegúrate que tu MapWebView maneje esto
                        lat: coords.latitude,
                        lng: coords.longitude
                    }));

                    // Ajustar vista para ver ambos
                    /* Opcional: si quieres auto-zoom constante
                    webRef.current?.postMessage(JSON.stringify({
                      type: 'fit',
                      bounds: [
                        [coords.latitude, coords.longitude],
                        [clienteCoords.latitude, clienteCoords.longitude],
                      ],
                    }));
                    */
                }
            });
        };

        initTracking();

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, []);

    return (
        <View style={styles.container}>
            <View style={categorystyles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
                    <Image source={require('../../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
                </TouchableOpacity>
                <Text style={homestyles.headerTitle}>Tu Pedido</Text>
            </View>

            <View style={styles.mapContainer}>
                {/* Pasamos las coordenadas actualizadas al componente */}
                <MapWebView
                    latitude={driverPos.latitude}
                    longitude={driverPos.longitude}
                    webRefProp={webRef}
                />
            </View>

            <View style={styles.summary}>
                <Text style={homestyles.sectionTitle}>Seguimiento en Vivo</Text>
                <Text style={styles.restName}>{order.restaurantName || 'Restaurante'}</Text>
                <Text style={styles.status}>Estado: {order.estado || 'En camino'}</Text>

                <Text style={[homestyles.sectionTitle, { marginTop: 15 }]}>Detalle</Text>
                <FlatList
                    data={order.items || []}
                    keyExtractor={(i, index) => `${i.id || index}`}
                    renderItem={({ item }) => (
                        <View style={styles.itemRow}>
                            <Text style={styles.itemQty}>x{item.qty || item.cantidad}</Text>
                            <Text style={styles.itemName}>{item.name || item.nombre}</Text>
                            <Text style={styles.itemPrice}>S/ {(item.price || item.precio || 0).toFixed(2)}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    mapContainer: { height: height * 0.55, width: '100%' },
    summary: { flex: 1, padding: 16, backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
    restName: { fontSize: 18, fontWeight: '700', color: '#333' },
    status: { fontSize: 14, color: '#FF6600', fontWeight: '600', marginBottom: 8 },
    itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderColor: '#eee' },
    itemQty: { width: 30, color: '#666', fontWeight: 'bold' },
    itemName: { flex: 1, marginLeft: 8 },
    itemPrice: { width: 70, textAlign: 'right', fontWeight: '600' },
});