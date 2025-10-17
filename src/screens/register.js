import React, { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/Stylesheet';

export default function Register({ navigation }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [repetirContraseña, setRepetirContraseña] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!nombre || !email || !contraseña || !repetirContraseña) {
            setError('Completa todos los campos');
            return;
        }

        if (contraseña !== repetirContraseña) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await axios.post('http://192.168.0.19:3000/api/auth/registro', {
                nombre,
                email,
                contraseña,
                tipo: 'cliente'
            });

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
        <View style={styles.container}>
            <View style={styles.formBox}>
                <Text style={styles.title}>Registrar</Text>

                <Text style={styles.label}>NOMBRE</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#aaa"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ejemplo@gmail.com"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>CONTRASEÑA</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={contraseña}
                    onChangeText={setContraseña}
                />

                <Text style={styles.label}>REPITA CONTRASEÑA</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={repetirContraseña}
                    onChangeText={setRepetirContraseña}
                />

                {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>REGISTRARSE</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.registerText}>
                        ¿Ya tienes cuenta? <Text style={styles.link}>INICIA SESIÓN</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
