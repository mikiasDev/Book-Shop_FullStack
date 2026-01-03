import { apiSlice } from './apiSlice';

export const staffActivityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaffActivity: builder.query({
      query: () => ({
        url: '/api/staff/activity',
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),
    logStaffActivity: builder.mutation({
      query: (data) => ({
        url: '/api/staff/activity',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useGetStaffActivityQuery,
  useLogStaffActivityMutation,
} = staffActivityApiSlice;
