import { apiSlice } from './apiSlice';

export const staffApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query({
      query: () => ({
        url: '/api/staff',
        method: 'GET',
        credentials: 'include',
      }),
      keepUnusedDataFor: 5,
    }),
    addStaff: builder.mutation({
      query: (data) => {
        let body;
        if (data instanceof FormData) {
          body = data;
        } else {
          body = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) body.append(key, value);
          });
        }
        return {
          url: '/api/staff',
          method: 'POST',
          body,
          credentials: 'include',
        };
      },
    }),
    updateStaff: builder.mutation({
      query: ({ id, ...data }) => {
        let body;
        if (data instanceof FormData) {
          body = data;
        } else {
          body = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) body.append(key, value);
          });
        }
        return {
          url: `/api/staff/${id}`,
          method: 'PUT',
          body,
          credentials: 'include',
        };
      },
    }),
    deleteStaff: builder.mutation({
      query: (id) => ({
        url: `/api/staff/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} = staffApiSlice;
