import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import BackArrow from '../../components/ui/backarrow';

export default function RepartidorProfile({ navigation }) {
    const [userName, setUserName] = useState('Repartidor');

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const usuarioStr = await AsyncStorage.getItem('usuario');
                if (usuarioStr) {
                    const usuario = JSON.parse(usuarioStr);
                    setUserName(usuario.nombre || 'Repartidor');
                }
            } catch (e) {
                console.error("Error al cargar usuario:", e);
            }
        };
        fetchUserName();
    }, []);

    const handleLogout = () => {
        navigation.navigate("AuthLoading");
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Información personal' },
        { icon: 'history', label: 'Historial de entregas' },
        { icon: 'account-balance-wallet', label: 'Ganancias' },
        { icon: 'notifications-none', label: 'Notificaciones' },
        { icon: 'settings', label: 'Configuración' },
        { icon: 'logout', label: 'Cerrar sesión', action: handleLogout },
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.headerBar}>
                    <BackArrow onPress={() => navigation.goBack()} color="#FF6600" />
                    <Text style={styles.headerTitle}>Mi Perfil</Text>
                </View>

                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/100' }}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.name}>{userName}</Text>
                        <Text style={styles.status}>En línea</Text>
                    </View>
                </View>

                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => item.action && item.action()}
                    >
                        <View style={styles.menuLeft}>
                            <MaterialIcons name={item.icon} size={24} color="#FF6600" />
                            <Text style={styles.menuText}>{item.label}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 20,
        backgroundColor: '#e0e0e0',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        marginLeft: 16,
        color: '#333',
    },
});