import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Modal, FlatList, Alert, ActivityIndicator, RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

// 👇 Importamos la nueva función getOrdenesRestaurante
import { 
  getRepartidoresDisponibles, 
  asignarOrden, 
  cambiarEstadoOrden,
  getOrdenesRestaurante 
} from '../../services/orderService';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]); // ⬅️ Inicia vacío, sin datos falsos
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados del Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [repartidores, setRepartidores] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // ✅ CARGAR ÓRDENES REALES
  const cargarDatos = async () => {
    const data = await getOrdenesRestaurante();
    // Si el backend devuelve un array, lo usamos. Si no, array vacío.
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
    setRefreshing(false);
  };

  // Carga automática al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  // 🔄 Lógica de Estados (Preparar -> Listo -> Asignar)
  const avanzarEstado = async (orden) => {
    setLoadingAction(true);
    try {
      if (orden.estado === 'pendiente') {
        await cambiarEstadoOrden(orden.id, 'preparando');
        cargarDatos(); // Recargamos para ver el cambio real de la BD
      }
      else if (orden.estado === 'preparando') {
        await cambiarEstadoOrden(orden.id, 'lista');
        cargarDatos();
      }
      else if (orden.estado === 'lista') {
        setOrdenSeleccionada(orden.id);
        const drivers = await getRepartidoresDisponibles();
        const driversDispo = drivers.map(d => ({...d, disponibilidad: "Disponible"}));
        setRepartidores(driversDispo);
        setModalVisible(true);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleAsignar = async (idRepartidor) => {
    const resultado = await asignarOrden(ordenSeleccionada, idRepartidor);
    if (resultado) {
      setModalVisible(false);
      Alert.alert("Éxito", "Orden asignada");
      cargarDatos(); // Recargar lista
    } else {
      Alert.alert("Error", "Fallo al asignar");
    }
  };

  // 🎨 Renderizado del Botón
  const renderBotonAccion = (orden) => {
    let texto = "";
    let color = "#FF8A00";
    let disabled = false;
    // Normalizamos el estado a minúsculas por si acaso
    const estado = orden.estado ? orden.estado.toLowerCase() : "pendiente";

    switch (estado) {
      case "pendiente": texto = "Preparar"; color = "#007bff"; break;
      case "preparando": texto = "Terminar"; color = "#e67e22"; break;
      case "lista": texto = "Asignar Moto"; color = "#28a745"; break;
      case "asignada": texto = "En Camino 🛵"; color = "#6c757d"; disabled = true; break;
      case "entregada": texto = "Entregado ✅"; color = "#28a745"; disabled = true; break;
      default: texto = estado;
    }

    return (
      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: color, opacity: disabled ? 0.6 : 1 }]}
        onPress={() => avanzarEstado(orden)}
        disabled={disabled || loadingAction}
      >
        <Text style={styles.actionText}>{texto}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Órdenes</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8A00" style={{marginTop: 50}}/>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.listContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {orders.length === 0 ? (
             <Text style={{textAlign:'center', marginTop:20, color:'#888'}}>No hay órdenes activas</Text>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={styles.imagePlaceholder} />
                  <View style={styles.textContainer}>
                    <Text style={styles.categoryText}>{order.estado?.toUpperCase()}</Text>
                    {/* Ajusta según tu BD: order.Usuario.nombre o order.cliente_id */}
                    <Text style={styles.orderName}>
                        {order.cliente ? order.cliente.nombre : `Cliente #${order.cliente_id}`}
                    </Text>
                    <Text style={styles.orderId}>ID: {order.id}</Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <Text style={styles.priceText}>S/ {order.total}</Text>
                  <View style={styles.buttonsRow}>
                    {renderBotonAccion(order)}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Modal Asignar */}
      <Modal
        animationType="slide" transparent={true} visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Elegir Repartidor</Text>
            <FlatList
              data={repartidores}
              keyExtractor={(item) => item.id.toString()}
              style={{ width: '100%', maxHeight: 300 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.driverItem} onPress={() => handleAsignar(item.id)}>
                  <Ionicons name="bicycle" size={24} color="#333" />
                  <View style={{marginLeft: 10}}>
                    <Text style={{fontWeight:'bold'}}>{item.nombre}</Text>
                    <Text style={{color:'green', fontSize:12}}>🟢 Disponible</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnClose}>
              <Text style={styles.btnCloseText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7", paddingTop: 40 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 16 },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  listContainer: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 12, marginBottom: 12, flexDirection: "row", justifyContent: "space-between", elevation: 2 },
  cardLeft: { flexDirection: "row", flex: 1.2 },
  cardRight: { flex: 0.9, alignItems: "flex-end", justifyContent: "space-between" },
  imagePlaceholder: { width: 50, height: 50, borderRadius: 10, backgroundColor: "#ddd" },
  textContainer: { marginLeft: 10, justifyContent: 'center' },
  categoryText: { fontSize: 10, color: "#FF8A00", fontWeight: 'bold' },
  orderName: { fontSize: 14, fontWeight: "600" },
  orderId: { fontSize: 11, color: "#777" },
  priceText: { fontSize: 14, fontWeight: "700", marginBottom: 5 },
  buttonsRow: { flexDirection: "row", alignItems: 'center', gap: 5 },
  actionButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, minWidth: 80, alignItems: 'center' },
  actionText: { color: "#FFF", fontSize: 11, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  driverItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderColor: '#eee', width: '100%' },
  btnClose: { marginTop: 15, padding: 10 },
  btnCloseText: { color: 'red', fontWeight: 'bold' }
});