import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/articleApi';


export const fetchArticles = createAsyncThunk('article/fetchAll', async () => {
  const res = await api.getArticles();
  return res.data;
});

export const addArticle = createAsyncThunk('article/add', async (data) => {
  const res = await api.createArticle(data);
  return res.data;
});

export const editArticle = createAsyncThunk('article/edit', async ({ id, data }) => {
  const res = await api.updateArticle(id, data);
  return res.data;
});

export const removeArticle = createAsyncThunk('article/delete', async ({id, reason}) => {
  await api.deleteArticle(id, reason);
  return id;
});
