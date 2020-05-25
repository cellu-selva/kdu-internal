import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { history } from "./util/history";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/style.css";
import "@fortawesome/fontawesome-free/css/all.css";

// var $ = require('jquery');
// var dt = require('datatables.net')(window, $);

ReactDOM.render(
  <React.StrictMode>
    <Router history={history}>
      <AppProvider>
        <App />
        
      </AppProvider>
    </Router>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
