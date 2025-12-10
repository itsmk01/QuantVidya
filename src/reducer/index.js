import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../slices/authSlice";
import profileReducer from "../slices/profileSlice";
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice";

const authPersistConfig = {
  key: "auth",
  version: 1,
  storage,
  whitelist: ["user", "token"],  // Only these are persisted
};

const coursePersistConfig = {
  key: "course",
  version: 1,
  storage,
  whitelist: ["step", "course", "editCourse"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),  // Wrap only auth
  profile: profileReducer,
  cart: cartReducer,
  course: persistReducer(coursePersistConfig, courseReducer),
});

export default rootReducer;

