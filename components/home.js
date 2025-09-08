import React, {useState} from 'react';
import Router from '../router';
import styles from '../styles/HomeStyles';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const allData = [
  { name: 'Mc Donalds', rating: 4.7, type: 'Restaurante' },
  { name: 'Burguer King', rating: 4.3, type: 'Restaurante' },
  { name: 'Starbucks', rating: 4.0, type: 'Restaurante' },
  { name: 'Pizza Europea', rating: 4.5, type: 'Comida' },
  { name: 'Pizza Buffalo', rating: 4.4, type: 'Comida' },
  // ...más items
];

export default function Home() {
      const [query, setQuery] = useState('');
  const filtered = allData.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
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
        {['Todas', 'Hot Dog', 'Pizza', 'Pollo'].map((f, i) => (
          <TouchableOpacity key={i} style={styles.filterButton}>
            <Text>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Resultados</Text>
      <ScrollView>
        {filtered.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text style={styles.details}>
              {item.type} • ⭐ {item.rating.toFixed(1)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
