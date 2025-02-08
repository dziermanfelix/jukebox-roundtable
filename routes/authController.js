import Jukebox from '../models/JukeboxModel.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { StatusCodes } from 'http-status-codes';
import { createJwt, getCookieOptions as cookieOptions } from '../utils/tokenUtils.js';
import {
  createSession,
  getSessionFromWebTokenAndJukebox,
  webTokenMatchesJukebox,
  cleanupSessionFromId,
  cleanupOldSessionFromWebToken,
} from './sessionController.js';
import { jukeboxBadCredentialsError, jukeboxSuccessfulLogout, sessionExistsError } from '../common/responseMessages.js';
import { generateRandomString } from '../common/string.js';
import { removeFromQueueOrder } from './queueOrderController.js';
import { Role } from '../utils/roles.js';
import { createJukebox } from './jukeboxController.js';

export const login = async (req, res) => {
  let jukebox = await Jukebox.findOne({ name: req.body.name });
  req.body.role = Role.JOINER;
  let userAuthenticated = true;
  if (!jukebox) {
    req.body.role = Role.STARTER;
    jukebox = await createJukebox(req, res);
    // userAuthenticated = req.body.code === jukebox.code;
  } else {
    userAuthenticated = jukebox && (await comparePassword(req.body.code, jukebox.code));
    if (!userAuthenticated) return res.status(StatusCodes.UNAUTHORIZED).json(jukeboxBadCredentialsError(req.body.name));
  }
  let webToken = req.cookies.webToken;
  let needNewSession = true;
  if (webToken) {
    if (await webTokenMatchesJukebox(webToken, jukebox)) {
      needNewSession = false;
    } else {
      if (await getSessionFromWebTokenAndJukebox(webToken, jukebox)) {
        await cleanupOldSessionFromWebToken(webToken);
      }
    }
  }
  if (needNewSession) {
    webToken = createJwt({ name: jukebox.name, randomString: generateRandomString(10) });
    const session = await createSession(req, jukebox, webToken);
    if (!session) return res.status(StatusCodes.BAD_REQUEST).json(sessionExistsError(webToken));
  }
  res.cookie('webToken', webToken, cookieOptions());
  return res.status(StatusCodes.OK).json({ jukebox: jukebox, role: req.body.role });
};

export const logout = async (req, res) => {
  if (req.cookies.webToken) {
    res.clearCookie('webToken');
  }
  await cleanupSessionFromId(req.body.sessionId);
  await removeFromQueueOrder(req.body.name, req.body.sessionId);
  return res.status(StatusCodes.OK).json(jukeboxSuccessfulLogout(req.body.name, req.body.sessionId));
};
