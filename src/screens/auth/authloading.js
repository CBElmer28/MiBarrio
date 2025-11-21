import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLoading({ navigation }) {
    useEffect(() => {
        const checkSession = async () => {
            const token = await AsyncStorage.getItem('token');
            const timestamp = await AsyncStorage.getItem('token_timestamp');

            const now = Date.now();
            const savedTime = parseInt(timestamp);
            const tenMinutes = 10 * 60 * 1000;

            if (now - savedTime < tenMinutes) {
                navigation.replace('Main');
            } else {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('usuario');
                await AsyncStorage.removeItem('token_timestamp');
                navigation.replace('Login');
            }
        };

        checkSession();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
