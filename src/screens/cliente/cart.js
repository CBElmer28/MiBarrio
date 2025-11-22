import React, { useContext, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { CartContext } from '../../context/CartContext';
import homestyles from '../../styles/HomeStyles';
import categorystyles from '../../styles/CategoryStyles';
// IMPORTAR EL MODAL
import AddressModal from '../../components/elements/addressmodal';

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

    // Estado para controlar la visibilidad del modal
    const [modalVisible, setModalVisible] = useState(false);

    const placeOrder = () => {
        if (items.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega productos antes de poner la orden');
            return;
        }
        // Validar que haya dirección antes de pasar al pago
        if (!address || address.trim() === '') {
            Alert.alert('Falta Dirección', 'Por favor ingresa o selecciona una dirección de entrega.');
            return;
        }
        navigation.navigate('PaymentScreen', { from: 'Cart' });
    };

    const handleAddressSelect = (selectedAddress) => {
        setAddress(selectedAddress);
        setModalVisible(false);
    };

    return (
        <View style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Carrito</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditCart')}>
                    <Text style={styles.editLink}>EDITAR ARTÍCULOS</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContainer}>
                {items.length === 0 ? (
                    <Text style={styles.emptyText}>No hay productos en el carrito.</Text>
                ) : (
                    items.map(it => (
                        <View key={it.id} style={styles.itemCard}>
                            <Image source={it.image} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{it.name}</Text>
                                <Text style={styles.itemPrice}>S/{it.price}</Text>

                                {/* Botón eliminar */}
                                <TouchableOpacity
                                    onPress={() => removeItem(it.id)}
                                    style={styles.removeButton}
                                >
                                    <Text style={styles.removeText}>Eliminar</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.qtyControls}>
                                <TouchableOpacity
                                    onPress={() => updateQty(it.id, Math.max(1, it.qty - 1))}
                                    style={styles.qtyButton}
                                >
                                    <Text style={styles.qtyButtonText}>−</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyNumber}>{it.qty}</Text>
                                <TouchableOpacity
                                    onPress={() => updateQty(it.id, it.qty + 1)}
                                    style={styles.qtyButton}
                                >
                                    <Text style={styles.qtyButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.addressSection}>
                    <View style={styles.addressHeader}>
                        <Text style={styles.addressLabel}>DIRECCIÓN DE ENTREGA</Text>
                        {/* Al presionar EDITAR se abre el modal */}
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Text style={styles.editText}>EDITAR / SELECCIONAR</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        style={styles.addressInput}
                        placeholder="Escribe o selecciona una dirección"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>TOTAL</Text>
                    <Text style={styles.totalAmount}>S/{subtotal.toFixed(2)}</Text>
                </View>

                <TouchableOpacity style={styles.orderButton} onPress={placeOrder}>
                    <Text style={styles.orderButtonText}>REALIZAR PEDIDO</Text>
                </TouchableOpacity>
            </View>

            {/* Integración del Modal */}
            <AddressModal 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelectAddress={handleAddressSelect}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#1a1d2e',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#1a1d2e',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2a2d3e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '300',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    editLink: {
        color: '#FF6B35',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    emptyText: {
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#252838',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#1a1d2e',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
    },
    itemName: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    itemSize: {
        color: '#8B8D98',
        fontSize: 13,
        marginBottom: 8,
    },
    removeButton: {
        alignSelf: 'flex-start',
        paddingVertical: 4,
    },
    removeText: {
        color: '#FF6B35',
        fontSize: 13,
        fontWeight: '600',
    },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    qtyButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1a1d2e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
    },
    qtyNumber: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        minWidth: 20,
        textAlign: 'center',
    },
    footer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 34,
    },
    addressSection: {
        marginBottom: 20,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressLabel: {
        color: '#999',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    editText: {
        color: '#FF6B35',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    addressInput: {
        color: '#1a1d2e',
        fontSize: 15,
        fontWeight: '500',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        color: '#999',
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    totalAmount: {
        color: '#1a1d2e',
        fontSize: 24,
        fontWeight: '700',
    },
    orderButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        paddingVertical: 18,
        alignItems: 'center',
    },
    orderButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});