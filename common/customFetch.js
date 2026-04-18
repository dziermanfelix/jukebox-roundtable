import axios from 'axios';
import { apiVersionBaseUrl } from './api';

const client = axios.create({
  baseURL: apiVersionBaseUrl,
});

export default client;
