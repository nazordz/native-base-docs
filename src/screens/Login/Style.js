import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat',
    paddingHorizontal: 16,
  },
  bgWarning: {
    backgroundColor: '#0068e1',
  },
  colorWarning: {
    borderColor: '#e5a90d',
  },
  fontBold: {
    fontFamily: 'Montserrat-Bold',
  },
  fontSize20: {
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
  },
  fontSize14: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  logo: {
    width: 350,
    height: 150,
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginTop: '7.5%',
  },
  center: {
    alignSelf: 'center',
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
  btnGoogle: {
    backgroundColor: 'white',
  },
  marginVertical10: {
    marginVertical: 10,
  },
  marginVertical20: {
    marginVertical: 20,
  },
  mt10: {
    marginTop: 10,
  },
  mt20: {
    marginTop: 20,
  },
  mt30: {
    marginTop: 30,
  },
  borderWidth2: {
    borderWidth: 2,
  },
});

export default styles;
