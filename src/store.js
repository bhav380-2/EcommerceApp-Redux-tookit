import { configureStore } from "@reduxjs/toolkit";

const { userReducer } = require("./redux/reducers/userReducer");
const { productReducer } = require("./redux/reducers/productReducer");

export const store = configureStore({
  reducer: { userReducer,productReducer }
});
