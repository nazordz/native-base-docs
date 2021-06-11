/* eslint-disable react-native/no-inline-styles */
import React, {
  useState,
  Component,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Button,
  SearchBar,
  ThemeProvider,
  Icon,
  Header,
  Text as Text2,
  BottomSheet,
} from 'react-native-elements';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../helpers/api';
import { NavigationEvents } from 'react-navigation';
import AppContext from '../../AppContext';
import util from '../../helpers/util';
import FlatCardComponent from '../../components/FlatCardComponent';
import { Switch } from 'react-native-gesture-handler';

function handleChangeOption(val) {
  if (val !== 0) {
    this.setState({ selectedValue: val });
  }
}

const Filter = () => {};

const Search = ({ navigation, route, item, index }) => {
  const { navigate } = useNavigation();
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [sort, setSort] = useState('');
  const [searchProduct, setSearchProduct] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState([]);
  const [filterMin, setFilterMin] = useState('');
  const [filterMax, setFilterMax] = useState('');
  const [wishlistItem, setWishlistItem] = useState([]);
  const { carts, setCarts, setShowSpinner } = useContext(AppContext);
  const refRBSheet = useRef();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const { query } = route.params;

  const [data, setData] = useState([]);

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

  console.log(sort);

  async function fetchDataSearch(sort) {
    try {
      const searchQuery = await api.getSearchProduct(
        query,
        filterMin,
        filterMax,
        sort,
      );
      console.log(searchQuery.length);
      setData(searchQuery);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchDataSearch();
    setRefresh(false);
  }, []);

  useEffect(() => {
    fetchDataSearch();
    setSearch(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  console.log(searchProduct);
  return (
    <>
      <View
        style={{ backgroundColor: 'white', padding: 15, paddingBottom: 10 }}>
        <View
          style={{
            position: 'relative',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon
            name="arrow-back"
            type=""
            size={30}
            containerStyle={{ marginLeft: -5, marginRight: 15, marginTop: -7 }}
            onPress={() => navigation.dispatch(CommonActions.goBack())}
          />
          <Icon
            name="search"
            type="material"
            containerStyle={{ marginRight: -35, zIndex: 99 }}
          />
          <TextInput
            placeholder="Cari Produk..."
            onChangeText={(val) => setSearch(val)}
            onSubmitEditing={() => {
              navigate('SearchValues', { query: search });
              setLoading(true);
            }}
            value={search}
            style={{
              backgroundColor: '#f0f0f0',
              color: 'black',
              width: '90%',
              paddingLeft: 49,
              marginTop: -6,
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <TouchableOpacity
              style={{ flex: 1, flexDirection: 'row' }}
              onPress={() => this[RBSheet + index].open()}>
              <Icon name="filter-outline" size={22} />
              <Text style={{ fontSize: 16 }}>Filter</Text>
            </TouchableOpacity>
            <Icon name="filter-variant" size={22} />
            <Picker
              selectedValue={sort}
              dropdownIconColor="black"
              style={{ height: 25, flex: 1, fontFamily: 'Montserrat-Bold' }}
              onValueChange={(val) => {
                setLoading(true);
                setSort(val);
                fetchDataSearch(val);
              }}>
              <Picker.Item label="Urutkan" value="" />
              <Picker.Item label="Termurah" value="termurah" />
              <Picker.Item label="Termahal" value="termahal" />
              <Picker.Item label="Terbaru" value="terbaru" />
            </Picker>
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
              style={{ zIndex: 999, paddingTop: 100 }}
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }
          style={{ paddingHorizontal: 3, marginTop: 10, paddingBottom: 115 }}>
          <FlatList
            numColumns={2}
            data={data}
            columnWrapperStyle={{ flexDirection: 'row' }}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 8 }}>
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
        </ScrollView>
      )}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <RBSheet
          ref={(ref) => {
            this[RBSheet + index] = ref;
          }}
          animationType="fade"
          height={300}
          openDuration={250}
          customStyles={{
            container: {
              borderTopRightRadius: 12,
              borderTopLeftRadius: 12,
            },
          }}>
          <View style={{ margin: 22 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 18 }}>
                Filter
              </Text>
              <Icon
                name="close"
                size={26}
                onPress={() => this[RBSheet + index].close()}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                  Harga Min
                </Text>
                <TextInput
                  onChangeText={(val) => setFilterMin(val)}
                  style={{
                    marginTop: 8,
                    marginRight: 5,
                    backgroundColor: 'white',
                    borderColor: '#f0f0f0',
                    borderWidth: 2,
                    borderRadius: 10,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                  Harga Max
                </Text>
                <TextInput
                  onChangeText={(val) => setFilterMax(val)}
                  style={{
                    marginTop: 8,
                    marginLeft: 5,
                    backgroundColor: 'white',
                    borderColor: '#f0f0f0',
                    borderWidth: 2,
                    borderRadius: 10,
                  }}
                />
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 20,
              }}>
              <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                Sembunyikan item pre-order?
              </Text>
              <View style={{ flexDirection: 'row' }}>
                {isEnabled ? (
                  <Text
                    style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                    Ya
                  </Text>
                ) : (
                  <Text
                    style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                    Tidak
                  </Text>
                )}
                <Switch
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
            </View>
            <Button
              title="Terapkan"
              containerStyle={{ marginTop: 25 }}
              onPress={() => {
                setLoading(true);
                fetchDataSearch();
                this[RBSheet + index].close();
              }}
            />
          </View>
        </RBSheet>
      </View>
    </>
  );
};

export default Search;
