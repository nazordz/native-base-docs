/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import NumberFormat from 'react-number-format';
import stylesCart from '../screens/Cart/Style';
import Texts from './Texts';
import HTML from 'react-native-render-html';
import AppContext from '../AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import util from '../helpers/util';
import api from '../helpers/api';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

const CardCartComponent = ({
  cartData,
  index,
  onChecked,
  isChecked,
  onDelete,
  disabled,
}) => {
  const { navigate } = useNavigation();
  const [data, setData] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [checkbox, setCheckbox] = useState(true);
  const { carts, setCarts, setShowSpinner } = useContext(AppContext);

  const onBuy = (productId) => async () => {
    setShowSpinner(true);
    try {
      setSelectedId([...selectedId, productId]);
      await util.addToCart(productId);
      const products = JSON.parse(
        (await AsyncStorage.getItem('products')) || '[]',
      );
      setCarts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const deceraseQty = (productId) => async () => {
    setShowSpinner(true);
    try {
      setSelectedId([...selectedId, productId]);
      await util.deceraseProductCart(productId);
      const products = JSON.parse(
        (await AsyncStorage.getItem('products')) || '[]',
      );
      setCarts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const removeFromCart = () => onDelete(index);

  const deleteSelectedId = (productId, index) => async () => {
    setShowSpinner(true);
    try {
      await util.removeProductCart(productId);
      setSelectedId(selectedId.filter((id) => id !== productId));
      const products = JSON.parse(
        (await AsyncStorage.getItem('products')) || '[]',
      );
      setData(data.filter((item) => item.id !== productId));
      setCarts(products);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const check = (val, id) => {
    if (cartData.avail_status === 1) {
      var type = 'NotPO';
    } else {
      var type = 'PO';
    }
    onChecked(val, id, type);
  };

  useEffect(() => {
    if (disabled) {
      setCheckbox(false);
    }
  }, [cartData.id, disabled]);

  return (
    <View style={stylesCart.container} key={cartData.id}>
      <View style={{ backgroundColor: 'white', padding: 12, borderRadius: 12 }}>
        {disabled && <Texts value="Stok Tidak Mencukupi" color="red" />}
        <View
          style={{
            flexDirection: 'row',
          }}>
          <CheckBox
            value={isChecked}
            onValueChange={(val) => check(val, cartData.id)}
            style={{ marginLeft: -8 }}
            disabled={disabled}
          />
          <TouchableOpacity
            onPress={() => navigate('DetailProduct', { id: cartData.id })}>
            <Image
              source={{ uri: cartData.base_image.path }}
              style={{ width: 100, height: 100 }}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
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
                  <>
                    <Text
                      style={{
                        marginTop: 10,
                        fontFamily: 'Montserrat-Bold',
                        fontSize: 16,
                        color: '#509bf2',
                        flex: 1,
                      }}>
                      {value}
                    </Text>
                  </>
                )}
                thousandSeparator={true}
                prefix={'Rp. '}
              />
              <View style={{ flexDirection: 'row' }}>
                {carts[index] && carts[index].qty === 1 ? (
                  <Icon
                    reverse
                    name="trash"
                    type="font-awesome-5"
                    size={11}
                    color="#ec002e"
                    onPress={removeFromCart}
                  />
                ) : (
                  <Icon
                    reverse
                    name="minus"
                    type="font-awesome-5"
                    size={11}
                    color="#ec002e"
                    onPress={deceraseQty(cartData.id)}
                  />
                )}

                <Text style={{ marginTop: 10, marginHorizontal: 10 }}>
                  {carts[index] && carts[index].qty}
                </Text>

                <Icon
                  reverse
                  name="plus"
                  type="font-awesome-5"
                  size={11}
                  color="#3ECB43"
                  containerStyle={{ marginRight: -10 }}
                  onPress={onBuy(cartData.id)}
                />
              </View>
            </View>
            <HTML
              html={cartData.name || '<p></p>'}
              baseFontStyle={{ fontFamily: 'Montserrat-Regular' }}
              containerStyle={stylesCart.description}
            />
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  backgroundColor: '#ebf8ff',
                  paddingRight: 10,
                }}>
                <NumberFormat
                  value={
                    cartData.selling_price.inCurrentCurrency.amount *
                    ((carts[index] && carts[index].qty) || 1)
                  }
                  displayType={'text'}
                  renderText={(value) => (
                    <>
                      <Text
                        style={{
                          marginTop: 10,
                          marginLeft: 10,
                          color: '#428cc9',
                          fontFamily: 'Montserrat-Regular',
                          flex: 1,
                        }}>
                        Sub-Total
                      </Text>
                      <Text
                        style={{
                          marginTop: 10,
                          color: '#428cc9',
                          fontFamily: 'Montserrat-Bold',
                        }}>
                        {value}
                      </Text>
                    </>
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
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  reverse
                  name="trash"
                  type="font-awesome-5"
                  size={11}
                  color="#ec002e"
                  containerStyle={{ marginRight: -10 }}
                  onPress={removeFromCart}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CardCartComponent;
