import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import api from '../../helpers/api';

const OTP = ({ route }) => {

    // const [timer, setTimer] = useState(30)
    const { navigate } = useNavigation();
    const [otp, setOtp] = useState('')
    const { phone } = route.params;

    // setInterval(() => setTimer(timer - 1), 1000);

    const cekOTP = async (code) => {
        try {
            const dataOTP = await api.getCheckOTP(phone, code);
            if (dataOTP.status == true) {
                console.log(dataOTP.token)
                navigate('Home')
                try {
                    await AsyncStorage.multiSet(['token', dataOTP.token], ['loggedIn', 'true'])
                    .then((value) => console.log(value))
                } catch (e) {
                    console.log(e)
                }
            }
            console.log(dataOTP)
            console.log(code)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(otp)

    return (
        <View>
            <Image
                style={styles.logo}
                source={require('../../assets/img/logo.png')}
            />
            <Image
                style={styles.logoOTP}
                source={require('../../assets/img/otp.png')}
            />
            <Text style={ styles.textH2 }>
                Verifikasi OTP
            </Text>
            <Text style={ styles.text }>
                Kami mengirimkan kode OTP ke Whatsapp anda
            </Text>

            <OTPInputView
                style={{width: '80%', height: 200, alignSelf: 'center', marginVertical: -60, color: 'black'}}
                pinCount={6}
                // code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                // onCodeChanged = {code => { setOtp({code})}}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled = { (code) => { cekOTP(code) } }
                placeholderTextColor={'black'}
            />

            <Text style={ styles.textResend }>
                Kirim ulang OTP dalam 20 detik
            </Text>

            <Button 
                type="outline"
                title="Login dengan akun lain"
                titleStyle={{ fontFamily: 'Montserrat-Regular', color: 'black' }}
                containerStyle={{ width: '90%', alignSelf: 'center', marginVertical: 20, marginTop: 40 }}
            />
        </View>
    )
}

export default OTP;