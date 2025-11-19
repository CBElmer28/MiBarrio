import React, { useState,useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { masterCategories } from '../../../data/masterData';
import categorystyles from '../../styles/CategoryStyles';
import homestyles from '../../styles/HomeStyles';
import AnimatedDropdown from '../../components/ui/dropdown';
import FoodCard from '../../components/elements/foodcard';
import RestaurantCard from '../../components/elements/restaurantcard';
import { API_URL } from "../../config";

export default function CategoryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'Todas');
  const [loading, setLoading] = useState(true);
  const [restaurantes, setRestaurantes] = useState([]);
const [comidas, setComidas] = useState([]);

  //Sacar datos del backend
    useEffect(() => {
    const fetchData = async () => {
      try {
        // Cambia la URL segun sea necesario
        const resRest = await fetch(`${API_URL}/restaurantes`);
        const resFood = await fetch(`${API_URL}/platillos`);
        
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

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  // 🔹 Filtrar por categoría seleccionada
  const restaurantesFiltrados = restaurantes.filter(item =>
    selectedCategory === 'Todas' ||
    item.categorias?.some(cat => cat.nombre === selectedCategory)
  );

  const comidasFiltradas = comidas.filter(item =>
    selectedCategory === 'Todas' ||
    item.categorias?.some(cat => cat.nombre === selectedCategory)
  );


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Encabezado */}
      <View style={categorystyles.headerContainer}>
        {/* Flecha atrás */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>

        {/* Dropdown de categorías */}
        <AnimatedDropdown
          data={masterCategories}
          selected={selectedCategory}
          onSelect={(cat) => setSelectedCategory(cat)}
          color="#FF6600"
        />

        {/* Botones de acción */}
        <TouchableOpacity style={categorystyles.iconButton}>
          <Image source={require('../../../assets/icons/Search.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={categorystyles.iconButton}>
          <Image source={require('../../../assets/icons/Filter.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <View style={categorystyles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
          {/* Comidas */}
          <Text style={homestyles.sectionTitle}>{selectedCategory} Populares</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {comidasFiltradas.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                onPress={() => navigation.navigate('FoodDetails', { food })}
              />
            ))}
          </ScrollView>

          {/* Restaurantes */}
          <Text style={homestyles.sectionTitle}>Restaurantes Disponibles</Text>
          {restaurantesFiltrados.map(rest => (
            <RestaurantCard
              key={rest.id}
              restaurant={rest}
              onPress={() => navigation.navigate('RestaurantDetails', { rest })}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}