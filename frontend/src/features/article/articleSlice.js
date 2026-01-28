import { createSlice } from '@reduxjs/toolkit';
import { fetchArticles, addArticle, editArticle, removeArticle } from './articleThunks';

const articleSlice = createSlice({
  name: 'article',
  initialState: {
    list: [],
    loading: false,
    error: null,
    isLoaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.isLoaded = true;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addArticle.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editArticle.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.ID === action.payload.ID);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(removeArticle.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.ID !== action.payload);
      });
  }
});

export default articleSlice.reducer;
