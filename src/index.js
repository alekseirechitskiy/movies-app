import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './components/app';
var a = 'text';
console.log();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
