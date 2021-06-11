import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    fontFamily: 'Montserrat',
  },
  fontBold: {
    fontFamily: 'Montserrat-Bold',
  },
  fontSize20: {
    fontSize: 20,
  },
  fontSize14: {
    fontSize: 16,
  },
  logo: {
    width: 250,
    height: 115,
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginTop: '7.5%',
  },
  center: {
    alignSelf: 'center',
  },
  marginTop: {
    marginVertical: 10,
  },
  input: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DCD9D5',
    textAlign: 'center',
    backgroundColor: 'white',
    color: 'black',
  },
  button: {
    borderRadius: 15,
    padding: 10,
  },
  buttonOutline: {
    borderRadius: 15,
    padding: 10,
    borderWidth: 2,
    borderColor: '#f0af17',
    borderTopColor: '#f0af17',
    marginTop: 15,
  },
  separator: {
    marginVertical: 25,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textRed: {
    color: '#0055b8',
  },
  textOrange: {
    color: '#f0af17',
  },
  textWhite: {
    color: '#fff',
  },
  bgColorOrange: {
    backgroundColor: '#f0af17',
  },
  bgColorWhite: {
    backgroundColor: '#fff',
  },
  bgWarning: {
    backgroundColor: '#0068e1',
  },
  marginVertical10: {
    marginVertical: 10,
  },
  marginVertical20: {
    marginVertical: 20,
  },
  colorWarning: {
    borderColor: '#0068e1',
  },
  borderWidth2: {
    borderWidth: 2,
  },
});

export default styles;
