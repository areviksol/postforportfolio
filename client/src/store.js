// store.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import postReducer from './reducers/posts';

const rootReducer = combineReducers({
  posts: postReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
