import React, { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, 
  Image // <--- 1. IMPORTANTE: Importar Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { getMisPlatillos } from '../../services/foodService';

export default function FoodsScreen({ navigation }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("All");

  const cargarDatos = async () => {
    const data = await getMisPlatillos();
    setFoods(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const categoriasUnicas = ["All", ...new Set(foods.map(f => 
    f.categorias && f.categorias.length > 0 ? f.categorias[0].nombre : "Otros"
  ))];

  const filtrados = filtro === "All"
    ? foods
    : foods.filter((f) => {
        const catNombre = f.categorias && f.categorias.length > 0 ? f.categorias[0].nombre : "Otros";
        return catNombre === filtro;
      });

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Artículos</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8A00" style={{marginTop: 50}}/>
      ) : (
        <>
          {/* Filtros */}
          <View style={styles.filtersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categoriasUnicas.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setFiltro(cat)}
                  style={[styles.filterButton, filtro === cat && styles.filterActive]}
                >
                  <Text style={[styles.filterText, filtro === cat && styles.filterTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Lista */}
          <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
            <Text style={styles.totalText}>Total {filtrados.length} items</Text>

            {filtrados.map((food) => (
              <TouchableOpacity
                key={food.id}
                style={styles.foodCard}
                onPress={() => navigation.navigate("CocineroFoodDetails", { food })}
              >
                {/* 👇 2. AQUÍ ESTÁ EL CAMBIO: Renderizamos la imagen si existe */}
                {food.imagen ? (
                   <Image source={{ uri: food.imagen }} style={styles.imagePlaceholder} />
                ) : (
                   // Si no tiene imagen, mostramos el cuadro gris por defecto
                   <View style={[styles.imagePlaceholder, { justifyContent: 'center', alignItems: 'center' }]}>
                      <Ionicons name="image-outline" size={24} color="#ccc" />
                   </View>
                )}

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.foodName}>{food.nombre}</Text>
                  <View style={styles.row}>
                    <View style={styles.tag}>
                      <Text style={styles.tagText}>
                        {food.categorias && food.categorias.length > 0 ? food.categorias[0].nombre : "General"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Ionicons name="star" size={14} color="#FF8A00" />
                    <Text style={styles.ratingText}>{food.rating || 5.0}</Text>
                  </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.priceText}>S/ {food.precio}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

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
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 20, justifyContent: "space-between" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#222" },
  filtersRow: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 12 },
  filterButton: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#EEE", marginRight: 10 },
  filterActive: { backgroundColor: "#FF8A00" },
  filterText: { fontSize: 12, color: "#666" },
  filterTextActive: { color: "#FFF", fontWeight: "600" },
  totalText: { paddingHorizontal: 16, fontSize: 12, color: "#777", marginBottom: 10 },
  foodCard: { flexDirection: "row", backgroundColor: "#FFF", borderRadius: 14, padding: 12, marginBottom: 12, marginHorizontal: 16, elevation: 2, alignItems: "center" },
  
  // Estilo de imagen ajustado para que funcione con <Image>
  imagePlaceholder: { width: 60, height: 60, borderRadius: 12, backgroundColor: "#D9D9D9" },
  
  foodName: { fontSize: 15, fontWeight: "600", marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  tag: { backgroundColor: "#FFF5E6", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginBottom: 6 },
  tagText: { color: "#FF8A00", fontSize: 11 },
  ratingText: { fontSize: 12, color: "#444", marginLeft: 4 },
  priceText: { fontSize: 16, fontWeight: "700", color: "#222" },
  addButton: { position: "absolute", bottom: 30, right: 20, backgroundColor: "#FF8A00", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
});