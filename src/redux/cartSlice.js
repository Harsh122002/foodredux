import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item.id === product.id);

      if (existingProduct) {
        existingProduct.qty = Math.min(existingProduct.qty + 1, 4);
      } else {
        state.cart.push({ ...product, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    updateQty: (state, action) => {
      const { id, type } = action.payload;
      const product = state.cart.find((item) => item.id === id);

      if (product) {
        if (type === "add") {
          product.qty = Math.min(product.qty + 1, 4);
        } else if (type === "subtract") {
          product.qty = Math.max(product.qty - 1, 1);
        }
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// Selector to get the total number of products
export const selectTotalItems = (state) => {
  return state.cart.cart.length;
};

export const { addToCart, removeFromCart, updateQty, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
