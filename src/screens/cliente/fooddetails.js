// src/screens/fooddetails.js
import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartContext } from '../../context/CartContext';
import categorystyles from '../../styles/CategoryStyles';

export default function FoodDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { food } = route.params;
  const { addToCart } = useContext(CartContext);
  const [qty, setQty] = useState(1);

  // 🍔 Ingredientes de hamburguesa
  const ingredientes = food.ingredients || [
    "Pan de hamburguesa con sésamo",
    "Carne de res 200g",
    "Queso cheddar",
    "Lechuga fresca",
    "Tomate",
    "Cebolla morada",
    "Pepinillos",
    "Salsa especial de la casa",
    "Mayonesa",
    "Ketchup"
  ];

  const onAdd = () => {
    addToCart({
      id: food.id,
      name: food.nombre,
      price: parseFloat(food.precio),
      image: { uri: food.imagen },
      restaurant: food.restaurante?.nombre || null,
    }, qty);
    navigation.navigate('CartScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image source={require('../../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
      </TouchableOpacity>

      <Image source={{ uri: food.imagen }} style={styles.image} />
      
      <Text style={styles.name}>{food.nombre}</Text>
      <Text style={styles.price}>Precio: ${food.precio}</Text>
      <Text style={styles.rating}>Rating: {Number(food.rating)?.toFixed(1) || 'N/A'} ⭐</Text>

      <View style={styles.divider} />

      <View style={styles.section}>
  <Text style={styles.sectionTitle}>Categoria</Text>
  <View style={styles.itemsContainer}>
    {(food.Categoria || []).map((cat, i) => (
      <View key={i} style={styles.itemRow}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.itemText}>{cat.nombre}</Text>
      </View>
    ))}
  </View>
</View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredientes</Text>
        <View style={styles.itemsContainer}>
          {ingredientes.map((ingredient, i) => (
            <View key={i} style={styles.itemRow}>
              <Text style={styles.bullet}>🍴</Text>
              <Text style={styles.itemText}>{ingredient}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.qtySection}>
        <Text style={styles.qtyLabel}>Cantidad:</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity onPress={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{qty}</Text>
          <TouchableOpacity onPress={() => setQty(q => q + 1)} style={styles.qtyBtn}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>🛒 Agregar al carrito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: '#F8F9FA',
    paddingBottom: 40
  },
  backButton: { 
    marginBottom: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: { 
    width: '100%', 
    height: 250, 
    borderRadius: 15, 
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  },
  name: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 8,
    color: '#1A1A1A'
  },
  price: { 
    fontSize: 22, 
    marginBottom: 5,
    color: '#FF6600',
    fontWeight: '700'
  },
  rating: { 
    fontSize: 18, 
    color: '#666', 
    marginBottom: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 12,
    color: '#2C3E50',
    letterSpacing: 0.5
  },
  itemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingVertical: 2
  },
  bullet: {
    fontSize: 18,
    marginRight: 10,
    color: '#FF6600',
    lineHeight: 24
  },
  itemText: { 
    fontSize: 16, 
    color: '#4A4A4A',
    flex: 1,
    lineHeight: 24
  },
  qtySection: {
    alignItems: 'center',
    marginTop: 10
  },
  qtyLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12
  },
  qtyRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  qtyBtn: { 
    backgroundColor: '#FF6600', 
    padding: 12,
    borderRadius: 10, 
    marginHorizontal: 20,
    minWidth: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4
  },
  qtyBtnText: { 
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  qtyText: { 
    fontSize: 24, 
    fontWeight: '700', 
    minWidth: 40, 
    textAlign: 'center',
    color: '#1A1A1A'
  },
  button: {
    backgroundColor: '#FF6600',
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: 'center',
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontWeight: 'bold',
    letterSpacing: 0.5
  }
});