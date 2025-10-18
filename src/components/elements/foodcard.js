import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../../styles/HomeStyles';

export default function FoodCard({ food, onPress }) {
  return (
    <View style={[styles.cardBase, styles.foodCard]}>
      <Image source={{ uri: food.imagen }} style={styles.foodImage} />

      <View style={styles.foodContent}>
        {/* Nombre */}
        <Text
          style={styles.foodName}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {food.nombre}
        </Text>

        {/* Precio */}
        {food.precio && (
          <Text style={styles.foodPrice}>${food.precio}</Text>
        )}

        {/* Botón "+" */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}