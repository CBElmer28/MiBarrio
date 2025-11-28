import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const toggleFavorito = async (platillo_id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/favoritos/toggle`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ platillo_id })
    });
    return await response.json();
  } catch (error) {
    console.error("Error toggle favorito:", error);
    return null;
  }
};

export const getMisFavoritos = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/favoritos`, {
      method: 'GET',
      headers
    });
    if (response.ok) return await response.json();
    return [];
  } catch (error) {
    console.error("Error get favoritos:", error);
    return [];
  }
};

export const checkEsFavorito = async (platillo_id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/favoritos/check/${platillo_id}`, {
        method: 'GET', headers
    });
    if(response.ok) {
        const data = await response.json();
        return data.esFavorito;
    }
    return false;
  } catch (error) {
      return false;
  }
};