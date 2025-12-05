import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Modal, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

// Importamos del servicio (Asegúrate de haber agregado las funciones arriba)
import { 
  getRepartidoresDisponibles, 
  crearRepartidor, 
  editarRepartidor, 
  eliminarRepartidor 
} from '../../services/orderService';

const VRepartidor = ({ navigation }) => {
  const [repartidores, setRepartidores] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal y Formulario
  const [modalVisible, setModalVisible] = useState(false);
  const [esEdicion, setEsEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);
  const [procesando, setProcesando] = useState(false);

  // Campos
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Cargar Lista
  const cargarLista = async () => {
    setLoading(true);
    const data = await getRepartidoresDisponibles();
    setRepartidores(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      cargarLista();
    }, [])
  );

  // Abrir Modal
  const abrirModal = (repartidor = null) => {
    if (repartidor) {
      setEsEdicion(true);
      setIdSeleccionado(repartidor.id);
      setNombre(repartidor.nombre);
      setEmail(repartidor.email);
      setPassword(''); 
    } else {
      setEsEdicion(false);
      setIdSeleccionado(null);
      setNombre('');
      setEmail('');
      setPassword('');
    }
    setModalVisible(true);
  };

  // Guardar
  const handleGuardar = async () => {
    if (!nombre || !email) {
      Alert.alert("Faltan datos", "Nombre y Email son obligatorios");
      return;
    }
    if (!esEdicion && !password) {
      Alert.alert("Faltan datos", "La contraseña es obligatoria");
      return;
    }

    setProcesando(true);
    
    // Preparamos el objeto para el backend
    const datos = { nombre, email };
    if (password.length > 0) datos.contraseña = password;

    let resultado;
    if (esEdicion) {
      resultado = await editarRepartidor(idSeleccionado, datos);
    } else {
      resultado = await crearRepartidor(datos);
    }

    setProcesando(false);

    if (resultado && !resultado.error) {
      Alert.alert("¡Listo!", esEdicion ? "Actualizado correctamente" : "Creado correctamente");
      setModalVisible(false);
      cargarLista();
    } else {
      Alert.alert("Error", resultado?.error || "No se pudo guardar");
    }
  };

  // Eliminar
  const handleEliminar = (id) => {
    Alert.alert(
      "Despedir Repartidor",
      "¿Seguro que quieres eliminar a este usuario? No podrá acceder más.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
             await eliminarRepartidor(id);
             cargarLista();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <View style={styles.avatar}>
            <Ionicons name="bicycle" size={24} color="#FFF" />
        </View>
        <View>
            <Text style={styles.name}>{item.nombre}</Text>
            {/* CAMBIO: Color email negro */}
            <Text style={styles.email}>{item.email}</Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => abrirModal(item)} style={styles.iconBtn}>
            <Ionicons name="pencil" size={20} color="#FF8A00" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleEliminar(item.id)} style={styles.iconBtn}>
            <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          {/* CAMBIO: Flecha negra */}
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestionar Flota</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8A00" style={{marginTop:50}}/>
      ) : (
        <FlatList
          data={repartidores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            // CAMBIO: Texto vacío negro
            <Text style={styles.emptyText}>No tienes repartidores registrados.</Text>
          }
        />
      )}

      {/* FAB (Botón Flotante) */}
      <TouchableOpacity style={styles.fab} onPress={() => abrirModal(null)}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="fade" transparent={true} visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{esEdicion ? "Editar Datos" : "Nuevo Repartidor"}</Text>
            
            {/* CAMBIO: Placeholders visibles (#555) */}
            <TextInput 
                style={styles.input} 
                placeholder="Nombre completo" 
                placeholderTextColor="#555"
                value={nombre} onChangeText={setNombre} 
            />
            <TextInput 
                style={styles.input} 
                placeholder="Correo electrónico" 
                placeholderTextColor="#555"
                value={email} onChangeText={setEmail} 
                keyboardType="email-address" autoCapitalize="none"
            />
            <TextInput 
                style={styles.input} 
                placeholder={esEdicion ? "Nueva contraseña (opcional)" : "Contraseña"} 
                placeholderTextColor="#555"
                value={password} onChangeText={setPassword} 
                secureTextEntry
            />

            <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.btnCancel} onPress={() => setModalVisible(false)}>
                    {/* CAMBIO: Texto cancelar negro */}
                    <Text style={styles.txtCancel}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.btnSave} onPress={handleGuardar} disabled={procesando}>
                    {procesando ? <ActivityIndicator color="#FFF"/> : <Text style={styles.txtSave}>Guardar</Text>}
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VRepartidor;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7", paddingTop: 40 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 15 },
  // CAMBIO: Color #000
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  list: { padding: 16 },
  // CAMBIO: Color #000
  emptyText: { textAlign: 'center', color: '#000', marginTop: 50 },
  
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#FF8A00', justifyContent: 'center', alignItems: 'center' },
  // CAMBIO: Color #000
  name: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  // CAMBIO: Color #000
  email: { fontSize: 12, color: '#000' },
  
  actions: { flexDirection: 'row', gap: 10 },
  iconBtn: { padding: 8 },
  
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF8A00', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.3, shadowRadius: 3 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, elevation: 5 },
  // CAMBIO: Color #000
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#000' },
  // CAMBIO: Color texto input #000 y fondo blanco puro
  input: { borderWidth: 1, borderColor: '#EEE', borderRadius: 8, padding: 12, marginBottom: 15, backgroundColor: '#FFF', color: '#000' },
  
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  // CAMBIO: Fondo gris un poco más oscuro
  btnCancel: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 8, backgroundColor: '#DDD' },
  btnSave: { flex: 1, padding: 15, alignItems: 'center', borderRadius: 8, backgroundColor: '#FF8A00' },
  // CAMBIO: Color texto cancelar #000
  txtCancel: { fontWeight: 'bold', color: '#000' },
  txtSave: { fontWeight: 'bold', color: '#FFF' }
});