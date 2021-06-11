/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { Icon, Header } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppContext from '../../AppContext';
import FlatCardComponent from '../../components/FlatCardComponent';
import api from '../../helpers/api';
import util from '../../helpers/util';
import { Image } from 'react-native';
import Texts from '../../components/Texts';

const ListCategory = ({ route, navigation }) => {
  const { navigate } = useNavigation();
  const { slug } = route.params;
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState([]);
  const [wishlistItem, setWishlistItem] = useState([]);
  const { carts, setCarts, setShowSpinner } = useContext(AppContext);

  const [data, setData] = useState({
    id: '',
    slug: '',
    products: [],
  });

  const getWishlistedItem = async () => {
    const isLogin = await AsyncStorage.getItem('token');
    if (isLogin) {
      const getWishlist = await api.getWishlistedItem();
      setWishlistItem(getWishlist);
    }
  };

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

  const deleteSelectedId = (productId) => async () => {
    setShowSpinner(true);
    try {
      await util.deceraseProductCart(productId);
      setSelectedId(selectedId.filter((id) => id !== productId));
      setQty(1);
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

  const fetchData = async () => {
    try {
      getWishlistedItem();
      const categoryData = await api.getCategoryProduct(slug);
      setData(categoryData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(data.products);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                width: 150,
                marginLeft: 10,
                marginTop: 2,
              }}>
              {data.name}
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
      ) : data.products.length < 1 ? (
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            top: '25%',
            alignSelf: 'center',
          }}>
          <Image
            source={require('../../assets/img/product-empty.png')}
            style={{ width: 150, height: 150, marginTop: '100%' }}
          />
        </View>
      ) : (
        <View style={{ marginTop: 10, flex: 1 }}>
          <FlatList
            numColumns={2}
            data={data.products}
            columnWrapperStyle={{ flexDirection: 'row' }}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 8, width: '48%' }}>
                <TouchableOpacity
                  onPress={() => navigate('DetailProduct', { id: item.id })}>
                  <FlatCardComponent
                    wishlist={wishlistItem}
                    key={item.id}
                    image={{ uri: item }}
                    Qty={qty}
                    product={item}
                    flashsale={item.pivot ? item.pivot : []}
                    onPress={onBuy(item.id)}
                    isSelected={selectedId.includes(item.id)}
                    onAdd={onBuy(item.id)}
                    onDecerase={deceraseQty(item.id)}
                    onRemove={deleteSelectedId(item.id)}
                  />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </>
  );
};

export default ListCategory;
