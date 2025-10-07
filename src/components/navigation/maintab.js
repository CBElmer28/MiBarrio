import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import Home from '../../screens/home';
import Favorites from '../../screens/favorites';
import Orders from '../../screens/orders';
import Profile from '../../screens/profile';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FF6600',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
          paddingBottom: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Favoritos') iconName = 'favorite';
          else if (route.name === 'Pedidos') iconName = 'receipt-long';
          else if (route.name === 'Perfil') iconName = 'person';
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Favoritos" component={Favorites} />
      <Tab.Screen name="Pedidos" component={Orders} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
}
