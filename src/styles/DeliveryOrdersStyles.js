import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    padding: 16, 
    backgroundColor: "#f9f9f9" 
  },
  greetingContainer: {
    marginBottom: 10,
  },
  greeting: { 
    fontSize: 26, 
    fontWeight: "bold", 
    color: '#333',
  },
  locationCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee'
  },
  label: { 
    fontSize: 12, 
    color: "#999" 
  },
  locationRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: 'space-between',
    marginTop: 5 
  },
  locationText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333" 
  },
  countersRow: { 
    flexDirection: "row", 
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 25,
  },
  counterBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  counterNumber: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#FF6600" 
  },
  counterLabel: { 
    fontSize: 14, 
    color: "#555" 
  },
  
  // Estilos para la lista de órdenes en deliveryorders.js
  listContainer: {
    flex: 1,
  },
  listTitle: { 
    fontSize: 16, 
    color: "#555", 
    marginBottom: 10,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  orderName: { 
    fontSize: 15, 
    fontWeight: "bold",
    color: '#333',
  },
  orderAddress: { 
    color: "#555", 
    marginBottom: 4,
    marginTop: 2,
  },
  itemsCount: { 
    color: "#FF6600", 
    fontWeight: "bold" 
  },
  orderDetails: { 
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailsTitle: { 
    fontWeight: "bold", 
    marginBottom: 8,
    color: '#333',
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingVertical: 2,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6600',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  mapButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#D9534F',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#D9534F',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default styles;
