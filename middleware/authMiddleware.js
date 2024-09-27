import { UnauthenticatedError } from '../errors/customErrors.js';
import { verifyJwt } from '../utils/tokenUtils.js';

export const authenticateToken = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError('invalid token');
  }
  try {
    const { name } = verifyJwt(token);
    req.jukebox = { name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};
