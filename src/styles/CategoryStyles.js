import { StyleSheet } from 'react-native';

export default StyleSheet.create({dropdownHeader: {
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 10,
  elevation: 2,
},
dropdownHeaderText: {
  fontSize: 16,
  fontWeight: 'bold',
},
dropdownList: {
  backgroundColor: '#fff',
  borderRadius: 8,
  marginBottom: 10,
  elevation: 2,
},
dropdownItem: {
  padding: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#eee',
},
dropdownItemText: {
  fontSize: 14,
},
headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
  marginTop: 20,
  paddingHorizontal: 10, // opcional, para que no pegue a los bordes
  height: 48, // 🔹 altura uniforme para flecha y dropdown
},
backButton: {
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%', // ocupa todo el alto del headerRow
  marginRight: 8,
},

}) 