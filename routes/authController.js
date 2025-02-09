import Jukebox from '../models/JukeboxModel.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { StatusCodes } from 'http-status-codes';
import { createJwt, getCookieOptions, getWebTokenFromRequest, getWebTokenKey } from '../utils/tokenUtils.js';
import { createSession, webTokenMatchesJukebox, cleanupSessionFromId } from './sessionController.js';
import { jukeboxBadCredentialsError, jukeboxSuccessfulLogout, sessionExistsError } from '../common/responseMessages.js';
import { generateRandomString } from '../common/string.js';
import { removeFromQueueOrder } from './queueOrderController.js';
import { Role } from '../utils/roles.js';
import { createJukeboxDb } from './jukeboxController.js';

export const login = async (req, res) => {
  let jukebox = await Jukebox.findOne({ name: req.body.name });
  let role = Role.JOINER;
  let userAuthenticated = true;
  if (!jukebox) {
    role = Role.STARTER;
    jukebox = await createJukeboxDb(req.body.name, req.body.code, req.body.role);
  } else {
    userAuthenticated = jukebox && (await comparePassword(req.body.code, jukebox.code));
    if (!userAuthenticated) return res.status(StatusCodes.UNAUTHORIZED).json(jukeboxBadCredentialsError(req.body.name));
  }
  let webToken = getWebTokenFromRequest(req, jukebox.name);
  let needNewSession = true;
  if (webToken) {
    if (await webTokenMatchesJukebox(webToken, jukebox)) {
      needNewSession = false;
    }
  }
  if (needNewSession) {
    webToken = createJwt({ name: jukebox.name, randomString: generateRandomString(10) });
    const session = await createSession(jukebox, webToken, role);
    if (!session) return res.status(StatusCodes.BAD_REQUEST).json(sessionExistsError(webToken));
  }
  res.cookie(getWebTokenKey(jukebox.name), webToken, getCookieOptions());
  return res.status(StatusCodes.OK).json({ jukebox: jukebox, role: role });
};

export const logout = async (req, res) => {
  if (req.cookies[`${req.body.name}WebToken`]) {
    res.clearCookie(`${req.body.name}WebToken`);
  }
  await cleanupSessionFromId(req.body.sessionId);
  await removeFromQueueOrder(req.body.name, req.body.sessionId);
  return res.status(StatusCodes.OK).json(jukeboxSuccessfulLogout(req.body.name, req.body.sessionId));
};
