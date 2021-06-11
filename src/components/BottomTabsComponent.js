import React, { Component, useContext, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import BottomNavigation, {
  FullTab,
  Badge,
} from 'react-native-material-bottom-navigation';
import { Icon } from 'react-native-elements';
import Home from '../screens/Home/Home';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import Category from '../screens/Category/Category';
import Cart from '../screens/Cart/Cart';
import MyOrder from '../screens/MyOrder/MyOrder';
import MyOrderDone from '../screens/MyOrder/MyOrderSelesai';
import Account from '../screens/Account/Account';
import AppContext from '../AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import util from '../helpers/util';

const tabs = [
  {
    key: 'Home',
    icon: 'home',
    label: 'Home',
    barColor: 'white',
    pressColor: 'rgba(255, 255, 255, 0.16)',
  },
  {
    key: 'Category',
    icon: 'puzzle',
    label: 'Kategori',
    barColor: 'white',
    pressColor: 'rgba(255, 255, 255, 0.16)',
  },
  {
    key: 'Cart',
    icon: 'cart',
    label: 'Keranjang',
    barColor: 'white',
    pressColor: 'rgba(255, 255, 255, 0.16)',
  },
  {
    key: 'MyOrder',
    icon: 'clock-time-two-outline',
    label: 'Order Saya',
    barColor: 'white',
    pressColor: 'rgba(255, 255, 255, 0.16)',
  },
  {
    key: 'Akun',
    icon: 'account',
    label: 'Akun',
    barColor: 'white',
    pressColor: 'rgba(255, 255, 255, 0.16)',
  },
];

const BottomTabs = ({ navigation }) => {
  const [tab, setTab] = useState('Home');
  const { carts } = useContext(AppContext);

  console.log(tab);


  const totalQty = useMemo(
    () => carts.reduce((prev, cart) => prev + cart.qty, 0),
    [carts],
  );

  const renderView = useMemo(() => {
    switch (tab) {
      case 'Home':
        return <Home />;
      case 'Cart':
        return <Cart />;
      case 'Category':
        return <Category />;
      case 'MyOrder':
        return <MyOrder />;
      case 'Akun':
        return <Account />;
      default:
        break;
    }
  }, [tab]);

  const renderIcon = (icon) => ({ isActive }) => (
    <Icon size={24} color={isActive ? '#0068e1' : 'gray'} name={icon} />
  );
  const renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      renderIcon={renderIcon(tab.icon)}
      showBadge={tab.key === 'Cart'}
      renderBadge={() => <Badge>{totalQty}</Badge>}
      labelStyle={{
        color: isActive ? '#0055b8' : 'gray',
        fontFamily: 'Montserrat-Regular',
      }}
    />
  );

  const isLoginRequired = async (key) => {
    const isLogin = await AsyncStorage.getItem('token');
    var authKeyPage = ['MyOrder', 'Akun'];
    if (!isLogin && authKeyPage.includes(key)) {
      return Alert.alert(
        'Warning!',
        'Mohon login terlebih dahulu!',
        [
          {
            text: 'Batal',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Login',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
        ],
        { cancelable: true },
      );
    } else {
      setTab(key);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>{renderView}</View>
      <BottomNavigation
        activeTab={tab} // {this.state.activeTab}
        onTabPress={(tab) => isLoginRequired(tab.key)} // {newTab => this.setState({ activeTab: newTab.key })}
        renderTab={renderTab}
        tabs={tabs}
      />
    </View>
  );
};

export default BottomTabs;
