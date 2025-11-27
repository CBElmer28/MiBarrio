import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminDashboard from '../../screens/admin/AdminDashboard';
// 👇 DESCOMENTA Y ASEGURA QUE LA RUTA SEA CORRECTA
import AdminRestaurantes from '../../screens/admin/AdminRestaurantes'; 
import AdminCocineros from '../../screens/admin/AdminCocineros';       

const Stack = createNativeStackNavigator();

export default function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      {/* 👇 HABILITA ESTAS PANTALLAS */}
      <Stack.Screen name="AdminRestaurantes" component={AdminRestaurantes} />
      <Stack.Screen name="AdminCocineros" component={AdminCocineros} />
    </Stack.Navigator>
  );
}