import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../screens/cliente/profile';
import Favorites from '../../screens/cliente/favorites';
import Orders from '../../screens/cliente/orders';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMenu" component={Profile} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Orders" component={Orders} />
    </Stack.Navigator>
  );
}
