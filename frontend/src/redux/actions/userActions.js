import { login, logout, register, updateProfile } from '../slices/userSlice';

export const loginUser = (email, password) => (dispatch) => {
  dispatch(login({ email, password }));
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};

export const registerUser = (name, email, password) => (dispatch) => {
  dispatch(register({ name, email, password }));
};

export const updateUserProfile = (user) => (dispatch) => {
  dispatch(updateProfile(user));
};