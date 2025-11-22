import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const QUESTIONS = [
  { id: 1, q: "¿Cómo rastreo mi pedido?", a: "Puedes ir a la sección 'Mis Pedidos' en tu perfil y seleccionar el pedido en curso para ver el mapa en tiempo real." },
  { id: 2, q: "¿Qué métodos de pago aceptan?", a: "Aceptamos tarjetas Visa, Mastercard, Yape, Plin y pago en efectivo contra entrega." },
  { id: 3, q: "¿Puedo cancelar mi orden?", a: "Sí, siempre y cuando el restaurante no haya comenzado a preparar tu comida. Ve al detalle de la orden para ver la opción." },
  { id: 4, q: "¿Cómo agrego una nueva dirección?", a: "En tu perfil, selecciona 'Mis Direcciones' y pulsa el botón '+' para agregar una nueva ubicación." },
];

const AccordionItem = ({ item, expanded, onPress }) => (
  <View style={styles.itemContainer}>
    <TouchableOpacity style={styles.questionRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.questionText}>{item.q}</Text>
      <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#FF6B35" />
    </TouchableOpacity>
    {expanded && (
      <View style={styles.answerContainer}>
        <Text style={styles.answerText}>{item.a}</Text>
      </View>
    )}
  </View>
);

export default function FAQs() {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Ayuda y FAQs</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>Preguntas Frecuentes</Text>
        {QUESTIONS.map(q => (
          <AccordionItem 
            key={q.id} 
            item={q} 
            expanded={expandedId === q.id} 
            onPress={() => toggleExpand(q.id)} 
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1d2e' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { padding: 8, backgroundColor: '#2a2d3e', borderRadius: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, backgroundColor: '#f8f9fa', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  itemContainer: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 10, padding: 15, elevation: 2 },
  questionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  questionText: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1, marginRight: 10 },
  answerContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  answerText: { fontSize: 14, color: '#666', lineHeight: 20 },
});