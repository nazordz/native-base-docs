/* eslint-disable react-native/no-inline-styles */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View, Text, Image, ActivityIndicator, Alert } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import NumberFormat from 'react-number-format';
import AppContext from '../../AppContext';
import api from '../../helpers/api';
import styles from './Style';
import util from '../../helpers/util';
import { useNavigation } from '@react-navigation/native';
import Texts from '../../components/Texts';
import CardCartComponent from '../../components/CardCartComponent';
import { RefreshControl } from 'react-native';

const Cart = () => {
  const { navigate } = useNavigation();
  const [data, setData] = useState([]);
  const [qty, setQty] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const { carts, setCarts, setShowSpinner } = useContext(AppContext);

  const onChecked = (val, id, type) => {
    console.log(type);
    if (type == 'PO') {
      if (selectedCartIds.includes(id)) {
        setSelectedCartIds([]);
      } else {
        setSelectedCartIds([id]);
      }
    } else {
      const cartPoIds = [];
      data.forEach((item) => {
        console.log(item.id, 'avail');
        if (item.avail_status === 2) {
          cartPoIds.push(item.id);
        }
      });

      console.log(cartPoIds, 'cart po');

      const cartIds = selectedCartIds.filter(
        (item) => !cartPoIds.includes(item),
      );

      console.log(cartIds);
      if (cartIds.includes(id)) {
        console.log(
          cartIds.filter((item) => {
            item !== id;
          }),
        );
        setSelectedCartIds(cartIds.filter((item) => item !== id));
      } else {
        setSelectedCartIds([...cartIds, id]);
      }
    }
  };

  console.log(selectedCartIds);

  const goToConfirm = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      navigate('ConfirmCart', {
        cart: selectedCartIds,
      });
    } else {
      Alert.alert(
        'Warning!',
        'Mohon login terlebih dahulu!',
        [
          {
            text: 'Batal',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Login',
            onPress: () => {
              navigate('Login');
            },
          },
        ],
        { cancelable: true },
      );
    }
  };

  const deleteFromCart = (index) => {
    const product = data[index];
    Alert.alert(
      'Konfirmasi',
      `Hapus ${product.name} dari keranjang?`,
      [
        {
          text: 'Batal',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            setShowSpinner(true);
            try {
              await util.removeProductCart(product.id);
              setSelectedId(selectedId.filter((id) => id !== product.id));
              const products = JSON.parse(
                (await AsyncStorage.getItem('products')) || '[]',
              );
              setData(data.filter((item) => item.id !== product.id));
              setCarts(products);
            } catch (error) {
              console.log(error);
            } finally {
              setShowSpinner(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  async function fetchData() {
    try {
      const products = JSON.parse(
        (await AsyncStorage.getItem('products')) || '[]',
      );
      const dataProduct = products.map((product) => product.id);
      const detailProduct = await api.postDataCart(dataProduct);
      console.log(detailProduct, 'asssssss');
      setQty(products.map((product) => product.qty));
      setData(detailProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  console.log(carts);

  const total = useMemo(() => {
    return data.reduce((prev, product, index) => {
      let price = product.selling_price.inCurrentCurrency.amount;
      if (product.pivot) {
        price = product.pivot.price.inCurrentCurrency.amount;
      }
      return prev + price * ((carts[index] && carts[index].qty) || 1);
    }, 0);
  }, [carts, data]);

  // console.log(data);

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchData();
    setRefresh(false);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 20,
          }}>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 18,
              marginLeft: 10,
              marginTop: 2,
            }}>
            Keranjang
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'flex-end',
              marginRight: 14,
            }}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 20,
                width: 60,
                alignSelf: 'center',
                color: '#0055b8',
              }}>
              Total
            </Text>

            <NumberFormat
              value={total}
              displayType={'text'}
              renderText={(value) => (
                <Text
                  style={{
                    alignSelf: 'center',
                    color: '#0055b8',
                    fontFamily: 'Montserrat-Regular',
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
        </View>
      </View>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          }>
          {data.filter((item) => item.avail_status === 1).length > 0 && (
            <Texts
              value="Produk Ready"
              bold
              size={20}
              style={{
                marginVertical: 6,
                marginHorizontal: 20,
                marginBottom: -4,
              }}
            />
          )}
          {data
            .filter((item) => item.avail_status === 1)
            .map((cartData, index) => (
              <CardCartComponent
                key={cartData.id}
                cartData={cartData}
                index={carts.findIndex((item) => item.id == cartData.id)}
                selectedCart={selectedCartIds}
                isChecked={selectedCartIds.includes(cartData.id)}
                onChecked={onChecked}
                onDelete={deleteFromCart}
                disabled={
                  cartData.qty && carts[index].qty > cartData.qty ? true : false
                }
              />
            ))}
          {data.filter((item) => item.avail_status === 2).length > 0 && (
            <Texts
              value="Produk Pre Order"
              bold
              size={20}
              style={{
                marginVertical: 6,
                marginHorizontal: 20,
                marginBottom: -4,
                marginTop: -4,
              }}
            />
          )}
          {data
            .filter((item) => item.avail_status === 2)
            .map((cartData, index) => (
              <CardCartComponent
                cartData={cartData}
                index={carts.findIndex((item) => item.id == cartData.id)}
                key={cartData.id}
                selectedCart={selectedCartIds}
                isChecked={selectedCartIds.includes(cartData.id)}
                onChecked={onChecked}
                onDelete={deleteFromCart}
                disabled={
                  cartData.qty && carts[index].qty > cartData.qty ? true : false
                }
              />
            ))}
          <View>
            <Button
              title="Lanjutkan Transaksi"
              buttonStyle={{ backgroundColor: '#0068e1', marginHorizontal: 10 }}
              onPress={goToConfirm}
              disabled={selectedCartIds.length > 0 ? false : true}
            />
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default Cart;
