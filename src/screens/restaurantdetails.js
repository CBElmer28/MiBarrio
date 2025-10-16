import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import homestyles from '../styles/HomeStyles';
import categorystyles from '../styles/CategoryStyles'

export default function RestaurantDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { rest } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>

      <Image source={rest.image} style={styles.image} />
      <Text style={styles.name}>{rest.name}</Text>
      <Text style={styles.categories}>{rest.categories.join(' - ')}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Image source={require('../../assets/icons/Star.png')} style={[homestyles.icon, { tintColor: '#FF6600' }]} />
          <Text style={homestyles.infoText}>{rest.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Image source={require('../../assets/icons/Car.png')} style={[homestyles.icon, { tintColor: '#FF6600' }]} />
          <Text style={homestyles.infoText}>{rest.deliveryCost}</Text>
        </View>
        <View style={styles.infoItem}>
          <Image source={require('../../assets/icons/Watch.png')} style={[homestyles.icon, { tintColor: '#FF6600' }]} />
          <Text style={homestyles.infoText}>{rest.time}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Ver menú</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff' },
  image: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  categories: { fontSize: 16, color: '#666', marginBottom: 15 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FF6600',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backButton: { marginBottom: 10 },
  backText: { color: '#2F7EBF', fontSize: 16 },
});