import { apiSlice } from './apiSlice';

const AUTHORS_URL = '/api/authors';

export const authorsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAuthors: builder.query({
      query: ({ pageNumber = 1, pageSize = 6 }) => ({
        url: AUTHORS_URL,
        params: { pageNumber, pageSize },
      }),
      keepUnusedDataFor: 5,
    }),
    updateAuthor: builder.mutation({
      query: ({ oldName, newName }) => ({
        url: `${AUTHORS_URL}/${encodeURIComponent(oldName)}`,
        method: 'PUT',
        body: { name: newName },
      }),
    }),
  }),
});

export const { useGetAuthorsQuery, useUpdateAuthorMutation } = authorsApiSlice;
