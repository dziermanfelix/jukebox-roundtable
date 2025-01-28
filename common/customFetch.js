import axios from 'axios';
import { apiVersionBaseUrl } from './api';

const customFetch = axios.create({
  baseURL: apiVersionBaseUrl,
});

export default customFetch;
