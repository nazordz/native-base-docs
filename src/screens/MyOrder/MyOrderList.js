/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import styles from './Style';
import api from '../../helpers/api';
import NumberFormat from 'react-number-format';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import { Button } from 'react-native-elements';
import util from '../../helpers/util';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Texts from '../../components/Texts';
import { Dimensions } from 'react-native';

const MyOrderProses = ({ navigation, status }) => {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [dataOrder, setDataOrder] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [fetchData, navigation, isFocused]);

  const chooseImage = async (order_id, image, fullpayment) => {
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
              fullpayment: fullpayment ? true : false,
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
              fullpayment: fullpayment ? true : false,
            });
          },
        },
      ],
      { cancelable: true },
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const orderApi = await api.getOrderData(token, status);
      setDataOrder(orderApi);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchData();
    setRefresh(false);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            alignContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#0068e1" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              style={{ zIndex: 1 }}
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }
          style={{ flex: 1, flexGrow: 1 }}
          contentContainerStyle={{
            minHeight: 250,
          }}>
          <View style={styles.container}>
            {dataOrder.order.length < 1 ? (
              <View
                style={{
                  position: 'absolute',
                  top: '40%',
                  zIndex: 99,
                  alignSelf: 'center',
                }}>
                <Image
                  style={{ width: 200, height: 200, zIndex: 1111 }}
                  source={require('../../assets/img/order-empty.png')}
                />
              </View>
            ) : (
              dataOrder.order.map((order) => (
                <View style={styles.card} key={order.id}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('DetailOrder', {
                        order_id: order.id,
                      });
                    }}>
                    <Text style={styles.textCode}>{order.id}</Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          marginVertical: 3,
                        }}>
                        Diorder
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Bold',
                          marginVertical: 3,
                          color: 'gray',
                        }}>
                        {dayjs(order.created_at)
                          .locale('id')
                          .format('DD-MMM-YYYY')}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#fdefff',
                        marginHorizontal: -5,
                        paddingHorizontal: 5,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Regular',
                          marginVertical: 3,
                        }}>
                        Total
                      </Text>
                      <NumberFormat
                        value={order.total.inCurrentCurrency.amount}
                        displayType={'text'}
                        renderText={(value) => (
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Bold',
                              marginVertical: 3,
                              color: '#509bf2',
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
                    {order.order_type == 2 && (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          backgroundColor: '#fdefff',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Regular',
                            marginVertical: 3,
                          }}>
                          Total DP
                        </Text>
                        <NumberFormat
                          value={Number(
                            order.products[0].product.dp_po,
                          ).toFixed(0)}
                          displayType={'text'}
                          renderText={(value) => (
                            <Text
                              style={{
                                fontFamily: 'Montserrat-Bold',
                                marginVertical: 3,
                                color: '#e90830',
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
                    )}
                    {order.order_type == 2 &&
                    order.downpayment_status == 1 &&
                    order.status === 'pending' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#ec1e25',
                        }}>
                        Pembayaran DP Diterima
                      </Text>
                    ) : order.status === 'pending' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#ec1e25',
                        }}>
                        Menunggu Pembayaran
                      </Text>
                    ) : order.status === 'processing' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#0ac1f2',
                        }}>
                        Sedang di proses
                      </Text>
                    ) : order.status === 'completed' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#0ac1f2',
                        }}>
                        Selesai
                      </Text>
                    ) : order.status === 'otw' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#0ac1f2',
                        }}>
                        Sedang Dikirim
                      </Text>
                    ) : order.status === 'completed' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#0ac1f2',
                        }}>
                        Selesai
                      </Text>
                    ) : order.status === 'refunded' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#0ac1f2',
                        }}>
                        Refunded
                      </Text>
                    ) : order.status === 'canceled' ||
                      order.status === 'completed' ? (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#0ac1f2',
                        }}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Italic',
                          marginVertical: 3,
                          color: '#0ac1f2',
                        }}>
                        On Hold
                      </Text>
                    )}
                  </TouchableOpacity>
                  {order.order_type == 2 &&
                  order.avail_status == 1 &&
                  order.downpayment_status == 1 ? (
                    <Button
                      title="Kirim Bukti Pelunasan"
                      onPress={() =>
                        chooseImage(
                          order.id,
                          order.products[0].product.base_image.path,
                          true,
                        )
                      }
                      buttonStyle={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: '#0068e1',
                      }}
                      titleStyle={{
                        color: 'white',
                        fontFamily: 'Roboto-Regular',
                        fontSize: 11,
                      }}
                    />
                  ) : order.order_type == 2 &&
                    order.status != 'completed' &&
                    order.status != 'canceled' &&
                    order.status != 'refunded' &&
                    order.status === 'pending' ? (
                    <Button
                      title="Kirim Bukti Bayar DP"
                      onPress={() =>
                        chooseImage(
                          order.id,
                          order.products[0].product.base_image.path,
                        )
                      }
                      buttonStyle={{
                        borderRadius: 4,
                        padding: 8,
                        backgroundColor: '#0068e1',
                      }}
                      titleStyle={{
                        color: 'white',
                        fontFamily: 'Roboto-Regular',
                        fontSize: 11,
                      }}
                    />
                  ) : (
                    order.order_type == 1 &&
                    order.status != 'otw' &&
                    order.status != 'processing' &&
                    order.status != 'completed' &&
                    order.status != 'canceled' &&
                    order.status != 'refunded' && (
                      <Button
                        title="Kirim Bukti Bayar"
                        onPress={() =>
                          chooseImage(
                            order.id,
                            order.products[0].product.base_image.path,
                          )
                        }
                        buttonStyle={{
                          borderRadius: 4,
                          padding: 8,
                          backgroundColor: '#0068e1',
                        }}
                        titleStyle={{
                          color: 'white',
                          fontFamily: 'Roboto-Regular',
                          fontSize: 11,
                        }}
                      />
                    )
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}

      <View style={styles.preOrder}>
        <Text
          style={{
            alignSelf: 'center',
            fontFamily: 'Montserrat-Bold',
            color: 'gray',
          }}>
          Pre-Order Saya
        </Text>

        <View style={styles.countPO}>
          <Text style={{ fontFamily: 'Montserrat-Bold', color: 'white' }}>
            {dataOrder.po}
          </Text>
        </View>
      </View>
    </>
  );
};
export default MyOrderProses;
