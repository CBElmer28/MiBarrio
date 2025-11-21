import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { CartContext } from '../../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import PaymentSuccess from '../../components/elements/paymentsuccess';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importar servicio
import { crearOrden } from '../../services/orderService';

// Método auxiliar para obtener usuario localmente
const getUserLocal = async () => {
    try {
        let json = await AsyncStorage.getItem('usuario');
        if(!json) json = await AsyncStorage.getItem('user');
        if(!json) json = await AsyncStorage.getItem('userData');
        return json ? JSON.parse(json) : null;
    } catch (e) { return null; }
};

const METHODS = [
    { id: 'yape', label: 'Yape', icon: require('../../../assets/icons/Yape-logo.png') },
    { id: 'visa', label: 'Visa', icon: require('../../../assets/icons/Visa-logo.png') },
    { id: 'mastercard', label: 'Mastercard', icon: require('../../../assets/icons/Mastercard-logo.png') },
    { id: 'paypal', label: 'PayPal', icon: require('../../../assets/icons/Paypal-logo.png') },
];

export default function PaymentScreen() {
    const navigation = useNavigation();
    const { items, subtotal, clearCart, address, cards = [] } = useContext(CartContext);
    const [selected, setSelected] = useState('mastercard');
    const [successVisible, setSuccessVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null); // Guardar orden creada para pasar al tracking

    const onAddCard = () => navigation.navigate('AddCardScreen', { method: selected });

    const onPay = async () => {
        if (items.length === 0) {
            Alert.alert('Carrito vacío', 'Agrega productos antes de pagar');
            return;
        }

        if (!address) {
             Alert.alert('Falta dirección', 'Por favor regresa y selecciona una dirección de entrega');
             return;
        }

        setLoading(true);

        // 1. Obtener ID del cliente
        const user = await getUserLocal();
        const userId = user?.id || user?.usuario?.id || user?.user?.id;

        if (!userId) {
            setLoading(false);
            Alert.alert("Error", "No se pudo identificar al usuario. Reinicia sesión.");
            return;
        }

        // 2. Obtener ID del restaurante (Asumiendo que todos los items son del mismo rest, o tomamos el primero)
        // Nota: Si tus items no tienen 'restaurante_id', asegúrate de agregarlo al agregarlos al carrito
        // O si el backend lo maneja, puedes enviar null (pero tu modelo backend lo pide).
        // Asumiremos que item tiene restaurante_id o lo sacamos de la info del producto.
        // Si no lo tienes en 'items', tendrás que pasarlo desde el carrito o obtenerlo de 'items[0].restaurante_id'
        const restauranteId = items[0]?.restaurante_id || items[0]?.restaurantId || 1; // Fallback temporal a 1 si no existe

        // 3. Preparar datos
        const orderData = {
            cliente_id: userId,
            restaurante_id: restauranteId, 
            direccion_entrega: address, // Enviamos el texto de la dirección
            // direccion_id: null, // Podrías enviar el ID si lo tuvieras guardado en el contexto aparte del texto
            items: items.map(i => ({
                platillo_id: i.id,
                cantidad: i.qty || i.quantity || 1
            }))
        };

        // 4. Llamar al servicio
        const result = await crearOrden(orderData);

        setLoading(false);

        if (result.success) {
            setCreatedOrder(result.orden); // Guardamos la orden real
            setSuccessVisible(true); // Mostrar modal de éxito
        } else {
            Alert.alert("Error al procesar pedido", result.error);
        }
    };

    const handleContinueToTracking = () => {
        setSuccessVisible(false);
        clearCart();
        // Pasamos la orden real creada por el backend
        navigation.navigate('TrackingScreen', { order: createdOrder });
    };

    const getCardStyle = (method) => {
        switch (method) {
            case 'yape': return { backgroundColor: '#6F2C91', textColor: '#FFFFFF' };
            case 'plin': return { backgroundColor: '#00B2FF', textColor: '#FFFFFF' };
            case 'visa': return { backgroundColor: '#1A1F71', textColor: '#FFFFFF' };
            case 'mastercard': return { backgroundColor: '#FF5F00', textColor: '#FFFFFF' };
            case 'paypal': return { backgroundColor: '#003087', textColor: '#FFFFFF' };
            default: return { backgroundColor: '#CCCCCC', textColor: '#000000' };
        }
    };

    const selectedCard = cards.find(c => c.method === selected);

    return (
        <>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Pago</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Dirección Resumen */}
                    <View style={styles.addressSummary}>
                        <Text style={styles.addressLabel}>ENTREGAR EN:</Text>
                        <Text style={styles.addressText} numberOfLines={2}>{address || "Sin dirección seleccionada"}</Text>
                    </View>

                    {/* Métodos de pago */}
                    <View style={styles.methodsGrid}>
                        {METHODS.map(m => {
                            const active = selected === m.id;
                            return (
                                <TouchableOpacity
                                    key={m.id}
                                    onPress={() => setSelected(m.id)}
                                    style={[styles.methodCard, active && styles.methodCardActive]}
                                >
                                    {active && <View style={styles.checkBadge}>
                                        <Text style={styles.checkIcon}>✓</Text>
                                    </View>}
                                    <View style={styles.methodIcon}>
                                        <Image
                                            source={typeof m.icon === 'string' ? { uri: m.icon } : m.icon}
                                            style={styles.methodImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    <Text style={[styles.methodText, active && styles.methodTextActive]}>
                                        {m.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Card Display (Visual Only for now) */}
                    <View style={styles.cardSection}>
                         {/* ... (Código de visualización de tarjeta igual que antes) ... */}
                         {selectedCard ? (
                            <View style={styles.cardDisplay}>
                                <View style={[
                                    styles.cardGradient,
                                    { backgroundColor: getCardStyle(selectedCard.method).backgroundColor }
                                ]}>
                                    {/* ... contenido tarjeta ... */}
                                    <Text style={{color:'white', fontWeight:'bold'}}>Tarjeta Guardada</Text>
                                    <Text style={{color:'white', fontSize:18, marginVertical:10}}>•••• •••• •••• {selectedCard.last4}</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.noCardContainer}>
                                <Text style={styles.noCardTitle}>Pagar con {selected}</Text>
                                <Text style={styles.noCardText}>Se realizará el cargo al confirmar.</Text>
                            </View>
                        )}
                    </View>

                    {/* Total */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>TOTAL:</Text>
                        <Text style={styles.totalAmount}>S/{subtotal.toFixed(2)}</Text>
                    </View>

                    {/* Pay Button */}
                    <TouchableOpacity 
                        style={[styles.payButton, loading && {opacity: 0.7}]} 
                        onPress={onPay}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.payButtonText}>PAGAR Y CONFIRMAR</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <PaymentSuccess
                visible={successVisible}
                onClose={() => {}} // Bloqueamos cerrar manual para obligar a continuar
                onContinue={handleContinueToTracking}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
        backgroundColor: '#fff',
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#333',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    methodsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    methodCard: {
        width: '22%',
        aspectRatio: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    methodCardActive: {
        borderWidth: 2,
        borderColor: '#FF6347',
    },
    checkBadge: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkIcon: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    methodIcon: {
        marginBottom: 8,
        width: 50,
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodImage: {
        width: 60,
        height: 60,
    },
    methodEmoji: {
        fontSize: 28,
    },
    methodText: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
    },
    methodTextActive: {
        color: '#FF6347',
        fontWeight: '600',
    },
    cardSection: {
        marginBottom: 25,
    },
    cardDisplay: {
        marginBottom: 15,
    },
    cardGradient: {
        backgroundColor: '#FF7F50',
        borderRadius: 16,
        padding: 20,
        minHeight: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    cardChip: {
        width: 45,
        height: 35,
        backgroundColor: '#FFD700',
        borderRadius: 6,
    },
    cardType: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    cardNumber: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '600',
        letterSpacing: 2,
        marginBottom: 20,
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardLabel: {
        color: '#FFE4B5',
        fontSize: 10,
        marginBottom: 4,
    },
    cardName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    cardBrand: {
        fontSize: 32,
    },
    noCardContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 25,
        alignItems: 'center',
        marginBottom: 15,
        minHeight: 200,
        justifyContent: 'center',
    },
    noCardIllustration: {
        marginBottom: 15,
    },
    noCardIcon: {
        width: 100,
        height: 100,
        backgroundColor: '#FFF0E6',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noCardEmoji: {
        fontSize: 48,
    },
    noCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    noCardText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
    addButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#FF6347',
        borderStyle: 'dashed',
    },
    addButtonText: {
        color: '#FF6347',
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    totalLabel: {
        fontSize: 14,
        color: '#999',
        fontWeight: '600',
        letterSpacing: 1,
    },
    totalAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333',
    },
    payButton: {
        backgroundColor: '#FF6347',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#FF6347',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
});
