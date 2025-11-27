import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard({ navigation }) {

  const logout = async () => {
    await AsyncStorage.clear();
    // Forzamos reinicio de la navegación (o usa tu contexto de Auth)
    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthLoading' }], // O como se llame tu pantalla de carga inicial
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administrador</Text>
        <Text style={styles.subtitle}>Super Usuario</Text>
      </View>

      <View style={styles.grid}>
        {/* TARJETA 1: RESTAURANTES */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => navigation.navigate('AdminRestaurantes')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="restaurant" size={32} color="#2196F3" />
          </View>
          <Text style={styles.cardTitle}>Restaurantes</Text>
          <Text style={styles.cardDesc}>Crear locales y sucursales</Text>
        </TouchableOpacity>

        {/* TARJETA 2: COCINEROS */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('AdminCocineros')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="people" size={32} color="#FF9800" />
          </View>
          <Text style={styles.cardTitle}>Cocineros</Text>
          <Text style={styles.cardDesc}>Contratar chefs y asignarlos</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20, paddingTop: 60 },
  header: { marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  card: {
    backgroundColor: '#FFF',
    width: '48%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: { padding: 15, borderRadius: 50, marginBottom: 15 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  cardDesc: { fontSize: 12, color: '#888', textAlign: 'center' },

  logoutBtn: { position: 'absolute', bottom: 40, alignSelf: 'center' },
  logoutText: { color: 'red', fontWeight: 'bold', fontSize: 16 }
});