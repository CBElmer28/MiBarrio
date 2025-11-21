import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentMethods({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Métodos de Pago</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.card}>
            <Ionicons name="card" size={30} color="#1A1F71" />
            <Text style={styles.cardText}>Visa terminada en 4242</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addText}>+ Agregar Tarjeta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 20 },
  content: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  cardText: { marginLeft: 15, fontSize: 16, fontWeight: '500' },
  addBtn: { padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#FF6600', borderRadius: 10, alignItems: 'center' },
  addText: { color: '#FF6600', fontWeight: 'bold' }
});