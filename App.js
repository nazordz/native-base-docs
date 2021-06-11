/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import AppContext from './src/AppContext';
import Routes from './src/config/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { RootSiblingParent } from 'react-native-root-siblings';
import messaging from '@react-native-firebase/messaging';
import * as RootNavigation from './RootNavigation';
import { Notifications } from 'react-native-notifications';
import api from './src/helpers/api';

const App = () => {
  const [carts, setCarts] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      RootNavigation.navigate('Notification');
    });

    const getCart = async () => {
      const products = JSON.parse(
        (await AsyncStorage.getItem('products')) || '[]',
      );
      setCarts(products);

      AsyncStorage.getItem('token').then((value) => {
        if (value) {
          const unsubscribe = messaging().onMessage(async (notif) => {
            Notifications.removeAllDeliveredNotifications();
            Notifications.postLocalNotification({
              title: notif.notification.title,
              body: notif.notification.body,
              extra: notif.data,
            });
            await api.addNotification(
              notif.data.order_id,
              notif.notification.title,
              notif.notification.body,
            );
          });

          messaging()
            .getToken()
            .then(async (token) => {
              console.log(token);
              await api.addFcm(token);
            });

          messaging().onTokenRefresh(async (token) => {
            await api.addFcm(token);
          });
          return unsubscribe;
        }
        console.log(value);
      });
    };
    getCart();
  }, []);

  Notifications.registerRemoteNotifications();

  Notifications.events().registerNotificationOpened(
    (notification, completion) => {
      RootNavigation.navigate('DetailOrder', {
        order_id: notification.payload.extra.order_id,
      });
      console.log('Notification opened: ', notification.payload);
      completion();
    },
  );

  return (
    <RootSiblingParent>
      <AppContext.Provider
        value={{ carts, setCarts, showSpinner, setShowSpinner }}>
        <Routes />
        <Spinner
          visible={showSpinner}
          // textContent={'Loading...'}
          //   textStyle={styles.spinnerTextStyle}
        />
      </AppContext.Provider>
    </RootSiblingParent>
  );
};

export default App;
