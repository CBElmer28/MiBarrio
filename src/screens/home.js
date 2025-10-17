import React, { useState, useEffect, useContext } from 'react';
import styles from '../styles/HomeStyles';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CartContext } from '../context/CartContext';
import FoodCard from '../components/elements/foodcard';
import RestaurantCard from '../components/elements/restaurantcard';

export default function Home({ navigation }) {
  const { items } = useContext(CartContext);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [restaurantes, setRestaurantes] = useState([]);
  const [comidas, setComidas] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = ['Todas', 'Hamburguesa', 'Pizza', 'Pollo', 'Café', 'Postres'];

  //Sacar datos del backend
    useEffect(() => {
    const fetchData = async () => {
      try {
        // Cambia la URL segun sea necesario
        const resRest = await fetch('http://192.168.0.19:3000/api/restaurantes');
        const resFood = await fetch('http://192.168.0.19:3000/api/platillos');
        
        const dataRest = await resRest.json();
        const dataFood = await resFood.json();

        setRestaurantes(dataRest);
        setComidas(dataFood);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //Conseguir filtrados
  const restaurantesFiltrados = restaurantes.filter(item =>
    (selectedCategory === 'Todas' ||
      item.Categoria?.some(cat => cat.nombre === selectedCategory)) &&
    item.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const comidasFiltradas = comidas.filter(item =>
    (selectedCategory === 'Todas' ||
      item.Categoria?.some(cat => cat.nombre === selectedCategory)) &&
    item.nombre.toLowerCase().includes(query.toLowerCase())
  );

  //Cargando
    if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Cargando datos...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      {/* Sección de Header */}
    <View style={[styles.headerRow, { justifyContent: 'space-between' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={styles.menuButton}>
          <MaterialIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>ENTREGAR A: Lima Norte</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={{ padding: 8 }}>
        <MaterialIcons name="shopping-cart" size={26} color="#333" />
        {cartCount > 0 && (
          <View style={{
            position: 'absolute',
            right: 2,
            top: -4,
            backgroundColor: '#FF3B30',
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 3,
          }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>
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
        contentContainerStyle={{ paddingRight: 16, paddingBottom: 6 }}
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
        {restaurantesFiltrados.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Restaurantes Disponibles</Text>
    {restaurantesFiltrados.map((rest) => (
      <RestaurantCard
        key={rest.id}
        restaurant={rest}
        onPress={() => navigation.navigate('RestaurantDetails', { rest })}
      />
    ))}
  </>
)}


        {/* Sección de Comidas */}
        {comidasFiltradas.length > 0 && (
  <>
    <Text style={styles.sectionTitle}>Comida Rápida Popular</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
      {comidasFiltradas.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          onPress={() => navigation.navigate('FoodDetails', { food })}
        />
      ))}
    </ScrollView>
  </>
)}
      </ScrollView>
    </View>
  );
}
