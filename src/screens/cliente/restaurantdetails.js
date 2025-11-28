import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, StatusBar, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_URL } from "../../config";

const { width, height } = Dimensions.get('window');

export default function RestaurantDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { rest } = route.params;
  
  const categories = rest.categorias?.map(c => c.nombre) || [];
  const rating = parseFloat(rest.rating) || 0;
  const deliveryCost = parseFloat(rest.delivery_cost) || 0;
  const time = parseFloat(rest.tiempo_entrega) || 0;

  const [restaurantFoods, setRestaurantFoods] = React.useState([]);

  React.useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await fetch(`${API_URL}/platillos/restaurante/${rest.id}`);
        const data = await res.json();
        setRestaurantFoods(data);
      } catch (err) {
        console.log("Error cargando platillos:", err);
      }
    };
    fetchFoods();
  }, []);

  // --- ITEM DE COMIDA (Horizontal Clean) ---
  const renderFoodItem = ({ item }) => (
    <TouchableOpacity
      style={styles.foodCard}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("FoodDetails", { food: item })}
    >
      {/* Imagen cuadrada a la izquierda */}
      <Image source={{ uri: item.imagen }} style={styles.foodImage} />

      {/* Info derecha */}
      <View style={styles.foodInfo}>
        <View>
            <Text style={styles.foodName} numberOfLines={2}>{item.nombre}</Text>
            <Text style={styles.foodDesc} numberOfLines={1}>
                {item.descripcion || "Sin descripción disponible"}
            </Text>
        </View>

        <View style={styles.foodFooter}>
          <Text style={styles.priceText}>S/ {Number(item.precio).toFixed(2)}</Text>
          {/* Botón Agregar Pequeño */}
          <View style={styles.addBtn}>
             <Ionicons name="add" size={18} color="#FFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* IMAGEN HEADER FIJA (Z-Index bajo para que quede al fondo) */}
      <Image source={{uri: rest.imagen}} style={styles.heroImage} />

      {/* GRADIENTE O SOMBRA (Opcional para que se lea bien el botón atrás) */}
      <View style={styles.overlayHeader} />

      {/* BOTÓN ATRÁS */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* CONTENIDO DESLIZABLE (SHEET) */}
      <FlatList
        data={restaurantFoods}
        renderItem={renderFoodItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={40} color="#ccc" />
            <Text style={styles.emptyText}>No hay platillos disponibles</Text>
          </View>
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            {/* Título y Categorías */}
            <Text style={styles.name}>{rest.nombre}</Text>
            <Text style={styles.categories}>{categories.join(' • ')}</Text>

            {/* Info Row (Rating, Delivery, Tiempo) */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.statText}>{rating.toFixed(1)}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.statText}>{time} min</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialIcons name="delivery-dining" size={18} color="#FF6600" />
                <Text style={styles.statText}>
                   {deliveryCost === 0 ? 'Gratis' : `S/ ${deliveryCost}`}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.menuTitle}>Menú</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F8F9FD', // Fondo negro para que la imagen resalte antes de cargar
  },
  heroImage: { 
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%', 
    height: 300, // Un poco más alta para el efecto rebote
    resizeMode: 'cover',
  },
  overlayHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.1)', // Sutil oscurecimiento arriba
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 12,
    zIndex: 10,
    elevation: 5,
  },
  scrollContent: {
    paddingTop: 220, // Empuja el contenido hacia abajo para ver la imagen
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  headerContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 10,
    minHeight: 100, // Asegura que cubra bien
  },
  name: { 
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1d2e',
    marginBottom: 5,
  },
  categories: { 
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { fontWeight: '700', fontSize: 13, color: '#333' },
  statDivider: { width: 1, height: 20, backgroundColor: '#DDD' },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 25 },
  menuTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 15 },

  // Food Item Styles
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginBottom: 15,
    borderRadius: 16,
    padding: 10,
    // Esto es necesario para que se vea dentro del FlatList que tiene fondo blanco
    backgroundColor: '#FFF', 
    marginHorizontal: 25, // Margen lateral para la lista
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: {width:0, height:2}
  },
  foodImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  foodInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  foodName: { fontSize: 16, fontWeight: '700', color: '#333' },
  foodDesc: { fontSize: 12, color: '#999', marginTop: 2 },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#FF6600' },
  addBtn: {
    backgroundColor: '#1a1d2e',
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center'
  },

  emptyContainer: { 
    padding: 40, alignItems: 'center', backgroundColor: '#FFF', 
    borderTopLeftRadius: 30, borderTopRightRadius: 30, // Para mantener la forma si está vacío
    minHeight: 500 
  },
  emptyText: { color: '#999', marginTop: 10 },
});