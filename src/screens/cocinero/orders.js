// src/screens/cocinero/orders.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Datos mock de órdenes en proceso
const mockOrders = [
  {
    id: "32053",
    categoria: "Breakfast",
    nombre: "Chicken Thai Biriyani",
    precio: 60,
  },
  {
    id: "15253",
    categoria: "Breakfast",
    nombre: "Chicken Bhuna",
    precio: 30,
  },
  {
    id: "21200",
    categoria: "Breakfast",
    nombre: "Vegetarian Poutine",
    precio: 35,
  },
];

const OrdersScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Órdenes en proceso</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Lista de órdenes */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {mockOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderLeft}>
              <View style={styles.imagePlaceholder} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.categoryText}>#{order.categoria}</Text>
                <Text style={styles.orderName}>{order.nombre}</Text>
                <Text style={styles.orderId}>ID: {order.id}</Text>
              </View>
            </View>

            <View style={styles.orderRight}>
              <Text style={styles.orderPrice}>S/ {order.precio}</Text>
              <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.readyButton}>
                  <Text style={styles.readyText}>Listo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  orderLeft: {
    flexDirection: "row",
    flex: 1.2,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
  },
  categoryText: {
    fontSize: 11,
    color: "#FF8A00",
    marginBottom: 2,
  },
  orderName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  orderId: {
    fontSize: 11,
    color: "#777",
    marginTop: 2,
  },
  orderRight: {
    flex: 0.8,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: "row",
    gap: 6,
  },
  readyButton: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#FF8A00",
  },
  readyText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  cancelButton: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#FF8A00",
  },
  cancelText: {
    color: "#FF8A00",
    fontSize: 12,
    fontWeight: "600",
  },
});
