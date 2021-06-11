/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Avatar, Header, Icon, Input } from 'react-native-elements';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';
import styles from './style';

const AccountEdit = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const [photo, setPhoto] = useState([]);
  const data = route.params;
  const [name, setName] = useState(data.name);
  const [email, setEmail] = useState(data.email);
  const [phone, setPhone] = useState(data.phone);
  const [pwd, setPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const save = async () => {
    const submit = await api.editProfile(
      name,
      email,
      phone,
      pwd,
      newPwd,
      confirmPwd,
    );

    if (submit.status == 'Success') {
      util.showToast('Sukses memperbarui profil');
      navigate('Tabs');
      console.log(submit.message);
    } else {
      console.log(submit);
      util.showToast(submit.message);
    }
  };

  const chooseImage = async () => {
    Alert.alert(
      null,
      'Unggah foto profil',
      [
        {
          text: 'Galeri',
          onPress: async () => {
            const choose = await util.imageGalleryLaunch();
            setPhoto(choose);
            console.log('ini', choose);
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
    <>
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
          <Texts value="Sunting Profil" size={16} />
          </View>
        }
        rightComponent={
          <TouchableOpacity
            onPress={save}
            style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Texts value="Simpan" color="#0055b8" />
            <Icon
              name="check"
              color="#0055b8"
              // onPress={() => navigation.dispatch(CommonActions.goBack())}
            />
          </TouchableOpacity>
        }
        containerStyle={{
          backgroundColor: '#fff',
          borderBottomWidth: 0,
        }}
      />
      <ScrollView>

        <View style={{ backgroundColor: 'white', height: 165 }}>
          <Input
            defaultValue={name}
            onChangeText={(val) => setName(val)}
            containerStyle={{ marginTop: 40 }}
            style={{ alignSelf: 'center' }}
            inputContainerStyle={{
              borderBottomWidth: 1,
              borderWidth: 0,
              height: 40,
            }}
            inputStyle={{ textAlign: 'center' }}
            placeholder="Nama Lengkap"
            rightIcon={{ type: 'material-community', name: 'pencil', size: 20 }}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
        <Avatar
          size={150}
          rounded
          source={require('../../assets/img/User.png')}
          onPress={chooseImage}
          containerStyle={{
            zIndex: 1,
            position: 'absolute',
            top: -75,
            borderWidth: 14,
            borderColor: 'white',
          }}
        />
        <Icon name="pencil" style={{ marginLeft: '35%', marginTop: 40 }} />
      </View>

        <View style={{ marginTop: 50 }}>
          <Input
            onChangeText={(val) => setEmail(val)}
            value={email}
            inputContainerStyle={{
              height: 60,
              backgroundColor: 'white',
            }}
            placeholder="Alamat Email"
            rightIcon={{ type: 'material-community', name: 'email', size: 20 }}
          />
          <Input
            onChangeText={(val) => setPhone(val)}
            value={phone}
            keyboardType="phone-pad"
            inputContainerStyle={{
              height: 60,
              backgroundColor: 'white',
            }}
            placeholder="Nomor Ponsel"
            rightIcon={{ type: 'material-community', name: 'phone', size: 20 }}
          />
          <Texts
            value="Ubah Keamanan (Opsional)"
            bold
            style={{ marginBottom: 20, marginLeft: 12 }}
          />
          <Input
            onChangeText={(val) => setPwd(val)}
            inputContainerStyle={{
              height: 60,
              backgroundColor: 'white',
            }}
            placeholder="Ketik Kata Sandi Lama"
            rightIcon={{ type: 'material-community', name: 'lock', size: 20 }}
          />
          <Input
            onChangeText={(val) => setNewPwd(val)}
            containerStyle={{ marginTop: -18 }}
            inputContainerStyle={{
              height: 60,
              backgroundColor: 'white',
            }}
            placeholder="Ketik Kata Sandi Baru"
          />
          <Input
            onChangeText={(val) => setConfirmPwd(val)}
            containerStyle={{ marginTop: -18 }}
            inputContainerStyle={{
              height: 60,
              backgroundColor: 'white',
            }}
            placeholder="Ketik Ulang Kata Sandi"
          />
        </View>
      </ScrollView>
    </>
  );
};

export default AccountEdit;
