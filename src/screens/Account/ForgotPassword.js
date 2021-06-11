/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import { View, Text } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';
import styles from './style';

const ForgotPassword = () => {
  const { navigate } = useNavigation();
  const [email, setEmail] = useState('');

  const submit = async () => {
    if (email == '') {
      return await util.showToast('Mohon lengkapi kolom email');
    }
    const forgot = await api.forgotPassword(email);
    if (forgot.status) {
      await util.showToast(forgot.message);
      navigate('Login');
    } else {
      await util.showToast(forgot.message);
    }
    console.log(forgot);
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <Image
        style={styles.logo}
        source={require('../../assets/img/Group21.png')}
      />
      <View style={{ padding: 20 }}>
        <Texts
          value="Reset Kata Sandi"
          color="#FE3B00"
          align="center"
          bold
          size={22}
        />
        <Texts
          value="Masukkan email akun Anda untuk menerima tautan untuk menyetel ulang kata sandi."
          align="center"
          style={{ marginVertical: 10 }}
        />
        <Input
          placeholder="Alamat Email"
          rightIcon={<Icon name="email" size={24} color="black" />}
          onChangeText={(val) => setEmail(val)}
          inputContainerStyle={{ height: 60 }}
          containerStyle={{ marginTop: 20, paddingHorizontal: -20 }}
        />
        <TouchableOpacity onPress={submit}>
          <LinearGradient
            colors={['#FE870F', '#FE3B07']}
            style={styles.linearGradient}>
            <Text style={styles.buttonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Button
          title="Kembali ke Halaman Login"
          type="outline"
          buttonStyle={{ borderColor: '#FE3B07', height: 60 }}
          titleStyle={{ color: '#FE3B07' }}
          onPress={() => navigate('Login')}
        />
      </View>
    </View>
  );
};

export default ForgotPassword;
