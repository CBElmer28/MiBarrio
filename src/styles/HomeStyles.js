import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    fontSize: 14,
    color: '#555',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  menuButton: {
    marginRight: 10,
    padding: 4,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
  },
  filters: {
    marginVertical: 10,
    paddingBottom: 10,
    marginTop: -4,
  },
  filterButton: {
    height: 36,
    minWidth: 90,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeFilterButton: {
    backgroundColor: '#FF6600',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  cardBase: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  restaurantCard: {
    borderRadius: 12,
    marginBottom: 20,
  },
  restaurantImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    paddingHorizontal: 10,
  },
  categories: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
    resizeMode: 'contain',
  },
  infoText: {
    fontSize: 13,
    color: '#555',
  },
  foodCard: {
  width: 160,
  height: 220,
  backgroundColor: '#fff',
  borderRadius: 12,
  marginRight: 14, 
  overflow: 'hidden',
  position: 'relative',
  elevation: 3, 
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},
  foodImage: {
  width: '100%',
  height: 140,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
},
  foodContent: {
  flex: 1,
  padding: 10,
  justifyContent: 'flex-start',
},

  foodName: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 6,
  lineHeight: 18,
},
foodPrice: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#FF6600',
  position: 'absolute',
  bottom: 10,
  left: 10,
},
  foodDetails: {
    color: '#666',
    fontSize: 13,
  },
  foodInfoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
},
addButton: {
  position: 'absolute',
  bottom: 10,
  right: 10,
  backgroundColor: '#FF6600',
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 4, // Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},

addButtonText: {
  color: '#fff',
  fontSize: 22,
  fontWeight: 'bold',
  lineHeight: 22,
},
});