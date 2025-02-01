import { StatusCodes } from 'http-status-codes';
import { UnauthenticatedError, UnauthorizedError } from '../errors/customErrors.js';
import { verifyJwt } from '../utils/tokenUtils.js';
import { noToken } from '../common/responseMessages.js';

export const authenticateUser = (req, res, next) => {
  const { webToken } = req.cookies;
  if (!webToken) {
    return res.status(StatusCodes.FORBIDDEN).json(noToken());
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
