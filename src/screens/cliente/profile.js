import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Profile({ navigation }) {
    const [userName, setUserName] = useState('Usuario');

    useEffect(() => {
        const loadUser = async () => {
            const u = await AsyncStorage.getItem('usuario');
            if(u) setUserName(JSON.parse(u).nombre);
        };
        loadUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(['token', 'usuario', 'token_timestamp']);
        navigation.replace('Login');
    };

    const MenuItem = ({ icon, label, screen, color = "#333", isDestructive = false }) => (
        <TouchableOpacity 
            style={styles.menuRow}
            onPress={() => screen ? navigation.navigate('Menu', { screen }) : handleLogout()}
        >
            <View style={[styles.iconBox, { backgroundColor: isDestructive ? '#FEE2E2' : '#F5F6FA' }]}>
                <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : '#FF6600'} />
            </View>
            <Text style={[styles.menuText, isDestructive && { color: '#EF4444' }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* Header Perfil */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.avatar} />
                    <View style={styles.editIcon}>
                        <Ionicons name="pencil" size={12} color="#FFF" />
                    </View>
                </View>
                <Text style={styles.name}>{userName}</Text>
                <Text style={styles.email}>Amante de la comida 🍔</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                
                <Text style={styles.sectionTitle}>CUENTA</Text>
                <View style={styles.card}>
                    <MenuItem icon="person-outline" label="Información personal" screen="Info" />
                    <View style={styles.divider}/>
                    <MenuItem icon="map-outline" label="Direcciones" screen="Addresses" />
                    <View style={styles.divider}/>
                    <MenuItem icon="card-outline" label="Métodos de pago" screen="PaymentMethods" />
                </View>

                <Text style={styles.sectionTitle}>ACTIVIDAD</Text>
                <View style={styles.card}>
                    <MenuItem icon="receipt-outline" label="Mis Órdenes" screen="Orders" />
                    <View style={styles.divider}/>
                    <MenuItem icon="heart-outline" label="Favoritos" screen="Favorites" />
                </View>

                <Text style={styles.sectionTitle}>GENERAL</Text>
                <View style={styles.card}>
                    <MenuItem icon="notifications-outline" label="Notificaciones" screen="Notifications" />
                    <View style={styles.divider}/>
                    <MenuItem icon="settings-outline" label="Configuración" screen="Settings" />
                    <View style={styles.divider}/>
                    <MenuItem icon="log-out-outline" label="Cerrar sesión" isDestructive />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FD' },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, backgroundColor: '#FFF' },
    avatarContainer: { marginBottom: 15 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#F8F9FD' },
    editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FF6600', padding: 6, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
    name: { fontSize: 22, fontWeight: '800', color: '#1a1d2e' },
    email: { fontSize: 14, color: '#888', marginTop: 4 },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionTitle: { fontSize: 13, fontWeight: '700', color: '#999', marginBottom: 10, marginTop: 25, marginLeft: 10 },
    
    card: { backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 5, paddingHorizontal: 15, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
    
    menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    iconBox: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 50 }
});