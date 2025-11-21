import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockReviews = [
  {
    id: "1",
    usuario: "Juan Pérez",
    fecha: "20/12/2024",
    rating: 5,
    comentario: "Excelente comida y servicio. Muy rápido y delicioso.",
    fotos: [
      "https://picsum.photos/200/200?random=1",
      "https://picsum.photos/200/200?random=2",
    ],
  },
  {
    id: "2",
    usuario: "María Lopez",
    fecha: "20/12/2024",
    rating: 4,
    comentario: "Muy rico, pero un poco salado. Igual lo recomiendo.",
    fotos: ["https://picsum.photos/200/200?random=3"],
  },
];

export default function ReviewsScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reseñas</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {mockReviews.map((item) => (
          <View key={item.id} style={styles.reviewCard}>
            {/* AVATAR */}
            <View style={styles.avatar} />

            {/* CONTENIDO */}
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{item.usuario}</Text>
                <Text style={styles.date}>{item.fecha}</Text>
              </View>

              {/* ESTRELLAS */}
              <View style={styles.starsRow}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={16}
                    color={i < item.rating ? "#FF8A00" : "#DDD"}
                  />
                ))}
              </View>

              {/* TEXTO */}
              <Text style={styles.comment}>{item.comentario}</Text>

              {/* FOTOS */}
              <View style={styles.photoRow}>
                {item.fotos.map((uri, i) => (
                  <TouchableOpacity key={i} onPress={() => setSelectedImage(uri)}>
                    <Image source={{ uri }} style={styles.photoItem} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* MODAL PROFESIONAL */}
      <Modal visible={!!selectedImage} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
            {/* Zona clickeable para cerrar */}
            <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
            <View style={styles.backdropTouchable} />
            </TouchableWithoutFeedback>

            {/* Vista de la imagen */}
            <View style={styles.modalCenter}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            </View>

            {/* Zona clickeable inferior para cerrar */}
            <TouchableWithoutFeedback onPress={() => setSelectedImage(null)}>
            <View style={styles.backdropTouchable} />
            </TouchableWithoutFeedback>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", paddingTop: 40 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 20,
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#222" },

  reviewCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    gap: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5E5E5",
  },

  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  userName: { fontWeight: "700", fontSize: 15, color: "#333" },
  date: { fontSize: 12, color: "#999" },

  starsRow: { flexDirection: "row", marginVertical: 6 },

  comment: {
    fontSize: 13,
    color: "#555",
    marginBottom: 10,
    lineHeight: 18,
  },

  photoRow: { flexDirection: "row", gap: 10 },
  photoItem: {
    width: 75,
    height: 75,
    borderRadius: 12,
    backgroundColor: "#EEE",
  },

  /* MODAL */
  modalBackdrop: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.8)",
  justifyContent: "center",
  alignItems: "center",
},

backdropTouchable: {
  flex: 1,
  width: "100%",
},

modalCenter: {
  width: "100%",
  height: "70%",
  justifyContent: "center",
  alignItems: "center",
},

fullImage: {
  width: "90%",
  height: "100%",
  resizeMode: "contain",
  borderRadius: 12,
},
});
