/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Texts from './Texts';

const CardNotification = ({ data }) => {
  const { navigate } = useNavigation();
  return (
    <>
      <View style={{ borderRadius: 2, elevation: 1, padding: 12, margin: 4 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <Texts value={data.message} />
            <Texts value={data.created_at} size={11} color="#aaa" />
          </View>
          <Icon
            name="chevron-right-circle-outline"
            size={20}
            color="red"
            onPress={() => navigate('DetailOrder', { order_id: data.order_id })}
          />
        </View>
      </View>
    </>
  );
};

export default CardNotification;
