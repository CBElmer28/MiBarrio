// src/screens/cocinero/editprofile.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function EditProfileScreen({ navigation }) {
  // Datos MOCK — luego se reemplazarán con backend
  const [nombre, setNombre] = useState("Cocinero Soma");
  const [descripcion, setDescripcion] = useState("Me encanta la comida rápida.");
  const [avatar, setAvatar] = useState(null);

  // Seleccionar imagen desde la galería
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      aspect: [1, 1], // cuadrada
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Guardar cambios (mock)
  const guardarCambios = () => {
    if (!nombre.trim()) {
      Alert.alert("Nombre requerido", "El nombre no puede estar vacío.");
      return;
    }

    // En el futuro aquí irá el POST al backend

    Alert.alert("Guardado", "Tus cambios se han guardado correctamente.");
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* AVATAR */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatarImg} />
        ) : (
          <Ionicons name="person-circle-outline" size={120} color="#CCC" />
        )}

        <TouchableOpacity style={styles.avatarBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color="#FFF" />
          <Text style={styles.avatarBtnText}>Cambiar foto</Text>
        </TouchableOpacity>
      </View>

      {/* FORMULARIO */}
      <View style={styles.formCard}>

        {/* Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ingresa tu nombre"
        />

        {/* Descripción */}
        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: "top" }]}
          value={descripcion}
          onChangeText={setDescripcion}
          multiline
          placeholder="Sobre ti..."
        />
      </View>

      {/* BOTÓN GUARDAR */}
      <TouchableOpacity style={styles.saveBtn} onPress={guardarCambios}>
        <Text style={styles.saveBtnText}>Guardar cambios</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* ---- ESTILOS ---- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingTop: 40,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatarImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },

  avatarBtn: {
    flexDirection: "row",
    backgroundColor: "#FF8A00",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
    gap: 6,
  },

  avatarBtnText: {
    color: "#FFF",
    fontWeight: "700",
  },

  formCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  label: {
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F1F1F1",
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
    marginBottom: 16,
  },

  saveBtn: {
    backgroundColor: "#FF8A00",
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  saveBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
