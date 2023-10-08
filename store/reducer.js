import { combineReducers } from "redux";

import postsReducer from "store/posts/reducer";
import appReducer from "store/app/reducer";

const reducers = {
  posts: postsReducer,
  app: appReducer
};

export default combineReducers(reducers);
