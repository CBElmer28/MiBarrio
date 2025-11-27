import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos tus pantallas de autenticación existentes
// (Asegúrate de que las rutas coincidan con tu estructura)
import Login from '../../screens/auth/login';
import Register from '../../screens/auth/register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}