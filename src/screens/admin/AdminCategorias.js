import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { getCategorias, crearCategoria, editarCategoria, eliminarCategoria } from '../../services/adminService';

export default function AdminCategorias({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [esEdicion, setEsEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [nombre, setNombre] = useState('');

  const cargarLista = async () => {
    setLoading(true);
    const data = await getCategorias();
    setCategorias(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { cargarLista(); }, []));

  const abrirModal = (item = null) => {
    if (item) {
        setEsEdicion(true);
        setIdSeleccionado(item.id);
        setNombre(item.nombre);
    } else {
        setEsEdicion(false);
        setIdSeleccionado(null);
        setNombre('');
    }
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) return Alert.alert("Error", "El nombre es obligatorio");
    
    let res;
    if (esEdicion) {
        res = await editarCategoria(idSeleccionado, nombre);
    } else {
        res = await crearCategoria(nombre);
    }

    if (res && !res.error) {
        setModalVisible(false);
        cargarLista();
        Alert.alert("Éxito", esEdicion ? "Actualizado" : "Creado");
    } else {
        Alert.alert("Error", res?.error || "No se pudo guardar");
    }
  };

  const handleEliminar = (id) => {
    Alert.alert("Eliminar", "¿Borrar esta categoría?", [
      { text: "Cancelar" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
          const res = await eliminarCategoria(id);
          if (res && !res.error) {
            cargarLista();
          } else {
            Alert.alert("Error", res?.error || "No se pudo eliminar");
          }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.info}>
            <Text style={styles.title}>{item.nombre}</Text>
        </View>
        <View style={{flexDirection:'row', gap:15}}>
            <TouchableOpacity onPress={() => abrirModal(item)}>
                <Ionicons name="pencil" size={22} color="#FF9800" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEliminar(item.id)}>
                <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
        </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* CAMBIO: Icono negro explícito */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Categorías</Text>
        <View style={{width:24}}/>
      </View>

      {loading ? <ActivityIndicator size="large" color="#4CAF50" style={{marginTop:50}}/> : (
        <FlatList 
            data={categorias} 
            keyExtractor={i => i.id.toString()} 
            renderItem={renderItem}
            contentContainerStyle={{padding: 20}}
            // CAMBIO: Texto "No hay categorías" en negro
            ListEmptyComponent={<Text style={{textAlign:'center', color:'#000'}}>No hay categorías.</Text>}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => abrirModal(null)}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>{esEdicion ? "Editar Categoría" : "Nueva Categoría"}</Text>
                
                {/* CAMBIO: Placeholder oscuro */}
                <TextInput 
                    style={styles.input} 
                    placeholder="Nombre (Ej: Pizza, Postres)" 
                    placeholderTextColor="#555"
                    value={nombre} 
                    onChangeText={setNombre} 
                />
                
                <View style={styles.rowBtn}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}>
                        {/* CAMBIO: Texto negro explícito */}
                        <Text style={{color:'#000', fontWeight: 'bold'}}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleGuardar} style={styles.btnSave}>
                        <Text style={{color:'#FFF', fontWeight:'bold'}}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent:'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 10 },
  // CAMBIO: Color #000
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  info: { flex: 1 },
  // CAMBIO: Color #000
  title: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 25, borderRadius: 15, elevation: 5 },
  // CAMBIO: Color #000
  modalHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#000' },
  // CAMBIO: Color texto input #000
  input: { borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 8, marginBottom: 20, backgroundColor: '#FFF', fontSize: 16, color: '#000' },
  rowBtn: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  // CAMBIO: Fondo gris un poco más oscuro
  btnCancel: { flex: 1, padding: 15, alignItems:'center', backgroundColor:'#DDD', borderRadius: 8 },
  btnSave: { flex: 1, backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems:'center' }
});