import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Modal, TextInput, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

// 👇 ASEGÚRATE QUE ESTAS FUNCIONES EXISTAN EN TU SERVICIO
import { 
  getCocineros, 
  crearCocinero, 
  editarCocinero, 
  eliminarCocinero, 
  getRestaurantes 
} from '../../services/adminService';

export default function AdminCocineros({ navigation }) {
  const [cocineros, setCocineros] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const [esEdicion, setEsEdicion] = useState(false);
  const [idSeleccionado, setIdSeleccionado] = useState(null);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [selectedRest, setSelectedRest] = useState(null);

  const cargarDatos = async () => {
    setLoading(true);
    console.log("🔄 Cargando lista de cocineros...");
    try {
        const users = await getCocineros();
        const rests = await getRestaurantes();
        console.log("✅ Datos recibidos:", users.length, "cocineros,", rests.length, "restaurantes");
        setCocineros(Array.isArray(users) ? users : []);
        setRestaurantes(Array.isArray(rests) ? rests : []);
    } catch (e) {
        console.error("❌ Error cargando datos:", e);
    } finally {
        setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { cargarDatos(); }, []));

  const abrirModal = (item = null) => {
    console.log("🔘 Abriendo modal...", item ? "Modo Editar" : "Modo Crear");
    if (item) {
        setEsEdicion(true);
        setIdSeleccionado(item.id);
        setNombre(item.nombre);
        setEmail(item.email);
        setPass('');
        setSelectedRest(item.restaurante_id);
    } else {
        setEsEdicion(false);
        setIdSeleccionado(null);
        setNombre(''); setEmail(''); setPass(''); setSelectedRest(null);
    }
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    // 🕵️ RASTREADOR 1: ¿Entra a la función?
    console.log("👉 Botón Guardar presionado");
    console.log("📝 Datos actuales:", { nombre, email, pass, selectedRest });

    if (!nombre || !email || !selectedRest) {
        console.log("❌ Faltan datos obligatorios");
        return Alert.alert("Faltan datos", "Nombre, email y restaurante son obligatorios");
    }
    
    const datos = { nombre, email, restaurante_id: selectedRest };
    if (pass.length > 0) datos.contraseña = pass;

    // 🕵️ RASTREADOR 2: ¿Llama al servicio?
    console.log("🚀 Llamando al servicio...", esEdicion ? "editarCocinero" : "crearCocinero");
    
    let res;
    try {
        if (esEdicion) {
            res = await editarCocinero(idSeleccionado, datos);
        } else {
            res = await crearCocinero(datos); 
        }
        
        console.log("📬 Respuesta del servicio:", res); 

        if (res && !res.error) {
            console.log("✅ Guardado exitoso");
            setModalVisible(false);
            cargarDatos();
            Alert.alert("¡Éxito!", "Operación realizada");
        } else {
            console.log("❌ Error del backend:", res?.error);
            Alert.alert("Error", res?.error || "No se pudo guardar");
        }
    } catch (error) {
        console.error("🔥 CRASH al llamar servicio:", error);
    }
  };

  const handleEliminar = (id) => {
    console.log("🗑️ Intento de eliminar ID:", id);
    Alert.alert("Despedir", "¿Eliminar cocinero?", [
      { text: "Cancelar" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
          console.log("🚀 Enviando orden de eliminar...");
          const res = await eliminarCocinero(id);
          console.log("📬 Respuesta eliminar:", res);
          if (res && !res.error) {
             cargarDatos();
          } else {
             Alert.alert("Error", res?.error || "Fallo al eliminar");
          }
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
        <View style={{flexDirection:'row', alignItems:'center', gap: 10, flex: 1}}>
            <View style={styles.avatar}><Ionicons name="restaurant" size={20} color="#FFF"/></View>
            <View style={{flex: 1}}>
                <Text style={styles.title}>{item.nombre}</Text>
                <Text style={styles.sub}>{item.email}</Text>
                <Text style={styles.restLabel}>
                    🏠 {item.restaurante ? item.restaurante.nombre : "Sin Asignar"}
                </Text>
            </View>
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
      {/* ... HEADER ... */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#000"/></TouchableOpacity>
        <Text style={styles.headerTitle}>Gestionar Cocineros</Text>
        <View style={{width:24}}/>
      </View>

      {/* ... LISTA ... */}
      {loading ? <ActivityIndicator size="large" color="#FF9800" style={{marginTop: 50}}/> : (
        <FlatList data={cocineros} keyExtractor={i => i.id.toString()} renderItem={renderItem} contentContainerStyle={{padding: 20}} />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => abrirModal(null)}>
        <Ionicons name="person-add" size={26} color="#FFF" />
      </TouchableOpacity>

      {/* ... MODAL ... */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalHeader}>{esEdicion ? "Editar Cocinero" : "Contratar Cocinero"}</Text>
                
                {/* CAMBIO: placeholderTextColor a negro/oscuro */}
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholder="Nombre" placeholderTextColor="#555" />
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" placeholderTextColor="#555"/>
                <TextInput style={styles.input} value={pass} onChangeText={setPass} placeholder="Contraseña" placeholderTextColor="#555" />

                <Text style={styles.label}>Asignar a Restaurante:</Text>
                <View style={styles.restListContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {restaurantes.map(r => (
                            <TouchableOpacity 
                                key={r.id} 
                                style={[styles.restItem, selectedRest === r.id && styles.restActive]}
                                onPress={() => {
                                    console.log("Seleccionado restaurante:", r.id, r.nombre);
                                    setSelectedRest(r.id);
                                }}
                            >
                                {/* CAMBIO: Texto negro si no está seleccionado */}
                                <Text style={selectedRest === r.id ? {color:'#FFF', fontWeight: 'bold'} : {color:'#000', fontWeight: 'bold'}}>
                                    {r.nombre}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                
                <View style={styles.rowBtn}>
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.btnCancel}>
                        <Text style={{color: '#000', fontWeight: 'bold'}}>Cancelar</Text>
                    </TouchableOpacity>
                    {/* BOTÓN GUARDAR CONECTADO */}
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
  header: { flexDirection: 'row', justifyContent:'space-between', paddingHorizontal: 20, alignItems: 'center' },
  // CAMBIO: color a #000
  headerTitle: { fontSize: 20, fontWeight: 'bold', color:'#000' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF9800', justifyContent:'center', alignItems:'center' },
  // CAMBIO: color a #000
  title: { fontSize: 16, fontWeight: 'bold', color:'#000' },
  // CAMBIO: color a #000 (antes gris claro)
  sub: { color: '#000', fontSize: 12 },
  // CAMBIO: color azul oscuro o negro para visibilidad
  restLabel: { color: '#000', fontSize: 12, fontWeight: 'bold', marginTop: 2 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#FF9800', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, elevation: 5 },
  // CAMBIO: color a #000
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color:'#000' },
  // CAMBIO: color input #000
  input: { borderWidth: 1, borderColor: '#CCC', padding: 12, borderRadius: 8, marginBottom: 10, backgroundColor: '#FFF', color: '#000' },
  // CAMBIO: color label #000
  label: { fontWeight: 'bold', marginVertical: 8, color: '#000' },
  restListContainer: { marginBottom: 20, height: 50, marginTop: 5 },
  restItem: { paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#DDD', borderRadius: 20, marginRight: 10, justifyContent:'center', height: 40 },
  restActive: { backgroundColor: '#FF9800' },
  rowBtn: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 10 },
  btnCancel: { flex: 1, padding: 15, alignItems:'center', backgroundColor:'#DDD', borderRadius: 8 },
  btnSave: { flex: 1, backgroundColor: '#FF9800', padding: 15, borderRadius: 8, alignItems:'center' }
});