import { apiSlice } from './apiSlice';

// We explicitly set this to /api/books to match your database
const BOOKS_URL = '/api/books'; 

export const booksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: ({ keyword, author, category, language, minPrice, maxPrice, pageNumber }) => ({
        url: BOOKS_URL,
        params: { keyword, author, category, language, minPrice, maxPrice, pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    getBookDetails: builder.query({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createBook: builder.mutation({
      query: (data) => ({
        url: BOOKS_URL,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Book'],
    }),
    updateBook: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Book'],
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `${BOOKS_URL}/${bookId}`,
        method: 'DELETE',
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Book'],
    }),
    deleteReview: builder.mutation({
      query: (data) => ({
        url: `${BOOKS_URL}/${data.bookId}/reviews/${data.reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Book'],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    uploadBookFile: builder.mutation({
      query: (data) => ({
        url: `/api/upload/file`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { 
  useGetBooksQuery, 
  useGetBookDetailsQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUploadProductImageMutation,
  useUploadBookFileMutation,
} = booksApiSlice;