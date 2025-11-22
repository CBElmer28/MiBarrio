import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings({ navigation }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Configuración</Text>
        <View style={{width:24}}/>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Preferencias</Text>
        
        <View style={styles.row}>
            <Text style={styles.rowLabel}>Notificaciones Push</Text>
            <Switch 
                value={notifications} 
                onValueChange={setNotifications}
                trackColor={{false: "#767577", true: "#FF6600"}}
            />
        </View>

        <View style={styles.row}>
            <Text style={styles.rowLabel}>Modo Oscuro</Text>
            <Switch 
                value={darkMode} 
                onValueChange={setDarkMode}
                trackColor={{false: "#767577", true: "#FF6600"}}
            />
        </View>

        <View style={styles.row}>
            <Text style={styles.rowLabel}>Servicios de Ubicación</Text>
            <Switch 
                value={location} 
                onValueChange={setLocation}
                trackColor={{false: "#767577", true: "#FF6600"}}
            />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Cuenta</Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert("Info", "Redirigir a política de privacidad")}>
            <Text style={styles.linkText}>Política de Privacidad</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert("Info", "Redirigir a términos")}>
            <Text style={styles.linkText}>Términos y Condiciones</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => Alert.alert("Cuidado", "Acción para eliminar cuenta")}>
            <Text style={[styles.linkText, {color: 'red'}]}>Eliminar Cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth:1, borderBottomColor:'#eee' },
  title: { fontSize: 18, fontWeight: 'bold' },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  sectionHeader: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 15, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  rowLabel: { fontSize: 16, color: '#333' },
  linkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
  linkText: { fontSize: 16, color: '#333' },
});