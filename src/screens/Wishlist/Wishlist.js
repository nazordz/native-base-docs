/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header, Icon, Tile } from 'react-native-elements';
import AppContext from '../../AppContext';
import FlatCardComponent from '../../components/FlatCardComponent';
import api from '../../helpers/api';
import util from '../../helpers/util';
import { ScrollView } from 'react-native';
import { RefreshControl } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native';
import Texts from '../../components/Texts';
import { Dimensions } from 'react-native';

const Wishlist = ({ route, navigation }) => {
  const { navigate } = useNavigation();
  const [qty, setQty] = useState(1);
  const [selectedId, setSelectedId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [wishlistItem, setWishlistItem] = useState([]);
  const { carts, setCarts, setShowSpinner } = useContext(AppContext);

  const [data, setData] = useState({
    id: '',
    slug: '',
    product: [],
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
    setLoading(true);
    try {
      const productData = await api.wishlist();
      setData(productData);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchData();
    setRefresh(false);
  }, []);

  console.log(data);

  useEffect(() => {
    getWishlistedItem();
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
              Wishlist
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
        <ScrollView
          refreshControl={
            <RefreshControl
              style={{ zIndex: 999, paddingTop: 100 }}
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }>
          <Image
            style={{ height: 150, width: Dimensions.get('screen').width }}
            source={require('../../assets/img/wishlist.png')}
          />
          <SafeAreaView style={{ flex: 1 }}>
            {data.length < 1 ? (
              <View
                style={{
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: 150,
                }}>
                <Image
                  source={require('../../assets/img/wishlist-empty.png')}
                  style={{ width: 150, height: 150 }}
                />
              </View>
            ) : (
              <FlatList
                numColumns={2}
                data={data}
                columnWrapperStyle={{ flexDirection: 'row' }}
                renderItem={({ item }) => (
                  <View style={{ paddingVertical: 8 }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigate('DetailProduct', { id: item.id })
                      }>
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
            )}
          </SafeAreaView>
        </ScrollView>
      )}
    </>
  );
};

export default Wishlist;
