import { apiSlice } from './apiSlice';

export const activityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecentActivity: builder.query({
      query: () => ({
        url: '/api/activity/recent',
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetRecentActivityQuery } = activityApiSlice;
