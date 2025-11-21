import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../../styles/HomeStyles';


export default function RestaurantCard({ restaurant, onPress }) {
      const categories = restaurant.Categoria?.map(c => c.nombre) || [];
  return (
    <TouchableOpacity
      style={[styles.cardBase, styles.restaurantCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{uri: restaurant.imagen}} style={styles.restaurantImage} />
      <Text style={styles.restaurantName}>{restaurant.nombre}</Text>
      <Text style={styles.categories}>
        {categories?.join(' - ')}
      </Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Image
            source={require('../../../assets/icons/Star.png')}
            style={[styles.icon, { tintColor: '#FF6600' }]}
          />
          <Text style={styles.infoText}>
              {restaurant.rating ? Number(restaurant.rating).toFixed(1) : '0.0'}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Image
            source={require('../../../assets/icons/Car.png')}
            style={[styles.icon, { tintColor: '#FF6600' }]}
          />
          <Text style={styles.infoText}>
            {restaurant.delivery_cost || '—'}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Image
            source={require('../../../assets/icons/Watch.png')}
            style={[styles.icon, { tintColor: '#FF6600' }]}
          />
          <Text style={styles.infoText}>
            {restaurant.tiempo_entrega || '—'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
