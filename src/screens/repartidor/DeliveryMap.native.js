import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications'; // <--- Importar notificaciones
import { io } from "socket.io-client";
import { getDistance } from 'geolib';
import polyline from '@mapbox/polyline';
import { API_URL, GOOGLE_MAPS_API_KEY } from '../../config';
import { MaterialIcons } from '@expo/vector-icons';

const SOCKET_URL = API_URL.replace('/api', '');
const PROXIMITY_THRESHOLD = 200;
const ROUTE_REFETCH_INTERVAL = 5000;

// Configuración para que la notificación aparezca con la app en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function DeliveryMap({ route, navigation }) {
  const { order } = route.params;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isAlertShown, setIsAlertShown] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const mapRef = useRef(null);
  const lastRouteFetchTime = useRef(0);

  // Función para enviar la notificación
  const sendProximityNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Estás Cerca del Destino",
        body: `Has llegado a la ubicación de ${order.cliente.nombre}.`,
        data: { orderId: order.id },
      },
      trigger: null,
    });
  };

  const fetchRoute = async (origin, destination) => {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error("La clave de API de Google Maps no está configurada.");
      return;
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const json = await response.json();
      if (json.routes.length > 0) {
        const points = polyline.decode(json.routes[0].overview_polyline.points);
        const coords = points.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoordinates(coords);
      }
    } catch (error) {
      console.error("Error al obtener la ruta:", error);
    }
  };

  useEffect(() => {
    const socket = io(SOCKET_URL);
    let locationSubscription = null;

    const requestPermissions = async () => {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        setErrorMsg('El permiso para acceder a la ubicación fue denegado');
        return false;
      }

      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        console.warn('El permiso para notificaciones fue denegado');
      }
      return true;
    };

    const startTracking = async () => {
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) return;

      let initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation.coords);
      
      if (order.destination) {
        fetchRoute(initialLocation.coords, order.destination);
        lastRouteFetchTime.current = Date.now();
      }

      locationSubscription = await Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 10,
      }, (newLocation) => {
        const currentLocation = newLocation.coords;
        setLocation(currentLocation);

        // --- LÓGICA DE ACTUALIZACIÓN DE RUTA ---
        const now = Date.now();
        if (now - lastRouteFetchTime.current > ROUTE_REFETCH_INTERVAL) {
          fetchRoute(currentLocation, order.destination);
          lastRouteFetchTime.current = now;
        }
        // --- FIN DE LA LÓGICA ---

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }

        socket.emit('updateLocation', {
          orderId: order.id,
          coords: currentLocation,
        });

        const distance = getDistance(currentLocation, order.destination);
        if (distance < PROXIMITY_THRESHOLD && !isAlertShown) {
          sendProximityNotification();
          setIsAlertShown(true);
        }
      });
    };

    socket.on('connect', () => {
      socket.emit('joinOrderRoom', order.id);
    });

    startTracking();

    return () => {
      socket.disconnect();
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [order.id]);

  if (errorMsg) {
    return <View style={styles.loadingContainer}><Text>{errorMsg}</Text></View>;
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
        <Text>Obteniendo ubicación inicial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
      >
        {order.destination && (
          <Marker
            coordinate={order.destination}
            title="Destino"
            description={order.direccion_entrega}
            pinColor="#1E90FF"
          />
        )}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#FF6600"
          strokeWidth={5}
        />
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('RepartidorDashboard')}>
        <MaterialIcons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.title}>Entregar a: {order.cliente.nombre}</Text>
        <Text style={styles.address}>{order.direccion_entrega}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: '100%' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
    elevation: 5,
  },
  infoBox: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  address: { fontSize: 14, color: '#666' }
});
