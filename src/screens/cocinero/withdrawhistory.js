// src/screens/cocinero/withdrawhistory.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Datos MOCK por ahora (más adelante vendrá del backend)
const mockWithdraws = [
  {
    id: 1,
    fecha: "15/01/2025",
    monto: 120,
    metodo: "Yape",
    estado: "Completado",
  },
  {
    id: 2,
    fecha: "03/01/2025",
    monto: 80,
    metodo: "Cuenta Bancaria",
    estado: "Pendiente",
  },
  {
    id: 3,
    fecha: "22/12/2024",
    monto: 200,
    metodo: "Yape",
    estado: "Completado",
  },
];

export default function WithdrawHistoryScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial de retiros</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* LISTA */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {mockWithdraws.map((item) => (
          <View key={item.id} style={styles.card}>

            {/* Icono de dinero */}
            <MaterialIcons
              name="attach-money"
              size={32}
              color="#FF8A00"
              style={{ marginRight: 10 }}
            />

            {/* INFORMACIÓN DEL RETIRO */}
            <View style={{ flex: 1 }}>
              <Text style={styles.monto}>S/ {item.monto}</Text>
              <Text style={styles.fecha}>{item.fecha}</Text>
              <Text style={styles.metodo}>{item.metodo}</Text>
            </View>

            {/* ESTADO */}
            <View style={styles.estadoBox}>
              <Text style={styles.estadoText(item.estado)}>{item.estado}</Text>
            </View>

          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* ---- ESTILOS ---- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 40,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 18,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  /* Tarjeta individual de retiro */
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  monto: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  fecha: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  metodo: {
    fontSize: 13,
    color: "#333",
    marginTop: 4,
  },

  /* Estado (completado / pendiente) */
  estadoBox: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
  },

  estadoText: (estado) => ({
    fontSize: 12,
    fontWeight: "700",
    color: estado === "Completado" ? "#28A745" : "#D9822B",
  }),
});

