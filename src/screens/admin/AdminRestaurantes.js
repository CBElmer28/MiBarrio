import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
// Importamos editarRestaurante
import { getRestaurantes, crearRestaurante, editarRestaurante, eliminarRestaurante } from '../../services/adminService';

export default function AdminRestaurantes({ navigation }) {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para Edición
  const [esEdicion, setEsEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [tipo, setTipo] = useState('');
  const [imagen, setImagen] = useState('');

  const cargarLista = async () => {
    setLoading(true);
    const data = await getRestaurantes();
    setRestaurantes(data);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { cargarLista(); }, []));

  // Función para abrir modal (Limpio o con datos)
  const abrirModal = (item = null) => {
    if (item) {
        setEsEdicion(true);
        setIdSeleccionado(item.id);
        setNombre(item.nombre);
        setDireccion(item.direccion);
        setTipo(item.tipo);
        setImagen(item.imagen);
    } else {
        setEsEdicion(false);
        setIdSeleccionado(null);
        setNombre(''); setDireccion(''); setTipo(''); setImagen('');
    }
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    if (!nombre || !direccion) return Alert.alert("Error", "Nombre y dirección obligatorios");
    
    let res;
    const datos = { nombre, direccion, tipo, imagen };

    if (esEdicion) {
        res = await editarRestaurante(idSeleccionado, datos);
    } else {
        res = await crearRestaurante(datos);
    }

    if (!res.error) {
        setModalVisible(false);
        cargarLista();
        Alert.alert("Éxito", esEdicion ? "Actualizado" : "Creado");
    } else {
        Alert.alert("Error", res.error);
    }
  };

  const handleEliminar = (id) => {
    Alert.alert("Eliminar", "¿Borrar este restaurante?", [
      { text: "Cancelar" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
          await eliminarRestaurante(id);
          cargarLista();
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.info}>
            <Text style={styles.title}>{item.nombre}</Text>
            <Text style={styles.sub}>{item.tipo} • {item.direccion}</Text>
        </View>
        <View style={{flexDirection:'row', gap:10}}>
            {/* BOTÓN EDITAR */}
            <TouchableOpacity onPress={() => abrirModal(item)}>
                <Ionicons name="pencil" size={24} color="#FF9800" />
            </TouchableOpacity>
            {/* BOTÓN ELIMINAR */}
            <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24}/></TouchableOpacity>
        <Text style={styles.headerTitle}>Restaurantes</Text>
        <View style={{width:24}}/>
      </View>

      {loading ? <ActivityIndicator size="large" color="#2196F3"/> : (
        <FlatList 
            data={restaurantes} 
            keyExtractor={i => i.id.toString()} 
            renderItem={renderItem}
            contentContainerStyle={{padding: 20}}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => abrirModal(null)}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>{esEdicion ? "Editar Restaurante" : "Nuevo Restaurante"}</Text>
                <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} placeholderTextColor="#888"/>
                <TextInput style={styles.input} placeholder="Dirección" value={direccion} onChangeText={setDireccion} placeholderTextColor="#888"/>
                <TextInput style={styles.input} placeholder="Tipo" value={tipo} onChangeText={setTipo} placeholderTextColor="#888"/>
                <TextInput style={styles.input} placeholder="URL Imagen" value={imagen} onChangeText={setImagen} placeholderTextColor="#888"/>
                
                <View style={styles.rowBtn}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}><Text>Cancelar</Text></TouchableOpacity>
                    <TouchableOpacity onPress={handleGuardar} style={styles.btnSave}><Text style={{color:'#FFF'}}>Guardar</Text></TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent:'space-between', paddingHorizontal: 20, alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color:"#1b1919ff" },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', color:"#000" },
  sub: { color: '#666', fontSize: 12 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#2196F3', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20, color:"#000" },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 10 },
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color:'#282727ff' },
  input: { borderWidth: 1, borderColor: '#DDD', padding: 10, borderRadius: 8, marginBottom: 10, backgroundColor: '#F9F9F9', color: '#000' },
  rowBtn: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, color:"#000" },
  btnCancel: { padding: 10, color: "#000" },
  btnSave: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, paddingHorizontal: 20 }
});