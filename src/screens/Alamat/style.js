import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerCard: {
    backgroundColor: 'white',
    elevation: 10,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  cardHeader: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    margin: 5,
  },
  accountButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 6,
    alignItems: 'center',
  },
  editHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
});

export default styles;
