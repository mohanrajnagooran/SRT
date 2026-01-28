import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/customers`;

export const getCustomers = (params) => axios.get(API_URL, { params });
export const getCustomer = (id) => axios.get(`${API_URL}/${id}`);
export const createCustomer = (data) => axios.post(API_URL, data);
export const updateCustomer = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteCustomer = (id, reason) => axios.patch(`${API_URL}/${id}`, {reason});
