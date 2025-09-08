import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/Stylesheet';

export default function Register({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Text style={styles.title}>Registrar</Text>

        <Text style={styles.label}>NOMBRE</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
        />

        <Text style={styles.label}>CONTRASEÑA</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
          {/* Aquí podrías agregar el ícono de ojo más adelante */}
        </View>

        <Text style={styles.label}>REPITA CONTRASEÑA</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('Home')}
        >
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
