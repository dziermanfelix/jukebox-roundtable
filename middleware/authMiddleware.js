import { UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import { verifyJwt } from '../utils/tokenUtils.js';

export const authenticateUser = (req, res, next) => {
  const { webToken } = req.cookies;
  if (!webToken) {
    throw new UnauthenticatedError('no token');
  }
  try {
    const urlName = req.originalUrl.split('/').pop();
    const { name: tokenName } = verifyJwt(webToken);
    if (urlName != tokenName) {
      throw new UnauthorizedError(`sign in to join jukebox ${urlName}`);
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
