import { StyleSheet } from 'react-native';

const stylesOTP = StyleSheet.create({
  logo: {
    width: 250,
    height: 115,
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginTop: '7.5%',
  },
  logoOTP: {
    width: 250,
    height: 250,
    resizeMode: 'stretch',
    alignSelf: 'center',
    marginTop: '7.5%',
  },
  textH2: {
    color: 'red',
    fontFamily: 'Montserrat-Bold',
    alignSelf: 'center',
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 6,
  },
  text: {
    fontFamily: 'Montserrat-Regular',
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
    width: 350,
  },
  textResend: {
    fontFamily: 'Montserrat-Regular',
    alignSelf: 'center',
    fontSize: 14,
    textAlign: 'center',
    width: 350,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
    color: 'black',
  },

  borderStyleHighLighted: {
    borderColor: 'black',
  },

  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    color: 'black',
    fontSize: 24,
    fontFamily: 'Montserrat-Regular',
  },

  underlineStyleHighLighted: {
    borderColor: 'black',
  },
});

export default stylesOTP;
