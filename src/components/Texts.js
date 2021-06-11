/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';

const Texts = (props) => {
  return (
    <View>
      <Text
        numberOfLines={props.ellipsis}
        onPress={props.onPress}
        style={[
          styles.default,
          props.style,
          {
            textAlign: props.align ? props.align : 'left',
            color: props.color ? props.color : 'black',
            fontWeight: props.bold ? 'bold' : 'normal',
            fontSize: props.size ? props.size : 14,
            fontFamily: props.font ? props.font : 'Montserrat-Regular',
          },
        ]}>
        {props.value}
      </Text>
      {props.icon && (
        <Icon
          name="arrow-right"
          size={15}
          containerStyle={[styles.iconDefault, props.iconStyle]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
  },
  iconDefault: {
    marginTop: -10,
    marginLeft: -10.
  },
});

export default Texts;
