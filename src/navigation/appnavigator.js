import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClienteStack from './stacks/ClienteStack';
import CocineroStack from './stacks/CocineroStack';
import RepartidorStack from './stacks/RepartidorStack';

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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  switch (userRole) {
    case 'cliente':
      return <ClienteStack />;
    case 'cocinero':
      return <CocineroStack />;
    case 'repartidor':
      return <RepartidorStack />;
    default:
      return null;
  }
}
