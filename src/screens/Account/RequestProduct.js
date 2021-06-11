/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Alert } from 'react-native';
import { Image } from 'react-native';
import { View, ScrollView } from 'react-native';
import { Button, Header, Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import AppContext from '../../AppContext';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';

const RequestProduct = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const { setShowSpinner } = useContext(AppContext);

  const uploadImage = async () => {
    setShowSpinner(true);
    try {
      const upload = await api.sendRequestProduct(
        photo,
        'upload-request-product',
        name,
        type,
      );
      if (upload.status == 'OK') {
        await util.showToast('Sukses melakukan request produk');
        navigate('Tabs');
      } else {
        await util.showToast(
          'Gagal melakukan request produk, silahkan coba lagi',
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
      'Unggah Foto Produk',
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
            <Texts value="Request Product" font="Montserrat-Bold" size={16} />
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
            <View style={{ padding: 20, alignItems: 'center' }}>
              <View
                style={{
                  width: '100%',
                  height: photo ? 450 : 150,
                  padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 8,
                }}>
                <TextInput
                  style={{
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: '#DCD9D5',
                    textAlign: 'center',
                  }}
                  placeholder="Nama Barang"
                  onChangeText={(val) => setName(val)}
                />
                <TextInput
                  style={{
                    borderRadius: 15,
                    borderWidth: 1,
                    borderColor: '#DCD9D5',
                    textAlign: 'center',
                    marginVertical: 10
                  }}
                  placeholder="Jenis"
                  onChangeText={(val) => setType(val)}
                />
                <Image
                  source={{
                    uri: photo.uri,
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            </View>

            <Button
              title="Upload Gambar"
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
          title="Kirim Request"
          onPress={() => uploadImage()}
          buttonStyle={{
            backgroundColor: '#0068e1',
          }}
          containerStyle={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

export default RequestProduct;
