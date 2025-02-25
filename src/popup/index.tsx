import React from 'react';
import ReactDOM from 'react-dom/client';
import Popup from './Popup';
import '../styles/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('grammar-enhancer-container') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
); 