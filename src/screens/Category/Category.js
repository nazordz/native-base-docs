/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import style from './Style';
import CategoryCard from '../../components/CategoryCardComponent';
import { useNavigation } from '@react-navigation/native';
import api from '../../helpers/api';
import { RefreshControl } from 'react-native';
import { Dimensions } from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';

const dataDummy = [
  {
    id: 1,
    name: 'tes',
    image: require('../../assets/img/logo.png'),
  },
  {
    id: 2,
    name: 'tes2',
    image: require('../../assets/img/logo.png'),
  },
  {
    id: 3,
    name: 'tes3',
    image: require('../../assets/img/logo.png'),
  },
  {
    id: 4,
    name: 'tes4',
    image: require('../../assets/img/logo.png'),
  },
  {
    id: 5,
    name: 'tes5',
    image: require('../../assets/img/logo.png'),
  },
  {
    id: 6,
    name: 'tes6',
    image: require('../../assets/img/logo.png'),
  },
  {
    id: 7,
    name: 'tes7',
    image: require('../../assets/img/logo.png'),
  },
];

const Category = () => {
  const { navigate } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const categoryData = await api.getCategories();
      setData(categoryData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefresh(true);
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

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0068e1" />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'white',
            flex: 1,
          }}>
          <Text style={style.textHeader}>
            Temukan Produk berdasarkan Kategori
          </Text>
          <ScrollView
            refreshControl={
              <RefreshControl
                style={{ zIndex: 999, paddingTop: 100 }}
                refreshing={refresh}
                onRefresh={onRefresh}
              />
            }>
            <FlatList
              numColumns={3}
              data={data}
              renderItem={({ item }) => (
                <CategoryCard
                  name={item.name}
                  image={item.logo.path}
                  onPress={() => navigate('ListCategory', { slug: item.slug })}
                />
              )}
              keyExtractor={(item) => item.id}
            />
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default Category;
