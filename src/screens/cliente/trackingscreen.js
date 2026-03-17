import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function TrackingScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const order = route.params?.order || {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rastreo de Pedido</Text>
            
            <View style={styles.card}>
                <Text style={styles.restName}>
                    {order.restaurante?.nombre || order.restaurantName || 'Restaurante'}
                </Text>
                <Text style={styles.status}>Estado: {order.estado?.toUpperCase() || 'EN PROCESO'}</Text>
                <Text style={styles.info}>
                    El mapa interactivo en tiempo real solo está disponible en nuestra aplicación móvil (Android/iOS).
                </Text>
            </View>

            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Volver a mis pedidos</Text>
            </TouchableOpacity>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333'
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        width: '100%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 30
    },
    restName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    status: {
        fontSize: 16,
        color: '#FF6600',
        fontWeight: '600',
        marginBottom: 15,
    },
    info: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20
    },
    backButton: {
        backgroundColor: '#FF6600',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});