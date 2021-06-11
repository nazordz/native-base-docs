/* eslint-disable react-native/no-inline-styles */
import { CommonActions } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import CardNotification from '../../components/CardNotification';
import api from '../../helpers/api';

const Notification = ({ navigation }) => {
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    const getData = await api.getNotification();
    setData(getData);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <Header
        leftComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              reverse
              name="arrow-back"
              type=""
              size={12}
              color="#0068e1"
              onPress={() => navigation.dispatch(CommonActions.goBack())}
            />

            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 18,
                width: 200,
                marginLeft: 5,
                marginTop: 2,
              }}>
              Notifikasi
            </Text>
          </View>
        }
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        {data.map((item) => (
          <CardNotification data={item} />
        ))}
      </View>
    </>
  );
};

export default Notification;
