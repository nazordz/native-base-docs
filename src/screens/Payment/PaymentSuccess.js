/* eslint-disable react-native/no-inline-styles */
import Clipboard from '@react-native-community/clipboard';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Image, ScrollView } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import CountDown from 'react-native-countdown-component';
import NumberFormat from 'react-number-format';
import Texts from '../../components/Texts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../AppContext';
import util from '../../helpers/util';

const PaymentSuccess = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const { dataCheckout, paymentLimit, bank, cart } = route.params;
  const { carts, setCarts } = useContext(AppContext);

  console.log('ini', cart);
  const removeCart = useCallback(async () => {
    try {
      cart.map(async (item) => {
        await util.removeProductCart(item);
        const products = JSON.parse(
          (await AsyncStorage.getItem('products')) || '[]',
        );
        setCarts(products);
      });
    } catch (error) {
      console.log(error);
    }
  }, [cart, setCarts]);

  useEffect(() => {
    removeCart();
  }, [removeCart]);

  return (
    <>
      <Header
        leftComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="arrow-back"
              type=""
              size={30}
              color="#0068e1"
              onPress={() => navigation.dispatch(CommonActions.goBack())}
            />

            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
                width: 250,
                marginLeft: 10,
                marginTop: 2,
              }}>
              Pemesanan Berhasil
            </Text>
          </View>
        }
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView>
          <Image
            source={require('../../assets/img/completeorder.png')}
            style={{
              width: 150,
              height: 150,
              marginVertical: 50,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 18,
              textAlign: 'center',
            }}>
            No. Pesanan Anda
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              fontSize: 24,
              textAlign: 'center',
              marginBottom: 20,
            }}>
            {dataCheckout.order.id}
          </Text>
          <View style={{ elevation: 10, marginHorizontal: 20 }}>
            <View style={{ backgroundColor: '#eee' }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 16,
                  textAlign: 'center',
                  padding: 10,
                }}>
                Segera lakukan pembayaran sebelum batas waktu pembayaran
                berakhir.
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                Total Pembayaran
              </Text>
              <NumberFormat
                value={dataCheckout.order.total.amount}
                displayType={'text'}
                renderText={(value) => (
                  <Text
                    style={{
                      color: '#509bf2',
                      fontFamily: 'Montserrat-Regular',
                      fontSize: 16,
                      // width: '100%',
                    }}>
                    {value}
                  </Text>
                )}
                thousandSeparator={true}
                prefix={'Rp. '}
                style={{
                  marginTop: 10,
                  color: '#428cc9',
                  fontFamily: 'Montserrat-Bold',
                }}
              />
            </View>
            <View
              style={{
                backgroundColor: 'white',
                padding: 12,
              }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 16,
                  textAlign: 'center',
                }}>
                Batas Pembayaran
              </Text>
              <CountDown
                until={paymentLimit * 3600}
                digitStyle={{ backgroundColor: 'transparent' }}
                timeToShow={['H', 'M', 'S']}
                timeLabels={{ h: 'Jam', m: 'Menit', s: 'Detik' }}
                digitTxtStyle={{ color: '#0068e1' }}
                size={20}
              />
            </View>
          </View>
          {dataCheckout.payment_gateway ? (
            <Button
              title="Bayar Sekarang"
              onPress={() => navigate('Xendit', { id: dataCheckout.order.id })}
              containerStyle={{
                marginTop: 30,
                marginBottom: -20,
                width: '90%',
                alignSelf: 'center',
              }}
              titleStyle={{ color: 'white', fontFamily: 'Roboto-Regular' }}
            />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Regular',
                  fontSize: 16,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                No. Virtual Account
              </Text>
              <Image
                source={{ uri: bank.files[0].path }}
                style={{ width: 200, height: 60 }}
              />
              <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 24 }}>
                {bank.no_account}
              </Text>
              <TouchableOpacity
                onPress={() => Clipboard.setString(bank.no_account)}>
                <Texts
                  value="Salin"
                  size={14}
                  style={{ textDecorationLine: 'underline' }}
                  color="#4C8BF5"
                />
              </TouchableOpacity>
            </View>
          )}

          <Button
            type="outline"
            title="Kembali ke Home"
            onPress={() => navigation.replace('Tabs')}
            containerStyle={{
              backgroundColor: 'white',
              borderWidth: 2,
              borderColor: '#0068e1',
              marginVertical: 30,
              width: '90%',
              alignSelf: 'center',
            }}
            titleStyle={{ color: '#0068e1', fontFamily: 'Montserrat-Regular' }}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default PaymentSuccess;
