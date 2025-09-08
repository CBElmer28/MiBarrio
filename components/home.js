import React, { useState } from 'react';
import styles from '../styles/HomeStyles';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';

const allData = [
  {
    name: 'Mc Donalds',
    rating: 4.7,
    type: 'Restaurante',
    categories: ['Hamburguesa', 'Pollo'],
    image: require('../assets/images/mcdonalds.jpg'),
  },
  {
    name: 'Burguer King',
    rating: 4.3,
    type: 'Restaurante',
    categories: ['Hamburguesa'],
    image: require('../assets/images/burgerking.jpg'),
  },
  {
    name: 'Starbucks',
    rating: 4.0,
    type: 'Cafetería',
    categories: ['Café', 'Postres'],
    image: require('../assets/images/starbucks.jpg'),
  },
  {
    name: 'Pizza Europea',
    rating: 4.5,
    type: 'Comida',
    categories: ['Pizza'],
    image: require('../assets/images/pizzaeuropea.jpg'),
  },
  {
    name: 'Pizza Buffalo',
    rating: 4.4,
    type: 'Comida',
    categories: ['Pizza'],
    image: require('../assets/images/pizzabuffalo.jpg'),
  },
];

export default function Home({navigation}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Hamburguesa', 'Pizza', 'Pollo', 'Café', 'Postres'];

  const filtered = allData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || item.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const restaurantes = filtered.filter(item => item.type === 'Restaurante' || item.type === 'Cafetería');
  const comidas = filtered.filter(item => item.type === 'Comida');

  return (
    <View style={styles.container}>
      <Text style={styles.header}>ENTREGAR A: Lima Norte</Text>
      <Text style={styles.greeting}>Hey Halal, Buenas Tardes!</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar"
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.filters}>
      {categories.map((cat, i) => (
        <TouchableOpacity
          key={i}
          style={styles.filterButton}
          onPress={() => navigation.navigate('Category', { category: cat })}
        >
          <Text>{cat}</Text>
        </TouchableOpacity>
      ))}
    </View>
      <ScrollView>
        {/* Sección de Restaurantes */}
        {restaurantes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Restaurantes Disponibles</Text>
            {restaurantes.map((item, idx) => (
  <View key={idx} style={styles.restaurantCard}>
    <Image source={item.image} style={styles.restaurantImage} />
    <Text style={styles.restaurantName}>{item.name}</Text>
    <Text style={styles.categories}>{item.categories.join(' - ')}</Text>
    <View style={styles.infoRow}>
      <Text style={styles.infoText}>⭐ {item.rating.toFixed(1)}</Text>
      <Text style={styles.infoText}>🚚 Gratis</Text>
      <Text style={styles.infoText}>⏱ 20 min</Text>
    </View>
  </View>
))}
          </>
        )}

        {/* Sección de Comidas */}
  {comidas.length > 0 && (
    <>
      <Text style={styles.sectionTitle}>Comida Rápida Popular</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {comidas.map((item, idx) => (
          <View key={idx} style={styles.foodCard}>
            <Image source={item.image} style={styles.foodImage} />
            <Text style={styles.foodName}>{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  )}
      </ScrollView>
    </View>
  );
}
