import React, { useState } from 'react';
import axios from 'axios';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import styles from '../../styles/Stylesheet';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { API_URL } from "../../config";

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [recordarme, setRecordarme] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                contraseña
            });

            const { token, usuario } = response.data;

            // 1. Guardar datos del usuario
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));

            // 2. CORRECCIÓN: Guardar el token SIEMPRE.
            // Es necesario para que las peticiones (como guardar dirección) funcionen en esta sesión.
            await AsyncStorage.setItem('token', token);

            // 3. Lógica de "Recordarme" (Opcional)
            // Puedes guardar una bandera separada si quieres verificarla al iniciar la app en el futuro
            if (recordarme) {
                await AsyncStorage.setItem('remember_me', 'true');
            } else {
                await AsyncStorage.removeItem('remember_me');
            }

            navigation.replace('Main'); // Redirige al home
        } catch (err) {
            console.error(err);
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
              <CheckBox value={recordarme} onValueChange={setRecordarme} />
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