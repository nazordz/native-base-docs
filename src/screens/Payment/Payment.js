/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Dimensions, View, Text } from 'react-native';
import { Header, Icon, Image } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../helpers/api';

const Payment = ({ navigation, route }) => {
  const { navigate, reset } = useNavigation();
  const [paymentLimit, setPaymentLimit] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bank, setBank] = useState([]);
  const {
    cart,
    alamat,
    total,
    grandTotal,
    hargaOngkir,
    courier,
    discount,
    couponCode,
  } = route.params;

  async function getPaymentLimit() {
    const data = await api.getPaymentLimit();
    setPaymentLimit(Number(data.time_limit));
    console.log(data);
  }

  const checkout = async (bank) => {
    Alert.alert(
      'Konfirmasi',
      `Proses Pembelian dengan "${bank.bank_name}"?`,
      [
        {
          text: 'Batal',
          onPress: async () => {
            const products = JSON.parse(
              (await AsyncStorage.getItem('products')) || '[]',
            ).filter((item) => cart.includes(item.id));
            const productId = products.map((product) => product.id);
            const detailProduct = await api.postDataCart(productId);
            const dataProduct = products.map((product, index) => ({
              ...product,
              price:
                detailProduct[index].selling_price.inCurrentCurrency.amount,
            }));
            console.log(dataProduct);
            // const qtyProduct = products.map((product) => product.qty);
            // const productPrice = detailProduct.map((prod) => prod.price.amount);
            // console.log(dataProduct, qtyProduct);
            const dataCheckout = await api.postCheckout(
              alamat,
              total,
              grandTotal,
              hargaOngkir,
              courier,
              discount,
              couponCode,
              dataProduct,
              bank.id,
            );
            console.log(dataCheckout);
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const products = JSON.parse(
              (await AsyncStorage.getItem('products')) || '[]',
            ).filter((item) => cart.includes(item.id));
            const productId = products.map((product) => product.id);
            const detailProduct = await api.postDataCart(productId);
            const dataProduct = products.map((product, index) => ({
              ...product,
              price:
                detailProduct[index].selling_price.inCurrentCurrency.amount,
            }));
            console.log(dataProduct);
            // const qtyProduct = products.map((product) => product.qty);
            // const productPrice = detailProduct.map((prod) => prod.price.amount);
            // console.log(dataProduct, qtyProduct);
            const dataCheckout = await api.postCheckout(
              alamat,
              total,
              grandTotal,
              hargaOngkir,
              courier,
              discount,
              couponCode,
              dataProduct,
              bank.id,
            );
            reset({
              index: 0,
              routes: [
                {
                  name: 'PaymentSuccess',
                  params: { dataCheckout, paymentLimit, bank, cart },
                },
              ],
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  async function fetchData() {
    const getBanks = await api.getBanks();
    console.log(getBanks);
    setBank(getBanks.banks);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    getPaymentLimit();
  }, []);

  console.log(
    alamat,
    total,
    grandTotal,
    hargaOngkir,
    courier,
    discount,
    couponCode,
  );
  return (
    <>
      <Header
        leftComponent={
          <View>
            <Icon
              name="arrow-back"
              type=""
              size={30}
              color="#0068e1"
              onPress={() => navigation.dispatch(CommonActions.goBack())}
            />
          </View>
        }
        centerComponent={
          <View>
            <Text
              style={{
                fontFamily: 'Roboto-Bold',
                fontSize: 18,
              }}>
              Pembayaran
            </Text>
          </View>
        }
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0068e1" />
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Text
            style={{
              textAlign: 'center',
              marginVertical: 10,
              fontFamily: 'Roboto-Regular',
              fontSize: 16,
            }}>
            Pilihan Pembayaran
          </Text>
          {bank.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => checkout(item)}
              style={{
                margin: 10,
                elevation: 7,
                borderRadius: 10,
                backgroundColor: 'white',
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <View>
                  <Text
                    style={{
                      fontFamily: 'Roboto-Regular',
                      fontSize: 16,
                    }}>
                    Transfer ke Bank {item.bank_name}
                  </Text>
                  <Image
                    source={{ uri: item.logo.path }}
                    style={{ width: 200, height: 60 }}
                  />
                </View>
                <View>
                  <Icon
                    name="arrow-right-circle-outline"
                    type="material-community"
                    size={30}
                    color="gray"
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={() => checkout({ bank_name: 'Xendit', id: 0 })}
            style={{
              margin: 10,
              elevation: 7,
              borderRadius: 10,
              backgroundColor: 'white',
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}>
              <View>
                <Text
                  style={{
                    fontFamily: 'Roboto-Regular',
                    fontSize: 16,
                  }}>
                  Bayar Melalui Payment Gateway Xendit
                </Text>
                <Image
                  source={require('../../assets/img/xendit.png')}
                  style={{ width: 225, height: 60 }}
                />
              </View>
              <View>
                <Icon
                  name="arrow-right-circle-outline"
                  type="material-community"
                  size={30}
                  color="gray"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Payment;
