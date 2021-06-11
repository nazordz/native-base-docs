/* eslint-disable react-native/no-inline-styles */
import React, { Component, useEffect } from 'react';
import { Text, Alert } from 'react-native';
import { Button, Header } from 'react-native-elements';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyOrderList from './MyOrderList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const MyOrder = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    const getLogin = async () => {
      const loginStatus = await AsyncStorage.getItem('token');
      if (!loginStatus) {
        Alert.alert(
          'Warning!',
          'Mohon terlebih dahulu untuk membuka menu ini.',
          [
            {
              text: 'Batal',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Login', onPress: () => navigate('Login') },
          ],
          { cancelable: false },
        );
      }
    };
    getLogin();
  }, []);

  return (
    <>
      <Header
        leftComponent={
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 18,
              width: 125,
              marginLeft: 10,
            }}>
            Order Saya
          </Text>
        }
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />

      <Tab.Navigator headerMode="none" initialRouteName="MyOrder" lazy>
        <Tab.Screen name="MyOrderProses" options={{ title: 'Diproses' }}>
          {(props) => <MyOrderList {...props} status="Proses" />}
        </Tab.Screen>

        <Tab.Screen name="MyOrderSelesai" options={{ title: 'Selesai' }}>
          {(props) => <MyOrderList {...props} status="Selesai" />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};
export default MyOrder;
