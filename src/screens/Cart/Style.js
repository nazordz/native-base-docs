import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';

const stylesCart = StyleSheet.create({
  container: {
    margin: 10,
  },
  description: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    width: Dimensions.get('window').width / 2,
    marginVertical: 4,
  },
  header: {
    backgroundColor: 'white',
    paddingVertical: 18,
  },
});

export default stylesCart;
