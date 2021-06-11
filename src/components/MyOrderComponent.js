import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button, Header } from 'react-native-elements';

const MyOrderComponent = () => {
  return (
    <View>
      <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
      />
    </View>
  );
};

export default MyOrderComponent;
