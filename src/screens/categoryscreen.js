import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { restaurants, foods } from '../../data/data';
import { masterCategories } from '../../data/masterData';
import categorystyles from '../styles/CategoryStyles';  
import homestyles from '../styles/HomeStyles';
import AnimatedDropdown from '../components/ui/dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function CategoryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'Todas');

  const filteredFoods = foods.filter(item =>
    selectedCategory === 'Todas' || item.categories.includes(selectedCategory)
  );

  const filteredRestaurants = restaurants.filter(item =>
    selectedCategory === 'Todas' || item.categories.includes(selectedCategory)
  );

  return (
    <View style={categorystyles.container}>
      {/* 🔹 Header con flecha y dropdown */}
      <View style={categorystyles.headerRow}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={categorystyles.backButton}
  >
    <MaterialIcons name="arrow-back" size={26} color="#FF6600" />
  </TouchableOpacity>

  <AnimatedDropdown
    data={masterCategories}
    selected={selectedCategory}
    onSelect={(cat) => setSelectedCategory(cat)}
    color="#FF6600"
  />
</View>


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