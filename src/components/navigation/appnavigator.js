import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/home';
import MenuStack from '../stacks/MenuStack';
import FoodDetails from '../../screens/fooddetails'
import RestaurantDetails from '../../screens/restaurantdetails';
import CartScreen from '../../screens/cart';
import PaymentScreen from '../../screens/paymentscreen';
import AddCardScreen from '../../screens/addcardscreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
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