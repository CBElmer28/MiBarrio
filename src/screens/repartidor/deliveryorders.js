import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../styles/DeliveryOrdersStyles';

const staticOrders = [
  {
    id: 1,
    direccion_entrega: "UCV, Av. Alfredo Mendiola 6232",
    cliente: { nombre: "Carlos Ruiz (Prueba)" },
    detalles: [
      { id: 1, cantidad: 1, platillo: { nombre: "Café Americano" }, subtotal: 8.00 },
    ],
    destination: { latitude: -11.9551101, longitude: -77.0695132 }
  },
  {
    id: 2,
    direccion_entrega: "Jr. de la Unión 456, Cercado de Lima",
    cliente: { nombre: "Ana Gomez" },
    detalles: [
      { id: 3, cantidad: 1, platillo: { nombre: "Hamburguesa Clásica" }, subtotal: 25.00 }
    ],
    destination: { latitude: -12.0479, longitude: -77.0306 }
  },
  {
    id: 3,
    direccion_entrega: "Palacio de la Juventud, Av. Universitaria 2202, Los Olivos",
    cliente: { nombre: "Maria Solano" },
    detalles: [
      { id: 4, cantidad: 1, platillo: { nombre: "Ceviche Mixto" }, subtotal: 45.00 },
    ],
    destination: { latitude: -12.0195, longitude: -77.0708 }
  }
];

const OrderCard = ({ order, onToggle }) => {
  const navigation = useNavigation();
  const { id, direccion_entrega, cliente, detalles, expanded } = order;

  return (
    <View style={styles.orderCard}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.orderHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.orderName}>{`Orden para ${cliente.nombre}`}</Text>
            <Text style={styles.orderAddress}>{direccion_entrega}</Text>
            <Text style={styles.itemsCount}>{`${detalles.length} item(s)`}</Text>
          </View>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={26}
            color="#555"
          />
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.orderDetails}>
          <Text style={styles.detailsTitle}>Pedidos:</Text>
          {detalles.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text>{`${item.cantidad}x ${item.platillo.nombre}`}</Text>
              <Text>{`S/ ${item.subtotal}`}</Text>
            </View>
          ))}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => navigation.navigate('DeliveryMap', { order })}
            >
              <MaterialIcons name="map" size={16} color="#fff" />
              <Text style={styles.mapButtonText}>Ver en Mapa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => console.log("Cancelar orden:", id)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Cargar los datos estáticos con la propiedad 'expanded' inicializada
    const formattedOrders = staticOrders.map(o => ({ ...o, expanded: false }));
    setOrders(formattedOrders);
  }, []);

  const toggleExpand = (orderId) => {
    // La animación se elimina, el cambio de estado es instantáneo
    setOrders(currentOrders =>
      currentOrders.map(order =>
        order.id === orderId ? { ...order, expanded: !order.expanded } : order
      )
    );
  };

  return (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>{`${orders.length} Órdenes de Muestra`}</Text>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onToggle={() => toggleExpand(order.id)}
        />
      ))}
    </View>
  );
}
