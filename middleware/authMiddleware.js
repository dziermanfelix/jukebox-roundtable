import { StatusCodes } from 'http-status-codes';
import { verifyJwt } from '../utils/tokenUtils.js';
import { notAuthorizedToJoinJukebox, noToken, placeHolder } from '../common/responseMessages.js';

export const authenticateUser = (req, res, next) => {
  const { webToken } = req.cookies;
  if (!webToken) {
    return res.status(StatusCodes.FORBIDDEN).json(noToken());
  }
  try {
    const jukeboxNameFromUrl = req.originalUrl.split('/').pop();
    const { name: jukeboxNameFromToken } = verifyJwt(webToken);
    if (jukeboxNameFromUrl != jukeboxNameFromToken) {
      return res.status(StatusCodes.FORBIDDEN).json(notAuthorizedToJoinJukebox(jukeboxNameFromUrl));
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.FORBIDDEN).json(placeHolder(jukeboxNameFromUrl));
  }
};
