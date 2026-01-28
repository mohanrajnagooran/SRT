import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/placeApi';

export const fetchPlaces = createAsyncThunk('place/fetchAll', async () => {
  const res = await api.getPlaces();
  return res.data;
});

export const addPlace = createAsyncThunk('place/add', async (data, { rejectWithValue }) => {
  try {
      const res = await api.createPlace(data);
      return res.data;
    } catch (err) {
      // Pass backend error response to the rejected action payload
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data);
      }
      return rejectWithValue({ error: 'Network error' });
    }
});

export const editPlace = createAsyncThunk('place/edit', async ({ id, data }) => {
  const res = await api.updatePlace(id, data);
  return res.data;
});

export const removePlace = createAsyncThunk('place/delete', async ({id, reason}) => {
  await api.deletePlace(id, reason);
  return id;
});
