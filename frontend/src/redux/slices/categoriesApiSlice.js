import { apiSlice } from './apiSlice';
import { BASE_URL } from '../constants/bookConstants'; // Assuming BASE_URL is defined here or similar

const CATEGORIES_URL = '/api/categories';

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ pageNumber = 1, pageSize = 5 } = {}) => ({
        url: `${CATEGORIES_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: CATEGORIES_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORIES_URL}/${data.categoryId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category', 'Book'], // Invalidate Book too as it updates books
    }),
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `${CATEGORIES_URL}/${categoryId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category', 'Book'],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApiSlice;