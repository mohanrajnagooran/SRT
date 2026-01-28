import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/lrApi';


export const fetchLrs = createAsyncThunk('lr/fetchAll', async (params = {}) => {
  const res = await api.getLrs(params);
  return res.data;
});

export const addLr = createAsyncThunk('lr/add', async (data) => {
  const res = await api.createLr(data);
  return res.data;
});

export const editLr = createAsyncThunk('lr/edit', async ({ id, data }) => {
  const res = await api.updateLr(id, data);
  return res.data;
});

export const removeLr = createAsyncThunk('lr/delete', async ({ id, reason }) => {
  await api.deleteLr(id, reason);
  return id;
});
