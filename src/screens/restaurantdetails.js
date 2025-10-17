import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { foods } from '../../data/data';
import homestyles from '../styles/HomeStyles';
import categorystyles from '../styles/CategoryStyles';

export default function RestaurantDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { rest } = route.params;

  // Filtrar comidas por restaurante
  const restaurantFoods = foods.filter(food => food.restaurantId === rest.id);

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.foodCard}
      onPress={() => navigation.navigate('FoodDetails', { food: item })}
    >
      <Image source={item.image} style={styles.foodImage} />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.name}</Text>
        <View style={styles.foodDetails}>
          <View style={styles.ratingContainer}>
            <Image 
              source={require('../../assets/icons/Star.png')} 
              style={[styles.smallIcon, { tintColor: '#FFD700' }]} 
            />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.priceText}>S/ {item.price.toFixed(2)}</Text>
        </View>
        <Text style={styles.categoryText}>{item.categories.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>

        <Image source={rest.image} style={styles.image} />
        <Text style={styles.name}>{rest.name}</Text>
        <Text style={styles.categories}>{rest.categories.join(' - ')}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Image source={require('../../assets/icons/Star.png')} style={[homestyles.icon, { tintColor: '#FF6600' }]} />
            <Text style={homestyles.infoText}>{rest.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Image source={require('../../assets/icons/Car.png')} style={[homestyles.icon, { tintColor: '#FF6600' }]} />
            <Text style={homestyles.infoText}>{rest.deliveryCost}</Text>
          </View>
          <View style={styles.infoItem}>
            <Image source={require('../../assets/icons/Watch.png')} style={[homestyles.icon, { tintColor: '#FF6600' }]} />
            <Text style={homestyles.infoText}>{rest.time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.menuTitle}>🍽️ Menú del Restaurante</Text>
        
        {restaurantFoods.length > 0 ? (
          <View style={styles.foodList}>
            {restaurantFoods.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.foodCard}
                onPress={() => navigation.navigate('FoodDetails', { food: item })}
              >
                <Image source={item.image} style={styles.foodImage} />
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <View style={styles.foodDetails}>
                    <View style={styles.ratingContainer}>
                      <Image 
                        source={require('../../assets/icons/Star.png')} 
                        style={[styles.smallIcon, { tintColor: '#FFD700' }]} 
                      />
                      <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    </View>
                    <Text style={styles.priceText}>S/ {item.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.categoryText}>{item.categories.join(', ')}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>😔 No hay platillos disponibles</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  image: { 
    width: '100%', 
    height: 250,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: { 
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    color: '#222',
  },
  categories: { 
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginBottom: 24,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2C3E50',
  },
  foodList: {
    gap: 16,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  foodImage: {
    width: 120,
    height: 120,
  },
  foodInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  foodDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  smallIcon: {
    width: 16,
    height: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6600',
  },
  categoryText: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});