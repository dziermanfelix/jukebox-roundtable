import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from './environmentVariables.js';

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

export const createUsername = () => {
  return 'specialmink';
};
