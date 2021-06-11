/* eslint-disable react-native/no-inline-styles */
import { CommonActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text } from 'react-native';
import { Header, Icon, Input } from 'react-native-elements';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import HTML from 'react-native-render-html';
import Texts from '../../components/Texts';
import api from '../../helpers/api';
import util from '../../helpers/util';

const Info = ({ navigation, route }) => {
  const { navigate } = useNavigation();
  const { info } = route.params;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  async function getData() {
    if (info != 'Kritik dan Saran') {
      const get = await api.getInfo(info);
      setData(get.page);
      console.log(get.page);
    }
    setLoading(false);
  }

  useEffect(() => {
    console.log(info);
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0068e1" />
        </View>
      ) : (
        <>
          <View style={{ backgroundColor: 'white' }}>
            <Header
              placement="left"
              leftComponent={
                <Icon
                  reverse
                  name="arrow-back"
                  type=""
                  size={14}
                  color="#0068e1"
                  onPress={() => navigation.dispatch(CommonActions.goBack())}
                />
              }
              containerStyle={{
                backgroundColor: '#fff',
                borderBottomWidth: 0,
              }}
            />
            <View style={{ padding: 20 }}>
              <Texts value={data.name} align="center" size={20} />
            </View>
          </View>
          <ScrollView>
            <View style={{ padding: 20 }}>
              <HTML
                html={data.body || '<p></p>'}
                baseFontStyle={{ fontFamily: 'Roboto-Regular' }}
                containerStyle={{
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'Roboto-Regular',
                }}
                defaultTextProps={{ numberOfLines: 1 }}
              />
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
};

export default Info;
