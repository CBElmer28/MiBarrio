import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from "socket.io-client"; // Importar Socket
import styles from '../../styles/DeliveryOrdersStyles';

import { getMisPedidosAsignados } from '../../services/orderService';
import { API_URL } from '../../config'; // Importar API_URL

const SOCKET_URL = API_URL.replace('/api', ''); // URL base para socket

const OrderCard = ({ order, onToggle }) => {
    const navigation = useNavigation();
    const { id, direccion_entrega, cliente, detalles, expanded, total } = order;

    const listaDetalles = detalles || order.OrdenDetalles || [];

    return (
        <View style={styles.orderCard}>
            <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
                <View style={styles.orderHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.orderName}>
                            {cliente ? `Orden para ${cliente.nombre}` : `Orden #${id}`}
                        </Text>
                        <Text style={styles.orderAddress}>{direccion_entrega}</Text>
                        <Text style={styles.itemsCount}>{`${listaDetalles.length} item(s)`}</Text>
                    </View>
                    <MaterialIcons
                        name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                        size={26}
                        color="#555"
                    />
                </View>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.orderDetails}>
                    <Text style={styles.detailsTitle}>Pedidos:</Text>
                    {listaDetalles.map((item, index) => (
                        <View key={item.id || index} style={styles.itemRow}>
                            <Text>{`${item.cantidad}x ${item.platillo?.nombre || 'Platillo'}`}</Text>
                            <Text>{`S/ ${item.subtotal || (item.cantidad * (item.precio || 0)).toFixed(2)}`}</Text>
                        </View>
                    ))}

                    <View style={{marginTop: 10, borderTopWidth: 1, borderColor: '#eee', paddingTop: 5}}>
                        <Text style={{fontWeight: 'bold', textAlign: 'right'}}>Total: S/ {total}</Text>
                    </View>

                    <View style={styles.buttonsRow}>
                        <TouchableOpacity
                            style={styles.mapButton}
                            onPress={() => navigation.navigate('DeliveryMap', { order })}
                        >
                            <MaterialIcons name="map" size={16} color="#fff" />
                            <Text style={styles.mapButtonText}>Ver en Mapa</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

export default function DeliveryOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const socketRef = useRef(null);

    // Función para cargar pedidos
    const fetchOrders = async () => {
        try {
            const data = await getMisPedidosAsignados();
            const formattedOrders = (Array.isArray(data) ? data : []).map(o => ({
                ...o,
                expanded: false,
                cliente: o.cliente || o.Usuario || { nombre: "Cliente" }
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Error cargando pedidos:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 1. Carga Inicial y al volver a la pantalla (Focus)
    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    // 2. Conexión Socket para ACTUALIZACIÓN DINÁMICA
    useEffect(() => {
        const initSocket = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            socketRef.current = io(SOCKET_URL, {
                auth: { token },
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                console.log("Repartidor conectado a Socket (Lista)");
            });

            // ESCUCHAR NUEVAS ASIGNACIONES EN TIEMPO REAL
            socketRef.current.on('orden:asignada:personal', (data) => {
                console.log("Nueva orden recibida por socket:", data);
                Alert.alert("¡Nueva Orden!", "Te han asignado un nuevo pedido.");
                fetchOrders(); // Recargar lista automáticamente
            });
        };

        initSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const toggleExpand = (orderId) => {
        setOrders(currentOrders =>
            currentOrders.map(order =>
                order.id === orderId ? { ...order, expanded: !order.expanded } : order
            )
        );
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.listContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#FF6600" />
                <Text style={{marginTop: 10, color: '#666'}}>Cargando tus pedidos...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#f5f5f5' }}
            contentContainerStyle={styles.listContainer}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6600"]} />
            }
        >
            {/* Este texto cambia dinámicamente según orders.length */}
            <Text style={styles.listTitle}>
                {orders.length > 0
                    ? `Tienes ${orders.length} órdenes asignadas`
                    : "No tienes órdenes asignadas"}
            </Text>

            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onToggle={() => toggleExpand(order.id)}
                />
            ))}
        </ScrollView>
    );
}