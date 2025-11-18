// src/screens/cocinero/withdrawsuccess.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function WithdrawSuccess({ navigation }) {
  return (
    <View style={styles.container}>

      {/* CHECK ICON */}
      <View style={styles.iconBox}>
        <Ionicons name="checkmark-circle" size={95} color="#FF8A00" />
      </View>

      {/* TEXTOS */}
      <Text style={styles.title}>Retiro exitoso</Text>
      <Text style={styles.desc}>
        Tu retiro se procesó correctamente. Puedes revisarlo en tu historial.
      </Text>

      {/* BOTONES */}
      <View style={styles.btnContainer}>

        {/* Ver historial */}
        <TouchableOpacity
          style={[styles.btn, styles.secondaryBtn]}
          onPress={() => navigation.navigate("CocineroWithdrawHistory")}
        >
          <Text style={styles.secondaryText}>Ver historial</Text>
        </TouchableOpacity>

        {/* Volver al dashboard */}
        <TouchableOpacity
          style={[styles.btn, styles.primaryBtn]}
          onPress={() => navigation.navigate("CocineroDashboard")}
        >
          <Text style={styles.primaryText}>Volver al inicio</Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

/* ---- ESTILOS ---- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  iconBox: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222",
    marginBottom: 10,
  },

  desc: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    maxWidth: 280,
  },

  btnContainer: {
    width: "100%",
    gap: 14,
  },

  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  primaryBtn: {
    backgroundColor: "#FF8A00",
  },

  primaryText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },

  secondaryBtn: {
    backgroundColor: "#F3F3F3",
  },

  secondaryText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 15,
  },
});
