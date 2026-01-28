import { createSlice } from '@reduxjs/toolkit';
import { addRoutePrefix, fetchRoutePrefix, editRouteprefix, removeRouteprefix} from './routePrefixThunks';

const routePrefixSlice = createSlice({
  name: 'routePrefix',
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
      .addCase(fetchRoutePrefix.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoutePrefix.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.isLoaded = true;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchRoutePrefix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addRoutePrefix.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editRouteprefix.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.customerid);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeRouteprefix.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
      });
  }
});

export default routePrefixSlice.reducer;
