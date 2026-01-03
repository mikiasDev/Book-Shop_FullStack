import { addToCart, removeFromCart } from '../slices/cartSlice';

export const addItemToCart = (item, qty) => (dispatch) => {
  dispatch(addToCart({ ...item, qty }));
};

export const removeItemFromCart = (id) => (dispatch) => {
  dispatch(removeFromCart(id));
};