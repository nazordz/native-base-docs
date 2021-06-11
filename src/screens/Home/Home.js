/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  Component,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Hr from 'react-native-hr-component';
import { Icon, Image as Image2 } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import CardComponent from '../../components/CardComponent';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './Style';
import api from '../../helpers/api';
import util from '../../helpers/util';
import AppContext from '../../AppContext';
import Header from '../../components/Header';
import { RefreshControl } from 'react-native';
import { BackHandler } from 'react-native';
import FastImage from 'react-native-fast-image';
import CountDown from 'react-native-countdown-component';

const Card = () => {
  return (
    <>
      <View style={[styles.cardView]}>
        <View style={{ position: 'absolute', top: 0, right: 0 }}>
          <Image2
            source={require('../../assets/img/home2.png')}
            style={styles.image2}
          />
        </View>

        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Montserrat-Bold',
            color: '#fed73d',
          }}>
          Lihat
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontFamily: 'Montserrat-Bold',
            color: '#fff',
          }}>
          Promo Terkini
        </Text>
      </View>
    </>
  );
};

const Home = () => {
  const { navigate, dangerouslyGetState } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedId, setSelectedId] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();
  const backClickCount = useRef(0);
  const [wishlistItem, setWishlistItem] = useState([]);
  const { setCarts, setShowSpinner } = useContext(AppContext);

  // Set Value From Axios
  const [data, setData] = useState({
    product: [],
    banner: [],
    latest: [],
    topcategory: [],
    flashsale: [],
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

  async function fetchData() {
    try {
      const homeData = await api.getHomeData();
      setData(homeData);
      console.log(homeData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await getWishlistedItem();
    await fetchData();
    setRefresh(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    getWishlistedItem();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const { index, routes } = dangerouslyGetState();
        const screenName = routes[index].name;
        console.log(screenName, 'ini screen name', index);
        if (screenName === 'Tabs' && isFocused) {
          backClickCount.current += 1;
          util.showToast('Tekan sekali lagi untuk keluar');
          setTimeout(() => {
            backClickCount.current = 0;
          }, 2000);
          if (backClickCount.current === 2) {
            BackHandler.exitApp();
          }
          return true;
        }
        return false;
      },
    );
    return () => backHandler.remove();
  }, [dangerouslyGetState, isFocused]);

  return (
    <>
      <Header />
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0055b8" />
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
          {data.banner.length > 0 && (
            <SliderBox
              images={data.banner.map((banner) => banner.path)}
              sliderBoxHeight={175}
              dotColor="#fb050a"
              autoplay
              cicrleLoop
            />
          )}

          {data.flashsale.length &&
            data.flashsale.map((dataku) => (
              <>
                <View
                  key={dataku.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 12,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="flash-outline"
                      size={22}
                      color="#0055b8"
                      containerStyle={{ marginLeft: 14 }}
                      onPress={async () =>
                        console.log(await AsyncStorage.getItem('token'))
                      }
                    />
                    <Text
                      style={{
                        fontSize: 20,
                        color: '#0055b8',
                        fontFamily: 'Montserrat-SemiBold',
                      }}>
                      {' '}
                      {dataku.campaign_name}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: -10 }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {dataku.products.map((product) => (
                      <View key={product.id}>
                        <TouchableOpacity
                          onPress={() =>
                            navigate('DetailProduct', { id: product.id })
                          }>
                          <CardComponent
                            wishlist={wishlistItem}
                            key={product.id}
                            image={{ uri: product }}
                            Qty={qty}
                            product={product}
                            flashsale={product.pivot ? product.pivot : []}
                            onPress={onBuy(product.id)}
                            isSelected={selectedId.includes(product.id)}
                            onAdd={onBuy(product.id)}
                            onDecerase={deceraseQty(product.id)}
                            onRemove={deleteSelectedId(product.id)}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </>
            ))}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 20,
                color: '#0055b8',
                fontFamily: 'Montserrat-SemiBold',
                marginLeft: 16,
              }}>
              Terbaru
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.latest.map((dataku) => (
              <View key={dataku.id}>
                <TouchableOpacity
                  onPress={() => navigate('DetailProduct', { id: dataku.id })}>
                  <CardComponent
                    wishlist={wishlistItem}
                    key={dataku.id}
                    image={{ uri: dataku }}
                    Qty={qty}
                    product={dataku}
                    onPress={onBuy(dataku.id)}
                    isSelected={selectedId.includes(dataku.id)}
                    onAdd={onBuy(dataku.id)}
                    onDecerase={deceraseQty(dataku.id)}
                    onRemove={deleteSelectedId(dataku.id)}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Icon
              name="trophy"
              size={22}
              color="#0055b8"
              containerStyle={{ marginLeft: 14 }}
              onPress={async () =>
                console.log(await AsyncStorage.getItem('token'))
              }
            />
            <Text
              style={{
                fontSize: 20,
                color: '#0055b8',
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {' '}
              Terlaris
            </Text>
          </View>

          <View style={{ marginVertical: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.product.map((dataku) => (
                <View key={dataku.id}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate('DetailProduct', { id: dataku.id })
                    }>
                    <CardComponent
                      wishlist={wishlistItem}
                      key={dataku.id}
                      image={{ uri: dataku }}
                      Qty={qty}
                      product={dataku}
                      onPress={onBuy(dataku.id)}
                      isSelected={selectedId.includes(dataku.id)}
                      onAdd={onBuy(dataku.id)}
                      onDecerase={deceraseQty(dataku.id)}
                      onRemove={deleteSelectedId(dataku.id)}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: '#0055b8',
                  fontFamily: 'Montserrat-SemiBold',
                  marginLeft: 16,
                }}>
                Terbaru
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {data.latest.map((dataku) => (
                <View key={dataku.id}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate('DetailProduct', { id: dataku.id })
                    }>
                    <CardComponent
                      wishlist={wishlistItem}
                      key={dataku.id}
                      image={{ uri: dataku }}
                      Qty={qty}
                      product={dataku}
                      onPress={onBuy(dataku.id)}
                      isSelected={selectedId.includes(dataku.id)}
                      onAdd={onBuy(dataku.id)}
                      onDecerase={deceraseQty(dataku.id)}
                      onRemove={deleteSelectedId(dataku.id)}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <Text
            style={{
              fontSize: 20,
              color: '#0055b8',
              fontFamily: 'Montserrat-SemiBold',
              marginLeft: 16,
              marginVertical: 10,
            }}>
            Top Kategori
          </Text>
          {data.topcategory.map((category) => (
            <TouchableOpacity
              onPress={() => navigate('ListCategory', { slug: category.slug })}
              key={category.id}>
              <View style={styles.cardTopKategori}>
                <FastImage
                  source={{
                    uri: category.logo.path,
                  }}
                  style={styles.imageTopKategori}
                />
                <View>
                  <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold' }}>
                    {category.name}
                  </Text>
                  <Text
                    style={{ fontSize: 14, fontFamily: 'Montserrat-Regular' }}>
                    {category.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  );
};

export default Home;
