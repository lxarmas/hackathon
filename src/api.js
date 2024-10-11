

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000', // Default to local during development
  withCredentials: true,
});


export const registerUser = async (userData) => {
  return await api.post('/api/register', userData);
};

export const loginUser = async (userData) => {
  return await api.post('/api/login', userData);
};

