
-----

#  MiBarrio - Plataforma de Delivery de Comida

##  Propósito y Alcance

Este documento proporciona una introducción de alto nivel a la plataforma de entrega de comida **MiBarrio**, cubriendo su propósito, arquitectura, pila tecnológica (tech stack) y sistemas principales.

##  ¿Qué es MiBarrio?

MiBarrio es una aplicación móvil multiplataforma de entrega de comida construida con **React Native** y **Expo**. La plataforma conecta tres roles de usuario distintos en un ecosistema de delivery:

  * **Cliente:** Navega por restaurantes, ordena comida y rastrea entregas en tiempo real.
  * **Repartidor:** Recibe asignaciones de pedidos, navega con GPS y entrega órdenes.
  * **Cocinero (Restaurante):** Gestiona pedidos entrantes, actualiza el menú y asigna repartidores.

La aplicación cuenta con seguimiento de ubicación en tiempo real, notificaciones basadas en WebSockets y una experiencia de carrito de compras unificada, todo desplegado en iOS, Android y web desde una única base de código.

-----

##  Pila Tecnológica (Tech Stack)

La siguiente tabla asigna las tecnologías de alto nivel a sus implementaciones específicas en el código base:

| Capa | Tecnología | Paquete/Versión | Propósito |
| :--- | :--- | :--- | :--- |
| **Framework** | Expo | `expo ~54.0.24` | Flujo de trabajo gestionado de React Native |
| **UI** | React Native | `react-native 0.81.5` | Interfaz de usuario móvil multiplataforma |
| **Librería Core** | React | `react 19.1.0` | Framework de componentes |
| **Navegación** | React Navigation | `@react-navigation/native ^7.1.17`<br>`@react-navigation/native-stack ^7.3.26`<br>`@react-navigation/bottom-tabs ^7.4.7` | Navegación por pila (Stack) y pestañas (Tabs) |
| **Gestión de Estado** | React Context | Nativo (Built-in) | Estado global del carrito vía `CartProvider` |
| **Persistencia** | AsyncStorage | `@react-native-async-storage/async-storage ^2.2.0` | Almacenamiento local clave-valor |
| **Cliente HTTP** | Axios | `axios ^1.12.2` | Comunicación con API REST |
| **WebSocket** | Socket.IO Client | `socket.io-client ^4.8.1` | Eventos bidireccionales en tiempo real |
| **Mapas** | React Native Maps | `react-native-maps 1.20.1` | Integración de mapas nativos |
| **Ubicación** | Expo Location | `expo-location ~19.0.7` | GPS y servicios de ubicación |
| **Notificaciones** | Expo Notifications | `expo-notifications ~0.32.13` | Notificaciones push y locales |
| **Enrutamiento** | Polyline | `@mapbox/polyline ^1.2.1` | Codificación/Decodificación de rutas |
| **Geoespacial** | Geolib | `geolib ^3.3.4` | Cálculos de distancia |

-----

##  Arquitectura de Navegación

El sistema de navegación implementa una estructura de dos niveles:

1.  **Router Externo:** El componente `Router` (usando `createNativeStackNavigator`) gestiona la autenticación y las pantallas compartidas.
2.  **Navegador Interno:** Después de la autenticación, el componente `AppNavigator` lee el rol del usuario desde `AsyncStorage` y renderiza condicionalmente uno de los tres navegadores de pestañas (tab navigators) específicos para cada rol.

Toda la navegación se maneja sin cabeceras predeterminadas (`headerShown: false`), utilizando componentes de navegación personalizados como `BackArrow` y `MenuButton` para gestionar la interfaz de usuario.

-----

##  Resumen de Sistemas Principales

### Gestión de Estado vía CartProvider

El `CartProvider` envuelve toda la aplicación en el nivel raíz, proporcionando el estado global del carrito de compras a través de **React Context**. Los datos del carrito se sincronizan bidireccionalmente con `AsyncStorage`, asegurando la persistencia a través de reinicios de la aplicación. El subtotal se calcula dinámicamente a partir de los artículos del carrito.

### Patrón de Capa de Servicios

Toda la comunicación con el backend está encapsulada en módulos de servicio que siguen un patrón consistente. Cada servicio implementa una función `getHeaders()` que recupera el token JWT de `AsyncStorage` y lo inyecta en los encabezados de la solicitud, proporcionando una autenticación centralizada. Esta abstracción evita que los componentes de la interfaz de usuario construyan directamente URLs de API o gestionen tokens.

### Arquitectura de Comunicación en Tiempo Real

Las características en tiempo real utilizan `socket.io-client` para la comunicación WebSocket bidireccional.

  * El `DeliveryMap` del **Repartidor** emite actualizaciones de ubicación cada 2 segundos.
  * El backend transmite estas actualizaciones a las instancias suscritas de `TrackingScreen` del **Cliente**.
  * Las transiciones de estado de los pedidos activan eventos WebSocket para notificar a las interfaces de **Cocinero** y **Repartidor**.
  * Todas las conexiones se autentican utilizando tokens JWT almacenados en `AsyncStorage`.

-----

##  Implementación de Roles de Usuario

El sistema basado en roles se implementa mediante renderizado condicional basado en un campo `tipo` almacenado en el objeto de usuario. Cada pila (stack) de roles es una instancia separada de `createBottomTabNavigator` con pantallas específicas para ese rol:

  * **Cliente:** Acceso a menús, carrito y seguimiento.
  * **Cocinero:** Acceso a gestión de pedidos y menús (Componente `MainTabs`).
  * **Repartidor:** Acceso a mapa de ruta y lista de entregas.

-----

##  Configuración y Entorno

Las variables de entorno se gestionan a través de `react-native-dotenv` (importado vía `babel.config.js`) y se accede a ellas utilizando la sintaxis de importación `@env`.

El archivo `app.json` configura los ajustes específicos de Expo, incluyendo el ID del proyecto EAS, iconos específicos de la plataforma y permisos de plugins nativos.

-----

##  Categorías de Datos

La aplicación utiliza una lista maestra de categorías para la clasificación de alimentos:

  * **Todas:** Muestra todos los restaurantes/artículos.
  * **Hamburguesa:** Restaurantes de hamburguesas.
  * **Pizza:** Pizzerías.
  * **Pollo:** Restaurantes de pollo.
  * **Café:** Cafeterías.
  * **Postres:** Vendedores de postres.
  * **Parrillas:** Restaurantes de parrilla.

  **Prueba de flujo**
  https://www.youtube.com/watch?v=jBKtgN-V-sc
