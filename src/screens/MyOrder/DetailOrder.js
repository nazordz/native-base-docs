/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Alert } from 'react-native';
import { Badge, Button, Divider, Header, Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import NumberFormat from 'react-number-format';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';

const DetailOrder = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const { order_id } = route.params;
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState([]);

  const chooseImage = async (order_id, image) => {
    Alert.alert(
      null,
      'Unggah bukti pembayaran',
      [
        {
          text: 'Galeri',
          onPress: async () => {
            const choose = await util.imageGalleryLaunch();
            navigate('ConfirmPayment', {
              order_id,
              image,
              data: choose,
            });
          },
        },
        {
          text: 'Kamera',
          onPress: async () => {
            const choose = await util.cameraLaunch();
            console.log(choose);
            navigate('ConfirmPayment', {
              order_id,
              image,
              data: choose,
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const submitConfirmation = async () => {
    Alert.alert(
      'Konfirmasi',
      'Konfrimasi bahwa pesanan telah diterima?',
      [
        {
          text: 'Batal',
          onPress: async () => {
            console.log('Batal');
          },
        },
        {
          text: 'Konfirmasi',
          onPress: async () => {
            const submit = await api.submitConfirmation(order_id);
            if (submit.status == true) {
              navigate('Tabs');
            } else {
              console.log(submit);
              await util.showToast('Terjadi kesalahan');
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  async function fetchData() {
    try {
      const order = await api.getOrderDetail(order_id);
      console.log(order);
      setOrderData(order);
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
            Detail Order
          </Text>
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
        <ScrollView>
          <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: 'white', padding: 10 }}>
              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  color: '#0068e1',
                  fontSize: 22,
                }}>
                {orderData.id}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    color: '#555',
                    fontSize: 16,
                  }}>
                  Tanggal Pesan
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Bold',
                    color: '#aaa',
                    fontSize: 16,
                  }}>
                  {dayjs(orderData.created_at)
                    .locale('id')
                    .format('DD-MMM-YYYY')}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    color: '#555',
                    fontSize: 16,
                  }}>
                  Pilihan Pembayaran
                </Text>
                {orderData.status != 'pending' ? (
                  <Texts value="Sudah Dibayar" bold color="#65cb67" size={16} />
                ) : (
                  <Badge
                    value="Bayar >"
                    status="primary"
                    badgeStyle={{ padding: 5, zIndex: 9 }}
                    onPress={() =>
                      chooseImage(
                        orderData.id,
                        orderData.products[0].product.base_image.path,
                      )
                    }
                    textStyle={{
                      fontFamily: 'Montserrat-Bold',
                      fontSize: 16,
                      alignSelf: 'center',
                    }}
                  />
                )}
              </View>
              <Divider
                style={{
                  backgroundColor: 'gray',
                  marginVertical: 10,
                  borderColor: '#eee',
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-around',
                }}>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Image
                    source={
                      orderData.status == 'pending' ||
                      orderData.status == 'pending_payment'
                        ? require('../../assets/img/order-pay.png')
                        : require('../../assets/img/order-pay2.png')
                    }
                    style={{ resizeMode: 'center', marginVertical: '-90%' }}
                  />
                  <Text style={{ textAlign: 'center' }}>Menunggu</Text>
                  <Text>Pembayaran</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Image
                    source={
                      orderData.status == 'processing' ||
                      orderData.status == 'on_hold'
                        ? require('../../assets/img/order-process.png')
                        : require('../../assets/img/order-process2.png')
                    }
                    style={{ resizeMode: 'center', marginVertical: '-90%' }}
                  />
                  <Text style={{ textAlign: 'center' }}>Memproses</Text>
                  <Text>Pesanan</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Image
                    source={
                      orderData.status == 'otw'
                        ? require('../../assets/img/order-sent.png')
                        : require('../../assets/img/order-sent2.png')
                    }
                    style={{ resizeMode: 'center', marginVertical: '-90%' }}
                  />
                  <Text style={{ textAlign: 'center' }}>Pesanan</Text>
                  <Text>Dikirim</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Image
                    source={
                      orderData.status == 'canceled' ||
                      orderData.status == 'completed' ||
                      orderData.status == 'refunded'
                        ? require('../../assets/img/order-complete.png')
                        : require('../../assets/img/order-complete2.png')
                    }
                    style={{ resizeMode: 'center', marginVertical: '-90%' }}
                  />
                  <Text style={{ textAlign: 'center' }}>Pesanan</Text>
                  <Text>Diterima</Text>
                </View>
              </View>
            </View>

            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
                padding: 10,
              }}>
              Item yang dibelanjakan
            </Text>

            {orderData.products.map((data, index) => (
              <View key={data.product.id}>
                <View
                  style={{
                    padding: 12,
                    backgroundColor: 'white',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={{ uri: data.product.base_image.path }}
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
                        value={Number(
                          data.product.selling_price.amount,
                        ).toFixed(0)}
                        displayType={'text'}
                        renderText={(value) => (
                          <Texts
                            value={value}
                            size={20}
                            color="#509bf2"
                            bold
                            align="center"
                            style={{ marginTop: 10 }}
                          />
                        )}
                        thousandSeparator={true}
                        prefix={'Rp. '}
                      />
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={{
                            marginTop: 10,
                            marginHorizontal: 10,
                            fontFamily: 'Montserrat-Bold',
                          }}>
                          x{data.qty}
                        </Text>
                      </View>
                    </View>
                    <HTML
                      html={data.product.name || '<p></p>'}
                      baseFontStyle={{ fontFamily: 'Montserrat-Regular' }}
                      containerStyle={{
                        color: 'black',
                        fontSize: 14,
                        fontFamily: 'Montserrat-Regular',
                        width: 350,
                        marginVertical: 4,
                      }}
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
                          Subtotal
                        </Text>
                        <NumberFormat
                          value={data.qty * data.product.selling_price.amount}
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
            <View
              style={{
                marginTop: 20,
                backgroundColor: 'white',
                paddingBottom: 20,
              }}>
              <View style={{ backgroundColor: 'white', marginTop: 20 }}>
                <View
                  style={{
                    marginHorizontal: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#eee',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{ fontFamily: 'Montserrat-Regular', color: '#777' }}>
                    Subtotal
                  </Text>
                  <NumberFormat
                    value={(+orderData.sub_total.amount).toFixed(0)}
                    displayType={'text'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: '#777',
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        {value}
                      </Text>
                    )}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                  />
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#eee',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{ fontFamily: 'Montserrat-Regular', color: '#777' }}>
                    Diskon
                  </Text>
                  <NumberFormat
                    value={(+orderData.discount.amount).toFixed(0)}
                    displayType={'text'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: '#777',
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        {value}
                      </Text>
                    )}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                  />
                </View>
                <View
                  style={{
                    marginHorizontal: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#eee',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{ fontFamily: 'Montserrat-Regular', color: '#777' }}>
                    Biaya Kirim
                  </Text>
                  <NumberFormat
                    value={(+orderData.shipping_cost.amount).toFixed(0)}
                    displayType={'text'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: '#777',
                          fontFamily: 'Montserrat-Regular',
                        }}>
                        {value}
                      </Text>
                    )}
                    thousandSeparator={true}
                    prefix={'Rp. '}
                  />
                </View>
                <View
                style={{
                  padding: 30,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: -20,
                }}>
                <Text style={{ fontFamily: 'Montserrat-Bold', color: '#777' }}>
                  Total
                </Text>
                <NumberFormat
                  value={(+orderData.total.amount).toFixed(0)}
                  displayType={'text'}
                  renderText={(value) => (
                    <Text
                      style={{
                        color: '#f66c50',
                        fontFamily: 'Montserrat-Bold',
                      }}>
                      {value}
                    </Text>
                  )}
                  thousandSeparator={true}
                  prefix={'Rp. '}
                />
              </View>
              </View>
              <Divider style={{ marginVertical: 10 }} />
              <View style={{ marginHorizontal: 25 }}>
                <Text style={{ fontFamily: 'Montserrat-Bold', color: '#444' }}>
                  Alamat Pengiriman
                </Text>
                <Text
                  style={{ fontFamily: 'Montserrat-Regular', color: '#777' }}>
                  {orderData.shipping_first_name}{' '}
                  {orderData.customer_phone
                    ? '-' + orderData.customer_phone
                    : ''}
                </Text>
                <Text
                  style={{ fontFamily: 'Montserrat-Regular', color: '#777' }}>
                  {orderData.shipping_address_1}{' '}
                  {orderData.shipping_subdistrict}, {orderData.shipping_city}
                  {', '}
                  {orderData.shipping_state}, {orderData.shipping_country},{' '}
                  {orderData.shipping_zip}{' '}
                </Text>
              </View>
            </View>
            {orderData.status == 'otw' && (
              <View
                style={{
                  padding: 20,
                  backgroundColor: 'white',
                  marginTop: 10,
                }}>
                <Button
                  title="Pesanan Telah Diterima"
                  onPress={submitConfirmation}
                  buttonStyle={{
                    borderRadius: 4,
                    backgroundColor: '#3ECB43',
                  }}
                  titleStyle={{
                    color: 'white',
                    fontFamily: 'Roboto-Regular',
                    fontSize: 16,
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default DetailOrder;
