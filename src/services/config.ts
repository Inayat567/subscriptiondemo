import axios from 'axios';
const AXIOS_BASE_URL = "http://192.168.18.123:8000/"; // change this to your local server url or production url if backend live

export const BASE_URL = axios.create({
  baseURL: AXIOS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});