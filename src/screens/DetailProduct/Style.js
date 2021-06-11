import { StyleSheet } from 'react-native';

const styleDetail = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 24,
    borderRadius: 15,
    marginBottom: '12%',
  },
  price: {
    textAlign: 'center',
    color: 'green',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',
  },
  name: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    width: 350,
  },
  description: {
    textAlign: 'center',
    color: 'black',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    width: 350,
    alignItems: 'center',
    marginTop: -12,
  },
  detail: {
    marginHorizontal: 30,
  },
  rl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    marginVertical: 5,
  },
  spaceAround: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styleDetail;
