import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importamos todos los Stacks
import ClienteStack from './stacks/ClienteStack';
import CocineroStack from './stacks/CocineroStack';
import RepartidorStack from './stacks/RepartidorStack';
import AdminStack from './stacks/AdminStack'; // <--- 1. NUEVO IMPORT
import AuthStack from './stacks/AuthStack';   // <--- IMPORTANTE: Para el Login

export default function AppNavigator() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const usuarioStr = await AsyncStorage.getItem('usuario');
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          setUserRole(usuario.tipo); 
        }
      } catch (e) {
        console.error("Error al leer los datos del usuario:", e);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF8A00" />
      </View>
    );
  }

  // Lógica de derivación según el rol
  switch (userRole) {
    case 'admin':       // <--- 2. NUEVO CASO ADMIN
      return <AdminStack />;
    case 'cliente':
      return <ClienteStack />;
    case 'cocinero':
      return <CocineroStack />;
    case 'repartidor':
      return <RepartidorStack />;
    default:
      // Si no hay rol (no está logueado), mostramos el Login
      return <AuthStack />; 
  }
}