import AsyncStorage from '@react-native-async-storage/async-storage';
// 👇 AQUÍ USAMOS TU CONFIGURACIÓN EXISTENTE
import { API_URL } from '../config'; 

// Función auxiliar para obtener el Token
const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token'); 
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// 🆕 CREAR ORDEN (Cliente)
export const crearOrden = async (orderData) => {
  try {
    const headers = await getHeaders();
    console.log("📤 Enviando orden:", JSON.stringify(orderData));
    
    const response = await fetch(`${API_URL}/orden`, { // Asegúrate que la ruta coincida con app.js
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (response.ok) {
        return { success: true, orden: data.orden };
    } else {
        return { success: false, error: data.error || "Error al crear la orden" };
    }
  } catch (error) {
    console.error("🔥 Error de red creando orden:", error);
    return { success: false, error: "Error de conexión" };
  }
};



/* ====================================================
   FUNCIONES PARA EL COCINERO (Gestión)
   ==================================================== */

// 1. Traer lista de repartidores disponibles
export const getRepartidoresDisponibles = async () => {
  try {
    const headers = await getHeaders();
    // Usamos la API_URL importada de tu config
    const response = await fetch(`${API_URL}/usuarios/repartidores`, { method: 'GET', headers });
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error al traer repartidores:", error);
    return [];
  }
};

// 2. Asignar un pedido a un repartidor
export const asignarOrden = async (idOrden, idRepartidor) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/orden/${idOrden}/asignar-repartidor`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ repartidor_id: idRepartidor }) // Tu back pide repartidor_id
    });

    if (response.ok) {
        return await response.json();
    } else {
        console.log("Error backend:", await response.text());
        return null;
    }
  } catch (error) {
    console.error("Error de red al asignar:", error);
    return null;
  }
};

/* ====================================================
   FUNCIONES PARA EL REPARTIDOR (App Móvil)
   ==================================================== */

// 3. Ver mis pedidos asignados
export const getMisPedidosAsignados = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/orden/asignadas`, { method: 'GET', headers });
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error("Error mis pedidos:", error);
    return [];
  }
};

// 4. Marcar pedido como entregado
export const marcarOrdenEntregada = async (idOrden) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/orden/${idOrden}/entregar`, { 
        method: 'PUT', 
        headers 
    });
    return response.ok;
  } catch (error) {
    console.error("Error al entregar:", error);
    return false;
  }
};

// Cambiar solo el estado (sin asignar repartidor)
export const cambiarEstadoOrden = async (idOrden, nuevoEstado) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/orden/${idOrden}/estado`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ estado: nuevoEstado }) 
    });

    return await response.json();
  } catch (error) {
    console.error("Error cambiando estado:", error);
    return null;
  }
};
// (Llama a la ruta: GET /api/orden que va a ordenController.listarOrdenes)
export const getOrdenesRestaurante = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${API_URL}/orden`, { // Ojo: revisa si en tu app.js es /api/orden o /api/ordenes
      method: 'GET',
      headers: headers
    });
    return await response.json();
  } catch (error) {
    console.error("Error cargando órdenes:", error);
    return [];
  }
};