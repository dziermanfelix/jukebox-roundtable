import Jukebox from '../models/JukeboxModel.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { StatusCodes } from 'http-status-codes';
import { createJwt } from '../utils/tokenUtils.js';
import { nodeEnv } from '../utils/environmentVariables.js';
import {
  createSession,
  getSessionFromWebTokenAndJukebox,
  webTokenMatchesJukebox,
  cleanupSessionFromId,
  cleanupSessionFromWebToken,
} from './sessionController.js';
import { jukeboxDoesNotExistError } from '../errors/errorMessages.js';

export const login = async (req, res) => {
  const jukebox = await Jukebox.findOne({ name: req.body.name });
  if (!jukebox) return res.status(StatusCodes.NOT_FOUND).json(jukeboxDoesNotExistError(req.body.name));
  const userAuthenticated = jukebox && (await comparePassword(req.body.code, jukebox.code));
  if (!userAuthenticated) throw new UnauthenticatedError('invalid credentials');
  let webToken = req.cookies.webToken;
  if ((webToken && !webTokenMatchesJukebox(webToken, jukebox.name)) || !webToken) {
    // cleanup old session
    if (webToken) {
      if (await getSessionFromWebTokenAndJukebox(webToken, jukebox.name)) {
        await cleanupSessionFromWebToken(webToken);
      }
    }
    webToken = createJwt({ name: jukebox.name });
    const oneDay = 1000 * 60 * 60 * 24; // in milliseconds
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: nodeEnv === 'production',
    };
    res.cookie('webToken', webToken, cookieOptions);
    await createSession(req, res, webToken);
  }
  return res.status(StatusCodes.OK).json({ msg: `user logged into jukebox ${jukebox.name}` });
};

export const logout = async (req, res) => {
  if (req.cookies.webToken) {
    res.clearCookie('webToken');
  }
  await cleanupSessionFromId(req.body.sessionId);
  return res.status(StatusCodes.OK).json({ msg: `user logged out from session ${req.body.sessionId}` });
};
