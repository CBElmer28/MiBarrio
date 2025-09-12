import React, { useState } from 'react';
import styles from '../styles/HomeStyles';
import { restaurants, foods } from '../../data/data';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Home({navigation}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Hamburguesa', 'Pizza', 'Pollo', 'Café', 'Postres'];
  
const restaurantes = restaurants.filter(item =>
  (selectedCategory === 'Todas' || item.categories.includes(selectedCategory)) &&
  item.name.toLowerCase().includes(query.toLowerCase())
);

const comidas = foods.filter(item =>
  (selectedCategory === 'Todas' || item.categories.includes(selectedCategory)) &&
  item.name.toLowerCase().includes(query.toLowerCase())
);
  return (
    <View style={styles.container}>
      {/* Sección de Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={styles.menuButton}>
          <MaterialIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>


        <Text style={styles.header}>ENTREGAR A: Lima Norte</Text>
      </View>
      <Text style={styles.greeting}>Hola Elmer, Buenas Tardes!</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar"
        value={query}
        onChangeText={setQuery}
      />
        {/* Sección de filtros */}
        <Text style={styles.sectionTitle}>Categorias</Text>
      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  style={styles.filters}
  contentContainerStyle={{ paddingRight: 16, paddingBottom:6 }}
>
  {categories.map((cat, i) => (
    <TouchableOpacity
      key={i}
      style={[
        styles.filterButton,
        selectedCategory === cat && styles.activeFilterButton
      ]}
      onPress={() => navigation.navigate('Category', { category: cat })}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedCategory === cat && styles.activeFilterButtonText
        ]}
      >
        {cat}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>


      <ScrollView>
        {/* Sección de Restaurantes */}
        {restaurantes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Restaurantes Disponibles</Text>
            {restaurantes.map((item, idx) => (
  <View key={idx} style={[styles.cardBase, styles.restaurantCard]}>
  <Image source={item.image} style={styles.restaurantImage} />
  <Text style={styles.restaurantName}>{item.name}</Text>
  <Text style={styles.categories}>{item.categories.join(' - ')}</Text>
  <View style={styles.infoRow}>
  <View style={styles.infoItem}>
    <Image source={require('../../assets/icons/Star.png')}   style={[styles.icon, { tintColor: '#FF6600' }]} />
    <Text style={styles.infoText}>{item.rating.toFixed(1)}</Text>
  </View>

  <View style={styles.infoItem}>
    <Image source={require('../../assets/icons/Car.png')}   style={[styles.icon, { tintColor: '#FF6600' }]} />
    <Text style={styles.infoText}>{item.deliveryCost}</Text>
  </View>

  <View style={styles.infoItem}>
    <Image source={require('../../assets/icons/Watch.png')}   style={[styles.icon, { tintColor: '#FF6600' }]} />
    <Text style={styles.infoText}>{item.time}</Text>
  </View>
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
          <View key={idx} style={[styles.cardBase, styles.foodCard]}>
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
