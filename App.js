import React from 'react';
import Router from './router';
import { CartProvider } from './src/context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <Router />
    </CartProvider>
  );
}
