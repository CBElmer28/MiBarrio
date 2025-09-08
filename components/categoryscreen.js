import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { restaurants, foods } from '../data/data';
import styles from '../styles/CategoryStyles';

export default function CategoryScreen() {
  const route = useRoute();
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'Todas');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const categories = ['Todas', 'Hamburguesa', 'Pizza', 'Pollo', 'Café', 'Postres'];

  const filteredFoods = foods.filter(item =>
    selectedCategory === 'Todas' || item.categories.includes(selectedCategory)
  );

  const filteredRestaurants = restaurants.filter(item =>
    selectedCategory === 'Todas' || item.categories.includes(selectedCategory)
  );

  return (
    <View style={styles.container}>
      {/* Header con dropdown */}
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text style={styles.dropdownHeaderText}>{selectedCategory} ▼</Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={styles.dropdownList}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedCategory(cat);
                setDropdownOpen(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView>
        <Text style={styles.sectionTitle}>{selectedCategory} Populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filteredFoods.map(food => (
            <View key={food.id} style={styles.foodCard}>
              <Text>{food.name}</Text>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Restaurantes Disponibles</Text>
        {filteredRestaurants.map(rest => (
          <View key={rest.id} style={styles.restaurantCard}>
            <Text>{rest.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
