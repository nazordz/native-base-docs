/* eslint-disable react-native/no-inline-styles */
import {
  CommonActions,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'react-native';
import { Header, Icon, Button } from 'react-native-elements';
import { Switch, TextInput } from 'react-native-gesture-handler';
import RBSheet from 'react-native-raw-bottom-sheet';
import AppContext from '../../AppContext';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import theme from '../../theme';
import styles from './style';

const ListAlamat = ({ route, navigation, item, index }) => {
  const { navigate } = useNavigation();
  const [alamat, setAlamat] = useState([]);
  const [alamatDefault, setAlamatDefault] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const refRBSheet = useRef();
  const [isEnabled, setIsEnabled] = useState(false);
  const isFocused = useIsFocused();
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const { setShowSpinner } = useContext(AppContext);

  async function fetchData() {
    try {
      const data = await api.getAlamat();
      setAlamat(data.address);
      setAlamatDefault(data.default_address);
      console.log(data.default_address.address.location_name);
    } catch (error) {
      console.log(error);
    } finally {
      setShowSpinner(false);
      setLoading(false);
    }
  }

  const onRefresh = useCallback(async () => {
    setRefresh(true);
    await fetchData();
    setRefresh(false);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const [filterMin, setFilterMin] = useState('');
  return (
    <>
      <Header
        placement="left"
        leftComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              reverse
              name="arrow-back"
              type=""
              size={14}
              color="#0068e1"
              onPress={() => navigation.dispatch(CommonActions.goBack())}
            />
            <Texts value="List Alamat" size={16} />
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
          <View style={theme.container}>
            {alamatDefault && (
              <View style={styles.containerCard}>
                <Text style={styles.cardHeader}>
                  {alamatDefault.location_name}{' '}
                  {`(${alamatDefault.first_name})`} (Alamat Utama)
                </Text>
                <Text style={styles.cardItem}>
                  {`${alamatDefault.address_1}, ${alamatDefault.city}, ${alamatDefault.state}`}
                </Text>
                <Button
                  title="Edit"
                  type="outline"
                  onPress={() =>
                    navigate('Alamat', {
                      id: alamatDefault.id,
                      location: alamatDefault.location_name,
                      name: alamatDefault.first_name,
                      alamatProvince: alamatDefault.state_id,
                      alamatCity: alamatDefault.city_id,
                      alamatSubdistrict: alamatDefault.subdistrict_id,
                      zip: alamatDefault.zip,
                      phone: alamatDefault.phone,
                      detailAlamat: alamatDefault.address_1,
                      isMain: true,
                    })
                  }
                  containerStyle={{
                    width: '30%',
                    alignSelf: 'flex-end',
                  }}
                />
              </View>
            )}
            <Button
              title="Tambah Alamat"
              buttonStyle={{
                backgroundColor: '#0068e1',
              }}
              onPress={() => navigate('Alamat')}
            />
            {alamat &&
              alamat.map((item) => (
                <View style={styles.containerCard} key={item.id}>
                  <Text
                    style={
                      styles.cardHeader
                    }>{`${item.location_name} (${item.first_name})`}</Text>
                  <Text style={styles.cardItem}>
                    {`${item.address_1}, ${item.city}, ${item.state}`}
                  </Text>
                  <Button
                    title="Edit"
                    type="outline"
                    onPress={() =>
                      navigate('Alamat', {
                        id: item.id,
                        location: item.location_name,
                        name: item.first_name,
                        alamatProvince: item.state_id,
                        alamatCity: item.city_id,
                        alamatSubdistrict: item.subdistrict_id,
                        zip: item.zip,
                        phone: item.phone,
                        detailAlamat: item.address_1,
                      })
                    }
                    containerStyle={{
                      width: '30%',
                      alignSelf: 'flex-end',
                    }}
                  />
                </View>
              ))}
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
                      style={{
                        fontFamily: 'Montserrat-Regular',
                        fontSize: 16,
                      }}>
                      Alamat
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
                      placeholder="Jl. Kenanga No. 30"
                    />
                  </View>
                </View>
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
                    {isEnabled ? (
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
                  // onPress={() => {
                  //   setLoading(true);
                  //   fetchDataSearch();
                  // }}
                />
              </View>
            </RBSheet>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default ListAlamat;
