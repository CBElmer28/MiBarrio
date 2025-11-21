import { StyleSheet } from 'react-native';

export default StyleSheet.create({dropdownHeader: {
  backgroundColor: '#fff',
  padding: 12,
  borderRadius: 8,
  marginBottom: 10,
  elevation: 2,
},
container: {
  flex: 1,
  backgroundColor: '#fff',
  paddingHorizontal: 16, 
  paddingTop: 10,       
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
  paddingHorizontal: 10, 
  height: 48, 
},
backButton: {
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  marginRight: 8,
},

infoRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
  paddingHorizontal: 4,
},
infoItem: {
  flexDirection: 'row',
  alignItems: 'center',     
  justifyContent: 'center',  
  gap: 6,        
},

icon: {
  width: 18,
  height: 18,
  resizeMode: 'contain',
},
infoText: {
  fontSize: 13,
  color: '#555',
},
headerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 12,
  paddingTop: 20,
  paddingBottom: 10,
  backgroundColor: '#fff',
},

iconButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
  elevation: 2,
  marginHorizontal: 4,
},

headerIcon: {
  width: 20,
  height: 20,
  tintColor: '#FF6600',
  resizeMode: 'contain',
},
}) 