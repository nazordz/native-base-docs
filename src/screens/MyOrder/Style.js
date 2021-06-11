import { StyleSheet } from 'react-native';

const myOrderStyle = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 70,
  },
  card: {
    borderRadius: 12,
    elevation: 10,
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
  },
  textCode: {
    color: '#0055b8',
    fontFamily: 'Montserrat-Bold',
  },
  text: {
    marginVertical: 5,
  },
  preOrder: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#ebfaff',
    width: '100%',
  },
  countPO: {
    width: 30,
    height: 30,
    backgroundColor: '#0068e1',
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regular: {
    fontFamily: 'Montserrat-Regular',
  },
});

export default myOrderStyle;
