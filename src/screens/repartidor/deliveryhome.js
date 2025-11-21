import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../styles/DeliveryOrdersStyles';
import DeliveryOrders from './deliveryorders';

export default function DeliveryHome({ navigation }) {
    const [userName, setUserName] = useState('Repartidor');

    useEffect(() => {
        const fetchUserName = async () => {
            const usuarioStr = await AsyncStorage.getItem('usuario');
            if (usuarioStr) {
                const usuario = JSON.parse(usuarioStr);
                setUserName(usuario.nombre || 'Repartidor');
            }
        };
        fetchUserName();
    }, []);

    return (
        <ScrollView style={styles.container}>
            {/* Header de Navegación */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('RepartidorProfile')}>
                    <MaterialIcons name="menu" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Saludo */}
            <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{`¡Hola, ${userName}!`}</Text>
            </View>

            {/* Tarjeta de Ubicación */}
            <View style={styles.locationCard}>
                <Text style={styles.label}>UBICACIÓN</Text>
                <View style={styles.locationRow}>
                    <Text style={styles.locationText}>UTP</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={22} color="#FF6600" />
                </View>
            </View>

            {/* Contadores */}
            <View style={styles.countersRow}>
                <View style={styles.counterBox}>
                    <Text style={styles.counterNumber}>3</Text>
                    <Text style={styles.counterLabel}>Pendientes</Text>
                </View>
                <View style={styles.counterBox}>
                    <Text style={styles.counterNumber}>0</Text>
                    <Text style={styles.counterLabel}>Completadas</Text>
                </View>
            </View>

            {/* Lista de Órdenes */}
            <DeliveryOrders />
        </ScrollView>
    );
}
