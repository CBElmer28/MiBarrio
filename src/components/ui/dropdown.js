import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ScrollView // Usaremos ScrollView o FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedDropdown({ data, selected, onSelect, color = '#333' }) {
  const animation = useRef(new Animated.Value(0)).current;
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: toggle ? 1 : 0,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  }, [toggle]);

  const arrowStyle = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  // Interpolamos la altura explícita
  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 250], // Aumentamos la altura máxima para ver más items
  });

  return (
    <View style={styles.dropdownWrapper}>
      {/* Botón Principal */}
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={() => setToggle(!toggle)}
      >
        <Text style={[styles.buttonText, { color }]} numberOfLines={1}>
          {selected || 'Categoría'}
        </Text>
        <Animated.View style={arrowStyle}>
          <Ionicons name="chevron-down" size={18} color={color} />
        </Animated.View>
      </TouchableOpacity>

      {/* Lista Desplegable */}
      {/* Usamos style para la animación de altura */}
      <Animated.View style={[styles.dropdownContainer, { height: dropdownHeight, opacity: animation }]}>
        <View style={styles.innerContainer}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.value.toString()}
                nestedScrollEnabled={true} // Clave para que funcione dentro de otros scrolls
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ paddingVertical: 5 }}
                renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        onSelect(item.value);
                        setToggle(false);
                    }}
                >
                    <Text style={[
                        styles.itemText,
                        selected === item.value && styles.selectedText,
                    ]}>
                        {item.label}
                    </Text>
                    {selected === item.value && (
                        <Ionicons name="checkmark" size={16} color="#FF6600" />
                    )}
                </TouchableOpacity>
                )}
            />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    position: 'relative',
    width: 160, 
    zIndex: 2000, // Z-index muy alto para flotar sobre todo
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F6FA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
    flex: 1,
  },
  dropdownContainer: {
    position: 'absolute',
    top: 45, // Justo debajo del botón
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden', // Importante para la animación de altura
    elevation: 8, // Sombra más fuerte para que se note que flota
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 3000,
  },
  innerContainer: {
      flex: 1, // Asegura que la lista ocupe el espacio animado
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  itemText: {
    fontSize: 14,
    color: '#555',
  },
  selectedText: {
    color: '#FF6600',
    fontWeight: 'bold',
  },
});