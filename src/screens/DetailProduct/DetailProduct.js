/* eslint-disable react-native/no-inline-styles */
import React, {
  Component,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Icon, Header, Divider, Button } from 'react-native-elements';
import { SliderBox } from 'react-native-image-slider-box';
import { useNavigation, CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HTML from 'react-native-render-html';
import styles from './Style';
import api from '../../helpers/api';
import util from '../../helpers/util';
import AppContext from '../../AppContext';
import { Dimensions } from 'react-native';
import NumberFormat from 'react-number-format';
import Texts from '../../components/Texts';

const DetailProduct = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedId, setSelectedId] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { setCarts, setShowSpinner } = useContext(AppContext);
  const [data, setData] = useState({
    product: {
      files: [],
      translations: [],
      price: {
        formatted: '',
      },
      name: '',
      description: '',
      brand_id: '',
      id: '',
    },
    brand: '',
  });
  const { id } = route.params;

  const inceraseQty = (productId) => () => {
    setSelectedId([...selectedId, productId]);
    setQty(qty + 1);
    // util.addToCart(productId);
  };

  const deceraseQty = (productId) => () => {
    setSelectedId([...selectedId, productId]);
    setQty(qty - 1);
  };

  const onBuy = (productId) => async () => {
    setShowSpinner(true);
    await util.addToCartDetail(productId, qty);
    const products = JSON.parse(
      (await AsyncStorage.getItem('products')) || '[]',
    );
    setCarts(products);
    setShowSpinner(false);
    util.showToast('Sukses menambahkan ke keranjang');
  };

  const addToWishlist = async (productId) => {
    setShowSpinner(true);
    const addWishlist = await api.addToWishlist(productId);
    util.showToast(addWishlist.messages);
    setIsWishlisted(!isWishlisted);
    setShowSpinner(false);
  };

  async function fetchData() {
    try {
      const detailProduct = await api.getDetailProduct(id);
      setData(detailProduct);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchData();
    setRefresh(false);
  }, []);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(loading);
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
              Detail Produk
            </Text>
          </View>
        }
        containerStyle={{
          backgroundColor: '#fff',
        }}
      />

      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.loading}>
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
            <View style={styles.container}>
              <View style={{ flex: 1 }}>
                <Icon
                  name="heart"
                  size={30}
                  color={isWishlisted ? 'red' : '#bbb'}
                  onPress={() => addToWishlist(id)}
                  containerStyle={{
                    margin: 3,
                    position: 'absolute',
                    right: 0,
                    zIndex: 1,
                  }}
                />
                <SliderBox
                  images={data.product.files.map((files) => files.path)}
                  sliderBoxHeight={350}
                  dotColor="#fb050a"
                  autoplay
                  disableOnPress
                  cicrleLoop
                  parentWidth={Dimensions.get('window').width - 24}
                />
              </View>

              <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                <NumberFormat
                  value={
                    data.flashsale
                      ? Number(
                          data.flashsale.pivot.price.inCurrentCurrency.amount,
                        ).toFixed(0)
                      : Number(data.product.selling_price.amount).toFixed(0)
                  }
                  displayType={'text'}
                  renderText={(value) => (
                    <Texts
                      value={value}
                      size={20}
                      color="green"
                      bold
                      align="center"
                    />
                  )}
                  thousandSeparator={true}
                  prefix={'Rp. '}
                />
                <Text style={styles.name}>{data.product.name}</Text>
                <HTML
                  html={data.product.description || '<p></p>'}
                  baseFontStyle={{ fontFamily: 'Montserrat-Regular' }}
                  containerStyle={styles.description}
                  style={{ fontSize: 5 }}
                />
              </View>

              <Divider
                style={{ backgroundColor: 'gray', marginVertical: 20 }}
              />

              <View style={styles.detail}>
                <View style={styles.rl}>
                  <Text style={styles.detailText}>Berat</Text>
                  <Text style={styles.detailText}>
                    {data.product.translations.map(
                      (translations) => translations.weight,
                    )}{' '}
                    gr
                  </Text>
                </View>
                <View style={styles.rl}>
                  <Text style={styles.detailText}>Dimensi</Text>
                  <Text style={styles.detailText}>
                    {data.product.translations.map(
                      (translations) => translations.dimension,
                    )}{' '}
                    cm
                  </Text>
                </View>
                {!!data.brand && !!data.brand.name && (
                  <View style={styles.rl}>
                    <Text style={styles.detailText}>Merk</Text>
                    <Text style={styles.detailText}>{data.brand.name}</Text>
                  </View>
                )}
              </View>

              <Divider
                style={{ backgroundColor: 'gray', marginVertical: 10 }}
              />

              <View style={styles.spaceAround}>
                <Icon
                  disabledStyle={{ backgroundColor: 'transparent' }}
                  name="minus-circle"
                  type="font-awesome-5"
                  color="red"
                  size={30}
                  disabled={qty == 1 ? true : false}
                  onPress={deceraseQty(data.product.id)}
                />
                <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold' }}>
                  {qty}
                </Text>
                <Icon
                  name="plus-circle"
                  size={30}
                  color="#65cb67"
                  containerStyle={{ marginLeft: 14 }}
                  onPress={inceraseQty(data.product.id)}
                />
              </View>

              <Divider
                style={{ backgroundColor: 'gray', marginVertical: 10 }}
              />

              {data.product.qty && (
                <Texts
                  value={' Stok: ' + data.product.qty}
                  size={16}
                  color="#eb072e"
                  align="center"
                  bold
                />
              )}

              <Button
                title="Tambah ke Keranjang"
                containerStyle={{ margin: 15 }}
                buttonStyle={{ backgroundColor: '#0068e1' }}
                onPress={onBuy(data.product.id)}
              />
            </View>
          </ScrollView>
        )}
      </View>
    </>
  );
};

export default DetailProduct;
