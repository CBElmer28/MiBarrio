// src/navigation/stacks/CocineroStack.js
import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DashboardScreen from "../../screens/cocinero/dashboard";
import OrdersScreen from "../../screens/cocinero/orders";
import FoodsScreen from "../../screens/cocinero/foods";
import FoodFormScreen from "../../screens/cocinero/foodform";
import FoodDetailsScreen from "../../screens/cocinero/fooddetails";
import CocineroProfile from "../../screens/cocinero/profile";
import WithdrawSuccess from "../../screens/cocinero/withdrawsuccess";
import ReviewsScreen from "../../screens/cocinero/reviews";
import WithdrawHistoryScreen from "../../screens/cocinero/withdrawhistory";
import ConfigScreen from "../../screens/cocinero/settings";
import EditProfileScreen from "../../screens/cocinero/editprofile";
import WithdrawScreen from "../../screens/cocinero/withdraw";




const Stack = createNativeStackNavigator();

const CocineroStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // usamos headers personalizados como en las vistas
      }}
    >
      <Stack.Screen
        name="CocineroDashboard"
        component={DashboardScreen} />
      <Stack.Screen
        name="CocineroOrders"
        component={OrdersScreen} />
      <Stack.Screen 
        name="CocineroFoods" 
        component={FoodsScreen} />
      <Stack.Screen 
        name="CocineroFoodForm" 
        component={FoodFormScreen} />
      <Stack.Screen 
        name="CocineroFoodDetails" 
        component={FoodDetailsScreen} />
      <Stack.Screen 
        name="CocineroProfile" 
        component={CocineroProfile} />
      <Stack.Screen 
        name="CocineroWithdrawSuccess" 
        component={WithdrawSuccess} />
      <Stack.Screen 
        name="CocineroReviews" 
        component={ReviewsScreen} />
      <Stack.Screen 
        name="CocineroWithdrawHistory" 
        component={WithdrawHistoryScreen} />
      <Stack.Screen 
        name="CocineroSettings" 
        component={ConfigScreen} />
      <Stack.Screen 
        name="CocineroEditProfile" 
        component={EditProfileScreen} />
      <Stack.Screen 
        name="CocineroWithdraw" 
        component={WithdrawScreen} />

    </Stack.Navigator>
  );
};

export default CocineroStack;
