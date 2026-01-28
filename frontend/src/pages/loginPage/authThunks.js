import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../api/config';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data; // { user, token }
    } catch (error) {
      // Handle error response
      console.log('Login error:', error);
      
      return thunkAPI.rejectWithValue(error.response.data.message || "Login failed");
    }
  }
);

