import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Info({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
        const json = await AsyncStorage.getItem('usuario');
        if (json) {
            const user = JSON.parse(json);
            setName(user.nombre || '');
            setEmail(user.email || '');
            setPhone(user.telefono || ''); // Asumiendo que existe o se agregará
        }
    } catch(e) { console.log(e); }
  };

  const handleSave = async () => {
    setLoading(true);
    // AQUÍ IRÍA LA LLAMADA AL BACKEND (PUT /usuarios/:id)
    // Por ahora simulamos actualizar el local storage
    try {
        const json = await AsyncStorage.getItem('usuario');
        let user = json ? JSON.parse(json) : {};
        user = { ...user, nombre: name, telefono: phone }; // Email suele ser inmutable o requiere verificación
        
        await AsyncStorage.setItem('usuario', JSON.stringify(user));
        Alert.alert("Éxito", "Información actualizada correctamente.");
        navigation.goBack();
    } catch(e) {
        Alert.alert("Error", "No se pudo actualizar.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Información Personal</Text>
        <View style={{width:24}}/>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput 
                style={styles.input} 
                value={name} 
                onChangeText={setName}
                placeholder="Tu nombre"
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <TextInput 
                style={[styles.input, {backgroundColor: '#f0f0f0', color:'#999'}]} 
                value={email} 
                editable={false} 
            />
            <Text style={styles.helper}>El correo no se puede cambiar.</Text>
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone}
                placeholder="+51 999 999 999"
                keyboardType="phone-pad"
            />
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>{loading ? "Guardando..." : "Guardar Cambios"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth:1, borderBottomColor:'#eee' },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 16, color: '#333' },
  helper: { fontSize: 12, color: '#999', marginTop: 5 },
  saveBtn: { backgroundColor: '#FF6600', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});