import React, { useState, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Dimensions } from 'react-native';
import { CartContext } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import homestyles from '../styles/HomeStyles';
import categorystyles from '../styles/CategoryStyles';
import PaymentSuccess from '../components/paymentsuccess';

const METHODS = [
  { id: 'cash', label: 'Efectivo' },
  { id: 'yape', label: 'Yape' },
  { id: 'plin', label: 'Plin' },
  { id: 'mastercard', label: 'Mastercard' },
  { id: 'bcp', label: 'BCP' },
];

const { width } = Dimensions.get('window');

export default function PaymentScreen() {
  const navigation = useNavigation();
  const { items, subtotal, clearCart, address, cards } = useContext(CartContext);
  const [selected, setSelected] = useState('cash');
  const [successVisible, setSuccessVisible] = useState(false);
  const carouselRef = useRef();

  const onAddCard = () => navigation.navigate('AddCardScreen', { method: selected });

  const buildOrder = () => ({
    restaurantName: items[0]?.restName || 'Restaurante',
    datetime: new Date().toLocaleString(),
    items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
    coords: { latitude: -12.0464, longitude: -77.0428 },
    address,
    total: subtotal,
  });

  const onPay = () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega productos antes de pagar');
      return;
    }
    // aquí podrías validar el método (ej. si requiere tarjeta vinculada)
    setSuccessVisible(true);
  };

  const handleContinueToTracking = () => {
    const order = buildOrder();
    setSuccessVisible(false);
    clearCart(); // limpiar al confirmar
    navigation.navigate('TrackingScreen', { order });
  };

  return (
    <>
      <View style={{ flex: 1 }}>
        <View style={categorystyles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
            <Image source={require('../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.page}>
          <Text style={homestyles.sectionTitle}>Método de pago</Text>

          <View style={{ height: 120, marginBottom: 12 }}>
            <ScrollView
              ref={carouselRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            >
              {METHODS.map(m => {
                const active = selected === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setSelected(m.id)}
                    style={[styles.carouselItem, active && styles.carouselItemActive, { width: width - 64 }]}
                  >
                    <Text style={[styles.methodLabel, active && styles.methodLabelActive]}>{m.label}</Text>
                    {active && (
                      <TouchableOpacity onPress={onAddCard} style={styles.addCardBtn}>
                        <Text style={styles.addCardText}>Añadir / editar</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <Text style={[homestyles.sectionTitle, { marginTop: 8 }]}>Métodos vinculados</Text>
          {cards.length === 0 ? (
            <Text style={{ color: '#666', marginBottom: 12 }}>No hay métodos vinculados</Text>
          ) : (
            cards.map(c => (
              <View key={c.id} style={[styles.linkedCard]}>
                <Text style={{ fontWeight: '700' }}>{c.label}</Text>
                <Text style={{ color: '#666' }}>{c.method.toUpperCase()}</Text>
              </View>
            ))
          )}

          <View style={styles.summary}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.payBtn} onPress={onPay}>
            <Text style={styles.payText}>Pagar y confirmar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <PaymentSuccess
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        onContinue={handleContinueToTracking}
      />
    </>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#fff', paddingBottom: 40 },
  carouselItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItemActive: { borderColor: '#FF6600', backgroundColor: '#fff7f0' },
  methodLabel: { fontSize: 18, color: '#333' },
  methodLabelActive: { color: '#FF6600', fontWeight: '700' },
  addCardBtn: { marginTop: 8 },
  addCardText: { color: '#2F7EBF' },

  linkedCard: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },

  summary: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, marginBottom: 12 },
  totalLabel: { fontSize: 16, color: '#666' },
  totalValue: { fontSize: 20, fontWeight: '700' },
  payBtn: { backgroundColor: '#FF6600', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 6 },
  payText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
