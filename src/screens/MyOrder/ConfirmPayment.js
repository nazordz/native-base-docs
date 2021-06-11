/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { Image } from 'react-native';
import { View, ScrollView } from 'react-native';
import { Button, Header, Icon } from 'react-native-elements';
import AppContext from '../../AppContext';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';

const ConfirmPayment = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const { order_id, image, data, fullpayment } = route.params;
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(data);
  const { setShowSpinner } = useContext(AppContext);

  const uploadImage = async () => {
    setShowSpinner(true);
    try {
      const upload = await api.uploadPic(
        photo,
        'upload-bukti-transfer',
        order_id,
        fullpayment,
      );
      if (upload.status == 'OK') {
        await util.showToast('Sukses mengupload bukti transfer');
        navigate('Tabs');
      } else {
        await util.showToast(
          'Gagal mengupload bukti transfer, silahkan coba lagi',
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const chooseImage = async () => {
    Alert.alert(
      null,
      'Unggah bukti pembayaran',
      [
        {
          text: 'Galeri',
          onPress: async () => {
            const choose = await util.imageGalleryLaunch();
            setPhoto(choose);
            console.log('ini', choose.data);
          },
        },
        {
          text: 'Kamera',
          onPress: async () => {
            const choose = await util.cameraLaunch();
            setPhoto(choose);
            console.log('ini', choose);
          },
        },
      ],
      { cancelable: true },
    );
  };

  console.log('mantap', route.params);

  return (
    <View style={{ flex: 1 }}>
      <Header
        placement="left"
        leftComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              reverse
              name="arrow-back"
              type=""
              size={14}
              color="#0068e1"
              onPress={() => navigation.dispatch(CommonActions.goBack())}
            />
            <Texts value="Konfirmasi Pembayaran" size={16} />
          </View>
        }
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />
      <ScrollView>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0068e1" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
                backgroundColor: 'white',
                padding: 10,
                paddingLeft: 20,
              }}>
              <Image
                source={{
                  uri: image,
                }}
                style={{ width: 60, height: 60 }}
              />
              <View style={{ marginLeft: 10 }}>
                <Texts value="No. Pesanan" />
                <Texts
                  value={dayjs().format(`[INV]/YYYY/MM/DD/[${order_id}]`)}
                  size={16}
                />
              </View>
            </View>

            <View style={{ padding: 20, alignItems: 'center' }}>
              <View style={{ width: '100%', height: 350 }}>
                <Image
                  source={{
                    uri: photo.uri,
                  }}
                  style={{ flex: 1, borderRadius: 8 }}
                />
              </View>
            </View>

            <Button
              title="Unggah Ulang Bukti Pembayaran"
              type="outline"
              onPress={chooseImage}
              buttonStyle={{
                borderColor: '#0068e1',
                width: '90%',
                alignSelf: 'center',
              }}
              titleStyle={{
                color: '#0068e1',
              }}
            />
          </View>
        )}
      </ScrollView>
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
          width: '100%',
        }}>
        <Button
          title="Konfirmasi Pembayaran"
          onPress={() => uploadImage(order_id)}
          buttonStyle={{
            backgroundColor: '#3ECB43',
          }}
          containerStyle={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

export default ConfirmPayment;
