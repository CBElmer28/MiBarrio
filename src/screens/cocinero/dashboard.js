import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.welcome}>Hola,</Text>
          <Text style={styles.userName}>Cocinero Soma</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("CocineroProfile")}>
          <View style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* MÉTRICAS PRINCIPALES */}
      <View style={styles.statsGrid}>
        <StatCard number="20" label="En proceso" color="#FF8A00" />
        <StatCard number="5" label="Completadas" color="#3AC170" />
        <StatCard number="S/ 241" label="Ingresos hoy" color="#4DA6FF" />
        <StatCard number="4.9★" label="Rating" color="#FFC02E" />
      </View>

      {/* ACCESOS RÁPIDOS */}
      <Text style={styles.sectionTitle}>Accesos rápidos</Text>

      <View style={styles.quickAccessRow}>
        <QuickButton
          icon="fast-food"
          label="Artículos"
          onPress={() => navigation.navigate("CocineroFoods")}
        />
        <QuickButton
          icon="receipt"
          label="Órdenes"
          onPress={() => navigation.navigate("CocineroOrders")}
        />
        <QuickButton
          icon="star"
          label="Reseñas"
          onPress={() => navigation.navigate("CocineroReviews")}
        />
        <QuickButton
          icon="settings"
          label="Ajustes"
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
        style={[styles.manageItem, styles.addItem]}
        onPress={() => navigation.navigate("CocineroFoodForm")}
      >
        <Ionicons name="add-circle-outline" size={26} color="#FFF" />
        <Text style={[styles.manageLabel, styles.addItemLabel]}>
          Añadir artículo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.manageItem}
        onPress={() => navigation.navigate("CocineroReviews")}
      >
        <Ionicons name="star-outline" size={22} color="#FF8A00" />
        <Text style={styles.manageLabel}>Reseñas</Text>
        <Ionicons name="chevron-forward" size={20} color="#AAA" />
      </TouchableOpacity>

      {/* RESUMEN DEL DÍA */}
      <Text style={styles.sectionTitle}>Resumen del día</Text>

      <View style={styles.summaryBox}>
        <SummaryLine label="Ventas del día" value="12" />
        <SummaryLine label="Plato más vendido" value="Pollo Frito" />
        <SummaryLine label="Cancelaciones" value="1" />
        <SummaryLine label="Tiempo promedio" value="18 min" />
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
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#FAFAFA",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  welcome: { fontSize: 14, color: "#777" },
  userName: { fontSize: 20, fontWeight: "700", color: "#222" },

  avatar: {
    width: 50,
    height: 50,
    backgroundColor: "#DDD",
    borderRadius: 25,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },

  statNumber: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#777", marginTop: 4 },

  sectionTitle: {
    marginLeft: 20,
    marginBottom: 8,
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
  },

  quickAccessRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 25,
  },

  quickButton: { alignItems: "center", width: 70 },

  quickIconBox: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 16,
    elevation: 2,
    marginBottom: 6,
  },

  quickLabel: { fontSize: 12, color: "#333", textAlign: "center" },

  manageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 14,
    elevation: 2,
    marginBottom: 12,
  },

  manageLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#333",
  },

  addItem: {
    backgroundColor: "#FF8A00",
  },

  addItemLabel: {
    color: "#FFF",
    fontWeight: "700",
  },

  summaryBox: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 1,
    padding: 16,
  },

  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },
});
