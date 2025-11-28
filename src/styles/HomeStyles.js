import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Fondo blanco sucio muy limpio
  },
  
  // --- HEADER PREMIUM ---
  headerContainer: {
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // Sombra del header
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // Botón Menú (Círculo gris suave)
  menuButton: {
    backgroundColor: '#F5F6FA',
    padding: 10,
    borderRadius: 14,
  },
  // Textos del Header
  greeting: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1a1d2e',
    marginTop: 15,
  },
  headerLabel: {
    fontSize: 12,
    color: '#FF6600',
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerLocation: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  // --- BUSCADOR FLOTANTE ---
  searchInput: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 18,
    fontSize: 15,
    color: '#333',
    // Sombra flotante
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },

  // --- FILTROS (PILLS) ---
  filters: {
    paddingLeft: 20,
    paddingVertical: 15,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 25,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  activeFilterButton: {
    backgroundColor: '#FF6600',
    elevation: 5,
    shadowColor: '#FF6600',
    shadowOpacity: 0.3,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  activeFilterButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },

  // --- TITULOS ---
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a1d2e',
    marginLeft: 20,
},

  // --- TARJETAS GENÉRICAS (Base) ---
  cardBase: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    // Sombra unificada
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
    borderWidth: 0, // Adiós bordes
  },

  // --- RESTAURANTE (Vertical) ---
  restaurantCard: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    resizeMode: 'cover',
  },
  restaurantInfoContent: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categories: {
    fontSize: 13,
    color: '#999',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginLeft: 4,
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: '#FF6600',
  },

  // --- COMIDA (Horizontal) ---
  foodCard: {
    width: 170,
    height: 230,
    marginLeft: 20, // Margen solo a la izquierda para el scroll
    marginRight: 5,
    marginBottom: 20, // Espacio para sombra
  },
  foodImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  foodContent: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    lineHeight: 18,
  },
  foodPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF6600',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FF6600',
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 18,
    // Sombra flotante
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    justifyContent: 'space-between'
},
searchPlaceholder: {
    color: '#999',
    fontSize: 15,
},

// Header de Sección (Categorías, Populares, etc.)
sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 20, // Margen derecho para el botón "Ver todo"
    marginTop: 15,
    marginBottom: 10,
},
seeAllText: {
    fontSize: 13,
    color: '#FF6600',
    fontWeight: '600',
},

  
});