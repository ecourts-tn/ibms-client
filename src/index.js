import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "react-toastify/dist/ReactToastify.css";
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en'
import './i18n';

TimeAgo.addDefaultLocale(en)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


