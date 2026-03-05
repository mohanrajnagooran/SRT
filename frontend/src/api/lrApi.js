import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/lrs`;

export const getLrs = (params) => axios.get(API_URL, { params });
export const getLr = (id) => axios.get(`${API_URL}/${id}`);
export const createLr = (data) => axios.post(API_URL, data);
export const updateLr = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteLr = (id, reason) => axios.patch(`${API_URL}/${id}`, { reason });

/* LR Report API */
export const getLrReport = (date) =>
  axios.get(`${API_URL}/report`, {
    params: { date },
  });