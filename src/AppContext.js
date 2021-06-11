import React from 'react';

const AppContext = React.createContext({
  carts: [],
  setCarts: () => null,
  showSpinner: false,
  setShowSpinner: () => null,
});

export default AppContext;
