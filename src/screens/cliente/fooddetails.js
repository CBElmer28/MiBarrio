import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { CartContext } from '../../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

// Asegúrate de tener este servicio creado (lo generamos en el paso anterior)
// Si aún no lo tienes, comenta estas líneas y la lógica de 'isFav'
import { toggleFavorito, checkEsFavorito } from '../../services/favoritoService';

const { height } = Dimensions.get('window');

export default function FoodDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { food } = route.params;
  const { addToCart } = useContext(CartContext);
  
  const [qty, setQty] = useState(1);
  const [isFav, setIsFav] = useState(false);

  // 1. Verificar si es favorito al cargar
  useEffect(() => {
    const check = async () => {
      try {
        // Si no has creado el servicio aún, comenta esto para evitar errores
        const estado = await checkEsFavorito(food.id);
        setIsFav(estado);
      } catch (e) {
        console.log("Error verificando favorito:", e);
      }
    };
    check();
  }, [food.id]);

  // 2. Manejar el click en favorito
  const handleToggleFav = async () => {
    const nuevoEstado = !isFav;
    setIsFav(nuevoEstado); // Actualización optimista inmediata
    await toggleFavorito(food.id);
  };

  // 3. Agregar al carrito con el ID CORRECTO de restaurante
  const onAdd = () => {
    addToCart({
      id: food.id,
      name: food.nombre,
      price: parseFloat(food.precio),
      image: { uri: food.imagen },
      // CORRECCIÓN IMPORTANTE: Enviamos el ID real del restaurante
      restaurante_id: food.restaurante_id || food.restaurante?.id,
      restaurant: food.restaurante?.nombre || null,
    }, qty);
    navigation.navigate('CartScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* --- IMAGEN HERO --- */}
      <Image source={{ uri: food.imagen }} style={styles.heroImage} />
      
      {/* Capa oscura sutil arriba para que se vean los botones */}
      <View style={styles.overlayHeader} />

      {/* Botón Atrás */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Botón Favorito */}
      <TouchableOpacity onPress={handleToggleFav} style={styles.favButton}>
        <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "#FF3B30" : "#000"} />
      </TouchableOpacity>

      {/* --- CONTENIDO (SHEET) --- */}
      <View style={styles.sheetContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {/* Header: Título y Precio */}
            <View style={styles.header}>
                <View style={{flex: 1, marginRight: 10}}>
                    <Text style={styles.title}>{food.nombre}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>
                            {food.rating ? Number(food.rating).toFixed(1) : '4.5'} (50+ reviews)
                        </Text>
                    </View>
                </View>
                <Text style={styles.price}>S/ {parseFloat(food.precio).toFixed(2)}</Text>
            </View>

            {/* Descripción Única */}
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>
                {food.descripcion || "Disfruta de este delicioso platillo preparado con los ingredientes más frescos de la casa. Una experiencia culinaria única lista para ti."}
            </Text>

            {/* Espacio final */}
            <View style={{height: 80}} />
        </ScrollView>

        {/* --- BARRA INFERIOR --- */}
        <View style={styles.bottomBar}>
            {/* Contador */}
            <View style={styles.counter}>
                <TouchableOpacity onPress={() => setQty(q => Math.max(1, q - 1))} style={styles.counterBtn}>
                    <Ionicons name="remove" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.counterVal}>{qty}</Text>
                <TouchableOpacity onPress={() => setQty(q => q + 1)} style={styles.counterBtn}>
                    <Ionicons name="add" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Botón Agregar */}
            <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
                <Text style={styles.addBtnText}>Agregar • S/ {(food.precio * qty).toFixed(2)}</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  
  // Hero Image
  heroImage: {
    width: '100%',
    height: height * 0.45, 
    opacity: 0.9,
    resizeMode: 'cover',
  },
  overlayHeader: {
    position: 'absolute', top: 0, width: '100%', height: 100,
    backgroundColor: 'rgba(0,0,0,0.1)'
  },

  // Botones Flotantes Superiores
  backButton: {
    position: 'absolute', top: 50, left: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 8, borderRadius: 12, zIndex: 10,
  },
  favButton: {
    position: 'absolute', top: 50, right: 20,
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 8, borderRadius: 12, zIndex: 10,
  },

  // Contenedor Blanco Curvo
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: -40, 
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    overflow: 'hidden',
  },
  scrollContent: {
    padding: 25,
  },

  // Textos
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    fontSize: 24, fontWeight: '800', color: '#1a1d2e',
    lineHeight: 30,
  },
  price: {
    fontSize: 22, fontWeight: 'bold', color: '#FF6600',
  },
  ratingRow: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8,
  },
  ratingText: {
    marginLeft: 5, color: '#888', fontWeight: '600', fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 8,
  },
  description: {
    fontSize: 15, color: '#666', lineHeight: 24,
  },
  
  // Barra Inferior
  bottomBar: {
    position: 'absolute', bottom: 0, width: '100%',
    backgroundColor: '#FFF',
    paddingHorizontal: 20, paddingVertical: 20,
    paddingBottom: 30, // Para iPhone X+
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#F5F5F5',
    elevation: 10, shadowColor: "#000", shadowOffset: {width:0, height:-2}, shadowOpacity: 0.05,
  },
  counter: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F5F6FA', borderRadius: 15,
    padding: 5, marginRight: 15,
  },
  counterBtn: {
    width: 36, height: 36,
    backgroundColor: '#FFF', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.05,
  },
  counterVal: {
    fontSize: 16, fontWeight: 'bold', marginHorizontal: 15, color: '#333',
  },
  addBtn: {
    flex: 1,
    backgroundColor: '#1a1d2e', // Color oscuro elegante para el botón de acción
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    elevation: 5, shadowColor: '#1a1d2e', shadowOpacity: 0.3, shadowOffset: {width:0, height:4}
  },
  addBtnText: {
    color: '#FFF', fontWeight: 'bold', fontSize: 16,
  },
});