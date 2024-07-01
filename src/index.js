import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux'
import "react-toastify/dist/ReactToastify.css";
import TimeAgo from 'javascript-time-ago'
import $ from 'jquery';
import Stepper from 'bs-stepper'

import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);

