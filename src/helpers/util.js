import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';
import Toast from 'react-native-root-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native';

const getTokenExpirationDate = (token) => {
  const decoded = jwtDecode(token);
  if (!Object.prototype.hasOwnProperty.call(decoded, 'exp')) {
    return null;
  }
  const date = new Date(0);
  date.setUTCSeconds(decoded.exp);
  return date;
};

const util = {
  getToken: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      alert(error.toString());
    }
  },

  setToken: async (newToken) => {
    await AsyncStorage.setItem('token', newToken);
  },

  showToast: (message) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      onShow: () => {
        // calls on toast\`s appear animation start
      },
      onShown: () => {
        // calls on toast\`s appear animation end.
      },
      onHide: () => {
        // calls on toast\`s hide animation start.
      },
      onHidden: () => {
        // calls on toast\`s hide animation end.
      },
    });
  },

  addToCart: async (productId) => {
    console.log(productId, 'productId');
    const products = JSON.parse(
      (await AsyncStorage.getItem('products')) || '[]',
    );
    const index = products.findIndex((product) => product.id === productId);

    if (index >= 0) {
      console.log(index);
      products[index].qty = products[index].qty + 1;
    } else {
      products.push({
        id: productId,
        qty: 1,
      });
    }

    await AsyncStorage.setItem('products', JSON.stringify(products));
  },

  addToCartDetail: async (productId, qty) => {
    console.log(productId, 'productId', 'qty', qty);
    const products = JSON.parse(
      (await AsyncStorage.getItem('products')) || '[]',
    );
    const index = products.findIndex((product) => product.id === productId);

    if (index >= 0) {
      console.log(index);
      products[index].qty = products[index].qty + qty;
    } else {
      products.push({
        id: productId,
        qty: qty,
      });
    }

    await AsyncStorage.setItem('products', JSON.stringify(products));
  },

  deceraseProductCart: async (productId) => {
    const products = JSON.parse(
      (await AsyncStorage.getItem('products')) || '[]',
    );
    const index = products.findIndex((product) => product.id === productId);

    if (index >= 0) {
      console.log(index);
      products[index].qty = products[index].qty - 1;
      if (products[index].qty < 1) {
        products.splice(index, 1);
      }
    } else {
      products.push({
        id: productId,
        qty: 1,
      });
    }

    await AsyncStorage.setItem('products', JSON.stringify(products));
  },

  removeProductCart: async (productId) => {
    const products = JSON.parse(
      (await AsyncStorage.getItem('products')) || '[]',
    );
    const index = products.findIndex((product) => product.id === productId);

    if (index >= 0) {
      console.log(index);
      // products[index].qty = 0;
      products.splice(index, 1);
    } else {
      products.push({
        id: productId,
        qty: 1,
      });
    }

    await AsyncStorage.setItem('products', JSON.stringify(products));
  },

  cameraLaunch: async () => {
    let options = {
      maxWidth: 720,
      maxHeight: 720,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return new Promise((resolve, reject) => {
          launchCamera(options, (res) => {
            console.log('Response = ', res);

            if (res.didCancel) {
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
              console.log('User tapped custom button: ', res.customButton);
              alert(res.customButton);
            } else {
              const source = { uri: res.uri };
              console.log('response camera', res);
              resolve(res);
            }
          });
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  },

  imageGalleryLaunch: async () => {
    let options = {
      quality: 0.1,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return new Promise((resolve, reject) => {
          launchImageLibrary(options, (res) => {
            console.log('Response = ', res);

            if (res.didCancel) {
              console.log('User cancelled image picker');
            } else if (res.error) {
              console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
              console.log('User tapped custom button: ', res.customButton);
              alert(res.customButton);
            } else {
              const source = { uri: res.uri };
              console.log('response galeri', JSON.stringify(res));
              // this.setState({
              //   filePath: res,
              //   fileData: res.data,
              //   fileUri: res.uri,
              // });
              resolve(res);
            }
          });
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  },
};

export default util;
