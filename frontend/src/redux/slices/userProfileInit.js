import { setCredentials, logout } from './authSlice';
import { userApiSlice } from './userApiSlice';

// Thunk to fetch current authenticated user from backend session (cookie)
export const fetchAndInitUserProfile = () => async (dispatch) => {
  try {
    const res = await dispatch(userApiSlice.endpoints.getMe.initiate());
    if (res.data && res.data._id) {
      dispatch(setCredentials(res.data));
    } else {
      dispatch(logout());
    }
  } catch (err) {
    dispatch(logout());
  }
};
