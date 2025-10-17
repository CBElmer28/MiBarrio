import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import BackArrow from '../components/ui/backarrow';

export default function Profile({ navigation }) {
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('usuario');
            await AsyncStorage.removeItem('token_timestamp');
            navigation.replace('Login');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

  const menuItems = [
    { icon: 'person', label: 'Información personal'},
    { icon: 'map', label: 'Direcciones'},
    { icon: 'shopping-cart', label: 'Carrito', screen: 'Orders' },
    { icon: 'favorite', label: 'Favoritos', screen: 'Favorites' },
    { icon: 'doorbell', label: 'Notificaciones'},
    { icon: 'credit-card', label: 'Metodos de pago'},
    { icon: 'question-mark', label: 'FAQs'},
    { icon: 'person', label: 'Reseñas de los usuarios'},
    { icon: 'settings', label: 'Configuración'},
    { icon: 'logout', label: 'Cerrar sesión', action: handleLogout },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Encabezado del perfil */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <BackArrow onPress={() => navigation.navigate('Home')} color="#FF6600" size={28} style={{ marginLeft: 10 }} />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Menú</Text>
        </View>


        <View style={styles.header}>
            
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>Elmer Josué</Text>
            <Text style={styles.status}>Me gusta la pizza</Text>
          </View>
        </View>

        {/* Lista de opciones */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
  if (item.screen) {
    navigation.navigate('Menu', { screen: item.screen });
  }
  if (item.action) item.action();
}}
          >
            <View style={styles.menuLeft}>
              <MaterialIcons name={item.icon} size={22} color="#FF6600" />
              <Text style={styles.menuText}>{item.label}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={22} color="#ccc" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    backgroundColor: '#f5c6c6',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 15,
    marginLeft: 12,
    color: '#333',
  },
});
