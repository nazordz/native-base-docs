/* eslint-disable react-native/no-inline-styles */
import { useNavigation } from '@react-navigation/native';
import React, { useState, Component, useContext } from 'react';
import { Alert, ImageBackground } from 'react-native';
import { Dimensions } from 'react-native';
import { StyleSheet, View, Text } from 'react-native';
import { Badge, Button, Icon, Image } from 'react-native-elements';
import Texts from './Texts';
import NumberFormat from 'react-number-format';
import api from '../helpers/api';
import util from '../helpers/util';
import AppContext from '../AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image';
import CountDown from 'react-native-countdown-component';

const CardComponent = ({
  wishlist,
  size2,
  product,
  flashsale,
  isSelected,
  onPress,
  onAdd,
  onDecerase,
  onRemove,
}) => {
  const { navigate } = useNavigation();
  const [qty, setQty] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { setShowSpinner } = useContext(AppContext);

  const addToWishlist = async (productId) => {
    const isLogin = await AsyncStorage.getItem('token');
    if (!isLogin) {
      return Alert.alert(
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
    } else {
      setShowSpinner(true);
      const addWishlist = await api.addToWishlist(productId);
      util.showToast(addWishlist.messages);
      setIsWishlisted(!isWishlisted);
      setShowSpinner(false);
    }
  };

  const addQty = async () => {
    const isLogin = await AsyncStorage.getItem('token');
    if (!isLogin) {
      return Alert.alert(
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
    } else {
      setQty(qty + 1);
      if (qty === 0) {
        onPress(product.id);
      } else {
        onAdd(product.id);
      }
    }
  };

  const deceraseQty = () => {
    setQty(qty - 1);
    onDecerase(product.id);
  };

  const removeQty = () => {
    // eslint-disable-next-line no-const-assign
    setQty(0);
    onRemove(product.id);
  };

  return (
    <View style={[card.viewCard]}>
      <Image
        source={{ uri: product.base_image.path }}
        transition={false}
        style={{
          resizeMode: 'cover',
          height: 170,
          width: 170,
        }}>
        {product.avail_status == 2 && (
          <View style={{ position: 'absolute', top: 10, left: 10 }}>
            <Badge value="Pre Order" badgeStyle={{ backgroundColor: '#555' }} />
          </View>
        )}
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <Icon
            reverse
            name="heart"
            size={12}
            reverseColor={
              isWishlisted || wishlist.includes(product.id) ? 'red' : 'gray'
            }
            color="white"
            onPress={() => addToWishlist(product.id)}
          />
        </View>
      </Image>
      <NumberFormat
        value={
          flashsale
            ? Number(flashsale.price.inCurrentCurrency.amount).toFixed(0)
            : Number(product.selling_price.amount).toFixed(0)
        }
        displayType={'text'}
        renderText={(value) => (
          <Texts value={value} size={16} color="#509bf2" bold align="center" />
        )}
        thousandSeparator={true}
        prefix={'Rp. '}
      />
      <Text numberOfLines={2} style={[card.name]}>
        {product.name}
      </Text>

      {flashsale && (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 4,
              marginTop: -20,
            }}>
            <Texts value={'Tersedia ' + flashsale.qty} />
            <Texts value={'Terjual ' + flashsale.sold} />
          </View>
          <CountDown
            until={
              new Date(flashsale.end_date).getTime() / 1000 - Date.now() / 1000
            }
            digitStyle={{
              borderWidth: 2,
              borderColor: '#0055b8',
              marginTop: 6,
            }}
            timeToShow={['D', 'H', 'M', 'S']}
            timeLabels={{ d: 'Hari', h: 'Jam', m: 'Menit', s: 'Detik' }}
            digitTxtStyle={{ color: '#0055b8' }}
            timeLabelStyle={{
              color: '#0055b8',
              marginBottom: 10,
              fontWeight: 'bold',
            }}
            size={14}
            showSeparator
          />
        </>
      )}

      {/* {isSelected ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}>
          {qty === 1 ? (
            <Icon
              reverse
              name="trash"
              type="font-awesome-5"
              size={16}
              color="red"
              onPress={removeQty}
            />
          ) : (
            <Icon
              reverse
              name="minus"
              type="font-awesome-5"
              size={16}
              color="red"
              onPress={deceraseQty}
            />
          )}

          <Text style={{ marginTop: 14 }}>{qty}</Text>

          <Icon
            reverse
            name="plus-circle"
            size={16}
            color="#3ECB43"
            onPress={addQty}
          />
        </View>
      ) : (
        <Button
          title="Beli"
          buttonStyle={card.buttonBuyStyle}
          titleStyle={card.buttonTitleStyle}
          containerStyle={card.buttonContainerStyle}
          onPress={() => addQty(product.id)}
        />
      )} */}
    </View>
  );
};

const card = StyleSheet.create({
  viewCard: {
    marginLeft: 17,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
    elevation: 4,
    marginVertical: 6,
    marginHorizontal: 2,
  },
  image: {
    resizeMode: 'cover',
    height: 150,
    width: 175,
  },
  price: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
  },
  name: {
    width: 170,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    height: 40,
    color: 'black',
    paddingHorizontal: 12,
  },
  buttonBuyStyle: {
    marginTop: 10,
    backgroundColor: '#ffcc32',
    borderRadius: 0,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  buttonTitleStyle: {
    fontFamily: 'Montserrat-Bold',
  },
});

export default CardComponent;
