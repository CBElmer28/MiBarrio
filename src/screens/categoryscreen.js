import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { restaurants, foods } from '../../data/data';
import { masterCategories } from '../../data/masterData';
import categorystyles from '../styles/CategoryStyles';
import homestyles from '../styles/HomeStyles';
import AnimatedDropdown from '../components/ui/dropdown';
import {MaterialIcons} from '@expo/vector-icons';

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={categorystyles.headerContainer}>
        {/* 🔙 Flecha */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>

        <AnimatedDropdown
          data={masterCategories}
          selected={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat)}
          color="#FF6600"
        />

        <TouchableOpacity style={categorystyles.iconButton}>
          <Image source={require('../../assets/icons/Search.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={categorystyles.iconButton}>
          <Image source={require('../../assets/icons/Filter.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>
      </View>
      <View style={categorystyles.container}>

        {/*Header */}
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          <Text style={homestyles.sectionTitle}>{selectedCategory} Populares</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredFoods.map(food => (
              <View key={food.id} style={[homestyles.cardBase, homestyles.foodCard]}>
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
            <View key={rest.id} style={[homestyles.cardBase, homestyles.restaurantCard]}>
              <Image source={rest.image} style={homestyles.restaurantImage} />
              <Text style={homestyles.restaurantName}>{rest.name}</Text>
              <Text style={homestyles.categories}>{rest.categories.join(' - ')}</Text>
              <View style={categorystyles.infoRow}>
                <View style={categorystyles.infoItem}>
                  <Image
                    source={require('../../assets/icons/Star.png')}
                    style={[categorystyles.icon, { tintColor: '#FF6600' }]}
                  />
                  <Text style={categorystyles.infoText}>{rest.rating.toFixed(1)}</Text>
                </View>

                <View style={categorystyles.infoItem}>
                  <Image
                    source={require('../../assets/icons/Car.png')}
                    style={[categorystyles.icon, { tintColor: '#FF6600' }]}
                  />
                  <Text style={categorystyles.infoText}>{rest.deliveryCost}</Text>
                </View>

                <View style={categorystyles.infoItem}>
                  <Image
                    source={require('../../assets/icons/Watch.png')}
                    style={[categorystyles.icon, { tintColor: '#FF6600' }]}
                  />
                  <Text style={categorystyles.infoText}>{rest.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

      </View>
    </View>
  );
}