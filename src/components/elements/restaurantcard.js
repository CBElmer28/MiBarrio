import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function RestaurantCard({ restaurant, onPress }) {
  const categories = restaurant.Categoria?.map(c => c.nombre).slice(0, 2).join(' • ') || 'General';

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      {/* Imagen Grande */}
      <Image source={{ uri: restaurant.imagen }} style={styles.image} />
      
      {/* Tiempo de entrega (Overlay) */}
      <View style={styles.timeBadge}>
        <Text style={styles.timeText}>{restaurant.tiempo_entrega || '30'} min</Text>
      </View>

      {/* Información */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
            <Text style={styles.name}>{restaurant.nombre}</Text>
            <View style={styles.ratingBox}>
                <Text style={styles.rating}>{restaurant.rating || '4.5'}</Text>
                <Ionicons name="star" size={10} color="#FFF" style={{marginLeft: 2}} />
            </View>
        </View>
        
        <Text style={styles.tags}>{categories} • $$</Text>
        
        <View style={styles.footerRow}>
            <View style={styles.deliveryInfo}>
                <MaterialIcons name="delivery-dining" size={16} color="#FF6600" />
                <Text style={styles.deliveryText}>
                    {parseFloat(restaurant.delivery_cost) === 0 ? 'Envío Gratis' : `S/ ${restaurant.delivery_cost}`}
                </Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden', // Para que la imagen respete el borde
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    backgroundColor: '#F0F0F0',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 90, // Ajustado para quedar sobre la imagen
    right: 15,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    elevation: 2,
  },
  timeText: { fontSize: 12, fontWeight: 'bold', color: '#1a1d2e' },
  content: { padding: 15 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 18, fontWeight: '800', color: '#1a1d2e' },
  ratingBox: { 
    backgroundColor: '#28a745', flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 
  },
  rating: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  tags: { fontSize: 13, color: '#888', marginBottom: 10 },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
  deliveryInfo: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  deliveryText: { fontSize: 12, color: '#FF6600', fontWeight: '600' },
});