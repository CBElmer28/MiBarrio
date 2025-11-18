import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function FoodForm({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [tipo, setTipo] = useState('Recoger');
  const [ingredientes, setIngredientes] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);

  const seleccionarImagen = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!res.canceled) {
      setImagen(res.assets[0].uri);
    }
  };

  const guardarCambios = () => {
    // Aquí podrías enviar los datos al backend en el futuro
    console.log({ nombre, precio, tipo, ingredientes, descripcion, imagen });
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Agregar nuevo artículo</Text>

      <Text style={styles.label}>Nombre del platillo</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Tallarines verdes"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Precio (S/)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 15.00"
        keyboardType="numeric"
        value={precio}
        onChangeText={setPrecio}
      />

      <Text style={styles.label}>Tipo de entrega</Text>
      <View style={styles.tipoRow}>
        <TouchableOpacity
          style={[
            styles.tipoButton,
            tipo === 'Recoger' && styles.tipoActivo,
          ]}
          onPress={() => setTipo('Recoger')}
        >
          <Text style={tipo === 'Recoger' ? styles.tipoTextActivo : styles.tipoText}>Recoger</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tipoButton,
            tipo === 'Delivery' && styles.tipoActivo,
          ]}
          onPress={() => setTipo('Delivery')}
        >
          <Text style={tipo === 'Delivery' ? styles.tipoTextActivo : styles.tipoText}>Delivery</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Imagen</Text>
      <TouchableOpacity style={styles.imageUpload} onPress={seleccionarImagen}>
        {imagen ? (
          <Image source={{ uri: imagen }} style={styles.imagePreview} />
        ) : (
          <Text style={{ color: '#777' }}>Seleccionar desde galería</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Ingredientes</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Ej. Papa, huevo, cebolla..."
        value={ingredientes}
        onChangeText={setIngredientes}
        multiline
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Ej. Plato típico peruano delicioso..."
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={guardarCambios}>
        <Text style={styles.saveButtonText}>GUARDAR CAMBIOS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  tipoRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  tipoButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  tipoActivo: {
    backgroundColor: '#FF8A00',
  },
  tipoText: { color: '#333' },
  tipoTextActivo: { color: '#fff', fontWeight: 'bold' },
  imageUpload: {
    marginTop: 10,
    height: 150,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#FF8A00',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
