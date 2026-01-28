import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/articles`;

export const getArticles = () => axios.get(API_URL);
export const getArticle = (id) => axios.get(`${API_URL}/${id}`);
export const createArticle = (data) => axios.post(API_URL, data);
export const updateArticle = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteArticle = (id, reason) => axios.patch(`${API_URL}/${id}`, {reason});
