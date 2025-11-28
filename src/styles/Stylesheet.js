import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Fondo base (ahora soportará el gradiente)
  container: {
    flex: 1,
  },
  // Contenedor que evita el teclado
  keyboardView: {
    flex: 1,
  },
  // Scroll interno para que el contenido se mueva si falta espacio
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  // La tarjeta blanca flotante
  formBox: {
    width: width * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 30, // Bordes muy curvos (estilo moderno)
    paddingVertical: 40,
    paddingHorizontal: 25,
    // Sombras profundas para efecto 3D
    elevation: 20, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800', // Extra bold
    color: '#1a1d2e',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    color: '#1a1d2e',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 10,
    marginBottom: 5,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  // NUEVO: Contenedor para Input + Icono
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA', // Gris muy suave
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 55, // Altura fija cómoda
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    height: '100%',
  },
  // Botón Principal
  button: {
    backgroundColor: '#FF6600',
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 10,
    shadowColor: '#FF6600',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  // Links y Footer
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#666',
    marginLeft: 8,
    fontSize: 13,
  },
  link: {
    color: '#FF6600',
    fontWeight: '700',
    fontSize: 13,
  },
  registerText: {
    color: '#666',
    marginTop: 25,
    textAlign: 'center',
    fontSize: 14,
  },
  favButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 8,
    borderRadius: 12,
    zIndex: 10,
},
});

export default styles;