import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// --- FIX: Defined directly here to prevent "Module not found" error ---
const BASE_URL = ''; 
// We leave this empty because your package.json "proxy" handles the http://localhost:5000 part.

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL, credentials: 'include' });

// Wrapper to catch "Proxy Error" HTML responses (The "Force Fix" from before)
const baseQueryWithReauth = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);
    
    // Check if result is actual error or HTML parsing error (backend crash)
    if (result.error && result.error.status === 'PARSING_ERROR') {
      console.error("Backend returned HTML instead of JSON. Server might be restarting.");
      return {
        error: {
          status: 500,
          data: { message: "Server error. Please wait a moment and try again." }
        }
      };
    }
    return result;
  } catch (err) {
    return {
      error: {
        status: 500,
        data: { message: err.message }
      }
    };
  }
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'User', 'Book'],
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: '/api/upload',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = apiSlice;