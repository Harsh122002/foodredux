import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCart = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage", error);
    return [];
  }
};

const initialState = {
  cart: loadCart(),
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
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.cart));
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
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem("cart");
    },
  },
});

// Selectors
export const selectTotalItems = (state) => state.cart.cart.length;

export const TotalAmount = (state) => {
  return state.cart.cart.reduce((total, product) => {
    return (total + (product.price*10) * product.qty) ;
  }, 0);
};

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
