/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import NumberFormat from 'react-number-format';
import AppContext from '../../AppContext';
import styles from '../Cart/Style';
import api from '../../helpers/api';

const ConfirmCart = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [infoCoupon, setInfoCoupon] = useState('');
  const [dataCoupon, setDataCoupon] = useState('');
  const [couponButton, setCouponButton] = useState(true);
  const [statusCoupon, setStatusCoupon] = useState(false);
  const [discount, setDiscount] = useState('');
  const { carts, setCarts, setShowSpinner } = useContext(AppContext);
  const { cart } = route.params;

  const useCoupon = async () => {
    setShowSpinner(true);
    const kupon = await api.postDataCoupon(coupon);
    console.log(kupon);
    setInfoCoupon(kupon);
    setDataCoupon(kupon.is_percent);
    if (kupon.id > 1) {
      setStatusCoupon(true);
      setCouponButton(false);
      if (kupon.is_percent === 1) {
        setDiscount((+kupon.value).toFixed(0));
      } else {
        setDiscount(kupon.value.inCurrentCurrency.amount);
      }
    } else {
      setStatusCoupon(false);
      setCouponButton(true);
      setDiscount(kupon);
    }
    setShowSpinner(false);
  };

  const resetCoupon = () => {
    setStatusCoupon(false);
    setCouponButton(true);
    setDiscount('');
    setCoupon('');
  };

  async function fetchData() {
    try {
      const products = JSON.parse(
        (await AsyncStorage.getItem('products')) || '[]',
      ).filter((item) => cart.includes(item.id));
      const dataProduct = products.map((product) => product.id);
      const detailProduct = await api.postDataCart(dataProduct);
      console.log(dataProduct);
      setQty(products.map((product) => product.qty));
      setData(detailProduct);
      //   const detailProduct = await api.getTotalCart(slug);
      //   setData(detailProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = useMemo(() => {
    return data.reduce((prev, product, index) => {
      let price = product.selling_price.inCurrentCurrency.amount;
      if (product.pivot) {
        price = product.pivot.price.inCurrentCurrency.amount;
      }
      return prev + price * carts[index].qty;
    }, 0);
  }, [carts, data]);

  return (
    <>
      <Header
        placement="left"
        leftComponent={
          <Icon
            name="arrow-back"
            type=""
            size={30}
            color="#0068e1"
            onPress={() => navigation.dispatch(CommonActions.goBack())}
          />
        }
        centerComponent={
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 18,
              marginTop: 2,
            }}>
            Konfirmasi Pesanan
          </Text>
        }
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#a3ceff',
          padding: 10,
        }}>
        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16 }}>
          Total Belanja
        </Text>
        <NumberFormat
          value={total}
          displayType={'text'}
          renderText={(value) => (
            <Text
              style={{
                color: '#0055b8',
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
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
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0068e1" />
        </View>
      ) : (
        <ScrollView>
          {data.map((cartData, index) => (
            <View key={cartData.id}>
              <View
                style={{
                  padding: 12,
                  backgroundColor: 'white',
                  flexDirection: 'row',
                }}>
                <Image
                  source={{ uri: cartData.base_image.path }}
                  style={{ width: 100, height: 100 }}
                />

                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <NumberFormat
                      value={
                        cartData.pivot
                          ? Number(
                              cartData.pivot.price.inCurrentCurrency.amount,
                            ).toFixed(0)
                          : Number(cartData.selling_price.amount).toFixed(0)
                      }
                      displayType={'text'}
                      renderText={(value) => (
                        <Text
                          style={{
                            color: '#509bf2',
                            fontFamily: 'Montserrat-Bold',
                            fontSize: 20,
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
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={{
                          marginTop: 10,
                          marginHorizontal: 10,
                          fontFamily: 'Montserrat-Bold',
                        }}>
                        x{carts[index].qty}
                      </Text>
                    </View>
                  </View>
                  <HTML
                    html={cartData.name || '<p></p>'}
                    baseFontStyle={{ fontFamily: 'Montserrat-Regular' }}
                    containerStyle={styles.description}
                    defaultTextProps={{ numberOfLines: 1 }}
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        backgroundColor: '#ebf8ff',
                        paddingRight: 10,
                        paddingVertical: 4,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          marginLeft: 10,
                          color: '#428cc9',
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        Sub-Total
                      </Text>
                      <NumberFormat
                        value={
                          cartData.selling_price.inCurrentCurrency.amount *
                          carts[index].qty
                        }
                        displayType={'text'}
                        renderText={(value) => (
                          <Text
                            style={{
                              color: '#428cc9',
                              fontFamily: 'Montserrat-Bold',
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
                    <View style={{ flexDirection: 'row' }} />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <View>
        <View style={{ padding: 15, backgroundColor: 'white' }}>
          {statusCoupon === 'Sukses' ? (
            <View>
              <Text>Gunakan Kupon</Text>
            </View>
          ) : !statusCoupon ? (
            <>
              <Text>Gunakan Kupon</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  onChangeText={(val) => setCoupon(val)}
                  style={{
                    flex: 1,
                    borderWidth: 2,
                    borderColor: '#f0f0f0',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 0,
                    borderTopRightRadius: 0,
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    paddingLeft: 18,
                    marginRight: -10,
                  }}
                  placeholder="Tulis kupon"
                />
                <Button
                  title="Pakai Kupon"
                  onPress={useCoupon}
                  disabled={!couponButton}
                  buttonStyle={{
                    borderRadius: 0,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    backgroundColor: coupon ? '#fdd83b' : '#ddd',
                    height: 52,
                  }}
                  containerStyle={{ paddingVertical: 4 }}
                />
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                  Kupon Digunakan
                </Text>
                <View
                  style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Icon name="close" size={20} color="red" />
                  <Text
                    onPress={resetCoupon}
                    style={{
                      fontFamily: 'Montserrat-Regular',
                      color: 'red',
                      fontSize: 16,
                    }}>
                    Reset Kupon
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginVertical: 4 }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    color: '#999',
                  }}>
                  Anda mendapatkan potongan belanja senilai{' '}
                  {dataCoupon === 1 ? (
                    `${discount}%`
                  ) : (
                    <NumberFormat
                      value={discount}
                      displayType={'text'}
                      renderText={(value) => (
                        <Text
                          style={{
                            color: '#2ebf5d',
                            fontFamily: 'Montserrat-Regular',
                            fontSize: 16,
                          }}>
                          {' '}
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
                  )}
                </Text>
              </View>
            </>
          )}
          {discount.status === false && (
            <Text
              style={{
                fontFamily: 'Montserrat-Regular',
                fontSize: 16,
                color: 'red',
              }}>
              Kupon tidak berlaku
            </Text>
          )}
        </View>
        <Button
          disabled={loading}
          title="Selanjutnya"
          buttonStyle={{ borderRadius: -1 }}
          onPress={() => navigate('Delivery', { coupon: infoCoupon, cart })}
          // onPress={tes}
        />
      </View>
    </>
  );
};

export default ConfirmCart;
