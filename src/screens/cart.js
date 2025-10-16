import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { CartContext } from '../context/CartContext';
import homestyles from '../styles/HomeStyles';
import categorystyles from '../styles/CategoryStyles';

export default function CartScreen() {
      const route = useRoute();
  const {
    items,
    updateQty,
    removeItem,
    subtotal,
    address,
    setAddress,
    clearCart,
  } = useContext(CartContext);
  const navigation = useNavigation();

const placeOrder = () => {
  if (items.length === 0) {
    Alert.alert('Carrito vacío', 'Agrega productos antes de poner la orden');
    return;
  }
  // Navegar a Payment sin limpiar el carrito todavía
  navigation.navigate('PaymentScreen', { from: 'Cart' });
};
  return (
    <View style={styles.page}>
        <View style={categorystyles.headerContainer}>
          {/* Flecha */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={categorystyles.iconButton}>
            <Image source={require('../../assets/icons/Back.png')} style={categorystyles.headerIcon} />
          </TouchableOpacity>
        </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {items.length === 0 ? (
          <Text style={styles.emptyText}>No hay productos en el carrito.</Text>
        ) : (
          items.map(it => (
            <View key={it.id} style={[homestyles.cardBase, styles.itemCard]}>
              <Image source={it.image} style={styles.itemImage} />
              <View style={styles.itemBody}>
                <Text style={styles.itemName}>{it.name}</Text>
                <Text style={styles.itemPrice}>${(it.price * it.qty).toFixed(2)}</Text>

                <View style={styles.row}>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      onPress={() => updateQty(it.id, Math.max(1, it.qty - 1))}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyBtnText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{it.qty}</Text>

                    <TouchableOpacity
                      onPress={() => updateQty(it.id, it.qty + 1)}
                      style={styles.qtyBtn}
                    >
                      <Text style={styles.qtyBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity onPress={() => removeItem(it.id)} style={styles.removeBtn}>
                    <Text style={styles.removeText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.addressRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.smallLabel}>Dirección de entrega</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.addressInput}
              placeholder="Escribe la dirección"
            />
          </View>

          <TouchableOpacity
            style={styles.editAddrBtn}
            onPress={() => Alert.alert('Editar dirección', 'Navega a la pantalla de edición o abre un modal')}
          >
            <Text style={styles.editAddrText}>Editar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.orderBtn} onPress={placeOrder}>
          <Text style={styles.orderBtnText}>Poner orden</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fff', padding: 20 },
  emptyText: { color: '#666', marginTop: 8 },

  itemCard: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: { width: 72, height: 72, borderRadius: 8, marginRight: 12, resizeMode: 'cover' },
  itemBody: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  itemPrice: { fontSize: 14, color: '#666', marginBottom: 8 },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  qtyBtnText: { fontSize: 16, fontWeight: '600' },
  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: '600' },

  removeBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  removeText: { color: '#c00' },

  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    backgroundColor: '#fff',
  },

  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  smallLabel: { fontSize: 12, color: '#666', marginBottom: 6 },
  addressInput: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  editAddrBtn: { marginLeft: 10, padding: 8 },
  editAddrText: { color: '#2F7EBF' },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: '700' },

  orderBtn: {
    backgroundColor: '#FF6600',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
