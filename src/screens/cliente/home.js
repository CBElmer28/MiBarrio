import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../context/CartContext';
import FoodCard from '../../components/elements/foodcard';
import RestaurantCard from '../../components/elements/restaurantcard';
import { API_URL } from "../../config";
import styles from '../../styles/HomeStyles';

export default function Home({ navigation }) {
  const { items } = useContext(CartContext);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [restaurantes, setRestaurantes] = useState([]);
  const [comidas, setComidas] = useState([]);
  
  // 1. CAMBIO: Estado para categorías dinámicas
  const [categories, setCategories] = useState(['Todas']); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 2. CAMBIO: Fetch simultáneo de todo
        const [resRest, resFood, resCat] = await Promise.all([
            fetch(`${API_URL}/restaurantes`),
            fetch(`${API_URL}/platillos`),
            fetch(`${API_URL}/categorias`) // <--- Nuevo fetch
        ]);
        
        const dataRest = await resRest.json();
        const dataFood = await resFood.json();
        const dataCat = await resCat.json();

        setRestaurantes(dataRest);
        setComidas(dataFood);

        // 3. CAMBIO: Mapear categorías de la BD al formato de la UI
        // Extraemos solo el nombre, y agregamos "Todas" al principio
        const listaCategorias = ['Todas', ...dataCat.map(c => c.nombre)];
        setCategories(listaCategorias);

      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lógica de filtrado (Sin cambios, ya funciona con los nombres)
  const restaurantesFiltrados = restaurantes.filter(item =>
    (selectedCategory === 'Todas' || item.categorias?.some(cat => cat.nombre === selectedCategory)) &&
    item.nombre.toLowerCase().includes(query.toLowerCase())
  );

  const comidasFiltradas = comidas.filter(item =>
    (selectedCategory === 'Todas' || item.categorias?.some(cat => cat.nombre === selectedCategory)) &&
    item.nombre.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return <View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text>Cargando delicias...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')} style={styles.menuButton}>
            <MaterialIcons name="menu" size={26} color="#1a1d2e" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerLabel}>ENTREGAR EN</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.headerLocation}>Lima Norte</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#FF6600" />
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('CartScreen')} style={styles.menuButton}>
            <MaterialIcons name="shopping-cart" size={24} color="#1a1d2e" />
            {cartCount > 0 && (
              <View style={{
                position: 'absolute', top: -5, right: -5,
                backgroundColor: '#FF3B30', borderRadius: 10, width: 20, height: 20,
                justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF'
              }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.greeting}>Hola, Elmer 👋</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* BUSCADOR (Al tocarlo, vamos a CategoryScreen para búsqueda avanzada) */}
        <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Category', { focusSearch: true })}
        >
            <View style={styles.searchContainer}>
                <Text style={styles.searchPlaceholder}>¿Qué se te antoja hoy?</Text>
                <Ionicons name="search" size={20} color="#FF6600" />
            </View>
        </TouchableOpacity>

        <View>
            <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Categorías</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Category')}>
                <Text style={styles.seeAllText}>Ver todo</Text>
            </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters} contentContainerStyle={{ paddingRight: 20 }}>
            {categories.map((cat, i) => (
                <TouchableOpacity
                    key={i}
                    style={[styles.filterButton, selectedCategory === cat && styles.activeFilterButton]}
                    onPress={() => {
                        setSelectedCategory(cat);
                        // Opcional: Si quieres que al tocar una categoría te lleve a la pantalla de detalle
                        // navigation.navigate('Category', { category: cat });
                    }}
                >
                    <Text style={[styles.filterButtonText, selectedCategory === cat && styles.activeFilterButtonText]}>
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        </View>

        {comidasFiltradas.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Comida Rápida Popular 🔥</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingRight: 20 }}
            >
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

        {restaurantesFiltrados.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Restaurantes Cercanos</Text>
            {restaurantesFiltrados.map((rest) => (
              <RestaurantCard
                key={rest.id}
                restaurant={rest}
                onPress={() => navigation.navigate('RestaurantDetails', { rest })}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}