/* eslint-disable react-native/no-inline-styles */
import { Picker } from '@react-native-picker/picker';
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Button, Header, Icon } from 'react-native-elements';
import { ScrollView, Switch, TextInput } from 'react-native-gesture-handler';
import AppContext from '../../AppContext';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';

const Alamat = ({ route, navigation }) => {
  const { navigate } = useNavigation();
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [zip, setZip] = useState('');
  const [detailAlamat, setDetailAlamat] = useState('');
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataSubdistrict, setDataSubdistrict] = useState([]);
  const [alamatProvince, setAlamatProvince] = useState('');
  const [alamatProvinceName, setAlamatProvinceName] = useState('');
  const [alamatCity, setAlamatCity] = useState('');
  const [alamatCityName, setAlamatCityName] = useState('');
  const [alamatSubdistrict, setAlamatSubdistrict] = useState('');
  const [alamatSubdistrictName, setAlamatSubdistrictName] = useState('');
  const [phone, setPhone] = useState('');
  const { setShowSpinner } = useContext(AppContext);

  const [isMain, setIsMain] = useState(false);
  const toggleSwitch = () => setIsMain((previousState) => !previousState);

  console.log(detailAlamat, alamatCity, alamatProvince, alamatSubdistrict);

  const findCity = async (provinceId) => {
    setShowSpinner(true);
    try {
      console.log(provinceId);
      const dataCities = await api.postCity(provinceId);
      setDataCity(dataCities.results);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const findSubdistrict = async (cityId) => {
    setShowSpinner(true);
    try {
      const dataSubdistricts = await api.postSubdistrict(cityId);
      console.log(dataSubdistricts.results);
      setDataSubdistrict(dataSubdistricts.results);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
    }
  };

  const submitAlamat = async () => {
    setShowSpinner(true);
    try {
      if (route.params) {
        const submit = await api.editAlamat(
          route.params.id,
          location,
          name,
          alamatProvince,
          alamatCity,
          alamatSubdistrict,
          zip,
          phone,
          detailAlamat,
          isMain,
        );
        console.log(submit);
        if (submit.status == 'Success') {
          await util.showToast('Sukses mengubah alamat');
          navigate('ListAlamat');
        } else {
          await util.showToast('Gagal menambah alamat');
        }
      } else {
        const submit = await api.addAlamat(
          location,
          name,
          alamatProvince,
          alamatCity,
          alamatSubdistrict,
          zip,
          phone,
          detailAlamat,
          isMain,
        );
        console.log(submit);
        if (submit.status == 'Success') {
          await util.showToast('Sukses menambah alamat');
          navigate('ListAlamat');
        } else {
          await util.showToast('Gagal menambah alamat');
        }
      }
    } catch (error) {
    } finally {
      setShowSpinner(false);
    }
  };

  async function fetchData() {
    try {
      const dataProvincies = await api.getProvince();
      console.log(dataProvincies);
      setDataProvince(dataProvincies.results);
      if (route.params) {
        findCity(route.params.alamatProvince);
        findSubdistrict(route.params.alamatCity);
        setLocation(route.params.location);
        setName(route.params.name);
        setAlamatProvince(route.params.alamatProvince.toString());
        setAlamatCity(route.params.alamatCity.toString());
        setAlamatSubdistrict(route.params.alamatSubdistrict.toString());
        setZip(route.params.zip);
        setPhone(route.params.phone);
        setDetailAlamat(route.params.detailAlamat);
        if (route.params.isMain) {
          setIsMain(true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header
        placement="left"
        leftComponent={
          <View>
            <Icon
              name="arrow-back"
              type=""
              size={30}
              color="#0068e1"
              onPress={() => navigation.dispatch(CommonActions.goBack())}
            />
          </View>
        }
        centerComponent={
          <View>
            <Texts value="Tambah Alamat" size={16} />
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
          <View style={{ margin: 20 }}>
            <View
              style={{
                padding: 20,
                borderRadius: 10,
                backgroundColor: 'white',
              }}>
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>
                Nama Lokasi
              </Text>
              <TextInput
                value={location}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#ddd',
                  paddingHorizontal: 15,
                  fontFamily: 'Montserrat-Regular',
                  marginTop: 10,
                }}
                placeholder="Contoh: Rumah, Kantor, dll"
                onChangeText={(val) => setLocation(val)}
              />
            </View>
            <View
              style={{
                padding: 20,
                borderRadius: 10,
                backgroundColor: 'white',
                marginVertical: 20,
              }}>
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>
                Nama Penerima
              </Text>
              <TextInput
                value={name}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#ddd',
                  paddingHorizontal: 15,
                  fontFamily: 'Montserrat-Regular',
                  marginTop: 10,
                }}
                placeholder="Nama Penerima"
                onChangeText={(val) => setName(val)}
              />
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>Provinsi</Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  marginVertical: 10,
                }}>
                <Picker
                  selectedValue={alamatProvince}
                  dropdownIconColor="black"
                  style={{
                    height: 25,
                    fontFamily: 'Montserrat-Bold',
                    borderWidth: 2,
                    marginVertical: 5,
                    padding: 16,
                  }}
                  onValueChange={(val, i) => {
                    // console.log(val);
                    findCity(val);
                    setAlamatProvince(val);
                  }}>
                  <Picker.Item label="Provinsi" value="" />
                  {dataProvince.map((provinsi) => (
                    <Picker.Item
                      key={provinsi.province_id}
                      label={provinsi.province}
                      value={provinsi.province_id}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>
                Kota / Kabupaten
              </Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  marginVertical: 10,
                }}>
                <Picker
                  selectedValue={alamatCity}
                  dropdownIconColor="black"
                  style={{
                    height: 25,
                    fontFamily: 'Montserrat-Bold',
                    borderWidth: 2,
                    marginVertical: 5,
                    padding: 16,
                  }}
                  onValueChange={(val, i) => {
                    // console.log(val);
                    findSubdistrict(val);
                    setAlamatCity(val);
                  }}>
                  <Picker.Item label="Kota / Kabupaten" value="" />
                  {dataCity.map((city) => (
                    <Picker.Item
                      key={city.city_id}
                      label={city.type + ' ' + city.city_name}
                      value={city.city_id}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>
                Kecamatan
              </Text>
              <View
                style={{
                  borderWidth: 2,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  marginVertical: 10,
                }}>
                <Picker
                  selectedValue={alamatSubdistrict}
                  dropdownIconColor="black"
                  style={{
                    height: 25,
                    fontFamily: 'Montserrat-Bold',
                    borderWidth: 2,
                    marginVertical: 5,
                    padding: 16,
                  }}
                  onValueChange={(val, i) => {
                    // console.log(val);
                    setAlamatSubdistrict(val);
                  }}>
                  <Picker.Item label="Kecamatan" value="" />
                  {dataSubdistrict.map((subdistrict) => (
                    <Picker.Item
                      key={subdistrict.subdistrict_id}
                      label={subdistrict.subdistrict_name}
                      value={subdistrict.subdistrict_id}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>Kode Pos</Text>
              <TextInput
                value={zip}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#ddd',
                  paddingHorizontal: 15,
                  fontFamily: 'Montserrat-Regular',
                  marginTop: 10,
                }}
                maxLength={5}
                keyboardType="number-pad"
                placeholder="Kode Pos"
                onChangeText={(val) => setZip(val)}
              />
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>
                No. Ponsel
              </Text>
              <TextInput
                value={phone}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#ddd',
                  paddingHorizontal: 15,
                  fontFamily: 'Montserrat-Regular',
                  marginTop: 10,
                }}
                keyboardType="phone-pad"
                placeholder="No. Ponsel Anda"
                onChangeText={(val) => setPhone(val)}
              />
              <Text style={{ fontFamily: 'Montserrat-Regular' }}>
                Alamat Lengkap
              </Text>
              <TextInput
                value={detailAlamat}
                style={{
                  borderWidth: 2,
                  borderRadius: 10,
                  borderColor: '#ddd',
                  paddingHorizontal: 15,
                  fontFamily: 'Montserrat-Regular',
                  marginTop: 10,
                  height: 90,
                  textAlignVertical: 'top',
                }}
                multiline
                textAlign="left"
                numberOfLines={4}
                onChangeText={(val) => setDetailAlamat(val)}
                placeholder="Contoh: Jl. Kenanga No. 13"
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 20,
                }}>
                <Text
                  style={{ fontFamily: 'Montserrat-Regular', fontSize: 16 }}>
                  Jadikan alamat utama?
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  {isMain ? (
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: 16,
                      }}>
                      Ya
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: 16,
                      }}>
                      Tidak
                    </Text>
                  )}
                  <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isMain ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isMain}
                  />
                </View>
              </View>
            </View>
            <Button
              title="Submit"
              loading={loading}
              disabled={loading}
              onPress={() => submitAlamat()}
            />
          </View>
        </ScrollView>
      )}
    </>
  );
};
export default Alamat;
