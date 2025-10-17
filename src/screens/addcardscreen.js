import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import categorystyles from '../styles/CategoryStyles';

export default function AddCardScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { addCard } = useContext(CartContext);
  const method = route.params?.method || 'mastercard';

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [phone, setPhone] = useState('');

  const onAdd = () => {
    if (method === 'yape' || method === 'plin') {
      if (!phone.trim()) { Alert.alert('Error', 'Ingresa número de teléfono'); return; }
      const cardObj = { id: Date.now().toString(), method, label: phone, data: { phone } };
      addCard(cardObj);
      navigation.goBack();
      return;
    }

    if (!name || !number) { Alert.alert('Error', 'Completa nombre y número'); return; }
    if (!expiry || !cvc) { Alert.alert('Error', 'Completa expiración y CVC'); return; }

    const cardObj = {
      id: Date.now().toString(),
      method,
      label: `${number.slice(-4)} • ${method.toUpperCase()}`,
      data: { name, number, expiry, cvc }
    };
    addCard(cardObj);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={categorystyles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Añadir método: {method.toUpperCase()}</Text>
      {method === 'yape' || method === 'plin' ? (
        <>
          <Text style={styles.label}>Número de teléfono</Text>
          <TextInput keyboardType="phone-pad" value={phone} onChangeText={(text) => setPhone(text.slice(0, 9))} style={styles.input} placeholder="9XXXXXXXX" />
        </>
      ) : (
        <>
          <Text style={styles.label}>Nombre en la tarjeta</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Nombre completo" />
          <Text style={styles.label}>Número de tarjeta</Text>
          <TextInput keyboardType="numeric" value={number} onChangeText={(text) => setNumber(text.slice(0, 16))} style={styles.input} placeholder="1234 5678 9012 3456" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Expiración (MM/AA)</Text>
              <TextInput value={expiry} onChangeText={(text) => setExpiry(text.slice(0, 4))} style={styles.input} placeholder="MM/AA" />
            </View>
            <View style={{ width: 100 }}>
              <Text style={styles.label}>CVC</Text>
              <TextInput keyboardType="numeric" value={cvc} onChangeText={(text) => setCvc(text.slice(0, 3))} style={styles.input} placeholder="123" />
            </View>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
        <Text style={styles.addText}>Añadir tarjeta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 14 },
  label: { fontSize: 14, color: '#666', marginTop: 8, marginBottom: 6 },
  input: { backgroundColor: '#f7f7f7', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  addBtn: { backgroundColor: '#FF6600', padding: 14, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  addText: { color: '#fff', fontWeight: '700' },
});
