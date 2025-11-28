import React, { useState, useEffect } from 'react';
import { 
  View, Text, Image, TouchableOpacity, FlatList, TextInput, Modal, ScrollView, StatusBar 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { API_URL } from "../../config";

import categorystyles from '../../styles/CategoryStyles';
import AnimatedDropdown from '../../components/ui/dropdown';

// Opciones de filtro
const FILTER_OPTIONS = {
  sort: ['Popular', 'Reciente', 'Precio Alto', 'Precio Bajo'],
  price: ['$', '$$', '$$$'],
  diet: ['Vegetariano', 'Vegano', 'Sin Gluten', 'Keto']
};

export default function CategoryScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  
  const [selectedCategory, setSelectedCategory] = useState(route.params?.category || 'Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [comidas, setComidas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dropdownData, setDropdownData] = useState([{ label: 'Todas', value: 'Todas' }]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false); // Toggle para la barra
  const [activeFilters, setActiveFilters] = useState({ sort: 'Popular', price: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resFood, resCat] = await Promise.all([
            fetch(`${API_URL}/platillos`),
            fetch(`${API_URL}/categorias`)
        ]);

        const dataFood = await resFood.json();
        const dataCat = await resCat.json();

        setComidas(dataFood);

        const formattedCategories = dataCat.map(c => ({ label: c.nombre, value: c.nombre }));
        setDropdownData([{ label: 'Todas', value: 'Todas' }, ...formattedCategories]);

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const comidasFiltradas = comidas.filter(item =>
    (selectedCategory === 'Todas' || item.categorias?.some(cat => cat.nombre === selectedCategory)) &&
    item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- RENDERIZADO DE LA TARJETA ESTILO REFERENCIA ---
  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
      style={categorystyles.gridCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('FoodDetails', { food: item })}
    >
      <Image source={{ uri: item.imagen }} style={categorystyles.gridImage} />
      
      {/* Título y Subtítulo */}
      <Text style={categorystyles.gridTitle} numberOfLines={1}>{item.nombre}</Text>
      <Text style={categorystyles.gridSub} numberOfLines={1}>
         {item.restaurante ? item.restaurante.nombre : 'Restaurante'}
      </Text>
      
      {/* Precio y Botón Más */}
      <View style={categorystyles.gridFooter}>
        <Text style={categorystyles.gridPrice}>${parseFloat(item.precio).toFixed(0)}</Text>
        <TouchableOpacity style={categorystyles.addBtnCircle}>
             <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const FilterOption = ({ label, type }) => (
    <TouchableOpacity 
      style={[
        categorystyles.filterOption, 
        activeFilters[type] === label && categorystyles.filterOptionSelected
      ]}
      onPress={() => setActiveFilters({...activeFilters, [type]: label})}
    >
      <Text style={[
        categorystyles.filterText,
        activeFilters[type] === label && categorystyles.filterTextSelected
      ]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={categorystyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />

      {/* 1. HEADER FIEL A LA IMAGEN */}
      <View style={categorystyles.headerContainer}>
        <View style={categorystyles.headerRow}>
          
          {/* IZQUIERDA: Back + Dropdown */}
          <View style={categorystyles.leftGroup}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconCircle}>
                <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>

            {/* Dropdown más limpio (Estilo texto) */}
            <AnimatedDropdown
                data={dropdownData}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                color="#333"
            />
          </View>

          {/* DERECHA: Search + Filter */}
          <View style={categorystyles.rightGroup}>
            <TouchableOpacity 
                style={[categorystyles.iconCircle, searchVisible && categorystyles.searchCircleActive]} 
                onPress={() => setSearchVisible(!searchVisible)}
            >
                <Ionicons name="search" size={22} color={searchVisible ? "#FFF" : "#333"} />
            </TouchableOpacity>

            <TouchableOpacity style={categorystyles.iconCircle} onPress={() => setModalVisible(true)}>
                <Ionicons name="options-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de búsqueda expandible */}
        {searchVisible && (
             <View style={categorystyles.searchBarContainer}>
                <TextInput
                    style={categorystyles.searchInput}
                    placeholder="Buscar comida..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus
                />
             </View>
        )}
      </View>

      {/* 2. CONTENIDO */}
      {loading ? (
        <Text style={{textAlign:'center', marginTop: 20, color:'#999'}}>Cargando...</Text>
      ) : (
        <FlatList
            ListHeaderComponent={
                <Text style={categorystyles.sectionTitle}>
                    {selectedCategory === 'Todas' ? 'Todas las comidas' : selectedCategory}
                </Text>
            }
            data={comidasFiltradas}
            renderItem={renderGridItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={categorystyles.gridList}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            showsVerticalScrollIndicator={false}
        />
      )}

      {/* 3. MODAL DE FILTROS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={categorystyles.modalOverlay}>
            <View style={categorystyles.modalContent}>
                <View style={categorystyles.modalHeader}>
                    <Text style={categorystyles.modalTitle}>Filtros</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={categorystyles.filterSectionTitle}>Ordenar por</Text>
                    <View style={categorystyles.filterOptionsRow}>
                        {FILTER_OPTIONS.sort.map(op => <FilterOption key={op} label={op} type="sort" />)}
                    </View>

                    <Text style={categorystyles.filterSectionTitle}>Precio</Text>
                    <View style={categorystyles.filterOptionsRow}>
                        {FILTER_OPTIONS.price.map(op => <FilterOption key={op} label={op} type="price" />)}
                    </View>

                    <Text style={categorystyles.filterSectionTitle}>Dietas</Text>
                    <View style={categorystyles.filterOptionsRow}>
                        {FILTER_OPTIONS.diet.map(op => <FilterOption key={op} label={op} type="diet" />)}
                    </View>
                </ScrollView>

                <TouchableOpacity style={categorystyles.applyButton} onPress={() => setModalVisible(false)}>
                    <Text style={categorystyles.applyButtonText}>Aplicar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>
    </View>
  );
}