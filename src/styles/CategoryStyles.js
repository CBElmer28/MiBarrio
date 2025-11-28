import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9', // Fondo muy limpio
  },

  // --- HEADER ---
  headerContainer: {
    backgroundColor: '#F9F9F9', // Mismo color que el fondo para que se funda
    paddingTop: Platform.OS === 'android' ? 50 : 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
    zIndex: 100,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  // Grupo Izquierdo (Atrás + Dropdown)
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },

  // Botones Circulares (Atrás, Search, Filter)
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FFF', // Blanco puro
    justifyContent: 'center',
    alignItems: 'center',
    // Sombra muy suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  // El botón de búsqueda activo (negro en la referencia)
  searchCircleActive: {
    backgroundColor: '#1a1d2e',
  },

  // Grupo Derecho (Search + Filter)
  rightGroup: {
    flexDirection: 'row',
    gap: 12,
  },

  // --- BARRA DE BÚSQUEDA EXPANDIBLE ---
  searchBarContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 15,
    color: '#333',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  // --- CONTENIDO ---
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  
  // --- GRID CARDS (Estilo Referencia) ---
  gridList: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    margin: 8, // Espacio entre tarjetas
    padding: 12,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    maxWidth: (width / 2) - 24,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: 110,
    borderRadius: 15,
    resizeMode: 'cover',
    marginBottom: 12,
    backgroundColor: '#F0F0F0',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1d2e',
    marginBottom: 4,
  },
  gridSub: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  gridPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1d2e',
  },
  
  // Botón Naranja "+"
  addBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6600',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#FF6600",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // --- MODAL FILTROS ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingBottom: 40,
    maxHeight: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1d2e',
  },
  filterSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  filterOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 25,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  filterOptionSelected: {
    backgroundColor: '#FF6600',
    borderColor: '#FF6600',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#FFF',
    fontWeight: '700',
  },
  applyButton: {
    backgroundColor: '#1a1d2e', // Botón negro/oscuro para contraste
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});