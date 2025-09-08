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
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
card: {
  flexDirection: 'row',
  backgroundColor: '#fff',
  borderRadius: 10,
  marginBottom: 15,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
},
imageContainer: {
  width: 90,
  height: 90,
  backgroundColor: '#e0e0e0', // gris placeholder
  justifyContent: 'center',
  alignItems: 'center',
},
cardImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},
cardContent: {
  flex: 1,
  padding: 10,
  justifyContent: 'center',
},
  restaurantCard: {
  backgroundColor: '#fff',
  borderRadius: 12,
  marginBottom: 20,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
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
  paddingHorizontal: 10,
  paddingBottom: 10,
},
infoText: {
  fontSize: 13,
  color: '#444',
},

  details: {
    color: '#666',
    marginTop: 4,
  },
  foodCard: {
  width: 140,
  marginRight: 15,
  backgroundColor: '#fff',
  borderRadius: 10,
  overflow: 'hidden',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  elevation: 3,
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