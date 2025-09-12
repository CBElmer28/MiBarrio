import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BackArrow from '../components/ui/backarrow';

export default function Favorites({navigation}) {
      const handleClose = () => {
    navigation.closeDrawer(); 
  };

  return (
    <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
  <BackArrow color="#FF6600" size={28} style={{ marginLeft: 10 }} />
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>Favoritos</Text>
</View>

  <View style={styles.Header}></View>

      <Text style={styles.text}>Aquí aparecerán tus comidas y resturantes favoritos </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});
