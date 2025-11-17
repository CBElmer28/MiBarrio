import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockFoods = [
  {
    id: "1",
    nombre: "Chicken Thai Biriyani",
    categoria: "Desayuno",
    precio: 60,
    rating: 4.9,
    reviews: 10,
    tipo: "Pick Up",
  },
  {
    id: "2",
    nombre: "Chicken Bhuna",
    categoria: "Almuerzo",
    precio: 30,
    rating: 4.9,
    reviews: 10,
    tipo: "Delivery",
  },
  {
    id: "3",
    nombre: "Mazatlán Halim",
    categoria: "Cena",
    precio: 25,
    rating: 4.9,
    reviews: 10,
    tipo: "Pick Up",
  },
];

export default function FoodsScreen({ navigation }) {
  const [filtro, setFiltro] = useState("All");

  const categorias = ["All", "Desayuno", "Almuerzo", "Cena"];

  const filtrados =
    filtro === "All"
      ? mockFoods
      : mockFoods.filter((f) => f.categoria === filtro);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de artículos</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FILTROS */}
      <View style={styles.filtersRow}>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setFiltro(cat)}
            style={[
              styles.filterButton,
              filtro === cat && styles.filterActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                filtro === cat && styles.filterTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LISTA */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.totalText}>Total {filtrados.length} items</Text>

        {filtrados.map((food) => (
          <TouchableOpacity
            key={food.id}
            style={styles.foodCard}
            onPress={() =>
              navigation.navigate("CocineroFoodDetails", { food })
            }
          >
            <View style={styles.imagePlaceholder} />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.foodName}>{food.nombre}</Text>

              <View style={styles.row}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{food.categoria}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Ionicons name="star" size={14} color="#FF8A00" />
                <Text style={styles.ratingText}>
                  {food.rating} ({food.reviews} Reviews)
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.priceText}>S/ {food.precio}</Text>
              <Text style={styles.typeText}>{food.tipo}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTÓN AÑADIR */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("CocineroFoodForm")}
      >
        <Ionicons name="add" size={26} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 40 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#222" },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#EEE",
  },
  filterActive: {
    backgroundColor: "#FF8A00",
  },
  filterText: { fontSize: 12, color: "#666" },
  filterTextActive: { color: "#FFF", fontWeight: "600" },
  totalText: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: "#777",
    marginBottom: 10,
  },
  foodCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    elevation: 2,
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#D9D9D9",
  },
  foodName: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  tag: {
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 6,
  },
  tagText: { color: "#FF8A00", fontSize: 11 },
  ratingText: { fontSize: 12, color: "#444", marginLeft: 4 },
  priceText: { fontSize: 16, fontWeight: "700", color: "#222" },
  typeText: { fontSize: 12, color: "#777" },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FF8A00",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
