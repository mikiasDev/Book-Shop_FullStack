import { apiSlice } from './apiSlice';

const PUBLISHERS_URL = '/api/publishers';

export const publishersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPublishers: builder.query({
      query: ({ pageNumber = 1, pageSize = 5 }) => ({
        url: PUBLISHERS_URL,
        params: { pageNumber, pageSize },
      }),
      keepUnusedDataFor: 5,
    }),
    createPublisher: builder.mutation({
      query: (data) => ({
        url: PUBLISHERS_URL,
        method: 'POST',
        body: data,
      }),
    }),
    updatePublisher: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${PUBLISHERS_URL}/${id}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deletePublisher: builder.mutation({
      query: (id) => ({
        url: `${PUBLISHERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetPublishersQuery,
  useCreatePublisherMutation,
  useUpdatePublisherMutation,
  useDeletePublisherMutation,
} = publishersApiSlice;
