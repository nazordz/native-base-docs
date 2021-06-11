/* eslint-disable react-native/no-inline-styles */
import React, { Component, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import styles from './Style';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../helpers/api';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import NumberFormat from 'react-number-format';

const MyOrderSelesai = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [dataOrder, setDataOrder] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', async (e) => {
      // Prevent default behavior
      fetchData();
      console.log(e);
    });

    return unsubscribe;
  }, [navigation]);

  async function fetchData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const orderApi = await api.getOrderData(token, 'Selesai');
      setDataOrder(orderApi);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  console.log(dataOrder);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ScrollView>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0068e1" />
          </View>
        ) : (
          <View style={styles.container}>
            {dataOrder.map((order) => (
              <View style={styles.card} key={order.id}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('DetailOrder', { order_id: order.id });
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
                  {order.status === 'completed' ? (
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
              </View>
            ))}
          </View>
        )}
      </ScrollView>

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
            0
          </Text>
        </View>
      </View>
    </>
  );
};

export default MyOrderSelesai;
