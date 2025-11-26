import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importamos el servicio para traer las órdenes
import { getOrdenesRestaurante } from '../../services/orderService';

export default function DashboardScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState("Cocinero");
  
  // Estado para las métricas
  const [stats, setStats] = useState({
    enProceso: 0,
    completadas: 0,
    ingresosHoy: 0,
    canceladas: 0,
    platoMasVendido: "---",
    ventasDia: 0
  });

  // Función Maestra: Carga datos y calcula todo
  const cargarDashboard = async () => {
    try {
      // 1. Obtener Nombre del Cocinero
      const userJson = await AsyncStorage.getItem('usuario');
      if (userJson) {
        const user = JSON.parse(userJson);
        setNombreUsuario(user.nombre || "Chef");
      }

      // 2. Obtener Órdenes
      const ordenes = await getOrdenesRestaurante();
      
      if (ordenes && Array.isArray(ordenes)) {
        calcularEstadisticas(ordenes);
      }

    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Lógica matemática para el reporte
  const calcularEstadisticas = (ordenes) => {
    const hoy = new Date().toISOString().slice(0, 10); // Fecha "YYYY-MM-DD"
    
    let proceso = 0;
    let completadas = 0;
    let ingresos = 0;
    let canceladas = 0;
    let conteoPlatos = {}; // Para saber cuál se vende más

    ordenes.forEach(orden => {
      // Extraer fecha de la orden (YYYY-MM-DD)
      const fechaOrden = orden.created_at ? orden.created_at.slice(0, 10) : "";
      const esHoy = fechaOrden === hoy;

      // 1. Conteo de Estados
      const estado = orden.estado ? orden.estado.toLowerCase() : "";
      
      if (['pendiente', 'preparando', 'lista', 'asignada'].includes(estado)) {
        proceso++;
      } else if (estado === 'entregada') {
        completadas++;
        // Sumar ingresos solo si es de HOY y está entregada (o pagada)
        if (esHoy) {
            ingresos += parseFloat(orden.total || 0);
        }
      } else if (estado === 'cancelada') {
        if (esHoy) canceladas++;
      }

      // 2. Plato más vendido (Solo de órdenes de hoy que no sean canceladas)
      if (esHoy && estado !== 'cancelada' && orden.detalles) {
        orden.detalles.forEach(d => {
            // Asumiendo que 'detalles' tiene el producto incluido, o al menos el ID
            // Ajusta esto según si tu backend incluye el nombre del platillo en el detalle
            const nombrePlato = d.platillo ? d.platillo.nombre : `Platillo #${d.platillo_id}`;
            conteoPlatos[nombrePlato] = (conteoPlatos[nombrePlato] || 0) + d.cantidad;
        });
      }
    });

    // Buscar el plato ganador
    let platoTop = "Ninguno";
    let maxVentas = 0;
    Object.entries(conteoPlatos).forEach(([nombre, cantidad]) => {
        if (cantidad > maxVentas) {
            maxVentas = cantidad;
            platoTop = nombre;
        }
    });

    setStats({
      enProceso: proceso,
      completadas: completadas, // Histórico total
      ventasDia: completadas,   // Podrías filtrar solo las de hoy si prefieres
      ingresosHoy: ingresos.toFixed(2),
      canceladas: canceladas,
      platoMasVendido: platoTop
    });
  };

  useFocusEffect(
    useCallback(() => {
      cargarDashboard();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    cargarDashboard();
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >

      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcome}>Hola,</Text>
          <Text style={styles.userName}>{nombreUsuario}</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("CocineroProfile")}>
          <View style={styles.avatar}>
             <Ionicons name="person" size={24} color="#555" />
          </View>
        </TouchableOpacity>
      </View>

      {/* MÉTRICAS PRINCIPALES */}
      <View style={styles.statsGrid}>
        <StatCard number={stats.enProceso} label="En proceso" color="#FF8A00" />
        <StatCard number={stats.completadas} label="Entregadas" color="#3AC170" />
        <StatCard number={`S/ ${stats.ingresosHoy}`} label="Ingresos hoy" color="#4DA6FF" />
        <StatCard number="4.9★" label="Rating" color="#FFC02E" />
      </View>

      {/* ACCESOS RÁPIDOS */}
      <Text style={styles.sectionTitle}>Accesos rápidos</Text>

      <View style={styles.quickAccessRow}>
        <QuickButton
          icon="fast-food" label="Artículos"
          onPress={() => navigation.navigate("CocineroFoods")}
        />
        <QuickButton
          icon="receipt" label="Órdenes"
          onPress={() => navigation.navigate("CocineroOrders")}
        />
        <QuickButton
          icon="star" label="Reseñas"
          onPress={() => navigation.navigate("CocineroReviews")}
        />
        <QuickButton
          icon="settings" label="Ajustes"
          onPress={() => navigation.navigate("CocineroSettings")}
        />
      </View>

      {/* GESTIÓN */}
      <Text style={styles.sectionTitle}>Gestión</Text>

      <TouchableOpacity
        style={styles.manageItem}
        onPress={() => navigation.navigate("CocineroFoods")}
      >
        <Ionicons name="fast-food-outline" size={22} color="#FF8A00" />
        <Text style={styles.manageLabel}>Mis artículos</Text>
        <Ionicons name="chevron-forward" size={20} color="#AAA" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.manageItem}
        onPress={() => navigation.navigate("CocineroRepartidores")}
      >
        <Ionicons name="bicycle-outline" size={22} color="#FF8A00" />
        <Text style={styles.manageLabel}>Mis Repartidores</Text>
        <Ionicons name="chevron-forward" size={20} color="#AAA" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.manageItem, styles.addItem]}
        onPress={() => navigation.navigate("CocineroFoodForm")}
      >
        <Ionicons name="add-circle-outline" size={26} color="#FFF" />
        <Text style={[styles.manageLabel, styles.addItemLabel]}>
          Añadir artículo
        </Text>
      </TouchableOpacity>

      {/* RESUMEN DEL DÍA */}
      <Text style={styles.sectionTitle}>Resumen del día</Text>

      <View style={styles.summaryBox}>
        <SummaryLine label="Ventas confirmadas (Hoy)" value={stats.completadas} />
        <SummaryLine label="Plato más vendido" value={stats.platoMasVendido} />
        <SummaryLine label="Cancelaciones" value={stats.canceladas} />
        <SummaryLine label="Ingresos totales" value={`S/ ${stats.ingresosHoy}`} />
      </View>

    </ScrollView>
  );
}

/* UI COMPONENTS */

function StatCard({ number, label, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickButton({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.quickButton} onPress={onPress}>
      <View style={styles.quickIconBox}>
        <Ionicons name={icon} size={22} color="#FF8A00" />
      </View>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function SummaryLine({ label, value }) {
  return (
    <View style={styles.summaryLine}>
      <Text style={styles.summaryLabel}>{label}:</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#FAFAFA" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 20, alignItems: "center" },
  welcome: { fontSize: 14, color: "#777" },
  userName: { fontSize: 20, fontWeight: "700", color: "#222" },
  avatar: { width: 50, height: 50, backgroundColor: "#DDD", borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 25 },
  statCard: { width: "48%", backgroundColor: "#FFF", paddingVertical: 20, borderRadius: 16, alignItems: "center", marginBottom: 16, elevation: 2 },
  statNumber: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#777", marginTop: 4 },
  sectionTitle: { marginLeft: 20, marginBottom: 8, marginTop: 10, fontSize: 16, fontWeight: "700" },
  quickAccessRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 25 },
  quickButton: { alignItems: "center", width: 70 },
  quickIconBox: { backgroundColor: "#FFF", padding: 15, borderRadius: 16, elevation: 2, marginBottom: 6 },
  quickLabel: { fontSize: 12, color: "#333", textAlign: "center" },
  manageItem: { flexDirection: "row", alignItems: "center", padding: 14, marginHorizontal: 20, backgroundColor: "#FFF", borderRadius: 14, elevation: 2, marginBottom: 12 },
  manageLabel: { flex: 1, marginLeft: 10, fontSize: 15, color: "#333" },
  addItem: { backgroundColor: "#FF8A00" },
  addItemLabel: { color: "#FFF", fontWeight: "700" },
  summaryBox: { backgroundColor: "#FFF", marginHorizontal: 20, borderRadius: 16, elevation: 1, padding: 16, marginBottom: 30 },
  summaryLine: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  summaryLabel: { fontSize: 14, color: "#555" },
  summaryValue: { fontSize: 14, fontWeight: "700", color: "#222" },
});