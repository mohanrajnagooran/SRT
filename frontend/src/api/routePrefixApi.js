import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/route-prefix`;

export const getRoutePrefixes = () => axios.get(API_URL);
export const getRoutePrefix = (id) => axios.get(`${API_URL}/${id}`);
export const createRoutePrefix = (data) => axios.post(API_URL, data);
export const updateRoutePrefix = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteRoutePrefix = (id, reason) => axios.patch(`${API_URL}/${id}`, {reason} );