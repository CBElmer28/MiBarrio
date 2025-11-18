// src/screens/cocinero/settings.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ConfigScreen({ navigation }) {

  // Estados locales (luego se pueden guardar en AsyncStorage o backend)
  const [darkMode, setDarkMode] = useState(false);
  const [notifPedidos, setNotifPedidos] = useState(true);
  const [notifResenas, setNotifResenas] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* TARJETA DE AJUSTES */}
      <View style={styles.card}>

        {/* MODO OSCURO */}
        <View style={styles.settingRow}>
          <View style={styles.iconLabelRow}>
            <Ionicons name="moon-outline" size={22} color="#333" />
            <Text style={styles.label}>Modo oscuro</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ true: "#FF8A00" }}
          />
        </View>

        {/* NOTIFICACIONES */}
        <View style={styles.sectionTitleBox}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.iconLabelRow}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
            <Text style={styles.label}>Pedidos nuevos</Text>
          </View>
          <Switch
            value={notifPedidos}
            onValueChange={setNotifPedidos}
            trackColor={{ true: "#FF8A00" }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.iconLabelRow}>
            <Ionicons name="star-outline" size={22} color="#333" />
            <Text style={styles.label}>Nuevas reseñas</Text>
          </View>
          <Switch
            value={notifResenas}
            onValueChange={setNotifResenas}
            trackColor={{ true: "#FF8A00" }}
          />
        </View>

        {/* CAMBIO DE CONTRASEÑA - Dummy (solo navegación futura) */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => console.log("Cambiar contraseña (futuro)")}
        >
          <View style={styles.iconLabelRow}>
            <Ionicons name="lock-closed-outline" size={22} color="#333" />
            <Text style={styles.label}>Cambiar contraseña</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

      </View>
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
    marginBottom: 18,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 10,
    elevation: 3,
  },

  sectionTitleBox: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  sectionTitle: {
    color: "#FF8A00",
    fontWeight: "700",
    fontSize: 14,
  },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#EEE",
  },

  iconLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
});
