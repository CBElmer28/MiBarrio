import React from 'react';
import Router from '../router';
import CheckBox from 'expo-checkbox';
import { useRoute } from '@react-navigation/native';
import styles from '../styles/Stylesheet';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';

export default function Login({ navigation  }) {
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

      <View style={styles.options}>
        <View style={styles.checkboxContainer}>
          <CheckBox value={false} />
          <Text style={styles.checkboxLabel}>Recordarme</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.link}>Olvidé mi contraseña</Text>
        </TouchableOpacity>
      </View>

    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.replace('Home')} // replace evita volver al login con "back"
    >
      <Text style={styles.buttonText}>INICIAR SESIÓN</Text>
    </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>¿No tienes cuenta? <Text style={styles.link}>REGÍSTRATE</Text></Text>
      </TouchableOpacity>
    </View>
    </View>
  );
}
