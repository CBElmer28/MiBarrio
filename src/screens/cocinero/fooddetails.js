import React from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, 
  Image // <--- 1. IMPORTANTE: Importar Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { eliminarPlatillo } from '../../services/foodService';

export default function FoodDetailsScreen({ route, navigation }) {
  const { food } = route.params || {};

  const handleEliminar = () => {
    Alert.alert(
      "Eliminar",
      "¿Estás seguro de eliminar este platillo?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", style: "destructive",
          onPress: async () => {
            const res = await eliminarPlatillo(food.id);
            if (!res.error) {
                navigation.popToTop(); 
            } else {
                Alert.alert("Error", "No se pudo eliminar");
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles</Text>

        <TouchableOpacity onPress={() => navigation.navigate("CocineroFoodForm", { food })}>
          <Text style={styles.editText}>EDITAR</Text>
        </TouchableOpacity>
      </View>

      {/* 👇 2. CAMBIO AQUÍ: Mostramos la Imagen Real */}
      {food?.imagen ? (
        <Image source={{ uri: food.imagen }} style={styles.imageBig} />
      ) : (
        <View style={[styles.imageBig, {justifyContent:'center', alignItems:'center'}]}>
             <Ionicons name="image-outline" size={50} color="#999" />
        </View>
      )}

      <View style={styles.tabRow}>
        <View style={styles.tab}>
          <Text style={styles.tabText}>
            {/* Mostramos la categoría real si existe */}
            {food?.categorias && food.categorias.length > 0 
                ? food.categorias[0].nombre 
                : "General"}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.name}>{food?.nombre}</Text>
        <Text style={styles.price}>S/ {food?.precio}</Text>
      </View>

      {/* <Text style={styles.location}>📍 Restaurante ID: {food?.restaurante_id}</Text> */}

      <View style={styles.row}>
        <Ionicons name="star" size={16} color="#FF8A00" />
        <Text style={styles.ratingText}>
          {food?.rating || 5.0} (10 Reviews)
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Descripción</Text>
      <Text style={styles.sectionText}>
        {food?.descripcion || "Sin descripción disponible."}
      </Text>

      <TouchableOpacity style={styles.deleteBtn} onPress={handleEliminar}>
        <Text style={styles.deleteText}>ELIMINAR PLATILLO</Text>
      </TouchableOpacity>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#FAFAFA" },
  headerRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, justifyContent: "space-between", marginBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#222" },
  editText: { fontSize: 13, color: "#FF8A00", fontWeight: "700" },
  
  // Estilo de imagen grande
  imageBig: { height: 200, backgroundColor: "#DDD", marginHorizontal: 16, borderRadius: 16, marginBottom: 14, resizeMode: 'cover' },
  
  tabRow: { flexDirection: "row", justifyContent: "flex-start", paddingHorizontal: 16, gap: 10, marginBottom: 10 },
  tab: { backgroundColor: "#FFF5E6", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 14 },
  tabText: { color: "#FF8A00", fontWeight: "600" },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 6 },
  name: { fontSize: 18, fontWeight: "700", flex: 1 },
  price: { fontSize: 18, fontWeight: "700", color: "#222" },
  location: { paddingHorizontal: 16, marginBottom: 10, color: "#777" },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom: 16 },
  ratingText: { marginLeft: 6, color: "#555", fontSize: 13 },
  sectionTitle: { fontSize: 15, fontWeight: "700", paddingHorizontal: 16, marginBottom: 6 },
  sectionText: { paddingHorizontal: 16, color: "#444", marginBottom: 14, lineHeight: 20 },
  deleteBtn: { margin: 20, backgroundColor: '#ffebee', padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#ffcdd2' },
  deleteText: { color: 'red', fontWeight: 'bold' }
});