import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1f4c', // azul oscuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff', // recuadro blanco
    borderRadius: 12,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1f4c', // azul oscuro
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    color: '#333',
    marginLeft: 5,
  },
  link: {
    color: '#ff8c00',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  registerText: {
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
});
export default styles;
