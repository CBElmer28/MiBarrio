import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FoodDetailsScreen({ route, navigation }) {
  const { food } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("CocineroFoodForm", { food })}
        >
          <Text style={styles.editText}>EDITAR</Text>
        </TouchableOpacity>
      </View>

      {/* IMAGEN */}
      <View style={styles.imageBig} />

      {/* TABS DE CATEGORÍA */}
      <View style={styles.tabRow}>
        <View style={styles.tab}>
          <Text style={styles.tabText}>
            {food?.categoria || "Desayuno"}
          </Text>
        </View>

        <View style={styles.tab}>
          <Text style={styles.tabText}>{food?.tipo || "Delivery"}</Text>
        </View>
      </View>

      {/* NOMBRE + PRECIO */}
      <View style={styles.infoRow}>
        <Text style={styles.name}>{food?.nombre}</Text>
        <Text style={styles.price}>S/ {food?.precio}</Text>
      </View>

      {/* UBICACIÓN */}
      <Text style={styles.location}>📍 Kentucky 39495</Text>

      {/* RATING */}
      <View style={styles.row}>
        <Ionicons name="star" size={16} color="#FF8A00" />
        <Text style={styles.ratingText}>
          {food?.rating || 4.9} ({food?.reviews || 10} Reviews)
        </Text>
      </View>

      {/* INGREDIENTES */}
      <Text style={styles.sectionTitle}>Ingredientes</Text>
      <Text style={styles.sectionText}>
        {food?.ingredientes || "Sal\nPimienta\nPapa"}
      </Text>

      {/* DESCRIPCIÓN */}
      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.sectionText}>
        {food?.detalles ||
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet velit."}
      </Text>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#FAFAFA" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerTitle: { fontSize: 18, fontWeight: "700", color: "#222" },
  editText: { fontSize: 13, color: "#FF8A00", fontWeight: "700" },

  imageBig: {
    height: 180,
    backgroundColor: "#DDD",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 10,
  },

  tab: {
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tabText: { color: "#FF8A00", fontWeight: "600" },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  name: { fontSize: 18, fontWeight: "700" },
  price: { fontSize: 18, fontWeight: "700", color: "#222" },

  location: {
    paddingHorizontal: 16,
    marginBottom: 10,
    color: "#777",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  ratingText: { marginLeft: 6, color: "#555", fontSize: 13 },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  sectionText: {
    paddingHorizontal: 16,
    color: "#444",
    marginBottom: 14,
    lineHeight: 20,
  },
});
