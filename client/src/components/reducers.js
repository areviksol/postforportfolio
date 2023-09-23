// reducers.js

import {
	FETCH_POSTS_SUCCESS,
	CREATE_POST_SUCCESS,
	UPDATE_POST_SUCCESS,
	DELETE_POST_SUCCESS,
  } from './actions';
  
  const initialState = {
	posts: [],
  };
  
  const postReducer = (state = initialState, action) => {
	switch (action.type) {
	  case FETCH_POSTS_SUCCESS:
		return {
		  ...state,
		  posts: action.payload,
		};
	  case CREATE_POST_SUCCESS:
		return {
		  ...state,
		  posts: [action.payload, ...state.posts, ],
		};
	  case UPDATE_POST_SUCCESS:
		return {
		  ...state,
		  posts: state.posts.map((post) =>
			post._id === action.payload._id ? action.payload : post
		  ),
		};
	  case DELETE_POST_SUCCESS:
		return {
		  ...state,
		  posts: state.posts.filter((post) => post._id !== action.payload),
		};
	  default:
		return state;
	}
  };
  
  export default postReducer;
  