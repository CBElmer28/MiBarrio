import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // Importante para recargar al volver
import styles from '../../styles/DeliveryOrdersStyles';
import DeliveryOrders from './deliveryorders';

// Importar el servicio para contar órdenes reales
import { getMisPedidosAsignados } from '../../services/orderService';

export default function DeliveryHome({ navigation }) {
    const [userName, setUserName] = useState('Repartidor');
    const [pendientes, setPendientes] = useState(0);
    const [completadas, setCompletadas] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    // 1. Cargar nombre del usuario
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

    // 2. Función para calcular contadores
    const fetchCounters = async () => {
        try {
            const orders = await getMisPedidosAsignados();

            if (Array.isArray(orders)) {
                // Filtrar según tus estados de base de datos
                const activos = orders.filter(o =>
                    o.estado === 'asignada' ||
                    o.estado === 'en_camino' ||
                    o.estado === 'lista'
                ).length;

                const finalizados = orders.filter(o =>
                    o.estado === 'entregada'
                ).length;

                setPendientes(activos);
                setCompletadas(finalizados);
            }
        } catch (error) {
            console.error("Error calculando contadores:", error);
        } finally {
            setRefreshing(false);
        }
    };

    // 3. Cargar contadores cada vez que la pantalla tiene foco
    useFocusEffect(
        useCallback(() => {
            fetchCounters();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchCounters();
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FF6600"]} />
            }
        >
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
                    <Text style={styles.locationText}>Lima, Perú</Text>
                    <MaterialIcons name="location-on" size={22} color="#FF6600" />
                </View>
            </View>

            {/* Contadores Dinámicos */}
            <View style={styles.countersRow}>
                <View style={styles.counterBox}>
                    {/* Usamos el estado dinámico aquí */}
                    <Text style={styles.counterNumber}>{pendientes}</Text>
                    <Text style={styles.counterLabel}>Pendientes</Text>
                </View>
                <View style={styles.counterBox}>
                    {/* Usamos el estado dinámico aquí */}
                    <Text style={styles.counterNumber}>{completadas}</Text>
                    <Text style={styles.counterLabel}>Completadas</Text>
                </View>
            </View>

            {/* Lista de Órdenes */}
            {/* Pasamos una prop para forzar actualización si es necesario,
                aunque DeliveryOrders ya tiene su propio focusEffect */}
            <DeliveryOrders />
        </ScrollView>
    );
}