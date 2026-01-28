import { createSlice } from '@reduxjs/toolkit';
import { fetchLrs, addLr, editLr, removeLr } from './lrThunks';

const lrSlice = createSlice({
  name: 'lr',
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
      .addCase(fetchLrs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLrs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.isLoaded = true;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchLrs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addLr.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editLr.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.customerid);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeLr.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
      });
  }
});

export default lrSlice.reducer;
