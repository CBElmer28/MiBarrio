import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/login';
import Register from './src/screens/register';
import CategoryScreen from './src/screens/categoryscreen';
import MainTabs from './src/components/navigation/maintab';
import AppNavigator from './src/components/navigation/appnavigator';
import FoodDetails from './src/screens/fooddetails';
import RestaurantDetails from './src/screens/restaurantdetails';
import CartScreen from './src/screens/cart';
import PaymentScreen from './src/screens/paymentscreen';
import AddCardScreen from './src/screens/addcardscreen';
import TrackingScreen from './src/screens/trackingscreen';
import authloading from "./src/screens/authloading";

const Stack = createNativeStackNavigator();

export default function Router() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
          <Stack.Screen
              name="AuthLoading"
              component={authloading}
              options={{ headerShown: false }}
          />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={AppNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Category"
          component={CategoryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FoodDetails"
          component={FoodDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RestaurantDetails"
          component={RestaurantDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddCardScreen"
          component={AddCardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrackingScreen"
          component={TrackingScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
