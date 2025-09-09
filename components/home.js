import React, { useState } from 'react';
import styles from '../styles/HomeStyles';
import { restaurants, foods } from '../data/data';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';


export default function Home({navigation}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Hamburguesa', 'Pizza', 'Pollo', 'Café', 'Postres'];
  
  const restaurantes = restaurants.filter(item =>
      selectedCategory === 'Todas' || item.categories.includes(selectedCategory)
    );
  const comidas = foods.filter(item =>
      selectedCategory === 'Todas' || item.categories.includes(selectedCategory)
    );
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
