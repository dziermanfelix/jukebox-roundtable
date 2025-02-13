import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn } from './environmentVariables.js';
import { nodeEnv } from '../utils/environmentVariables.js';
import { parse } from 'set-cookie-parser';

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

export function getWebTokenFromRequest(req, jukeboxName) {
  return req['cookies'][getWebTokenKey(jukeboxName)];
}

export function getWebTokenKey(jukeboxName) {
  return `${jukeboxName}WebToken`;
}

export function getWebTokenFromResponse(response) {
  const jukeboxName = response?.body?.jukebox?.name;
  if (!jukeboxName) return undefined;
  const cookies = parse(response);
  const webToken = cookies.find((cookie) => cookie.name === `${jukeboxName}WebToken`);
  if (webToken) return webToken.value;
  return undefined;
}
