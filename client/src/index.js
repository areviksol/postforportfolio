import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import postReducer from './components/reducers';
import thunk from 'redux-thunk';
const store = createStore(postReducer, applyMiddleware(thunk));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <BrowserRouter>  
    <App />
  </BrowserRouter>
  </Provider>,
);
