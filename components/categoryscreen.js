import React, { useState, useEffect } from 'react';
import { View,Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { restaurants, foods } from '../data/data';
import categorystyles from '../styles/CategoryStyles';  
import homestyles from '../styles/HomeStyles';

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
    <View style={categorystyles.container}>
      {/* Header con dropdown */}
      <TouchableOpacity
        style={categorystyles.dropdownHeader}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text style={categorystyles.dropdownHeaderText}>{selectedCategory} ▼</Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={categorystyles.dropdownList}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={idx}
              style={categorystyles.dropdownItem}
              onPress={() => {
                setSelectedCategory(cat);
                setDropdownOpen(false);
              }}
            >
              <Text style={categorystyles.dropdownItemText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView>
        <Text style={homestyles.sectionTitle}>{selectedCategory} Populares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  {filteredFoods.map(food => (
    <View key={food.id} style={homestyles.foodCard}>
      <Image source={food.image} style={homestyles.foodImage} />
      <View style={homestyles.foodContent}>
        <Text style={homestyles.foodName}>{food.name}</Text>
        <Text style={homestyles.foodDetails}>${food.price}</Text>
      </View>
    </View>
  ))}
</ScrollView>


        <Text style={homestyles.sectionTitle}>Restaurantes Disponibles</Text>
        {filteredRestaurants.map(rest => (
  <View key={rest.id} style={homestyles.restaurantCard}>
    <Image source={rest.image} style={homestyles.restaurantImage} />
    <Text style={homestyles.restaurantName}>{rest.name}</Text>
    <Text style={homestyles.categories}>{rest.categories.join(' - ')}</Text>
    <View style={homestyles.infoRow}>
      <Text style={homestyles.infoText}>⭐ {rest.rating}</Text>
      <Text style={homestyles.infoText}>🚚 {rest.deliveryCost}</Text>
      <Text style={homestyles.infoText}>⏱ {rest.time}</Text>
    </View>
  </View>
))}
      </ScrollView>
    </View>
  );
}
