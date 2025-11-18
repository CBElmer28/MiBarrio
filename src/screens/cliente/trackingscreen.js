
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapWebView from '../../components/mapwebview';
import categorystyles from '../../styles/CategoryStyles';
import homestyles from '../../styles/HomeStyles';
import io from 'socket.io-client';
import { API_URL } from "../../config";
import * as Location from 'expo-location';


const { height } = Dimensions.get('window');

export default function TrackingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order || {};
  const startCoords = order.coords || { latitude: -12.0464, longitude: -77.0428 };
  const [driverPos, setDriverPos] = useState(order.driverCoords || {
    latitude: startCoords.latitude + 0.0035,
    longitude: startCoords.longitude - 0.0035,
  });

  const webRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
  const obtenerUbicacionCliente = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se puede acceder a la ubicación');
      return;
    }

    const ubicacion = await Location.getCurrentPositionAsync({});
    const clienteCoords = {
      latitude: ubicacion.coords.latitude,
      longitude: ubicacion.coords.longitude,
    };

    // Enviar ubicación del cliente al mapa
    const msg = { type: 'cliente', lat: clienteCoords.latitude, lng: clienteCoords.longitude };
    webRef.current?.postMessage(JSON.stringify(msg));

    // Centrar mapa entre cliente y repartidor
    const boundsMsg = {
      type: 'fit',
      bounds: [
        [driverPos.latitude, driverPos.longitude],
        [clienteCoords.latitude, clienteCoords.longitude],
      ],
    };
    webRef.current?.postMessage(JSON.stringify(boundsMsg));
  };

  obtenerUbicacionCliente();


    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={categorystyles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
          <Image source={require('../../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapWebView
          latitude={driverPos.latitude}
          longitude={driverPos.longitude}
          webRefProp={webRef}
        />
      </View>

      <View style={styles.summary}>
        <Text style={homestyles.sectionTitle}>Seguimiento</Text>
        <Text style={styles.restName}>{order.restaurantName || 'Restaurante'}</Text>
        <Text style={styles.datetime}>{order.datetime || '—'}</Text>

        <Text style={[homestyles.sectionTitle, { marginTop: 8 }]}>Productos</Text>
        <FlatList
          data={order.items || []}
          keyExtractor={(i) => `${i.id}`}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemQty}>x{item.qty}</Text>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: { height: height * 0.63, width: '100%' },
  summary: { flex: 1, padding: 16, backgroundColor: '#fff' },
  restName: { fontSize: 18, fontWeight: '700' },
  datetime: { fontSize: 13, color: '#666', marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  itemQty: { width: 32, color: '#666' },
  itemName: { flex: 1, marginLeft: 8 },
  itemPrice: { width: 80, textAlign: 'right' },
});
