import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from '../../screens/cliente/profile';
import Favorites from '../../screens/cliente/favorites';
import Orders from '../../screens/cliente/orders';
import Addresses from '../../screens/cliente/addresses';
import FAQs from '../../screens/cliente/faqs';
import Info from '../../screens/cliente/info';
import Notifications from '../../screens/cliente/notifications';
import Settings from '../../screens/cliente/settings';
import PaymentMethods from '../../screens/cliente/paymentmethods';

const Stack = createNativeStackNavigator();

export default function MenuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMenu" component={Profile} />
      <Stack.Screen name="Info" component={Info} />
      <Stack.Screen name="Favorites" component={Favorites} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Addresses" component={Addresses} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="FAQs" component={FAQs} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  );
}
