import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function CocineroProfile({ navigation }) {

  // MOCK DATA - más adelante lo enlazaremos al backend
  const chef = {
    nombre: "Cocinero Soma",
    descripcion: "Me encanta la comida rápida.",
    avatar: null, 
    rating: 4.9,
    pedidos: 128,
    saldo: 500,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* HEADER / PERFIL */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          {chef.avatar ? (
            <Image source={{ uri: chef.avatar }} style={styles.avatarImg} />
          ) : (
            <Ionicons name="person-circle-outline" size={95} color="#CCC" />
          )}
        </View>

        <Text style={styles.name}>{chef.nombre}</Text>
        <Text style={styles.description}>{chef.descripcion}</Text>

        {/* MÉTRICAS */}
        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Ionicons name="star" size={22} color="#FF8A00" />
            <Text style={styles.metricLabel}>{chef.rating} ⭐</Text>
          </View>

          <View style={styles.metricItem}>
            <FontAwesome5 name="receipt" size={20} color="#333" />
            <Text style={styles.metricLabel}>{chef.pedidos} pedidos</Text>
          </View>

          <View style={styles.metricItem}>
            <MaterialIcons name="account-balance-wallet" size={22} color="#28A745" />
            <Text style={styles.metricLabel}>S/ {chef.saldo}</Text>
          </View>
        </View>
      </View>

      {/* OPCIONES */}
      <View style={styles.section}>

        <MenuItem
          title="Información personal"
          icon="person-outline"
          onPress={() => console.log("pendiente")}
        />

        <MenuItem
          title="Historial de retiros"
          icon="wallet-outline"
          onPress={() => navigation.navigate("CocineroWithdrawHistory")}
        />

        <MenuItem
          title="Realizar retiro"
          icon="cash-outline"
          onPress={() => navigation.navigate("CocineroWithdraw")}
        />

        <MenuItem
          title="Número de pedidos"
          icon="receipt-outline"
          onPress={() => console.log("pendiente")}
        />

        <MenuItem
          title="Reseñas de los usuarios"
          icon="star-outline"
          onPress={() => navigation.navigate("CocineroReviews")}
        />

        <MenuItem
          title="Configuración"
          icon="settings-outline"
          onPress={() => navigation.navigate("CocineroSettings")}
        />

        <MenuItem
          title="Editar Perfil"
          icon="create-outline"
          onPress={() => navigation.navigate("CocineroEditProfile")}
        />

        <MenuItem
          title="Cerrar sesión"
          icon="log-out-outline"
          type="danger"
          onPress={() => navigation.navigate("AuthLoading")}
        />

      </View>
    </ScrollView>
  );
}


/* COMPONENTE REUSABLE */
function MenuItem({ title, icon, type, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons
          name={icon}
          size={22}
          color={type === "danger" ? "#D9534F" : "#333"}
        />
        <Text style={[styles.menuLabel, type === "danger" && { color: "#D9534F" }]}>
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  headerCard: {
    backgroundColor: "#FFF",
    margin: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
  },

  avatar: {
    marginBottom: 10,
  },
  avatarImg: {
    width: 95,
    height: 95,
    borderRadius: 80,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
  },

  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    marginBottom: 12,
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },

  metricItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },

  metricLabel: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  section: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    elevation: 3,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  menuLabel: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
});
