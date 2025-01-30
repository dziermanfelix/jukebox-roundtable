import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from './environmentVariables.js';
import { nodeEnv } from '../utils/environmentVariables.js';

export const getCookieOptions = () => {
  const oneDay = 1000 * 60 * 60 * 24; // in milliseconds
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: nodeEnv === 'production',
  };
  return cookieOptions;
};

export const createJwt = (payload) => {
  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
  return token;
};

export const verifyJwt = (token) => {
  const decoded = jwt.verify(token, jwtSecret);
  return decoded;
};
