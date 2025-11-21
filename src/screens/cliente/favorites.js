import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config';

export default function Favorites({ navigation }) {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const usuario = await AsyncStorage.getItem('usuario');
                const cliente_id = JSON.parse(usuario)?.id;

                if (cliente_id) {
                    const response = await axios.get(`${API_URL}/favoritos/${cliente_id}`);
                    setFavoritos(response.data);
                }
            } catch (error) {
                console.error('Error al cargar favoritos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Image
                        source={require('../../../assets/icons/Back.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favoritos</Text>
            </View>

            {/* Contenido */}
            {loading ? (
                <Text style={styles.text}>Cargando favoritos...</Text>
            ) : favoritos.length === 0 ? (
                <Text style={styles.text}>Aquí aparecerán tus comidas y restaurantes favoritos</Text>
            ) : (
                <ScrollView style={{ marginTop: 10 }}>
                    {favoritos.map((item) => (
                        <View key={item.id} style={{ marginBottom: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.platillo?.nombre}</Text>
                            <Text style={{ fontSize: 14, color: '#666' }}>{item.platillo?.precio} soles</Text>
                            <Text style={{ fontSize: 12, color: '#999' }}>
                                Desde: {new Date(item.fecha).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  backIcon: {
    width: 26,
    height: 26,
    tintColor: '#FF6600',
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
