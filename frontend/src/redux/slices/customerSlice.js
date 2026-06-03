import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '../../api';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await customerApi.getAll();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerApi.create(data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue({ message: error.message, errors: error.errors });
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await customerApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCustomerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearCustomerError } = customerSlice.actions;
export default customerSlice.reducer;
