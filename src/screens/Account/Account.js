/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Avatar, Button, Header, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import api from '../../helpers/api';
import { RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native';

const Account = () => {
  const { navigate, reset } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const isFocused = useIsFocused();

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  async function fetchData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const account = await api.getAccountInfo(token);
      setName(account.first_name);
      setEmail(account.email);
      setPhone(account.phone);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchData();
    setRefresh(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return (
    <>
      <Header
        containerStyle={{ backgroundColor: 'white' }}
        centerComponent={
          <View>
            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 20 }}>
              Login Sebagai
            </Text>
          </View>
        }
        rightComponent={
          <Button
            buttonStyle={{ backgroundColor: '#0068e1', justifyContent: 'center' }}
            containerStyle={{ width: 50, height: 40 }}
            onPress={logout}
            icon={
              <Icon
                name="arrow-right-bold-box-outline"
                size={28}
                color="white"
                style={{ justifyContent: 'center' }}
              />
            }
          />
        }
      />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0068e1" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              style={{ zIndex: 999, paddingTop: 100 }}
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }>
          <View style={{ backgroundColor: 'white', padding: 10 }}>
            <View
              style={{
                padding: 20,
                backgroundColor: 'white',
                flexDirection: 'row',
                paddingVertical: 30,
              }}>
              <Avatar
                size="large"
                rounded
                source={{
                  uri: 'https://source.unsplash.com/1024x768/?water',
                }}
                containerStyle={{ borderWidth: 8, borderColor: '#0068e1' }}
              />

              <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <View
                  style={{
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: 22,
                      color: '#0068e1',
                    }}>
                    {name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      marginTop: 4,
                      fontFamily: 'Montserrat-Regular',
                      fontSize: 16,
                      color: 'black',
                    }}>
                    {email}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      marginTop: 4,
                      fontFamily: 'Montserrat-Regular',
                      fontSize: 16,
                      color: 'black',
                    }}>
                    {phone}
                  </Text>
                </View>
              </View>
            </View>
            <Button
              title="Edit Profile Saya"
              type="outline"
              onPress={() =>
                navigate('AccountEdit', {
                  name,
                  email,
                  phone,
                })
              }
              buttonStyle={{
                backgroundColor: 'white',
                borderColor: '#0068e1',
                borderWidth: 2,
              }}
              titleStyle={{ fontFamily: 'Montserrat-Regular', color: '#0068e1' }}
            />
          </View>
          <View>
            <Button
              title="Alamat Saya"
              onPress={() => navigate('ListAlamat')}
              buttonStyle={{ backgroundColor: 'white' }}
              containerStyle={{
                marginHorizontal: 20,
                marginVertical: 10,
                marginTop: 30,
              }}
              titleStyle={{
                textAlign: 'left',
                color: 'black',
                fontFamily: 'Montserrat-Regular',
              }}
              icon={{
                name: 'arrow-right',
                size: 15,
                color: 'black',
              }}
              iconRight
            />
            <Button
              title="Privacy Policy"
              buttonStyle={{ backgroundColor: 'white' }}
              onPress={() => navigate('Info', { info: 'Kebijakan' })}
              containerStyle={{
                marginHorizontal: 20,
                marginVertical: 10,
              }}
              titleStyle={{
                textAlign: 'left',
                color: 'black',
                fontFamily: 'Montserrat-Regular',
              }}
              icon={{
                name: 'arrow-right',
                size: 15,
                color: 'black',
              }}
              iconRight
            />
            <Button
              title="Syarat dan Ketentuan"
              onPress={() => navigate('Info', { info: 'SK' })}
              buttonStyle={{ backgroundColor: 'white' }}
              containerStyle={{
                marginHorizontal: 20,
                marginVertical: 10,
              }}
              titleStyle={{
                textAlign: 'left',
                color: 'black',
                fontFamily: 'Montserrat-Regular',
              }}
              icon={{
                name: 'arrow-right',
                size: 15,
                color: 'black',
              }}
              iconRight
            />
            <Button
              title="Request Produk"
              buttonStyle={{ backgroundColor: 'white' }}
              onPress={() => navigate('RequestProduct')}
              containerStyle={{
                marginHorizontal: 20,
                marginVertical: 10,
              }}
              titleStyle={{
                textAlign: 'left',
                color: 'black',
                fontFamily: 'Montserrat-Regular',
              }}
              icon={{
                name: 'arrow-right',
                size: 15,
                color: 'black',
              }}
              iconRight
            />
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default Account;
