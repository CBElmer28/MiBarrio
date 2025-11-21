// src/services/foodService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; 

// Obtener headers con Token
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Obtener el ID del Restaurante del usuario logueado
// (Esto asume que guardaste el usuario al hacer login. Si no, usaremos 4 por defecto para Ana)
const getRestauranteId = async () => {
  try {
    const userJson = await AsyncStorage.getItem('usuario'); // Ajusta la clave si usas otra
    const user = userJson ? JSON.parse(userJson) : null;
    return user?.restaurante_id || 4; // <--- 4 ES EL ID DE ANA (Temporal)
  } catch (e) {
    return 4;
  }
};

/* === API CALLS === */

// 1. Listar mis platillos
export const getMisPlatillos = async () => {
  try {
    const id = await getRestauranteId();
    const response = await fetch(`${API_URL}/platillos/restaurante/${id}`);
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error listando platillos:", error);
    return [];
  }
};

// 2. Crear Platillo
export const crearPlatillo = async (datos) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/platillos`, {
      method: 'POST',
      headers,
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error) {
    console.error("Error creando:", error);
    return { error: error.message };
  }
};

// 3. Actualizar Platillo
export const actualizarPlatillo = async (id, datos) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/platillos/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error) {
    console.error("Error editando:", error);
    return { error: error.message };
  }
};

// 4. Eliminar Platillo
export const eliminarPlatillo = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/platillos/${id}`, {
      method: 'DELETE',
      headers
    });
    return await response.json();
  } catch (error) {
    console.error("Error eliminando:", error);
    return { error: error.message };
  }
};