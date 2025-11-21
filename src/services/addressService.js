import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Función corregida para obtener el ID del usuario
export const getUserId = async () => {
  try {
    // 1. CORRECCIÓN: Declaramos la variable con 'let' y buscamos 'usuario' primero (según tu Login)
    let jsonValue = await AsyncStorage.getItem('usuario');

    // 2. Si no existe, intentar con 'user' (por si acaso)
    if (!jsonValue) {
        jsonValue = await AsyncStorage.getItem('user');
    }

    // 3. Si aún no existe, intentar 'userData'
    if (!jsonValue) {
        jsonValue = await AsyncStorage.getItem('userData');
    }

    if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        console.log("🔍 Datos recuperados:", data);

        // 4. Lógica de extracción de ID
        if (data.id) return data.id; 
        if (data.usuario && data.usuario.id) return data.usuario.id; 
        if (data.user && data.user.id) return data.user.id; 
        
        console.warn("⚠️ Objeto encontrado sin propiedad ID:", data);
        return null;
    }

    console.warn("⚠️ No se encontró sesión en Storage (claves: usuario, user, userData)");
    return null;

  } catch(e) {
    console.error("❌ Error leyendo Storage:", e);
    return null;
  }
}

export const getAddresses = async (userId) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/direcciones/usuario/${userId}`, {
      method: 'GET',
      headers
    });
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

export const createAddress = async (data) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/direcciones`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating address:", error);
    return null;
  }
};

export const deleteAddress = async (id) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/direcciones/${id}`, {
      method: 'DELETE',
      headers
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting address:", error);
    return false;
  }
};

export const setPrincipalAddress = async (id, userId) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/direcciones/${id}/principal`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ usuario_id: userId })
    });
    return response.ok;
  } catch (error) {
    console.error("Error setting principal address:", error);
    return false;
  }
};