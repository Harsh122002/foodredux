import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./loginSlice";
import cartReducer from "./cartSlice";
import modeReducer from "./lightDark";
import favoritesReducer from "./favoritesSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    mode: modeReducer,
    favorites: favoritesReducer,

  },
});

export default store;
