import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeliveryHome from '../../screens/repartidor/deliveryhome';
import RepartidorProfile from '../../screens/repartidor/profile';
import DeliveryMap from '../../screens/repartidor/DeliveryMap'; 

const Stack = createNativeStackNavigator();

export default function RepartidorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_left',
      }}
    >
      <Stack.Screen
        name="RepartidorDashboard"
        component={DeliveryHome} 
      />
      <Stack.Screen
        name="RepartidorProfile"
        component={RepartidorProfile}
      />
      <Stack.Screen
        name="DeliveryMap"
        component={DeliveryMap}
      />
    </Stack.Navigator>
  );
};
