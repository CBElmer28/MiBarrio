import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// MOCK DEL SALDO DEL COCINERO (luego vendrá del backend)
const SALDO_DISPONIBLE = 500;

export default function WithdrawScreen({ navigation }) {

  const [monto, setMonto] = useState("");
  const [metodo, setMetodo] = useState("");

  // Valida y procesa el retiro
  const realizarRetiro = () => {
    const montoNum = Number(monto);

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      Alert.alert("Monto inválido", "Ingresa un monto válido.");
      return;
    }

    if (!metodo) {
      Alert.alert("Método requerido", "Selecciona un método de retiro.");
      return;
    }

    if (montoNum > SALDO_DISPONIBLE) {
      Alert.alert("Saldo insuficiente", "No puedes retirar más de tu saldo.");
      return;
    }

    // Más adelante aquí irá el POST al backend

    navigation.navigate("CocineroWithdrawSuccess");
  };

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Realizar retiro</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* SALDO */}
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Saldo disponible</Text>
        <Text style={styles.balanceAmount}>S/ {SALDO_DISPONIBLE}</Text>
      </View>

      {/* FORMULARIO */}
      <View style={styles.formBox}>

        {/* MONTO */}
        <Text style={styles.inputLabel}>Monto a retirar</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 100"
          keyboardType="numeric"
          value={monto}
          onChangeText={setMonto}
        />

        {/* MÉTODO */}
        <Text style={styles.inputLabel}>Método de cobro</Text>

        <TouchableOpacity
          style={[styles.metodoBtn, metodo === "Yape" && styles.metodoSelected]}
          onPress={() => setMetodo("Yape")}
        >
          <Text style={styles.metodoText}>Yape</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.metodoBtn,
            metodo === "Cuenta Bancaria" && styles.metodoSelected,
          ]}
          onPress={() => setMetodo("Cuenta Bancaria")}
        >
          <Text style={styles.metodoText}>Cuenta Bancaria</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.metodoBtn,
            metodo === "Efectivo" && styles.metodoSelected,
          ]}
          onPress={() => setMetodo("Efectivo")}
        >
          <Text style={styles.metodoText}>Efectivo</Text>
        </TouchableOpacity>
      </View>

      {/* BOTÓN */}
      <TouchableOpacity style={styles.submitBtn} onPress={realizarRetiro}>
        <Text style={styles.submitText}>Retirar ahora</Text>
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

  balanceBox: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 18,
  },

  balanceLabel: {
    fontSize: 14,
    color: "#666",
  },

  balanceAmount: {
    fontSize: 26,
    fontWeight: "800",
    color: "#28A745",
    marginTop: 6,
  },

  formBox: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
  },

  inputLabel: {
    marginBottom: 6,
    color: "#444",
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#F2F2F2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    fontSize: 15,
  },

  metodoBtn: {
    backgroundColor: "#EFEFEF",
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  metodoSelected: {
    backgroundColor: "#FF8A00",
  },

  metodoText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
  },

  submitBtn: {
    backgroundColor: "#FF8A00",
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
