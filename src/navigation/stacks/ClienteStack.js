// src/components/navigation/stacks/ClienteStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/cliente/home';
import MenuStack from './MenuStack';
import FoodDetails from '../../screens/cliente/fooddetails';
import RestaurantDetails from '../../screens/cliente/restaurantdetails';
import CartScreen from '../../screens/cliente/cart';
import PaymentScreen from '../../screens/cliente/paymentscreen';
import AddCardScreen from '../../screens/cliente/addcardscreen';

const Stack = createNativeStackNavigator();

export default function ClienteStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Menu" component={MenuStack} />
      <Stack.Screen name="FoodDetails" component={FoodDetails} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetails}/>
      <Stack.Screen name="CartScreen" component={CartScreen}/>
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="AddCard" component={AddCardScreen} />
    </Stack.Navigator>
  );
}