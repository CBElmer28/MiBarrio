import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function FoodCard({ food, onPress }) {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      {/* Imagen con gradiente sutil si se quisiera, aquí limpia */}
      <Image source={{ uri: food.imagen }} style={styles.image} />
      
      {/* Badge de Rating Flotante */}
      <View style={styles.ratingBadge}>
        <Ionicons name="star" size={10} color="#000" />
        <Text style={styles.ratingText}>{food.rating || 4.5}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{food.nombre}</Text>
        <Text style={styles.restaurantName} numberOfLines={1}>
            {food.restaurante?.nombre || "Restaurante"}
        </Text>
        
        <View style={styles.footerRow}>
            <Text style={styles.price}>
                <Text style={styles.currency}>S/ </Text>
                {parseFloat(food.precio).toFixed(0)}
            </Text>
            
            <View style={styles.addBtn}>
                <Ionicons name="add" size={18} color="#FFF" />
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 160,
    height: 220,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 10, // Para la sombra
    marginLeft: 5,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 110, // Mitad de la tarjeta
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: 'cover',
    backgroundColor: '#F0F0F0',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    elevation: 2,
  },
  ratingText: { fontSize: 10, fontWeight: 'bold', color: '#000' },
  infoContainer: { padding: 12, flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 15, fontWeight: '700', color: '#1a1d2e' },
  restaurantName: { fontSize: 12, color: '#999', marginTop: 2 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: '800', color: '#1a1d2e' },
  currency: { fontSize: 12, color: '#FF6600', fontWeight: 'bold' },
  addBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#1a1d2e',
    justifyContent: 'center', alignItems: 'center'
  }
});