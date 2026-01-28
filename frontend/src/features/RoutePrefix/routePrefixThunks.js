import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/routePrefixApi';


export const fetchRoutePrefix = createAsyncThunk('routeprefix/fetchAll', async (params = {}) => {
  const res = await api.getRoutePrefixes(params);
  console.log(res.data);
  return res.data;
});

export const addRoutePrefix = createAsyncThunk('routeprefix/add', async (data) => {
  // const safeData = { ...data, place_ids: [...data.place_ids] };
  const res = await api.createRoutePrefix(data);
  return res.data;
});

export const editRouteprefix = createAsyncThunk('routeprefix/edit', async ({ id, data }) => {
  const res = await api.updateRoutePrefix(id, data);
  return res.data;
});

export const removeRouteprefix = createAsyncThunk('routeprefix/delete', async ({ id, reason }) => {
  await api.deleteRoutePrefix(id, reason);
  return id;
});
