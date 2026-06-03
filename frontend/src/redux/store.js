import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';
import productReducer from './slices/productSlice';
import customerReducer from './slices/customerSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    products: productReducer,
    customers: customerReducer,
    orders: orderReducer,
  },
});
