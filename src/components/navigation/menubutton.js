import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

export default function MenuButton({ color = '#333', size = 28, style }) {
  const navigation = useNavigation();

  const handlePress = () => {
  navigation.navigate('Menu');
};

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, style]}>
      <MaterialIcons name="menu" size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 6,
    borderRadius: 20,
  },
});
