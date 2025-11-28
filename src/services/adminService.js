import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; 

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

/* --- GESTIÓN DE RESTAURANTES --- */

export const getRestaurantes = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/admin/restaurante`, { method: 'GET', headers });
    return response.ok ? await response.json() : [];
  } catch (error) { return []; }
};

export const crearRestaurante = async (datos) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/admin/restaurante`, {
      method: 'POST', 
      headers, 
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error) { return { error: "Error de conexión" }; }
};

export const editarRestaurante = async (id, datos) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/admin/restaurante/${id}`, {
      method: 'PUT', 
      headers, 
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error) { return { error: "Error de conexión" }; }
};

export const eliminarRestaurante = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/admin/restaurante/${id}`, { 
        method: 'DELETE', 
        headers 
    });
    return await response.json();
  } catch (error) { return { error: "Error de conexión" }; }
};

/* --- GESTIÓN DE COCINEROS (AQUÍ ESTABA EL POSIBLE ERROR) --- */

export const getCocineros = async () => {
  try {
    const headers = await getHeaders();
    // Usamos el endpoint 'dashboard' porque ahí devolvemos la lista de cocineros
    const response = await fetch(`${API_URL}/admin/dashboard`, { method: 'GET', headers });
    const data = await response.json();
    return data.cocineros || [];
  } catch (error) { return []; }
};

// 1. CREAR COCINERO
export const crearCocinero = async (datos) => {
  try {
    const headers = await getHeaders();
    console.log("Enviando a crear:", datos); // <--- Chivato para debug
    const response = await fetch(`${API_URL}/admin/cocinero`, {
      method: 'POST', 
      headers, 
      body: JSON.stringify(datos)
    });
    const res = await response.json();
    console.log("Respuesta crear:", res); // <--- Chivato para debug
    return res;
  } catch (error) { 
    console.error(error);
    return { error: "Error de conexión" }; 
  }
};

// 2. EDITAR COCINERO
export const editarCocinero = async (id, datos) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/admin/cocinero/${id}`, {
      method: 'PUT', 
      headers, 
      body: JSON.stringify(datos)
    });
    return await response.json();
  } catch (error) { return { error: "Error de conexión" }; }
};

// 3. ELIMINAR COCINERO
export const eliminarCocinero = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/admin/cocinero/${id}`, { 
        method: 'DELETE', 
        headers 
    });
    return await response.json();
  } catch (error) { return { error: "Error de conexión" }; }
};

// --- CATEGORÍAS (CRUD) ---

export const getCategorias = async () => {
  try {
    const response = await fetch(`${API_URL}/categorias`); // Público
    return await response.json();
  } catch (error) {
    console.error("Error getCategorias:", error);
    return [];
  }
};

export const crearCategoria = async (nombre) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ nombre })
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const editarCategoria = async (id, nombre) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ nombre })
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};

export const eliminarCategoria = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/categorias/${id}`, {
      method: 'DELETE',
      headers
    });
    return await response.json();
  } catch (error) {
    return { error: error.message };
  }
};