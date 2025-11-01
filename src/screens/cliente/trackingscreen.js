// src/screens/trackingscreen.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import MapWebView from '../../components/mapwebview';
import categorystyles from '../../styles/CategoryStyles';
import homestyles from '../../styles/HomeStyles';

const { height } = Dimensions.get('window');

export default function TrackingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order || {}; // { restaurantName, datetime, items, coords, driverCoords }

  const startCoords = order.coords || { latitude: -12.0464, longitude: -77.0428 };
  const [driverPos, setDriverPos] = useState(order.driverCoords || {
    latitude: startCoords.latitude + 0.0035,
    longitude: startCoords.longitude - 0.0035,
  });

  const webRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // center map to restaurant initially (fit bounds)
    const boundsMsg = {
      type: 'fit',
      bounds: [
        [driverPos.latitude, driverPos.longitude],
        [startCoords.latitude, startCoords.longitude],
      ],
    };
    setTimeout(() => {
      webRef.current?.postMessage(JSON.stringify(boundsMsg));
    }, 500);

    // Simular movimiento: desplazarse hacia startCoords
    let step = 0;
    const steps = 40;
    const latStep = (startCoords.latitude - driverPos.latitude) / steps;
    const lngStep = (startCoords.longitude - driverPos.longitude) / steps;

    intervalRef.current = setInterval(() => {
      step += 1;
      const newLat = driverPos.latitude + latStep * step;
      const newLng = driverPos.longitude + lngStep * step;
      const msg = { type: 'move', lat: newLat, lng: newLng };
      webRef.current?.postMessage(JSON.stringify(msg));
      setDriverPos({ latitude: newLat, longitude: newLng });

      if (step >= steps) {
        clearInterval(intervalRef.current);
        Alert.alert('Estado', 'El repartidor llegó al restaurante (simulación).');
      }
    }, 800);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
  summary: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  restName: { fontSize: 18, fontWeight: '700' },
  datetime: { fontSize: 13, color: '#666', marginBottom: 8 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  itemQty: { width: 32, color: '#666' },
  itemName: { flex: 1, marginLeft: 8 },
  itemPrice: { width: 80, textAlign: 'right' },
});
