/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View, Text, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import util from '../helpers/util';

const Header = () => {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('products');
      console.log(value);
    } catch (e) {
      console.log(e);
    }
  };
  const removeData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      console.log(value);
    } catch (e) {
      console.log(e);
    }
  };

  const goToHeaderPage = async (page) => {
    try {
      const isLogin = await AsyncStorage.getItem('token');
      if (isLogin) {
        navigate(page);
      } else {
        Alert.alert(
          'Warning!',
          'Mohon login terlebih dahulu!',
          [
            {
              text: 'Batal',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Login',
              onPress: () => {
                navigate('Login');
              },
            },
          ],
          { cancelable: true },
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ backgroundColor: 'white', padding: 15, paddingBottom: 10 }}>
      <View
        style={{
          position: 'relative',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name="search"
          type="material"
          containerStyle={{ marginRight: -32, zIndex: 99 }}
        />
        <TextInput
          placeholder="Cari Produk..."
          onChangeText={(val) => setSearch(val)}
          onSubmitEditing={() => navigate('SearchValues', { query: search })} //Pindah halaman ke search
          value={search}
          style={{
            backgroundColor: '#f0f0f0',
            color: 'black',
            paddingLeft: 35,
            marginTop: -6,
            flex: 1,
          }}
        />
        <Icon
          name="email-outline"
          color="gray"
          size={30}
          containerStyle={{ marginLeft: 20 }}
          onPress={() => goToHeaderPage('Notification')}
        />
        <Icon
          name="heart-outline"
          color="gray"
          size={30}
          containerStyle={{ marginLeft: 20 }}
          onPress={() => goToHeaderPage('Wishlist')}
        />
      </View>
    </View>
  );
};

export default Header;
