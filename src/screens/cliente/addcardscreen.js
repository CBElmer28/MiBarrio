import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import categorystyles from '../../styles/CategoryStyles';
import { guardarTarjeta } from '../../services/paymentService'; // <--- Importamos servicio

export default function AddCardScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const method = route.params?.method || 'mastercard';

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const onAdd = async () => {
    setLoading(true);
    let cardData = { method };

    if (method === 'yape' || method === 'plin') {
      if (!phone.trim()) { 
          Alert.alert('Error', 'Ingresa número de teléfono'); 
          setLoading(false); return; 
      }
      cardData.phone = phone;
      cardData.label = phone;
    } else {
      if (!name || !number || !expiry || !cvc) { 
          Alert.alert('Error', 'Completa todos los campos'); 
          setLoading(false); return; 
      }
      // Guardamos solo los últimos 4 dígitos para mostrar, por seguridad
      cardData = {
          method,
          name,
          last4: number.slice(-4),
          expiry,
          // OJO: En una app real NUNCA guardes el número completo ni el CVC en tu BD así.
          // Aquí lo simulamos guardando masked data.
          label: `•••• ${number.slice(-4)}`
      };
    }

    // Llamada al Backend
    const res = await guardarTarjeta(cardData);
    setLoading(false);

    if (res && !res.error) {
        Alert.alert("¡Éxito!", "Método de pago agregado");
        navigation.goBack();
    } else {
        Alert.alert("Error", "No se pudo guardar la tarjeta");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={categorystyles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Añadir método: {method.toUpperCase()}</Text>
      
      {method === 'yape' || method === 'plin' ? (
        <>
          <Text style={styles.label}>Número de teléfono</Text>
          <TextInput keyboardType="phone-pad" value={phone} onChangeText={setPhone} style={styles.input} placeholder="9XXXXXXXX" maxLength={9}/>
        </>
      ) : (
        <>
          <Text style={styles.label}>Nombre en la tarjeta</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Nombre completo" />
          <Text style={styles.label}>Número de tarjeta</Text>
          <TextInput keyboardType="numeric" value={number} onChangeText={setNumber} style={styles.input} placeholder="1234 5678 9012 3456" maxLength={16}/>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.label}>Expiración (MM/AA)</Text>
              <TextInput value={expiry} onChangeText={setExpiry} style={styles.input} placeholder="MM/AA" maxLength={5}/>
            </View>
            <View style={{ width: 100 }}>
              <Text style={styles.label}>CVC</Text>
              <TextInput keyboardType="numeric" value={cvc} onChangeText={setCvc} style={styles.input} placeholder="123" maxLength={4} secureTextEntry/>
            </View>
          </View>
        </>
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAdd} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF"/> : <Text style={styles.addText}>Guardar Método</Text>}
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