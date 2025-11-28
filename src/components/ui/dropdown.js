import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView, 
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedDropdown({ data, selected, onSelect, color = '#333' }) {
  const animation = useRef(new Animated.Value(0)).current;
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: toggle ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // Necesario para animar propiedades de layout como maxHeight
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

  // Animamos maxHeight en lugar de height fijo
  // Esto permite que se ajuste al contenido si es poco, y scrollee si es mucho
  const dropdownMaxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300], // Aumentamos el límite visual a 300px
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
      <Animated.View 
        style={[
          styles.dropdownContainer, 
          { maxHeight: dropdownMaxHeight, opacity: animation }
        ]}
      >
        <ScrollView
            nestedScrollEnabled={true} // Clave para que funcione dentro de otras vistas
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingVertical: 5 }}
            style={{ flexGrow: 0 }} // Permite que el ScrollView respete el maxHeight
        >
            {data.map((item, index) => (
                <TouchableOpacity
                    key={item.value || index}
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
            ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    position: 'relative',
    width: 160, 
    zIndex: 2000, 
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
    top: 45, 
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 15,
    overflow: 'hidden', 
    elevation: 8, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 3000,
    borderColor: '#F0F0F0',
    borderWidth: 1,
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