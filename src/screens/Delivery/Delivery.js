/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Image } from 'react-native';
import { View, Text, TextInput, ActivityIndicator } from 'react-native';
import { Icon, Header, CheckBox, Button, Divider } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Hr from 'react-native-hr-component';
import NumberFormat from 'react-number-format';
import AppContext from '../../AppContext';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';

const Delivery = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const { coupon, cart } = route.params;
  const [data, setData] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [address, setAddress] = useState();
  const [selectedDetailAddress, setSelectedDetailAddress] = useState();
  const [alamat, setAlamat] = useState('');
  const [alamatProvince, setAlamatProvince] = useState('');
  const [alamatProvinceName, setAlamatProvinceName] = useState('');
  const [alamatCity, setAlamatCity] = useState('');
  const [alamatCityName, setAlamatCityName] = useState('');
  const [alamatSubdistrict, setAlamatSubdistrict] = useState('');
  const [alamatSubdistrictName, setAlamatSubdistrictName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [courier, setCourier] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [grandTotal, setGrandTotal] = useState('');
  const [hargaOngkir, setHargaOngkir] = useState('');
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataProvince, setDataProvince] = useState('');
  const [dataCity, setDataCity] = useState([]);
  const [dataSubdistrict, setDataSubdistrict] = useState([]);
  const [dataOngkir, setDataOngkir] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [listAlamat, setListAlamat] = useState([]);
  const isFocused = useIsFocused();
  const { carts, setCarts, setShowSpinner } = useContext(AppContext);

  // console.log(coupon.value.amount);

  const goToPayment = () => {
    if (courier == '') {
      util.showToast('Kurir harus dipilih');
    } else if (address == '') {
      util.showToast('Alamat harus diisi');
    } else {
      navigate('Payment', {
        cart,
        alamat: selectedAddress,
        total,
        grandTotal,
        hargaOngkir,
        courier,
        discount: coupon ? coupon.value.inCurrentCurrency.amount : 0,
        couponCode,
      });
    }
  };

  const checkOngkir = useCallback(async () => {
    setShowSpinner(true);
    try {
      const weights = data.reduce((prev, product, index) => {
        const dataWeight = product.translations[0].weight;
        return prev + dataWeight * carts[index].qty;
      }, 0);
      if (selectedDetailAddress.subdistrict_id) {
        const costData = await api.postOngkir(
          selectedDetailAddress.subdistrict_id,
          weights,
        );
        console.log(costData)
        // console.log(weights.toString());
        // console.log('check ongkir', costData);

        const costs = [];
        costData.results.map((ongkir) =>
          ongkir.costs.map((ongkir2) =>
            ongkir2.cost.map((ongkir3) => {
              costs.push({
                code: ongkir.code,
                price: ongkir3.value,
                name: `${ongkir.code.toUpperCase()} - ${ongkir2.service}`,
                etd: ongkir3.etd,
              });
            }),
          ),
        );
        // console.log(cost)
        setDataOngkir(costs);
      }
    } catch (error) {
      console.log('ini tuh error', error);
    } finally {
      setShowSpinner(false);
    }
  }, [carts, data, selectedDetailAddress, setShowSpinner]);

  useEffect(() => {
    // console.log(selectedAddress);
    if (address) {
      let addressData = null;
      if (address.default_address || address.address.length > 0) {
        // console.log('addressData');
        if (
          address.default_address &&
          selectedAddress === address.default_address.address_id
        ) {
          addressData = address.default_address;
        } else {
          addressData = address.address.find(
            (item) => item.id === selectedAddress,
          );
        }
        // console.log(addressData, 'addressData');
        if (addressData) {
          setSelectedDetailAddress(addressData);
        }
      } else {
        setLoading(false);
      }
    }
  }, [selectedAddress, address]);

  const fetchData = useCallback(
    async (addressId) => {
      try {
        const products = JSON.parse(
          (await AsyncStorage.getItem('products')) || '[]',
        ).filter((item) => cart.includes(item.id));
        const dataProduct = products.map((product) => product.id);
        const detailProduct = await api.postDataCart(dataProduct);
        setData(detailProduct);

        if (coupon.id > 0) {
          if (coupon.is_percent == 0) {
            setCouponCode(coupon.id);
            setDiscount(coupon.value.inCurrentCurrency.amount);
          } else {
            setCouponCode(coupon.id);
            setDiscount(coupon.value);
          }
        } else {
          setDiscount(0);
        }
        if (addressId) {
          setSelectedAddress(addressId);
        }
        // setDiscount(coupon.value.inCurrentCurrency.amount);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [cart, coupon.id, coupon.is_percent, coupon.value],
  );

  useEffect(() => {
    if (selectedAddress) {
      checkOngkir();
    }
  }, [checkOngkir, fetchData, selectedAddress]);

  useEffect(() => {
    const getData = async () => {
      if (isFocused) {
        // setDiscount(coupon.value.inCurrentCurrency.amount);
        const getAddress = await api.getAlamat();
        // console.log(getAddress);
        setAddress(getAddress);
        // fetchData('firstTime');
        // console.log('Pertama Kaliiiiiiiiiiiiiiiiiiiiiii');
        if (getAddress.default_address || getAddress.address.length) {
          if (getAddress.default_address) {
            fetchData(getAddress.default_address.address_id);
          } else {
            fetchData(getAddress.address[0].id);
          }
        } else {
          const products = JSON.parse(
            (await AsyncStorage.getItem('products')) || '[]',
          ).filter((item) => cart.includes(item.id));
          const dataProduct = products.map((product) => product.id);
          const detailProduct = await api.postDataCart(dataProduct);
          setData(detailProduct);
          setLoading(false);
        }
      }
    };

    getData();
  }, [isFocused, fetchData, cart]);

  console.log('ini cart', cart);

  const totalQty = useMemo(
    () =>
      carts
        .filter((item) => cart.includes(item.id))
        .reduce((prev, cart) => prev + cart.qty, 0),
    [cart, carts],
  );

  const total = useMemo(() => {
    return data.reduce((prev, product, index) => {
      let price = product.selling_price.inCurrentCurrency.amount;
      if (product.pivot) {
        price = product.pivot.price.inCurrentCurrency.amount;
      }
      return prev + price * carts[index].qty;
    }, 0);
  }, [carts, data]);

  const weight = useMemo(() => {
    return data.reduce((prev, product, index) => {
      const dataWeight = product.translations[0].weight;
      return prev + dataWeight * carts[index].qty;
    }, 0);
  }, [carts, data]);

  //   console.log(dataOngkir.map((val) => console.log(val)));

  //   console.log(data[0].translations[0].weight);
  //   console.log(data.map((datas) => console.log(datas.translations[0].weight)));
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
                width: 200,
                marginLeft: 10,
                marginTop: 2,
              }}>
              Detail pengiriman
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
        <ScrollView>
          <>
            <View style={{ padding: 20, backgroundColor: 'white' }}>
              <Texts value="Informasi Pengiriman" size={16} />
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4,
                  marginVertical: 10,
                }}>
                <Picker
                  selectedValue={selectedAddress}
                  dropdownIconColor="black"
                  style={{
                    height: 25,
                    fontFamily: 'Montserrat-Bold',
                    borderWidth: 2,
                    marginVertical: 5,
                    padding: 16,
                  }}
                  onValueChange={(val, i) => {
                    if (val == 0) {
                      navigate('Alamat');
                    }
                    console.log('azzzzz', val);
                    setSelectedAddress(val);
                  }}>
                  <Picker.Item key="-1" label="Pilih Alamat" value="" />
                  <Picker.Item key="0" label="+ Tambah Alamat" value="0" />
                  {address.default_address && (
                    <Picker.Item
                      key={address.default_address.id}
                      label={address.default_address.location_name}
                      value={address.default_address.id}
                      color="black"
                    />
                  )}
                  {address.address &&
                    address.address.map((alamat) => (
                      <Picker.Item
                        key={alamat.id}
                        label={alamat.location_name}
                        value={alamat.id}
                      />
                    ))}
                </Picker>
              </View>
              <Texts value="Rincian Alamat" size={14} />
              {selectedDetailAddress && (
                <View
                  style={{
                    borderLeftWidth: 3,
                    paddingLeft: 10,
                    borderLeftColor: '#C4C4C4',
                    marginTop: 6,
                  }}>
                  <Texts
                    value={`${selectedDetailAddress.first_name}`}
                    size={13}
                  />
                  <Texts
                    value={`${selectedDetailAddress.address_1}, Kec. ${selectedDetailAddress.subdistrict}, ${selectedDetailAddress.city}, ${selectedDetailAddress.state}, ${selectedDetailAddress.zip}`}
                    size={13}
                    color="#A3A3A3"
                  />
                </View>
              )}
            </View>

            <View
              style={{ padding: 20, backgroundColor: 'white', marginTop: 40 }}>
              <Texts value="Ekspedisi pengiriman" size={16} />
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 4,
                  marginVertical: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: 10,
                }}>
                <Image
                  source={require('../../assets/img/truck.png')}
                  style={{ width: 30, height: 30 }}
                />
                <Picker
                  selectedValue={courier}
                  dropdownIconColor="black"
                  itemStyle={{ textTransform: 'capitalize' }}
                  style={{ height: 50, width: '90%' }}
                  onValueChange={(val, i) => {
                    // console.log(`${val.name} - ${val.service}`);
                    setCourier(val);
                    {
                      {
                        val != 0
                          ? setHargaOngkir(Number(dataOngkir[i - 1].price))
                          : setHargaOngkir('');
                      }
                      coupon.is_percent === 0
                        ? setGrandTotal(
                            Number(total) +
                              Number(dataOngkir[i - 1].price) -
                              discount,
                          )
                        : coupon.is_percent === 1
                        ? setGrandTotal(
                            (
                              Number(total) -
                              (Number(total) * coupon.value) / 100 +
                              Number(dataOngkir[i - 1].price)
                            ).toFixed(0),
                          )
                        : setGrandTotal(
                            Number(total) +
                              (i > 0 ? Number(dataOngkir[i - 1].price) : 0),
                          );
                    }
                  }}>
                  <Picker.Item label="Pilih Kurir" value="" />
                  {dataOngkir.map((ongkir) => (
                    <Picker.Item
                      key={ongkir.code}
                      label={`${ongkir.name.toUpperCase()} (${
                        ongkir.etd
                      } Hari) Rp. ${ongkir.price.toLocaleString('id')}/kg`}
                      value={`${ongkir.code} - ${ongkir.name}`}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View
              style={{
                padding: 20,
                backgroundColor: 'white',
                marginTop: 40,
                marginBottom: 10,
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  Total Item
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  {totalQty} Items
                </Text>
              </View>
              <Divider
                style={{
                  backgroundColor: 'gray',
                  marginVertical: 10,
                  borderWidth: 1,
                  borderColor: '#ddd',
                }}
              />
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  Total Biaya Belanja
                </Text>
                <NumberFormat
                  value={total}
                  displayType={'text'}
                  renderText={(value) => (
                    <Text
                      style={{
                        color: '#509bf2',
                        fontFamily: 'Montserrat-Regular',
                        fontSize: 16,
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
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  Diskon Kupon
                </Text>
                {coupon.is_percent == 0 ? (
                  <NumberFormat
                    value={discount}
                    displayType={'text'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: '#509bf2',
                          fontFamily: 'Montserrat-Regular',
                          fontSize: 16,
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
                ) : coupon.is_percent == 1 ? (
                  <Text
                    style={{
                      color: '#509bf2',
                      fontFamily: 'Montserrat-Regular',
                      fontSize: 16,
                    }}>
                    {(+discount).toFixed(0)}%
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: '#509bf2',
                      fontFamily: 'Montserrat-Regular',
                      fontSize: 16,
                    }}>
                    Rp. {(+discount).toFixed(0)}
                  </Text>
                )}
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  Berat
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    color: '#509bf2',
                  }}>
                  {weight} gr
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  Biaya Kirim
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  <NumberFormat
                    value={hargaOngkir == '' ? 0 : hargaOngkir}
                    displayType={'text'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: '#509bf2',
                          fontFamily: 'Montserrat-Regular',
                          fontSize: 16,
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
                </Text>
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  marginVertical: 5,
                  backgroundColor: '#a3ceff',
                  padding: 4,
                }}>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  Grand Total
                </Text>
                <Text
                  style={{
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 16,
                    alignSelf: 'center',
                  }}>
                  <NumberFormat
                    value={
                      grandTotal
                      // coupon.is_percent === 0
                      //   ? total + hargaOngkir - discount
                      //   : coupon.is_percent === 1
                      //   ? (
                      //       total -
                      //       (total * coupon.value) / 100 +
                      //       hargaOngkir
                      //     ).toFixed(0)
                      //   : total + hargaOngkir
                    }
                    displayType={'text'}
                    renderText={(value) => (
                      <Text
                        style={{
                          color: '#0055b8',
                          fontFamily: 'Montserrat-Regular',
                          fontSize: 16,
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
                </Text>
              </View>
            </View>
            {hargaOngkir == '' ? (
              <Button
                title="Selanjutnya"
                disabled
                buttonStyle={{
                  width: '90%',
                  alignSelf: 'center',
                  marginVertical: 10,
                  marginBottom: 25,
                }}
              />
            ) : (
              <Button
                title="Selanjutnya"
                onPress={goToPayment}
                buttonStyle={{
                  width: '90%',
                  alignSelf: 'center',
                  marginVertical: 10,
                  marginBottom: 25,
                }}
              />
            )}
          </>
        </ScrollView>
      )}
    </>
  );
};

export default Delivery;
