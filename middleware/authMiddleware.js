import { StatusCodes } from 'http-status-codes';
import { getWebTokenFromRequest, verifyJwt } from '../utils/tokenUtils.js';
import { notAuthorizedToJoinJukebox, noToken, placeHolder } from '../common/responseMessages.js';

export const authenticateUser = (req, res, next) => {
  const jukeboxName = req.originalUrl.split('/').pop();
  const webToken = getWebTokenFromRequest(req, jukeboxName);
  if (!webToken) {
    return res.status(StatusCodes.FORBIDDEN).json(noToken());
  }
  try {
    const { name: jukeboxNameFromToken } = verifyJwt(webToken);
    if (jukeboxName != jukeboxNameFromToken) {
      return res.status(StatusCodes.FORBIDDEN).json(notAuthorizedToJoinJukebox(jukeboxName));
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.FORBIDDEN).json(placeHolder(jukeboxName));
  }
};
