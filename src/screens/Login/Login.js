import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Hr from 'react-native-hr-component';
import { Button, ThemeProvider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import styles from './Style';
import axios from 'axios';
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
} from 'react-native';
import api from '../../helpers/api';
import util from '../../helpers/util';

const Separator = (props) => <View style={styles.separator} />;

const Login = () => {
  const { navigate, reset } = useNavigation();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [user, setUser] = useState({});

  const googleConfig = () => {
    GoogleSignin.configure({
      webClientId:
        '416903553700-dqckegi4qipi1nn32dalcoguvn1g40qo.apps.googleusercontent.com',
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // iosClientId: '', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  };

  // const isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   if (isSignedIn) {
  //     getCurrentUserInfo();
  //   } else {
  //     console.log('Please Login');
  //   }
  // };

  // const getCurrentUserInfo = async () => {
  //   try {
  //     const userInfo = await GoogleSignin.signInSilently();
  //     console.log(userInfo);
  //     setUser(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_REQUIRED) {
  //       alert('User has not signed in yet');
  //       console.log('User has not signed in yet');
  //     } else {
  //       alert("Something went wrong. Unable to get user's info");
  //       console.log("Something went wrong. Unable to get user's info");
  //     }
  //   }
  // };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const registerData = await api.postLoginGoogle(userInfo.user);
      console.log(registerData)

      if (registerData.status == true) {
        await AsyncStorage.setItem('token', registerData.token);
        reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
        console.log(registerData);
        setUser(userInfo);
      }
    } catch (error) {
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };

  // const signOut = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     setUser({}); // Remember to remove the user from your app's state as well
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    googleConfig();
  }, []);

  const loggedIn = async () => {
    setLoading(true);
    if (email == '' || pwd == '') {
      setSubmitted(true);
      util.showToast('Mohon lengkapi form login!');
    }
    try {
      const loginData = await api.postLogin(email, pwd);

      if (loginData.status == true) {
        await AsyncStorage.multiSet([
          ['token', loginData.token],
          ['email', email],
        ]).then((value) => console.log(value));
        reset({
          index: 0,
          routes: [{ name: 'Tabs' }],
        });
      } else if (loginData.status == false) {
        util.showToast(loginData.message);
      }
      setLoading(false);
      console.log(loginData);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
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
            styles.mt30,
          ]}>
          Masuk ke Akun Anda
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.mt10,
            { borderColor: submitted && !email ? 'red' : '#DCD9D5' },
          ]}
          placeholder="Email Anda"
          onChangeText={(val) => setEmail(val)}
        />
        <TextInput
          style={[
            styles.input,
            styles.mt10,
            { borderColor: submitted && !pwd ? 'red' : '#DCD9D5' },
          ]}
          placeholder="Password Anda"
          onChangeText={(val) => setPwd(val)}
          secureTextEntry
        />
        <Button
          title="Login"
          buttonStyle={StyleSheet.flatten([
            styles.bgWarning,
            styles.marginVertical10,
          ])}
          onPress={loggedIn}
          loading={loading}
          disabled={loading}
        />
        <Hr
          lineColor="#DCD9D5"
          width={1}
          text="Atau"
          hrStyles={styles.marginVertical20}
        />
        <Button
          title="Masuk dengan akun Google"
          buttonStyle={{ backgroundColor: '#e24929' }}
          onPress={signIn}
        />
        <Text style={[styles.center, styles.fontSize14, styles.mt30]}>
          Belum punya Akun?
        </Text>
        <Button
          title="Daftar Sekarang"
          type="clear"
          titleStyle={{ color: '#0055b8', fontFamily: 'Montserrat-Regular' }}
          // buttonStyle={StyleSheet.flatten([styles.borderWidth2, styles.colorWarning, styles.marginVertical20])}
          onPress={() => navigate('Register')}
        />
        <Button
          title="Lewati halaman login >"
          type="clear"
          titleStyle={{
            textDecorationLine: 'underline',
            color: 'gray',
            fontFamily: 'Montserrat-Bold',
          }}
          onPress={() => navigate('Tabs')}
        />
      </ScrollView>
    </>
  );
};

export default Login;
