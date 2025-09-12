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
    width: 140,
    marginRight: 15,
  },
  foodImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  foodContent: {
    padding: 10,
  },
  foodName: {
    padding: 8,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  foodDetails: {
    color: '#666',
    fontSize: 13,
  },
});