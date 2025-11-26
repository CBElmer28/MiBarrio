import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config'; 

// Helper: Obtener Token para autorización
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Helper: Obtener el ID del Usuario logueado
const getUserId = async () => {
    try {
        // Buscamos donde sea que hayas guardado al usuario
        let json = await AsyncStorage.getItem('usuario');
        if(!json) json = await AsyncStorage.getItem('user');
        
        const user = json ? JSON.parse(json) : null;
        return user?.id;
    } catch (e) { return null; }
};

/* ====================================================
   FUNCIONES DE PAGO
   ==================================================== */

// 1. Obtener mis tarjetas guardadas
export const getMisTarjetas = async () => {
  try {
    const userId = await getUserId();
    if (!userId) return [];

    const headers = await getHeaders();
    // Llamamos al backend filtrando por el ID del usuario logueado
    const response = await fetch(`${API_URL}/metodos-pago/usuario/${userId}`, {
        method: 'GET',
        headers
    });
    
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error obteniendo tarjetas:", error);
    return [];
  }
};

// 2. Guardar nueva tarjeta
export const guardarTarjeta = async (datosTarjeta) => {
  try {
    const userId = await getUserId();
    const headers = await getHeaders();

    // --- MAPEO DE IDs SEGÚN TU BASE DE DATOS ---
    // 1=Crédito, 2=Débito, 3=Yape, 4=Plin, 5=Efectivo
    let metodoId = 1; // Por defecto "Tarjeta de Crédito" para Visa/Mastercard
    
    if (datosTarjeta.method === 'yape') metodoId = 3;
    if (datosTarjeta.method === 'plin') metodoId = 4;
    
    // Preparamos el cuerpo para el backend
    const body = {
        usuario_id: userId,        // El dueño de la tarjeta
        metodo_pago_id: metodoId,  // El tipo (Yape, Visa, etc.)
        principal: false,          // (Opcional)
        // Guardamos todos los datos (número enmascarado, nombre, etc.) como texto JSON
        detalles: JSON.stringify(datosTarjeta) 
    };

    const response = await fetch(`${API_URL}/metodos-pago/asignar`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    return await response.json();
  } catch (error) {
    console.error("Error guardando tarjeta:", error);
    return { error: "Error de conexión" };
  }
};

// ... tus otras funciones ...

// 3. Eliminar Tarjeta
export const eliminarTarjeta = async (idRelacion) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/metodos-pago/${idRelacion}`, {
      method: 'DELETE',
      headers
    });
    return await response.json();
  } catch (error) {
    return { error: "Error de conexión" };
  }
};

// 3. Editar Tarjeta
export const editarTarjeta = async (idRelacion, datosTarjeta) => {
  try {
    const headers = await getHeaders();
    
    // Preparamos el body igual que al crear, pero solo enviamos lo que cambia
    const body = {
        detalles: JSON.stringify(datosTarjeta),
        principal: false // O true si implementas lógica de favorito
    };

    const response = await fetch(`${API_URL}/metodos-pago/${idRelacion}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    return await response.json();
  } catch (error) {
    console.error("Error editando:", error);
    return { error: "Error de conexión" };
  }
};