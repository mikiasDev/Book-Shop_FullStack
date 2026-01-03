import { createSlice } from '@reduxjs/toolkit';

function getInitialCartState() {
  let stored = localStorage.getItem('cart');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        cartItems: Array.isArray(parsed.cartItems) ? parsed.cartItems : [],
      };
    } catch {
      // fallback if corrupted
      return { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };
    }
  }
  return { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };
}

const initialState = getInitialCartState();

const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // Defensive: ensure cartItems is always an array
      if (!Array.isArray(state.cartItems)) state.cartItems = [];
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id
            ? { ...x, qty: x.qty + (item.qty || 1) } // increase quantity
            : x
        );
      } else {
        state.cartItems = [...state.cartItems, { ...item, qty: item.qty || 1 }];
      }
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
      state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);
      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      
      // Recalculate prices
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
      state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
      state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
      state.totalPrice = (
        Number(state.itemsPrice) +
        Number(state.shippingPrice) +
        Number(state.taxPrice)
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // --- NEW: Resets the entire cart state (for Logout) ---
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = 'PayPal';
      state.itemsPrice = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart'); // Clears from browser storage
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart, // Export the new action
} = cartSlice.actions;

export default cartSlice.reducer;