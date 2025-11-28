import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, StatusBar 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getMisFavoritos } from '../../services/favoriteService';
import categorystyles from '../../styles/CategoryStyles'; // Reutilizamos estilos de grilla

export default function Favorites({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar favoritos cada vez que se entra a la pantalla
  useFocusEffect(
    useCallback(() => {
      cargarFavoritos();
    }, [])
  );

  const cargarFavoritos = async () => {
    setLoading(true);
    const data = await getMisFavoritos();
    setFavoritos(data);
    setLoading(false);
  };

  const renderItem = ({ item }) => {
    const food = item.platillo;
    if (!food) return null; // Seguridad si se borró el platillo

    return (
      <TouchableOpacity 
        style={categorystyles.gridCard}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('FoodDetails', { food })}
      >
        <Image source={{ uri: food.imagen }} style={categorystyles.gridImage} />
        
        <Text style={categorystyles.gridTitle} numberOfLines={1}>{food.nombre}</Text>
        <Text style={categorystyles.gridSub} numberOfLines={1}>
           {food.restaurante ? food.restaurante.nombre : 'Restaurante'}
        </Text>
        
        <View style={categorystyles.gridFooter}>
          <Text style={categorystyles.gridPrice}>S/ {parseFloat(food.precio).toFixed(0)}</Text>
          {/* Icono de corazón lleno indicando que es fav */}
          <Ionicons name="heart" size={18} color="#FF3B30" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header Simple */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Favoritos</Text>
        <View style={{width: 40}} /> 
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6600" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons name="heart-dislike-outline" size={50} color="#ccc" />
                </View>
                <Text style={styles.emptyTitle}>Aún no tienes favoritos</Text>
                <Text style={styles.emptyText}>
                    Guarda tus platillos preferidos tocando el corazón en los detalles del producto.
                </Text>
                <TouchableOpacity 
                    style={styles.exploreBtn}
                    onPress={() => navigation.navigate('Main', { screen: 'Home' })}
                >
                    <Text style={styles.exploreText}>Explorar Comida</Text>
                </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 50, 
    paddingHorizontal: 20, 
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width:0, height:4}
  },
  backBtn: {
    padding: 8,
    backgroundColor: '#F5F6FA',
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1d2e',
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  iconCircle: {
      width: 100, height: 100, borderRadius: 50, backgroundColor: '#FFF',
      justifyContent:'center', alignItems:'center', marginBottom: 20,
      elevation: 2, shadowOpacity: 0.1
  },
  emptyTitle: {
      fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10
  },
  emptyText: {
      fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20, marginBottom: 30
  },
  exploreBtn: {
      backgroundColor: '#FF6600',
      paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25,
      elevation: 3, shadowColor: '#FF6600', shadowOpacity: 0.3
  },
  exploreText: {
      color: '#FFF', fontWeight: 'bold', fontSize: 15
  }
});