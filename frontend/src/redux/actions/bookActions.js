import { fetchBooks } from '../slices/bookSlice';

// Re-exporting the thunk from the slice to maintain folder structure convention
export const listBooks = () => (dispatch) => {
  dispatch(fetchBooks());
};