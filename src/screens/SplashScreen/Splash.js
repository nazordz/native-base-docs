import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Splash() {
  const { navigate, reset } = useNavigation();

  const fetchData = async () => {
    setTimeout(async () => {
      await AsyncStorage.multiGet(['token', 'email']).then((value) => {
        console.log(value);
        if (value[0][1] != null || value[1][1] != null) {
          reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
          });
        } else {
          reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }
      });
    }, 3000);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../../assets/img/logo.png')}
        style={{ width: 300, alignSelf: 'center' }}
        resizeMode="contain"
      />
    </View>
  );
}
