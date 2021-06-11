import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Texts from './Texts';

const { width } = Dimensions.get('window');

const CategoryCardComponent = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={props.onPress}>
        <Image style={styles.image} source={{ uri: props.image }} />
        <Texts value={props.name} ellipsis={1} style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    // flex: 1 / 3,
    borderWidth: 2,
    width: '29.3%',
    height: 120,
    borderColor: '#eee',
    borderRadius: 4,
  },
  image: {
    width: 75,
    height: 75,
    resizeMode: 'cover',
    alignSelf: 'center',
    margin: 10,
  },
  textCategory: {
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
});

export default CategoryCardComponent;
