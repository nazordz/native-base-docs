import axios from 'axios';
import { Alert } from 'react-native';
import util from './util';
import RNFS from 'react-native-fs';

const http = axios.create({
  baseURL: 'https://ecommercev3.nstekdev.com/api/',
});

http.interceptors.request.use(async (axiosConfig) => {
  const httpConfig = { ...axiosConfig };
  const token = await util.getToken();
  // if (token && util.isTokenExpired(token)) {
  //   return util.refreshToken().then(async (data) => {
  //     const { token: newToken } = data;
  //     await util.setToken(newToken);
  //     httpConfig.headers.Authorization = `Bearer ${newToken}`;
  //     return Promise.resolve(httpConfig);
  //   });
  // }
  if (token) {
    httpConfig.headers.Authorization = `Bearer ${token}`;
  }
  return httpConfig;
});

http.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (err) {
    let errorMessage = [];
    console.log(err.response, 'keterangan');

    if (err.response.status !== 422) {
      errorMessage.push(err.response.data.message || err.response.statusText);
    } else {
      const { errors } = err.response.data;
      console.log(errors);
      errorMessage = Object.keys(errors).map((key) => errors[key][0]);
    }
    if (err.response.status !== 401) {
      errorMessage.forEach((message) => util.showToast(message));
    }
    return Promise.reject(err);
  },
);

const api = {
  getHomeData: async () => {
    try {
      const res = await http.get('product');
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getDetailProduct: async (id) => {
    try {
      const res = await http.get(`detail/${id}`);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getSearchProduct: async (query, filterMin, filterMax, sort) => {
    try {
      const data = {
        min: filterMin,
        max: filterMax,
        sort,
      };
      console.log(sort);

      const searchParams = new URLSearchParams(data);

      const res = await http.get(`search/${query}?${searchParams}`);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getCategories: async () => {
    try {
      const res = await http.get('category');
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getCategoryProduct: async (slug) => {
    try {
      const res = await http.get(`category/${slug}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  postRegister: async (name, phone, email, pwd, pwdConfirm) => {
    try {
      const res = await http.post('register', {
        name,
        email,
        phone,
        password: pwd,
        confirmPassword: pwdConfirm,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {}
  },

  postLogin: async (email, pwd) => {
    try {
      const res = await http.post('login', {
        email,
        pwd,
      });
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error.response.errors);
    }
  },

  getCheckOTP: async (phone, code) => {
    try {
      const res = await http.post('checkotp', {
        phone,
        otp: code,
      });
      console.log(phone, code);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  postLoginGoogle: async (user) => {
    try {
      const res = await http.post('login-google', user);
      console.log(res.data);
      return res.data;
    } catch (err) {
      let errorMessage = [];
      console.log(err);

      if (err.response.status !== 422) {
        errorMessage.push(err.response.data.message || err.response.statusText);
      } else {
        const { errors } = err.response.data;
        console.log(errors);
        errorMessage = Object.keys(errors).map((key) => errors[key][0]);
      }
      if (err.response.status !== 401) {
        errorMessage.forEach((message) => Alert.alert('Warning!', message));
      }
      return Promise.reject(err);
    }
  },

  getInfo: async (info) => {
    try {
      const res = await http.get(`get-info/${info}`);
      return res.data;
    } catch (error) {
      console.log(error.response.errors);
    }
  },

  getAccountInfo: async () => {
    try {
      const res = await http.get('account');
      return res.data;
    } catch (error) {
      console.log(error.response.errors);
    }
  },

  postDataCart: async (dataProduct) => {
    try {
      const res = await http.post('cart', {
        id: dataProduct,
      });
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  postDataCoupon: async (coupon) => {
    try {
      const res = await http.post('coupon', {
        coupon,
      });
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getProvince: async () => {
    try {
      const res = await http.get('rajaongkir/province');
      return res.data.rajaongkir;
    } catch (error) {
      alert(error.toString());
    }
  },

  postCity: async (provinceId) => {
    try {
      console.log(provinceId);
      const res = await http.post('rajaongkir/city', { province: provinceId });
      return res.data.rajaongkir;
    } catch (error) {
      alert(error.toString());
    }
  },

  postSubdistrict: async (cityId) => {
    try {
      const res = await http.post('rajaongkir/subdistrict', { city: cityId });
      return res.data.rajaongkir;
    } catch (error) {
      alert(error.toString());
    }
  },

  postOngkir: async (destination, weight) => {
    try {
      const res = await http.post('rajaongkir/ongkir', {
        destination,
        weight,
      });
      return res.data.rajaongkir;
    } catch (error) {
      alert(error.toString());
    }
  },

  getOrderData: async (token, status) => {
    try {
      const res = await http.post('order-process', {
        token,
        status,
      });
      console.log(token);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getOrderDetail: async (order_id) => {
    try {
      const res = await http.post('order-detail', {
        order_id,
      });
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getBanks: async () => {
    try {
      const res = await http.get('get-banks');
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getPaymentLimit: async () => {
    try {
      const res = await http.get('payment-limit');
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  postCheckout: async (
    alamat,
    total,
    grandTotal,
    hargaOngkir,
    courier,
    discount,
    couponCode,
    dataProduct,
    bank_id,
  ) => {
    try {
      const res = await http.post('checkout', {
        alamat,
        total,
        grandTotal,
        hargaOngkir,
        courier,
        discount,
        couponCode,
        dataProduct,
        bank_id,
      });
      console.log(res)
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  submitConfirmation: async (order_id) => {
    try {
      const res = await http.post('confirm-order', { order_id });
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  addAlamat: async (
    location,
    name,
    alamatProvince,
    alamatCity,
    alamatSubdistrict,
    zip,
    phone,
    detailAlamat,
    isMain,
  ) => {
    try {
      const res = await http.post('add-address', {
        location,
        name,
        alamatProvince,
        alamatCity,
        alamatSubdistrict,
        zip,
        phone,
        detailAlamat,
        isMain,
      });
      console.log('ini', res.data.message);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  editAlamat: async (
    id,
    location,
    name,
    alamatProvince,
    alamatCity,
    alamatSubdistrict,
    zip,
    phone,
    detailAlamat,
    isMain,
  ) => {
    try {
      const res = await http.post('edit-address', {
        id,
        location,
        name,
        alamatProvince,
        alamatCity,
        alamatSubdistrict,
        zip,
        phone,
        detailAlamat,
        isMain,
      });
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getAlamat: async () => {
    try {
      const res = await http.post('get-address');
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  addToWishlist: async (productId) => {
    try {
      const res = await http.post('add-to-wishlist', {
        productId,
      });
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  getWishlistedItem: async () => {
    try {
      const res = await http.post('get-wishlist');
      console.log(res.data);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  wishlist: async () => {
    try {
      const res = await http.post('wishlist');
      console.log(res.data);
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  uploadPic: async (data, url, orderId, fullpayment) => {
    // yang ini
    console.log(data, url, orderId);
    // 33 nya ada isinya ? iya ada
    // error nya apa sekarang ?
    // masih sama undefined status
    if (data.uri.startsWith('content://')) {
      const uriComponents = data.uri.split('/');
      const fileNameAndExtension = uriComponents[uriComponents.length - 1];
      const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
      await RNFS.copyFile(data.uri, destPath);
      let uri = data.uri;
      let name = data.fileName;
      let type = data.type;
      const file = { uri, name, type };
      const formData = new FormData();
      formData.append('image', file);
      formData.append('order_id', orderId);
      formData.append('fullpayment', fullpayment);
      try {
        const response = await http.post(url, formData, {
          headers: {
            Accept: 'application/json',
          },
        });
        console.log('response', response);
        return response.data;
      } catch (e) {
        console.log(e);
      }
    }
  },

  sendRequestProduct: async (data, url, productName, productType) => {
    if (data.uri.startsWith('content://')) {
      const uriComponents = data.uri.split('/');
      const fileNameAndExtension = uriComponents[uriComponents.length - 1];
      const destPath = `${RNFS.TemporaryDirectoryPath}/${fileNameAndExtension}`;
      await RNFS.copyFile(data.uri, destPath);
      let uri = data.uri;
      let name = data.fileName;
      let type = data.type;
      const file = { uri, name, type };
      const formData = new FormData();
      formData.append('image', file);
      formData.append('productName', productName);
      formData.append('productType', productType);
      try {
        const response = await http.post(url, formData, {
          headers: {
            Accept: 'application/json',
          },
        });
        console.log('response', response);
        return response.data;
      } catch (e) {
        console.log(e);
      }
    }
  },

  editProfile: async (name, email, phone, pwd, newPwd, confirmPwd) => {
    try {
      const res = await http.post('account-edit', {
        name,
        email,
        phone,
        pwd,
        newPwd,
        confirmPwd,
      });
      return res.data;
    } catch (error) {
      console.log(error.response.errors);
    }
  },

  getNotification: async () => {
    try {
      const res = await http.get('notification');
      return res.data;
    } catch (error) {
      alert(error.toString());
    }
  },

  addFcm: async (fcmToken) => {
    try {
      const res = await http.post('add-fcm-token', {
        fcmToken,
      });
      return res.data;
    } catch (error) {
      console.log(error.response.errors);
    }
  },

  addNotification: async (order_id, title, body) => {
    try {
      const res = await http.post('add-notification', {
        order_id,
        title,
        body,
      });
      return res.data;
    } catch (error) {
      console.log(error.response.errors);
    }
  },
};

export default api;
