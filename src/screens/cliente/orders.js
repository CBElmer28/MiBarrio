import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// Asegúrate de tener este servicio en orderService.js o créalo similar a 'misOrdenes' del backend
import { API_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Orders() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active'); // 'active' | 'history'

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_URL}/orden/mis-ordenes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Ordenar por fecha descendente (ID más alto primero)
        setOrders(data.sort((a, b) => b.id - a.id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtrar órdenes según tab
  const filteredOrders = orders.filter(o => {
    const isCompleted = ['entregada', 'cancelada'].includes(o.estado.toLowerCase());
    return tab === 'history' ? isCompleted : !isCompleted;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pendiente': return '#FFC107'; // Amarillo
      case 'preparando': return '#FF6B35'; // Naranja
      case 'en camino': return '#2196F3'; // Azul
      case 'entregada': return '#4CAF50'; // Verde
      case 'cancelada': return '#F44336'; // Rojo
      default: return '#999';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('TrackingScreen', { order: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.restName}>Orden #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
          <Text style={styles.statusText}>{item.estado.toUpperCase()}</Text>
        </View>
      </View>
      
      {/* Mostrar primer detalle como resumen */}
      {item.detalles && item.detalles.length > 0 && (
        <View style={styles.detailRow}>
          <Text style={styles.detailText}>
            {item.detalles[0].cantidad}x {item.detalles[0].platillo?.nombre || 'Platillo'}
            {item.detalles.length > 1 ? ` + ${item.detalles.length - 1} más` : ''}
          </Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.totalPrice}>S/ {item.total}</Text>
      </View>
    </TouchableOpacity>
  );

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
              <Text style={styles.emptyText}>No hay pedidos en esta sección.</Text>
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