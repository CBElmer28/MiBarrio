import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
    ActivityIndicator,
    Alert,
    ScrollView,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAddresses, createAddress, deleteAddress, setPrincipalAddress, getUserId } from '../../services/addressService';

export default function AddressModal({ visible, onClose, onSelectAddress }) {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    // Estado para el formulario de nueva dirección
    const [showForm, setShowForm] = useState(false);
    const [newAddress, setNewAddress] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [isPrincipal, setIsPrincipal] = useState(false);

    useEffect(() => {
        if (visible) {
            loadData();
        }
    }, [visible]);

    const loadData = async () => {
        setLoading(true);
        try {
            const id = await getUserId();
            if (id) {
                setUserId(id);
                // Cargar direcciones
                const data = await getAddresses(id);
                if (Array.isArray(data)) {
                    setAddresses(data);
                } else {
                    console.warn("Respuesta inesperada al obtener direcciones:", data);
                    setAddresses([]);
                }
            } else {
                // No alertar agresivamente aquí, pero registrar el fallo
                console.log("No se pudo obtener el ID del usuario desde el almacenamiento.");
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (addr) => {
        if (onSelectAddress) {
            onSelectAddress(addr.direccion);
        }
        onClose();
    };

    const handleSave = async () => {
        Keyboard.dismiss();

        // 1. Validaciones Previas
        if (!userId) {
            Alert.alert("Error de Sesión", "No se ha identificado al usuario. Por favor, vuelve a iniciar sesión.");
            return;
        }

        if (!newAddress.trim()) {
            Alert.alert("Campo Requerido", "La dirección no puede estar vacía.");
            return;
        }

        setLoading(true);

        try {
            // 2. Llamada al Servicio
            const result = await createAddress({
                usuario_id: userId,
                direccion: newAddress,
                etiqueta: newLabel.trim() || 'Casa',
                principal: isPrincipal
            });

            console.log("Resultado creación dirección:", result);

            // 3. Verificar respuesta exitosa (Backend devuelve { message, direccion })
            if (result && result.direccion) {
                Alert.alert("Éxito", "Dirección guardada correctamente.");

                // Limpiar formulario
                setNewAddress('');
                setNewLabel('');
                setIsPrincipal(false);
                setShowForm(false);

                // Recargar lista
                await loadData();
            } else {
                // 4. Mostrar error REAL del backend
                const serverMsg = result?.error || "No se pudo guardar la dirección. Intenta de nuevo.";
                Alert.alert("Error al Guardar", serverMsg);
            }
        } catch (error) {
            console.error("Error handleSave:", error);
            Alert.alert("Error", "Ocurrió un problema de conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Alert.alert(
            "Eliminar",
            "¿Estás seguro de eliminar esta dirección?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        setLoading(true);
                        const success = await deleteAddress(id);
                        if (success) {
                            await loadData();
                        } else {
                            Alert.alert("Error", "No se pudo eliminar la dirección.");
                        }
                        setLoading(false);
                    }
                }
            ]
        );
    };

    const handleSetPrincipal = async (item) => {
        if (item.principal) return;

        setLoading(true);
        const success = await setPrincipalAddress(item.id, userId);
        if (success) {
            await loadData();
        } else {
            Alert.alert("Error", "No se pudo actualizar la dirección principal.");
        }
        setLoading(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, item.principal && styles.cardPrincipal]}
            onPress={() => handleSelect(item)}
        >
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.label}>{item.etiqueta || 'Dirección'}</Text>
                    {item.principal && (
                        <View style={styles.principalBadge}>
                            <Text style={styles.principalText}>Principal</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.addressText}>{item.direccion}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleSetPrincipal(item)} style={styles.actionBtn}>
                    <Ionicons
                        name={item.principal ? "star" : "star-outline"}
                        size={22}
                        color={item.principal ? "#FFD700" : "#666"}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
                    <Ionicons name="trash-outline" size={22} color="#FF6B35" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Mis Direcciones</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {loading && <ActivityIndicator size="small" color="#FF6B35" style={{ marginVertical: 10 }} />}

                    {showForm ? (
                        <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
                            <Text style={styles.subTitle}>Nueva Dirección</Text>

                            <Text style={styles.inputLabel}>Etiqueta (Ej: Casa, Trabajo)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Casa"
                                value={newLabel}
                                onChangeText={setNewLabel}
                            />

                            <Text style={styles.inputLabel}>Dirección Completa</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Av. Principal 123..."
                                value={newAddress}
                                onChangeText={setNewAddress}
                                multiline
                            />

                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                activeOpacity={0.8}
                                onPress={() => setIsPrincipal(!isPrincipal)}
                            >
                                <View style={[styles.checkbox, isPrincipal && styles.checkboxChecked]}>
                                    {isPrincipal && <Ionicons name="checkmark" size={16} color="#fff" />}
                                </View>
                                <Text style={styles.checkboxLabel}>Marcar como predeterminada</Text>
                            </TouchableOpacity>

                            <View style={styles.formActions}>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnCancel]}
                                    onPress={() => setShowForm(false)}
                                >
                                    <Text style={styles.btnTextCancel}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.btn, styles.btnSave]}
                                    onPress={handleSave}
                                >
                                    <Text style={styles.btnTextSave}>Guardar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    ) : (
                        <>
                            <FlatList
                                data={addresses}
                                keyExtractor={item => item.id.toString()}
                                renderItem={renderItem}
                                ListEmptyComponent={
                                    !loading && <Text style={styles.emptyText}>No tienes direcciones guardadas.</Text>
                                }
                                contentContainerStyle={{ paddingBottom: 20 }}
                            />
                            <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(true)}>
                                <Text style={styles.addButtonText}>+ AGREGAR NUEVA DIRECCIÓN</Text>
                            </TouchableOpacity>
                        </>
                    )}

                </View>
            </View>
        </Modal>
    );
}

// (Mantén tus estilos tal como están, son correctos)
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '85%', // Un poco más alto para teclados
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1d2e',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    cardPrincipal: {
        borderColor: '#FFD700',
        backgroundColor: '#FFFCF0',
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
        marginRight: 8,
    },
    principalBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    principalText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    addressText: {
        fontSize: 13,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        padding: 8,
        marginLeft: 5,
    },
    addButton: {
        backgroundColor: '#1a1d2e',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 20,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    inputLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 5
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#1a1d2e',
        borderRadius: 6,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#1a1d2e',
    },
    checkboxLabel: {
        fontSize: 14,
        color: '#333',
    },
    formActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    btn: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    btnCancel: {
        backgroundColor: '#eee',
    },
    btnSave: {
        backgroundColor: '#FF6B35',
    },
    btnTextCancel: {
        color: '#333',
        fontWeight: 'bold',
    },
    btnTextSave: {
        color: '#fff',
        fontWeight: 'bold',
    },
});