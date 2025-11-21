import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

//Solo esta creado para que no salga error al intentar ejecutar el proyecto debido a que en la version web
//El mapa no deberia funcionar
export default function DeliveryMap({ route }) {
  const { order } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de Entrega</Text>
      {order ? (
        <Text style={styles.subtitle}>Orden para: {order.cliente?.nombre || 'Cliente Desconocido'}</Text>
      ) : null}
      <Text style={styles.info}>La funcionalidad de mapa no está disponible en la versión web.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
