/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { ThemeProvider } from 'react-native-elements';
import theme from './src/theme';

const Main = () => (
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);

AppRegistry.registerComponent(appName, () => Main);
