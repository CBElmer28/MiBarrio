import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Orders() {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('active');

    // --- 1. Carga de Datos ---
    const fetchOrders = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_URL}/orden/mis-ordenes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data.sort((a, b) => b.id - a.id));
            }
        } catch (error) {
            console.error("Error cargando pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    // Recargar al entrar a la pantalla
    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    // --- 2. Lógica de Filtro ---
    const filteredOrders = orders.filter(o => {
        const status = o.estado ? o.estado.toLowerCase() : '';
        const isCompleted = ['entregada', 'cancelada'].includes(status);
        return tab === 'history' ? isCompleted : !isCompleted;
    });

    // --- 3. Colores por Estado ---
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendiente': return '#FFC107';
            case 'preparando': return '#FF9800';
            case 'lista': return '#4CAF50';
            case 'asignada': return '#2196F3';
            case 'en_camino': return '#FF6600';
            case 'entregada': return '#00E676';
            case 'cancelada': return '#F44336';
            default: return '#999';
        }
    };

    // --- 4. Manejo de Clic en Orden ---
    const handlePressOrder = (order) => {
        const status = order.estado ? order.estado.toLowerCase() : '';
        if (['entregada', 'cancelada'].includes(status)) {
            Alert.alert("Pedido Finalizado", `Esta orden fue ${status}.`);
            return;
        }

        navigation.navigate('TrackingScreen', { order });
    };

    // --- 5. Render Item ---
    const renderItem = ({ item }) => {
        const primerDetalle = item.detalles?.[0] || item.OrdenDetalles?.[0];
        const nombrePlatillo = primerDetalle?.platillo?.nombre || primerDetalle?.Platillo?.nombre || 'Platillo';
        const cantidad = primerDetalle?.cantidad || 1;
        const extraCount = (item.detalles?.length || item.OrdenDetalles?.length || 0) - 1;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => handlePressOrder(item)}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.restName}>Orden #{item.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
                        <Text style={styles.statusText}>{item.estado?.toUpperCase() || 'PENDIENTE'}</Text>
                    </View>
                </View>

                {primerDetalle && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailText}>
                            {cantidad}x {nombrePlatillo}
                            {extraCount > 0 ? ` + ${extraCount} más` : ''}
                        </Text>
                    </View>
                )}

                <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.totalPrice}>S/ {parseFloat(item.total).toFixed(2)}</Text>
                        {/* Icono indicador de que se puede tocar */}
                        {!['entregada', 'cancelada'].includes(item.estado?.toLowerCase()) && (
                            <Ionicons name="chevron-forward" size={16} color="#666" style={{marginLeft: 5}}/>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Mis Pedidos</Text>
                <View style={{width: 40}} />
            </View>

            {/* Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tabItem, tab === 'active' && styles.tabActive]}
                    onPress={() => setTab('active')}
                >
                    <Text style={[styles.tabText, tab === 'active' && styles.tabTextActive]}>En Curso</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabItem, tab === 'history' && styles.tabActive]}
                    onPress={() => setTab('history')}
                >
                    <Text style={[styles.tabText, tab === 'history' && styles.tabTextActive]}>Historial</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator color="#FF6B35" style={{marginTop: 50}} />
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchOrders} tintColor="#FF6B35" />}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={60} color="#444" />
                            <Text style={styles.emptyText}>
                                {tab === 'active' ? "No tienes pedidos en curso." : "No tienes historial de pedidos."}
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1a1d2e' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
    backBtn: { padding: 8, backgroundColor: '#2a2d3e', borderRadius: 12 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 10 },
    tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#2a2d3e' },
    tabActive: { borderBottomColor: '#FF6B35' },
    tabText: { color: '#8B8D98', fontSize: 14, fontWeight: '600' },
    tabTextActive: { color: '#fff' },
    list: { padding: 20 },
    card: { backgroundColor: '#252838', borderRadius: 16, padding: 16, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    restName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    detailRow: { marginBottom: 12 },
    detailText: { color: '#ccc', fontSize: 14 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12 },
    dateText: { color: '#8B8D98', fontSize: 12 },
    totalPrice: { color: '#FF6B35', fontSize: 16, fontWeight: 'bold' },
    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: '#666', marginTop: 16, fontSize: 16 },
});