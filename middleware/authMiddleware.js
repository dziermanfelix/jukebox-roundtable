import { UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import { verifyJwt } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError('no token');
  }
  try {
    const urlName = req.originalUrl.split('/').pop();
    const { name: tokenName } = verifyJwt(token);
    if (urlName != tokenName) {
      throw new UnauthorizedError('sign in to join jukebox');
    }
    req.jukebox = { name: tokenName };
    next();
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthenticatedError('authentication failed');
  }
};
