import { apiSlice } from './apiSlice';

const ORDERS_URL = '/api/orders';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: { ...details },
      }),
    }),
    // Call this to get the Client Secret from backend
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/stripe/payment`,
        method: 'POST',
        body: data,
      }),
    }),
    // Call this to get the Public Key (You can also fetch this from an endpoint if you prefer)
    getStripeConfig: builder.query({
      query: () => ({
        url: '/api/config/stripe',
      }),
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),

    // Manual payment proof upload
    uploadPaymentProof: builder.mutation({
      query: ({ orderId, formData }) => ({
        url: `${ORDERS_URL}/${orderId}/payment-proof`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),
  }),
});

export const { 
  useCreateOrderMutation, 
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useCreatePaymentIntentMutation,
  useGetStripeConfigQuery,
  useGetOrdersQuery,
  useDeliverOrderMutation,
  useUploadPaymentProofMutation
} = ordersApiSlice;