import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#ff0300',
    borderRadius: 15,
    marginTop: 10,
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    elevation: 5,
    shadowRadius: 10,
    justifyContent: 'center',
    height: 70,
    overflow: 'hidden',
  },
  // image: {
  //     width: 90,
  //     height: 90,
  //     resizeMode: 'cover',
  //     position: 'relative',
  //     alignSelf: 'flex-end',
  //     marginTop: -20,
  //     marginRight: -15,

  // },
  image2: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    position: 'relative',
    alignSelf: 'flex-end',
    marginTop: -22,
    marginRight: -22,
  },
  cardTopKategori: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 15,
    height: 100,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageTopKategori: {
    width: 75,
    height: 75,
    marginHorizontal: 10,
    alignItems: 'center',
  },
});

export default styles;
