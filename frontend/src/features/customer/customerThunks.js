import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/customerApi';

export const fetchCustomers = createAsyncThunk('customer/fetchAll', async (params = {}) => {
  const res = await api.getCustomers(params);
  return res.data;
});

export const addCustomer = createAsyncThunk('customer/add', async (data) => {
  const res = await api.createCustomer(data);
  return res.data;
});

export const editCustomer = createAsyncThunk('customer/edit', async ({ id, data }) => {
  const res = await api.updateCustomer(id, data);
  console.log('Edited Customer:', res.data);
  
  return res.data;
});

export const removeCustomer = createAsyncThunk('customer/delete', async ({ id, reason }) => {
  await api.deleteCustomer(id, reason);
  return id;
});
