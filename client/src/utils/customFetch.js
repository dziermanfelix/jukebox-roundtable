import axios from 'axios';
import { apiVersionBaseUrl } from '../../../global/api';

const customFetch = axios.create({
  baseURL: apiVersionBaseUrl,
});
export default customFetch;
