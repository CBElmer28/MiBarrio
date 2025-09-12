import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  FlatList,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

export default function AnimatedDropdown({ data, selected, onSelect, color = '#2F7EBF' }) {
  const animation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [toggle, setToggle] = useState(false);
  const [toggleLong, setToggleLong] = useState(false);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: toggleLong ? 1 : 0,
      friction: 5,
      useNativeDriver: false,
    }).start();
  }, [toggleLong]);

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
          outputRange: ['0deg', '90deg'],
        }),
      },
    ],
  };

  const listStyle = {
    opacity: animation,
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-10, 0],
        }),
      },
    ],
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        onSelect(item.value);
        setToggle(false);
      }}
    >
      <Text style={[styles.itemText, selected === item.value && styles.selectedText]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.dropdownWrapper}>
      <TouchableOpacity
        style={[styles.button, { borderColor: color }]}
        onPress={() => {
          setToggle(!toggle);
          Animated.timing(animation, {
            toValue: toggle ? 0 : 1,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }}
      >
        <Text style={[styles.buttonText, { color }]}>{selected || 'Seleccionar categoría'}</Text>
        <Animated.View style={[styles.arrow, arrowStyle]}>
          <Material name="chevron-right" size={20} color={color} />
        </Animated.View>
      </TouchableOpacity>

      {toggle && (
        <Animated.View style={[styles.dropdownList, { borderColor: color }, listStyle]}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelect(item.value);
                  setToggle(false);
                }}
              >
                <Text
                  style={[
                    styles.itemText,
                    selected === item.value && { color, fontWeight: 'bold' },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownWrapper: {
    position: 'relative', // referencia para el menú flotante
    width: 180,
    zIndex: 100,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2F7EBF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  buttonText: {
    flex: 1,
    fontSize: 14,
    color: '#2F7EBF',
    fontWeight: '500',
  },
  arrow: {
    marginLeft: 8,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%', // justo debajo del botón
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#2F7EBF',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 200,
    elevation: 5, // sombra en Android
  },
  item: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#2F7EBF',
    fontWeight: 'bold',
  },
});