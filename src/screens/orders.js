import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

export default function Orders({navigation}) {
      const handleClose = () => {
    navigation.closeDrawer();
  };

  const [activeTab, setActiveTab] = useState('ongoing');

  const ongoingOrders = [
    { id: '1', vendor: 'Pizza Hut', price: 35.25, items: 3, orderNo: '162432' },
    { id: '2', vendor: 'McDonald', price: 40.15, items: 2, orderNo: '242432' },
    { id: '3', vendor: 'Starbucks', price: 17.20, items: 1, orderNo: '240112' },
  ];

  const historyOrders = [
    { id: '4', vendor: 'Burger King', price: 28.50, items: 2, orderNo: '152222' },
    { id: '5', vendor: 'KFC', price: 22.00, items: 1, orderNo: '142111' },
  ];

  const renderOrder = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.vendor}>{item.vendor}</Text>
        <Text style={styles.details}>${item.price.toFixed(2)} • {item.items} {item.items > 1 ? 'items' : 'item'}</Text>
        <Text style={styles.orderNo}>Orden #{item.orderNo}</Text>
      </View>
      {activeTab === 'ongoing' && (
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.track]}>
            <Text style={styles.buttonText}>Rastrear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.cancel]}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
          <TouchableOpacity onPress={handleClose} style={{ marginLeft: 10, padding: 4 }}>
            <MaterialIcons name="arrow-back" size={28} color="#FF6600" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Menú</Text>
        </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('ongoing')}
        >
          <Text style={[styles.tabText, activeTab === 'ongoing' && styles.activeTabText]}>En curso</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>Historial</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={activeTab === 'ongoing' ? ongoingOrders : historyOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    margin: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FF6600',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  orderInfo: {
    marginBottom: 10,
  },
  vendor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  details: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  orderNo: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  track: {
    backgroundColor: '#FF6600',
  },
  cancel: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
});
