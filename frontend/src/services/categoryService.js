// Service to fetch categories from backend
import axios from 'axios';

export const fetchCategories = async () => {
  const { data } = await axios.get('/api/categories');
  return data.categories;
};
