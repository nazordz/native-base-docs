import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../helpers/api';
import styles from './Style';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

const Separator = () => <View style={styles.separator} />;

const Register = () => {
  const { navigate, reset } = useNavigation();
  const [loadBtn, setLoadBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  const submitRegister = async () => {
    if ((name == '', phone == '', email == '', pwd == '', pwdConfirm == '')) {
      setSubmitted(true);
    }

    if (pwd !== pwdConfirm) {
      Alert.alert('Warning!', 'Password Tidak Sama!');
    }

    try {
      const registerData = await api.postRegister(
        name,
        phone,
        email,
        pwd,
        pwdConfirm,
      );
      console.log(registerData);
      if (registerData.status == true) {
        try {
          await AsyncStorage.multiSet([
            'token',
            registerData.token,
          ]).then((value) => console.log(value));
          reset({
            index: 0,
            routes: [{ name: 'Tabs' }],
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const isLogin = async () => {
  //   try {
  //     const login = await AsyncStorage.getItem('token')
  //     if (login == null) {
  //       navigate('Home')
  //     } else {
  //       setLoading(false)
  //     }
  //   } catch(e) {
  //     console.log(e)
  //   }
  // }

  // useEffect(() => {
  //   isLogin();
  // }, []);

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0068e1" />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <Image
            style={styles.logo}
            source={require('../../assets/img/logo3.png')}
          />

          <Text
            style={[
              styles.center,
              styles.textRed,
              styles.fontSize20,
              styles.fontBold,
            ]}>
            Isi data lengkap anda
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.marginTop,
              { borderColor: submitted && !name ? 'red' : '#DCD9D5' },
            ]}
            placeholder="Nama Lengkap"
            onChangeText={(val) => setName(val)}
          />

          <TextInput
            style={[
              styles.input,
              styles.marginTop,
              { borderColor: submitted && !phone ? 'red' : '#DCD9D5' },
            ]}
            placeholder="No. Ponsel Anda"
            onChangeText={(val) => setPhone(val)}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[
              styles.input,
              styles.marginTop,
              { borderColor: submitted && !email ? 'red' : '#DCD9D5' },
            ]}
            placeholder="Alamat Email"
            onChangeText={(val) => setEmail(val)}
          />

          <TextInput
            style={[
              styles.input,
              styles.marginTop,
              { borderColor: submitted && !pwd ? 'red' : '#DCD9D5' },
            ]}
            placeholder="Sandi"
            onChangeText={(val) => setPwd(val)}
            secureTextEntry
          />

          <TextInput
            style={[
              styles.input,
              styles.marginTop,
              { borderColor: submitted && !pwdConfirm ? 'red' : '#DCD9D5' },
            ]}
            placeholder="Konfirmasi Sandi"
            onChangeText={(val) => setPwdConfirm(val)}
            secureTextEntry
          />

          <Button
            title="Daftar"
            buttonStyle={StyleSheet.flatten([
              styles.bgWarning,
              styles.marginVertical10,
            ])}
            onPress={submitRegister}
            loading={loading}
            disabled={loading}
          />

          <Separator />

          <Text style={[styles.center, styles.fontSize14]}>
            Sudah punya Akun?
          </Text>

          <Button
            title="Login"
            type="clear"
            titleStyle={{ color: '#0068e1' }}
            buttonStyle={StyleSheet.flatten([
              styles.borderWidth2,
              styles.colorWarning,
              styles.marginVertical20,
              styles.bgColorWhite,
            ])}
            onPress={() => navigate('Login')}
          />
        </ScrollView>
      )}
    </>
  );
};

export default Register;
