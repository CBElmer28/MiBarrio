import React, { useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { CartContext } from '../../context/CartContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import PaymentSuccess from '../../components/elements/paymentsuccess';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Servicios
import { crearOrden } from '../../services/orderService';
import { getMisTarjetas } from '../../services/paymentService';

const getUserLocal = async () => {
    try {
        let json = await AsyncStorage.getItem('usuario');
        if(!json) json = await AsyncStorage.getItem('user');
        return json ? JSON.parse(json) : null;
    } catch (e) { return null; }
};

const METHODS_TYPES = [
    { id: 'yape', label: 'Yape', icon: require('../../../assets/icons/Yape-logo.png') },
    { id: 'visa', label: 'Visa', icon: require('../../../assets/icons/Visa-logo.png') },
    { id: 'mastercard', label: 'Mastercard', icon: require('../../../assets/icons/Mastercard-logo.png') },
    { id: 'paypal', label: 'PayPal', icon: require('../../../assets/icons/Paypal-logo.png') },
];

export default function PaymentScreen() {
    const navigation = useNavigation();
    const { items, subtotal, clearCart, address } = useContext(CartContext);
    
    const [loading, setLoading] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    
    // Estado para las tarjetas reales de la BD
    const [savedCards, setSavedCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    // Cargar tarjetas cada vez que entramos a la pantalla
    useFocusEffect(
        useCallback(() => {
            cargarMisTarjetas();
        }, [])
    );

    const cargarMisTarjetas = async () => {
        const data = await getMisTarjetas();
        
        // Procesar los datos del backend (parsear el JSON de 'detalles')
        const tarjetasProcesadas = data.map(item => {
            try {
                const detalles = typeof item.detalles === 'string' ? JSON.parse(item.detalles) : item.detalles;
                return {
                    id_bd: item.id, // ID de la relación en BD
                    ...detalles // Esparcimos info como method, last4, phone, etc.
                };
            } catch (e) { return null; }
        }).filter(Boolean);

        setSavedCards(tarjetasProcesadas);
        
        // Seleccionar la primera por defecto si no hay ninguna seleccionada
        if (tarjetasProcesadas.length > 0 && !selectedCard) {
            setSelectedCard(tarjetasProcesadas[0]);
        }
    };

    const onAddCard = (methodType) => {
        navigation.navigate('AddCardScreen', { method: methodType });
    };

    const onPay = async () => {
        if (items.length === 0) return Alert.alert('Carrito vacío', 'Agrega productos antes de pagar');
        if (!address) return Alert.alert('Falta dirección', 'Selecciona una dirección de entrega');
        if (!selectedCard) return Alert.alert('Método de pago', 'Por favor selecciona o agrega un método de pago');

        setLoading(true);

        // 1. Obtener Usuario
        const user = await getUserLocal();
        const userId = user?.id;

        if (!userId) {
            setLoading(false);
            return Alert.alert("Error", "Sesión no válida. Reingresa.");
        }

        // 2. Datos de la Orden
        const restauranteId = items[0]?.restaurante_id || 4; // Fallback a 4 si no viene en el item
        
        const orderData = {
            cliente_id: userId,
            restaurante_id: restauranteId, 
            direccion_entrega: address,
            // Aquí podrías enviar también el id del método de pago si tu backend lo pide
            // metodo_pago_id: selectedCard.id_bd, 
            items: items.map(i => ({
                platillo_id: i.id,
                cantidad: i.qty || i.quantity || 1
            }))
        };

        // 3. Enviar al Backend
        const result = await crearOrden(orderData);
        setLoading(false);

        if (result && result.orden_id) { // Ajusta según la respuesta de tu backend (orden_id o success)
            setCreatedOrder(result);
            setSuccessVisible(true);
        } else if (result && result.message) {
             // Caso backup si tu backend responde con message
             setCreatedOrder(result);
             setSuccessVisible(true);
        } else {
            Alert.alert("Error", "No se pudo procesar el pedido.");
        }
    };

    const handleContinueToTracking = () => {
        setSuccessVisible(false);
        clearCart();
        navigation.navigate('TrackingScreen', { order: createdOrder });
    };

    // Helper para estilos de tarjeta
    const getCardStyle = (method) => {
        switch (method) {
            case 'yape': return { bg: '#6F2C91', txt: '#FFF' };
            case 'plin': return { bg: '#00B2FF', txt: '#FFF' };
            case 'visa': return { bg: '#1A1F71', txt: '#FFF' };
            case 'mastercard': return { bg: '#FF5F00', txt: '#FFF' };
            case 'paypal': return { bg: '#003087', txt: '#FFF' };
            default: return { bg: '#333', txt: '#FFF' };
        }
    };

    return (
        <>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Confirmar Pago</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    
                    {/* Resumen Dirección */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>DIRECCIÓN DE ENTREGA</Text>
                        <View style={styles.addressBox}>
                            <Text style={styles.addressText} numberOfLines={2}>📍 {address || "Selecciona una dirección"}</Text>
                        </View>
                    </View>

                    {/* 1. CARRUSEL DE TARJETAS GUARDADAS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>MIS MÉTODOS GUARDADOS</Text>
                        {savedCards.length > 0 ? (
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
                                {savedCards.map((card, index) => {
                                    const style = getCardStyle(card.method);
                                    const isSelected = selectedCard && selectedCard.id_bd === card.id_bd;
                                    return (
                                        <TouchableOpacity 
                                            key={index} 
                                            style={[
                                                styles.savedCardItem, 
                                                { backgroundColor: style.bg },
                                                isSelected && styles.selectedCardBorder
                                            ]}
                                            onPress={() => setSelectedCard(card)}
                                        >
                                            <Text style={[styles.cardBrand, {color: style.txt}]}>{card.method.toUpperCase()}</Text>
                                            <Text style={[styles.cardLabel, {color: style.txt}]}>
                                                {card.method === 'yape' || card.method === 'plin' 
                                                    ? card.phone 
                                                    : `•••• ${card.last4}`}
                                            </Text>
                                            {isSelected && <View style={styles.checkBadge}><Text style={styles.checkIcon}>✓</Text></View>}
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        ) : (
                            <Text style={styles.emptyCardsText}>No tienes métodos guardados.</Text>
                        )}
                    </View>

                    {/* 2. AGREGAR NUEVO MÉTODO */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>AGREGAR NUEVO</Text>
                        <View style={styles.methodsGrid}>
                            {METHODS_TYPES.map(m => (
                                <TouchableOpacity key={m.id} onPress={() => onAddCard(m.id)} style={styles.methodBtn}>
                                    <Image source={m.icon} style={styles.methodIcon} resizeMode="contain" />
                                    <Text style={styles.methodName}>{m.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Total */}
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
                        <Text style={styles.totalAmount}>S/ {subtotal.toFixed(2)}</Text>
                    </View>

                    {/* Botón Pagar */}
                    <TouchableOpacity 
                        style={[styles.payButton, loading && {opacity: 0.7}]} 
                        onPress={onPay}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>REALIZAR PEDIDO</Text>}
                    </TouchableOpacity>

                </ScrollView>
            </View>

            <PaymentSuccess
                visible={successVisible}
                onClose={() => {}}
                onContinue={handleContinueToTracking}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15, backgroundColor: '#fff' },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    backIcon: { fontSize: 24, color: '#333' },
    headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
    content: { padding: 20, paddingBottom: 50 },
    
    section: { marginBottom: 25 },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: '#999', marginBottom: 10, letterSpacing: 0.5 },
    
    addressBox: { backgroundColor: '#FFF', padding: 15, borderRadius: 12 },
    addressText: { fontSize: 15, color: '#333' },

    // Estilos Tarjetas Guardadas
    cardsScroll: { flexDirection: 'row' },
    savedCardItem: { width: 140, height: 90, borderRadius: 12, padding: 12, marginRight: 12, justifyContent: 'space-between' },
    selectedCardBorder: { borderWidth: 3, borderColor: '#FFD700' }, // Borde dorado al seleccionar
    cardBrand: { fontWeight: 'bold', fontSize: 14 },
    cardLabel: { fontSize: 16, fontWeight: '600' },
    checkBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: '#fff', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
    checkIcon: { color: 'green', fontWeight: 'bold', fontSize: 12 },
    emptyCardsText: { color: '#888', fontStyle: 'italic' },

    // Estilos Agregar Nuevo
    methodsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    methodBtn: { alignItems: 'center', width: '22%', backgroundColor: '#FFF', padding: 10, borderRadius: 12, elevation: 1 },
    methodIcon: { width: 40, height: 40, marginBottom: 5 },
    methodName: { fontSize: 11, color: '#555' },

    totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 20, paddingHorizontal: 5 },
    totalLabel: { fontSize: 14, fontWeight: '700', color: '#555' },
    totalAmount: { fontSize: 24, fontWeight: 'bold', color: '#FF6347' },

    payButton: { backgroundColor: '#FF6347', borderRadius: 12, padding: 18, alignItems: 'center', shadowColor: '#FF6347', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    payButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 1 },
});