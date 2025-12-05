import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CheckBox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Asegúrate de tener esta librería
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/Stylesheet';
import { API_URL, GOOGLE_MAPS_API_KEY } from "../../config";

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [recordarme, setRecordarme] = useState(false);
  const [secureText, setSecureText] = useState(true);

  useEffect(() => {
    console.log("========================================");
    console.log("[DEBUG_APP] Login Screen Mounted");
    console.log("[DEBUG_APP] API_URL:", API_URL);
    console.log("[DEBUG_APP] MAPS_KEY Loaded:", !!GOOGLE_MAPS_API_KEY); // Returns true/false
    console.log("========================================");
  }, []);

  const handleLogin = async () => {
      console.log(`[DEBUG_APP] Attempting login to: ${API_URL}/auth/login`);
      console.log(`[DEBUG_APP] Payload:`, { email }); // Don't log password

      try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, contraseña });
          
          console.log("[DEBUG_APP] Login Success Status:", response.status);
          const { token, usuario } = response.data;
          
          console.log("[DEBUG_APP] Token received:", token ? "YES" : "NO");
          console.log("[DEBUG_APP] User Role:", usuario?.tipo);

          await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
          await AsyncStorage.setItem('token', token);
          
          if (recordarme) await AsyncStorage.setItem('remember_me', 'true');
          else await AsyncStorage.removeItem('remember_me');
          
          navigation.replace('Main');
      } catch (err) {
          console.error("[DEBUG_APP] Login Error:", err.message);
          if (err.response) {
              console.log("[DEBUG_APP] Server Response:", err.response.data);
              console.log("[DEBUG_APP] Status Code:", err.response.status);
          } else if (err.request) {
              console.log("[DEBUG_APP] No response received. Possible Network Error or Wrong IP.");
          }
          setError(err.response?.data?.error || 'Error al iniciar sesión');
      }
  };

  return (
    <LinearGradient colors={['#FF6600', '#FF9944']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6600" />
      
      {/* CORRECCIÓN TECLADO: KeyboardAvoidingView envuelve todo */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formBox}>
            <Text style={styles.title}>¡Hola de nuevo!</Text>
            <Text style={styles.subtitle}>Ingresa para pedir tu comida favorita</Text>

            <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="ejemplo@gmail.com"
                placeholderTextColor="#bbb"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.label}>CONTRASEÑA</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#bbb"
                secureTextEntry={secureText}
                value={contraseña}
                onChangeText={setContraseña}
              />
              <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={styles.options}>
              <View style={styles.checkboxContainer}>
                  <CheckBox value={recordarme} onValueChange={setRecordarme} color={recordarme ? '#FF6600' : undefined} />
                <Text style={styles.checkboxLabel}>Recordarme</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.link}>¿Olvidaste tu clave?</Text>
              </TouchableOpacity>
            </View>

            {error ? <Text style={{ color: '#FF3B30', textAlign: 'center', marginBottom: 10 }}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerText}>
                ¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}