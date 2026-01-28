import { createSlice } from '@reduxjs/toolkit';
import { fetchPlaces, addPlace, editPlace, removePlace } from './placeThunks';

const placeSlice = createSlice({
  name: 'place',
  initialState: {
    list: [],
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.isLoaded = true;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPlace.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editPlace.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removePlace.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
      });
  }
});

export default placeSlice.reducer;
