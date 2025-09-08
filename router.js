// Router.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './components/login.js';
import Home from './components/home.js';
import Register from './components/register.js';
import CategoryScreen from './components/categoryscreen.js';

const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={Register}
          options={{headerShown: false}} />


        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Inicio', headerShown: false }}
        />

        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={({ route }) => ({
            title: route.params?.category || 'Categoría',
          })}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
