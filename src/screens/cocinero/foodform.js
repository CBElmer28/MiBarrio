import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { crearPlatillo, actualizarPlatillo } from '../../services/foodService';

export default function FoodForm({ route, navigation }) {
  const { food } = route.params || {};
  const esEdicion = !!food;

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(''); // Inicializamos como string vacío
  const [categoriaId, setCategoriaId] = useState(5); // Default Pizza
  const [loading, setLoading] = useState(false);

  const categorias = [
    { id: 1, nombre: "Hamburguesa" },
    { id: 2, nombre: "Pollo" },
    { id: 3, nombre: "Café" },
    { id: 4, nombre: "Postres" },
    { id: 5, nombre: "Pizza" },
    { id: 6, nombre: "Parrillas" },
    { id: 7, nombre: "Comida" },
    { id: 8, nombre: "Bebida" }
  ];

  useEffect(() => {
    if (esEdicion) {
      setNombre(food.nombre);
      setPrecio(String(food.precio));
      setDescripcion(food.descripcion || '');
      setImagen(food.imagen || '');
      if (food.categorias && food.categorias.length > 0) {
        setCategoriaId(food.categorias[0].id);
      }
    }
  }, [food]);

  const seleccionarImagen = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, aspect: [4, 3], quality: 1,
    });
    if (!res.canceled) {
      // Al seleccionar de galería, llenamos el campo con la ruta local
      setImagen(res.assets[0].uri);
    }
  };

  const guardarCambios = async () => {
    if (!nombre || !precio) {
      Alert.alert("Faltan datos", "Nombre y precio son obligatorios");
      return;
    }

    setLoading(true);
    
    const datos = {
      nombre,
      precio: parseFloat(precio),
      descripcion,
      imagen, // Enviamos lo que haya en el estado (URL o URI local)
      categoria_id: categoriaId 
    };

    let resultado;
    if (esEdicion) {
      resultado = await actualizarPlatillo(food.id, datos);
    } else {
      resultado = await crearPlatillo(datos);
    }

    setLoading(false);

    if (resultado && !resultado.error) {
      Alert.alert("¡Listo!", esEdicion ? "Platillo actualizado" : "Platillo creado");
      navigation.goBack();
    } else {
      Alert.alert("Error", "No se pudo guardar.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{esEdicion ? "Editar Platillo" : "Nuevo Platillo"}</Text>

      <Text style={styles.label}>Nombre</Text>
      {/* CAMBIO: placeholderTextColor visible */}
      <TextInput 
        style={styles.input} 
        value={nombre} 
        onChangeText={setNombre} 
        placeholder="Ej. Pizza Suprema" 
        placeholderTextColor="#555"
      />

      <Text style={styles.label}>Precio (S/)</Text>
      <TextInput 
        style={styles.input} 
        value={precio} 
        onChangeText={setPrecio} 
        keyboardType="numeric" 
        placeholder="0.00" 
        placeholderTextColor="#555"
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.catContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categorias.map((cat) => (
                <TouchableOpacity 
                    key={cat.id} 
                    style={[styles.catButton, categoriaId === cat.id && styles.catActive]}
                    onPress={() => setCategoriaId(cat.id)}
                >
                    <Text style={[styles.catText, categoriaId === cat.id && styles.catTextActive]}>
                        {cat.nombre}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      {/* SECCIÓN DE IMAGEN ACTUALIZADA */}
      <Text style={styles.label}>Imagen (URL o Galería)</Text>
      
      {/* 1. Campo de texto para pegar URL */}
      <TextInput 
        style={styles.input} 
        value={imagen} 
        onChangeText={setImagen} 
        placeholder="Pega aquí el link de la imagen..." 
        placeholderTextColor="#555"
        autoCapitalize="none"
      />

      {/* 2. Botón para abrir galería (sobreescribe el texto) */}
      <TouchableOpacity style={styles.uploadBtn} onPress={seleccionarImagen}>
        <Text style={styles.uploadText}>📂 Abrir Galería</Text>
      </TouchableOpacity>

      {/* 3. Vista Previa */}
      <View style={styles.previewContainer}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.imagePreview} />
        ) : (
          <View style={styles.placeholderImg}>
             <Text style={{ fontSize: 30 }}>📷</Text>
             {/* CAMBIO: Texto negro */}
             <Text style={{ color: '#000', fontSize: 12 }}>Vista previa</Text>
          </View>
        )}
      </View>

      <Text style={styles.label}>Descripción</Text>
      <TextInput 
        style={styles.textarea} 
        value={descripcion} 
        onChangeText={setDescripcion} 
        multiline 
        placeholder="Detalles del plato..." 
        placeholderTextColor="#555"
      />

      <TouchableOpacity 
        style={[styles.saveButton, loading && {opacity: 0.7}]} 
        onPress={guardarCambios}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>GUARDAR</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        {/* CAMBIO: Texto negro */}
        <Text style={styles.cancelButtonText}>CANCELAR</Text>
      </TouchableOpacity>
      
      <View style={{height: 50}}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  // CAMBIO: Color negro
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#000' },
  // CAMBIO: Color negro
  label: { fontSize: 14, fontWeight: '600', marginTop: 15, color: '#000' },
  // CAMBIO: Color texto negro y fondo blanco
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, marginTop: 6, backgroundColor: '#F9F9F9', color: '#000' },
  
  catContainer: { flexDirection: 'row', marginTop: 10 },
  catButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EEE', marginRight: 8 },
  catActive: { backgroundColor: '#FF8A00' },
  // CAMBIO: Color texto negro
  catText: { color: '#000', fontSize: 13 },
  catTextActive: { color: '#FFF', fontWeight: 'bold' },

  // Estilos nuevos para imagen
  uploadBtn: { backgroundColor: '#EEE', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  // CAMBIO: Color negro
  uploadText: { color: '#000', fontWeight: '600' },
  previewContainer: { marginTop: 10, height: 150, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#EEE' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderImg: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9' },

  // CAMBIO: Color texto negro
  textarea: { borderWidth: 1, borderColor: '#DDD', borderRadius: 10, padding: 12, marginTop: 6, height: 80, textAlignVertical: 'top', backgroundColor: '#F9F9F9', color: '#000' },
  saveButton: { backgroundColor: '#FF8A00', padding: 16, borderRadius: 12, marginTop: 30, alignItems: 'center', elevation: 3 },
  saveButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  
  cancelButton: { marginTop: 15, padding: 15, alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#DDD', backgroundColor: 'transparent' },
  // CAMBIO: Color negro
  cancelButtonText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});