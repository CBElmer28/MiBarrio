import React, { useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, Image, 
  ActivityIndicator, Modal, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Importamos los servicios del Backend
import { getMisTarjetas, eliminarTarjeta } from '../../services/paymentService';

// Opciones para el Modal de "Agregar Nuevo"
const METHODS_TYPES = [
    { id: 'visa', label: 'Visa', icon: require('../../../assets/icons/Visa-logo.png') },
    { id: 'mastercard', label: 'Mastercard', icon: require('../../../assets/icons/Mastercard-logo.png') },
    { id: 'yape', label: 'Yape', icon: require('../../../assets/icons/Yape-logo.png') },
    { id: 'plin', label: 'Plin', icon: require('../../../assets/icons/Yape-logo.png') }, // Cambia icono si tienes el de Plin
];

export default function PaymentMethods({ navigation }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // 1. Cargar Tarjetas al entrar
  useFocusEffect(
    useCallback(() => {
      cargarTarjetas();
    }, [])
  );

  const cargarTarjetas = async () => {
    setLoading(true);
    const data = await getMisTarjetas();
    
    // Procesamos los datos (el backend devuelve 'detalles' como texto o JSON)
    const tarjetasReales = data.map(item => {
        try {
            const detalles = typeof item.detalles === 'string' ? JSON.parse(item.detalles) : item.detalles;
            return {
                id_bd: item.id, // ID único de la base de datos (para borrar)
                ...detalles     // method, last4, phone, etc.
            };
        } catch (e) { return null; }
    }).filter(Boolean);

    setCards(tarjetasReales);
    setLoading(false);
  };

  // 2. Lógica para Eliminar
  const confirmarEliminar = (id) => {
    Alert.alert(
      "Eliminar método",
      "¿Estás seguro de eliminar este método de pago?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            const res = await eliminarTarjeta(id);
            if (!res.error) {
                cargarTarjetas(); // Recargamos la lista
            } else {
                Alert.alert("Error", "No se pudo eliminar");
            }
          }
        }
      ]
    );
  };

const handleEditar = (item) => {
      // Navegamos al formulario pasando la tarjeta completa para rellenar los datos
      navigation.navigate('AddCard', { 
          method: item.method, 
          cardToEdit: item 
      });
  };

  // 3. Navegar al formulario (AddCard)
  const handleSelectMethod = (methodType) => {
      setModalVisible(false);
      // IMPORTANTE: Asegúrate que 'AddCard' es el nombre en tu ClienteStack.js
      navigation.navigate('AddCard', { method: methodType });
  };

  // Helper para iconos
  const getIcono = (method) => {
    switch(method) {
        case 'visa': return "card"; 
        case 'mastercard': return "card-outline";
        case 'yape': return "phone-portrait-outline"; // Icono de celular
        case 'plin': return "phone-portrait-outline";
        default: return "wallet-outline";
    }
  };

  // Renderizar cada tarjeta
  const renderCard = ({ item }) => (
    <View style={styles.card}>
        <View style={styles.cardLeft}>
            <Ionicons name={getIcono(item.method)} size={30} color="#1A1F71" />
            <View style={{marginLeft: 15}}>
                <Text style={styles.cardBrand}>{item.method.toUpperCase()}</Text>
                <Text style={styles.cardText}>
                    {item.method === 'yape' || item.method === 'plin' ? item.phone : `•••• ${item.last4}`}
                </Text>
            </View>
        </View>
        
        <View style={{flexDirection: 'row'}}>
            {/* BOTÓN EDITAR (LÁPIZ) */}
            <TouchableOpacity onPress={() => handleEditar(item)} style={[styles.iconBtn, {marginRight: 10}]}>
                <Ionicons name="pencil-outline" size={22} color="#FF8A00" />
            </TouchableOpacity>

            {/* BOTÓN ELIMINAR (BASURA) */}
            <TouchableOpacity onPress={() => confirmarEliminar(item.id_bd)} style={styles.iconBtn}>
                <Ionicons name="trash-outline" size={22} color="#FF4444" />
            </TouchableOpacity>
        </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Métodos de Pago</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF6600" style={{marginTop: 50}} />
      ) : (
        <View style={styles.content}>
            <FlatList 
                data={cards}
                keyExtractor={(item) => item.id_bd.toString()}
                renderItem={renderCard}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="card-outline" size={50} color="#DDD" />
                        <Text style={styles.emptyText}>No tienes métodos guardados.</Text>
                    </View>
                }
            />

            {/* Botón Agregar */}
            <TouchableOpacity 
                style={styles.addBtn} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.addText}>+ Agregar Nuevo Método</Text>
            </TouchableOpacity>
        </View>
      )}

      {/* MODAL SELECCIONAR TIPO */}
      <Modal
        animationType="slide" transparent={true} visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecciona un método</Text>
                
                <View style={styles.grid}>
                    {METHODS_TYPES.map((m) => (
                        <TouchableOpacity 
                            key={m.id} 
                            style={styles.methodOption}
                            onPress={() => handleSelectMethod(m.id)}
                        >
                            <Image source={m.icon} style={styles.iconImg} resizeMode="contain" />
                            <Text style={styles.methodLabel}>{m.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity 
                    style={styles.cancelBtn} 
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginLeft: 20 },
  content: { flex: 1, padding: 20 },
  
  // Tarjeta
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#f9f9f9', borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  cardBrand: { fontSize: 12, fontWeight: 'bold', color: '#999' },
  cardText: { fontSize: 16, fontWeight: '500', color: '#333' },
  trashBtn: { padding: 5 },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 50, marginBottom: 30 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 10 },

  // Botón Agregar
  addBtn: { padding: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#FF6600', borderRadius: 10, alignItems: 'center', marginTop: 10 },
  addText: { color: '#FF6600', fontWeight: 'bold' },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 25, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  methodOption: { width: '45%', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 15 },
  iconImg: { width: 50, height: 40, marginBottom: 8 },
  methodLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  cancelBtn: { padding: 15, alignItems: 'center', width: '100%' },
  cancelText: { color: 'red', fontSize: 16, fontWeight: 'bold' }
});