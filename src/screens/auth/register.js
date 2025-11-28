import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/Stylesheet';
import { API_URL } from "../../config";

export default function Register({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [repetirContraseña, setRepetirContraseña] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!nombre || !email || !contraseña || !repetirContraseña) { setError('Completa todos los campos'); return; }
        if (contraseña !== repetirContraseña) { setError('Las contraseñas no coinciden'); return; }
        try {
            const response = await axios.post(`${API_URL}/auth/register`, { nombre, email, contraseña, tipo: 'cliente' });
            const { token, usuario } = response.data;
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('usuario', JSON.stringify(usuario));
            await AsyncStorage.setItem('token_timestamp', Date.now().toString());
            navigation.replace('Main');
        } catch (err) {
            setError(err.response?.data?.error || 'Error al registrar');
        }
    };

    return (
        <LinearGradient colors={['#FF6600', '#FF8E53']} style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.formBox}>
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>Únete a MiBarrio hoy</Text>

                        {/* Nombre */}
                        <Text style={styles.label}>Nombre Completo</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="Tu nombre" placeholderTextColor="#bbb" value={nombre} onChangeText={setNombre} />
                        </View>

                        {/* Correo */}
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="ejemplo@gmail.com" placeholderTextColor="#bbb" keyboardType="email-address" value={email} onChangeText={setEmail} autoCapitalize="none" />
                        </View>

                        {/* Contraseña */}
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#bbb" secureTextEntry value={contraseña} onChangeText={setContraseña} />
                        </View>

                        {/* Repetir Contraseña */}
                        <Text style={styles.label}>Repetir Contraseña</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                            <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#bbb" secureTextEntry value={repetirContraseña} onChangeText={setRepetirContraseña} />
                        </View>

                        {error ? <Text style={{ color: '#FF3B30', textAlign: 'center', marginBottom: 10 }}>{error}</Text> : null}

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>REGISTRARSE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.registerText}>
                                ¿Ya tienes cuenta? <Text style={styles.link}>Inicia Sesión</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}