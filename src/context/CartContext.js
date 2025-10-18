import React, { createContext, useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();


export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { id, name, price, image, qty, restId, restName }
  const [address, setAddress] = useState('Lima Norte');
  const [cards, setCards] = useState([]); // métodos/vínculos guardados: { id, method, label, data }

  useEffect(() => {
  AsyncStorage.setItem('cart', JSON.stringify(items));
}, [items]);

useEffect(() => {
  AsyncStorage.getItem('cart').then(saved => {
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map(it => ({
          ...it,
          price: parseFloat(it.price) || 0,
          qty: Number(it.qty) || 1,
        }));
        setItems(parsed);
      } catch (e) {
        console.warn('Error cargando carrito:', e);
      }
    }
  });
}, []);



  const addToCart = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].qty += qty;
        return copy;
      }
      return [...prev, { ...product, qty }];
    });
  };

  const updateQty = (id, qty) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setItems([]);

  const subtotal = items.reduce((s, it) => {
  const price = parseFloat(it.price) || 0;
  const qty = Number(it.qty) || 0;
  return s + price * qty;
}, 0);


  // Cards management
  const addCard = (card) => {
    // card: { id, method, label, data }
    setCards(prev => [...prev, card]);
  };
  const removeCard = (id) => setCards(prev => prev.filter(c => c.id !== id));

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQty,
      removeItem,
      clearCart,
      subtotal,
      address,
      setAddress,
      cards,
      addCard,
      removeCard
    }}>
      {children}
    </CartContext.Provider>
  );
}
