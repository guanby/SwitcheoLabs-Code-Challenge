import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import Headers from './Components/HeaderComponents/Headers';
import SwapComponent from './Components/Swap/SwapComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Headers />
    <SwapComponent />
    <App />
  </React.StrictMode>
);

