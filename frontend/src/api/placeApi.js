import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/places`;

export const getPlaces = () => axios.get(API_URL);
export const getPlace = (id) => axios.get(`${API_URL}/${id}`);
export const createPlace = (data) => axios.post(API_URL, data);
export const updatePlace = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePlace = (id, reason) => axios.patch(`${API_URL}/${id}`, {reason} );
