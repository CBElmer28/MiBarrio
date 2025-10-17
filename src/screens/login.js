import React, { useState } from 'react';
import axios from 'axios'; // 👈 Asegúrate de tener axios instalado
import CheckBox from 'expo-checkbox';
import { useRoute } from '@react-navigation/native';
import styles from '../styles/Stylesheet';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.0.19:3000/api/auth/login', {
        email,
        contraseña
      });

      const { token, usuario } = response.data;

      // Aquí puedes guardar el token en AsyncStorage si lo necesitas
      // await AsyncStorage.setItem('token', token);

      navigation.replace('Main'); // Redirige al home
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>CONTRASEÑA</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={contraseña}
            onChangeText={setContraseña}
          />
        </View>

        <View style={styles.options}>
          <View style={styles.checkboxContainer}>
            <CheckBox value={false} />
            <Text style={styles.checkboxLabel}>Recordarme</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.link}>Olvidé mi contraseña</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerText}>
            ¿No tienes cuenta? <Text style={styles.link}>REGÍSTRATE</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}