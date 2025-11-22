import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    FlatList,
    Alert,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

// Importamos las funciones del servicio
import {
    getRepartidoresDisponibles,
    asignarOrden,
    cambiarEstadoOrden,
    getOrdenesRestaurante
} from '../../services/orderService';

const OrdersScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Estados para el Modal de Asignación
    const [modalVisible, setModalVisible] = useState(false);
    const [repartidores, setRepartidores] = useState([]);
    const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    // --- 1. CARGA DE DATOS ---
    const cargarDatos = async () => {
        try {
            // Obtenemos las órdenes reales del backend
            const data = await getOrdenesRestaurante();

            // Filtramos para no mostrar las entregadas (opcional, según tu flujo)
            // const activas = Array.isArray(data) ? data.filter(o => o.estado !== 'entregada') : [];
            const lista = Array.isArray(data) ? data : [];

            // Ordenar: Pendientes primero, luego preparando, luego listas
            const prioridad = { 'pendiente': 1, 'preparando': 2, 'lista': 3, 'asignada': 4, 'entregada': 5 };
            lista.sort((a, b) => prioridad[a.estado] - prioridad[b.estado]);

            setOrders(lista);
        } catch (error) {
            console.error("Error cargando órdenes:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Recargar cada vez que la pantalla recibe el foco
    useFocusEffect(
        useCallback(() => {
            cargarDatos();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        cargarDatos();
    };

    // --- 2. LÓGICA DE ESTADOS ---
    const avanzarEstado = async (orden) => {
        setLoadingAction(true);
        try {
            const estadoActual = orden.estado ? orden.estado.toLowerCase() : 'pendiente';

            if (estadoActual === 'pendiente') {
                await cambiarEstadoOrden(orden.id, 'preparando');
                await cargarDatos(); // Recargar para reflejar cambio
            }
            else if (estadoActual === 'preparando') {
                await cambiarEstadoOrden(orden.id, 'lista');
                await cargarDatos();
            }
            else if (estadoActual === 'lista') {
                // Abrir modal para asignar repartidor
                setOrdenSeleccionada(orden.id);
                const drivers = await getRepartidoresDisponibles();
                setRepartidores(drivers);

                if (drivers.length === 0) {
                    Alert.alert("Aviso", "No hay repartidores disponibles en este momento.");
                } else {
                    setModalVisible(true);
                }
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el estado.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleAsignar = async (idRepartidor) => {
        const resultado = await asignarOrden(ordenSeleccionada, idRepartidor);
        if (resultado) {
            setModalVisible(false);
            Alert.alert("Éxito", "Orden asignada al repartidor correctamente.");
            cargarDatos(); // La orden pasará a estado 'asignada'
        } else {
            Alert.alert("Error", "No se pudo asignar la orden.");
        }
    };

    // --- 3. RENDERIZADO ---
    const renderBotonAccion = (orden) => {
        let texto = "";
        let color = "#FF8A00";
        let disabled = false;
        const estado = orden.estado ? orden.estado.toLowerCase() : "pendiente";

        switch (estado) {
            case "pendiente":
                texto = "Preparar";
                color = "#007bff"; // Azul
                break;
            case "preparando":
                texto = "Terminar";
                color = "#e67e22"; // Naranja
                break;
            case "lista":
                texto = "Asignar Moto";
                color = "#28a745"; // Verde
                break;
            case "asignada":
            case "en_camino":
                texto = "En Camino 🛵";
                color = "#6c757d";
                disabled = true;
                break;
            case "entregada":
                texto = "Entregado ✅";
                color = "#28a745";
                disabled = true;
                break;
            default:
                texto = estado;
        }

        return (
            <TouchableOpacity
                style={[
                    styles.actionButton,
                    { backgroundColor: color, opacity: (disabled || loadingAction) ? 0.6 : 1 }
                ]}
                onPress={() => avanzarEstado(orden)}
                disabled={disabled || loadingAction}
            >
                {loadingAction && orden.id === ordenSeleccionada ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.actionText}>{texto}</Text>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
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
                        <View style={{alignItems:'center', marginTop: 50}}>
                            <Ionicons name="receipt-outline" size={50} color="#ccc" />
                            <Text style={{marginTop:10, color:'#888'}}>No hay órdenes activas</Text>
                        </View>
                    ) : (
                        orders.map((order) => (
                            <View key={order.id} style={styles.card}>
                                <View style={styles.cardLeft}>
                                    {/* Icono o Imagen según estado */}
                                    <View style={[styles.statusIndicator, {
                                        backgroundColor:
                                            order.estado === 'lista' ? '#d4edda' :
                                                order.estado === 'preparando' ? '#fff3cd' : '#e2e3e5'
                                    }]}>
                                        <Ionicons
                                            name={order.estado === 'lista' ? "restaurant" : "time"}
                                            size={24}
                                            color={order.estado === 'lista' ? "#155724" : "#856404"}
                                        />
                                    </View>

                                    <View style={styles.textContainer}>
                                        <Text style={styles.orderName}>
                                            {order.cliente?.nombre || `Cliente #${order.usuario_id}`}
                                        </Text>
                                        <Text style={styles.orderDetail}>
                                            Estado: <Text style={{fontWeight:'bold'}}>{order.estado}</Text>
                                        </Text>
                                        <Text style={styles.orderId}>Orden #{order.id}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardRight}>
                                    <Text style={styles.priceText}>S/ {parseFloat(order.total).toFixed(2)}</Text>
                                    <View style={styles.buttonsRow}>
                                        {renderBotonAccion(order)}
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}

            {/* Modal para Asignar Repartidor */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Asignar Repartidor</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>Selecciona un repartidor disponible:</Text>

                        <FlatList
                            data={repartidores}
                            keyExtractor={(item) => item.id.toString()}
                            style={{ width: '100%', maxHeight: 300 }}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.driverItem} onPress={() => handleAsignar(item.id)}>
                                    <View style={styles.driverIcon}>
                                        <Ionicons name="bicycle" size={24} color="#fff" />
                                    </View>
                                    <View style={{marginLeft: 12}}>
                                        <Text style={styles.driverName}>{item.nombre}</Text>
                                        <Text style={styles.driverStatus}>🟢 Disponible</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#ccc" style={{marginLeft:'auto'}} />
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default OrdersScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F7F7", paddingTop: 40 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: '#333' },

    listContainer: { paddingHorizontal: 16, paddingBottom: 24 },

    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 15,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardLeft: { flexDirection: "row", flex: 1, alignItems: 'center' },
    cardRight: { alignItems: "flex-end", justifyContent: "center", paddingLeft: 10 },

    statusIndicator: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

    textContainer: { marginLeft: 12, justifyContent: 'center' },
    orderName: { fontSize: 16, fontWeight: "700", color: '#333' },
    orderDetail: { fontSize: 13, color: "#555", marginTop: 2 },
    orderId: { fontSize: 12, color: "#999", marginTop: 2 },

    priceText: { fontSize: 16, fontWeight: "800", color: '#FF8A00', marginBottom: 8 },

    actionButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 25,
        minWidth: 90,
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 15 },

    driverItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0'
    },
    driverIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
    driverName: { fontWeight: '700', fontSize: 15, color: '#333' },
    driverStatus: { color: '#28a745', fontSize: 12, marginTop: 2 },
});