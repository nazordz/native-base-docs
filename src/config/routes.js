import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as RootNavigation from '../../RootNavigation';
import messaging from '@react-native-firebase/messaging';
import Register from '../screens/Register/Register';
import Login from '../screens/Login/Login';
import Home from '../screens/Home/Home';
import OTP from '../screens/OTP/OTP';
import Account from '../screens/Account/Account';
import Alamat from '../screens/Alamat/Alamat';
import ListAlamat from '../screens/Alamat/ListAlamat';
import Category from '../screens/Category/Category';
import SearchValues from '../screens/Search/Search';
import DetailProduct from '../screens/DetailProduct/DetailProduct';
import ListCategory from '../screens/Category/ListCategory';
import Cart from '../screens/Cart/Cart';
import ConfirmCart from '../screens/Cart/ConfirmCart';
import Delivery from '../screens/Delivery/Delivery';
import Payment from '../screens/Payment/Payment';
import PaymentSuccess from '../screens/Payment/PaymentSuccess';
import DetailOrder from '../screens/MyOrder/DetailOrder';
import Splash from '../screens/SplashScreen/Splash';
import BottomTabs from '../components/BottomTabsComponent';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Wishlist from '../screens/Wishlist/Wishlist';
import ConfirmPayment from '../screens/MyOrder/ConfirmPayment';
import Info from '../screens/Account/Info';
import AccountEdit from '../screens/Account/AccountEdit';
import RequestProduct from '../screens/Account/RequestProduct';
import Notification from '../screens/Notification/Notification';
import Xendit from '../screens/Payment/Xendit';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const BottomTab = () => {
  const [foundToken, setFoundToken] = useState('');
  const [firstRoute, setFirstRoute] = useState('');
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Home');

  const isLogin = async () => {
    try {
      // const login = await AsyncStorage.removeItem('token')
      // console.log(login)
      // setFoundToken('')

      AsyncStorage.getItem('token').then((value) => {
        value === null ? setFirstRoute('Login') : setFirstRoute('Home');
        console.log(value);
      });
      // if (!login) {
      //   setFirstRoute('Login')
      // }
      // console.log(login)
      // setFoundToken(login)
    } catch (e) {
      console.log(e);
    }
  };

  console.log(firstRoute);
  console.log(isLogin);

  useEffect(() => {
    isLogin();
  }, []);

  return (
    <NavigationContainer ref={RootNavigation.navigationRef}>
      <Stack.Navigator headerMode="none" initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="AccountEdit" component={AccountEdit} />
        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Tabs" component={BottomTabs} />
        <Stack.Screen name="SearchValues" component={SearchValues} />
        <Stack.Screen name="DetailProduct" component={DetailProduct} />
        <Stack.Screen name="ListCategory" component={ListCategory} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="ConfirmCart" component={ConfirmCart} />
        <Stack.Screen name="Delivery" component={Delivery} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
        <Stack.Screen name="DetailOrder" component={DetailOrder} />
        <Stack.Screen name="Alamat" component={Alamat} />
        <Stack.Screen name="ListAlamat" component={ListAlamat} />
        <Stack.Screen name="ConfirmPayment" component={ConfirmPayment} />
        <Stack.Screen name="Info" component={Info} />
        <Stack.Screen name="RequestProduct" component={RequestProduct} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Xendit" component={Xendit} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default BottomTab;
