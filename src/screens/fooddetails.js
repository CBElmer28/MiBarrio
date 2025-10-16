// src/screens/fooddetails.js
import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import categorystyles from '../styles/CategoryStyles';

export default function FoodDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { food } = route.params;
  const { addToCart } = useContext(CartContext);
  const [qty, setQty] = useState(1);

  const onAdd = () => {
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      restId: food.restaurantId || null
    }, qty);
    navigation.navigate('CartScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>

      <Image source={food.image} style={styles.image} />
      <Text style={styles.name}>{food.name}</Text>
      <Text style={styles.price}>Precio: ${food.price}</Text>
      <Text style={styles.rating}>Rating: {food.rating?.toFixed(1)}</Text>

      <Text style={styles.section}>Categorías:</Text>
      {food.categories.map((cat, i) => (
        <Text key={i} style={styles.ingredient}>• {cat}</Text>
      ))}

      <View style={styles.qtyRow}>
        <TouchableOpacity onPress={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>
          <Text style={styles.qtyBtnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{qty}</Text>
        <TouchableOpacity onPress={() => setQty(q => q + 1)} style={styles.qtyBtn}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>Agregar al carrito</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 18, marginBottom: 5 },
  rating: { fontSize: 16, color: '#888', marginBottom: 15 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 10 },
  ingredient: { fontSize: 16, marginLeft: 10, marginBottom: 3 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  qtyBtn: { backgroundColor: '#eee', padding: 10, borderRadius: 6, marginHorizontal: 20 },
  qtyBtnText: { fontSize: 18 },
  qtyText: { fontSize: 18, fontWeight: '600' },
  button: {
    backgroundColor: '#FF6600',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginBottom: 10 },
  backText: { color: '#2F7EBF', fontSize: 16 },
});