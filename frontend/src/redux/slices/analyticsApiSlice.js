import { apiSlice } from './apiSlice';

export const analyticsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsSummary: builder.query({
      query: () => ({
        url: '/api/analytics/summary',
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetAnalyticsSummaryQuery } = analyticsApiSlice;
