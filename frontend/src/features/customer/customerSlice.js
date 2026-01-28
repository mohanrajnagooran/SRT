import { createSlice } from '@reduxjs/toolkit';
import { fetchCustomers, addCustomer, editCustomer, removeCustomer } from './customerThunks';

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    list: [],
    loading: false,
    error: null,
    isLoaded: false,
    page: 1,
    totalPages: 0,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.isLoaded = true;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editCustomer.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.customerid);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeCustomer.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
      });
  }
});

export default customerSlice.reducer;
