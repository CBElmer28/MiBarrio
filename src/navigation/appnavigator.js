// src/components/navigation/MainNavigator.js
import React, { useEffect, useState } from 'react';
import ClienteStack from './stacks/ClienteStack';
import CocineroStack from '../navigation/stacks/CocineroStack';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppNavigator() {
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    const getTipoUsuario = async () => {
      const usuarioStr = await AsyncStorage.getItem('usuario');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        setTipo(usuario.tipo);
      }
    };
    getTipoUsuario();
  }, []);
  

  if (!tipo) return null; // o pantalla de carga

  switch (tipo) {
  case 'cliente':
    return <ClienteStack />;

  case 'cocinero':
    return <CocineroStack />;

  default:
    return null;
}

}