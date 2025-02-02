import Jukebox from '../models/JukeboxModel.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { StatusCodes } from 'http-status-codes';
import { createJwt, getCookieOptions as cookieOptions } from '../utils/tokenUtils.js';
import {
  createSession,
  getSessionFromWebTokenAndJukebox,
  webTokenMatchesJukebox,
  cleanupSessionFromId,
  cleanupSessionFromWebToken,
} from './sessionController.js';
import {
  jukeboxBadCredentialsError,
  jukeboxDoesNotExistError,
  jukeboxSuccessfulLogin,
  jukeboxSuccessfulLogout,
} from '../common/responseMessages.js';
import { generateRandomString } from '../common/string.js';

export const login = async (req, res) => {
  const jukebox = await Jukebox.findOne({ name: req.body.name });
  if (!jukebox) return res.status(StatusCodes.NOT_FOUND).json(jukeboxDoesNotExistError(req.body.name));
  const userAuthenticated = jukebox && (await comparePassword(req.body.code, jukebox.code));
  if (!userAuthenticated) return res.status(StatusCodes.UNAUTHORIZED).json(jukeboxBadCredentialsError(req.body.name));
  let webToken = req.cookies.webToken;
  if (webToken) {
    const webTokenMatches = await webTokenMatchesJukebox(webToken, jukebox.name);
    if (!webTokenMatches) {
      if (await getSessionFromWebTokenAndJukebox(webToken, jukebox.name)) {
        await cleanupSessionFromWebToken(webToken);
      }
      webToken = await newSessionAndWebToken(req, jukebox);
    }
  } else {
    webToken = await newSessionAndWebToken(req, jukebox);
  }
  res.cookie('webToken', webToken, cookieOptions());
  return res.status(StatusCodes.OK).json(jukeboxSuccessfulLogin(jukebox.name));
};

async function newSessionAndWebToken(req, jukebox) {
  const webToken = createJwt({ name: jukebox.name, randomString: generateRandomString(10) });
  await createSession(req, webToken);
  return webToken;
}

export const logout = async (req, res) => {
  if (req.cookies.webToken) {
    res.clearCookie('webToken');
  }
  await cleanupSessionFromId(req.body.sessionId);
  return res.status(StatusCodes.OK).json(jukeboxSuccessfulLogout(req.body.name, req.body.sessionId));
};
