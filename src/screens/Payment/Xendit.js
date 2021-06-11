import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import WebView from 'react-native-webview';
import api from '../../helpers/api';

const Xendit = ({ route }) => {
  const { id } = route.params;
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    const getData = await api.getOrderDetail(id);
    setData(getData);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <WebView
      source={{
        uri: `https://checkout-staging.xendit.co/web/${data.xendit_invoice_id}`,
      }}
    />
  );
};

export default Xendit;
