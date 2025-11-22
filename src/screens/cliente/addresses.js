import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getUserId, getAddresses, deleteAddress } from '../../services/addressService';
import AddressModal from '../../components/elements/addressmodal'; // Reutilizamos el modal para crear

export default function Addresses() {
  const navigation = useNavigation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Cargar direcciones al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [])
  );

  const loadAddresses = async () => {
    setLoading(true);
    const userId = await getUserId();
    if (userId) {
      const data = await getAddresses(userId);
      setAddresses(data);
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Eliminar', '¿Seguro que quieres borrar esta dirección?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          await deleteAddress(id);
          loadAddresses();
      }}
    ]);
  };

  // Renderizado de cada tarjeta
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="location-sharp" size={24} color="#FF6B35" />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>{item.etiqueta || 'Ubicación'}</Text>
          {item.principal && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Principal</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText}>{item.direccion}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color="#FF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Direcciones</Text>
        <View style={{width: 40}} />
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator color="#FF6B35" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={60} color="#444" />
              <Text style={styles.emptyText}>No tienes direcciones guardadas.</Text>
            </View>
          }
        />
      )}

      {/* FAB Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Modal para agregar (sin selección, solo gestión) */}
      <AddressModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          loadAddresses(); // Recargar al cerrar
        }}
        onSelectAddress={() => {}} // No seleccionamos, solo gestionamos
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d2e' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { padding: 8, backgroundColor: '#2a2d3e', borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  list: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: '#252838', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center' },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 107, 53, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  infoContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  label: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginRight: 8 },
  badge: { backgroundColor: '#FF6B35', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  addressText: { fontSize: 14, color: '#8B8D98' },
  deleteBtn: { padding: 8 },
  fab: { position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#FF6B35', shadowOpacity: 0.4, shadowOffset: {width:0, height:4} },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#666', marginTop: 16, fontSize: 16 },
});