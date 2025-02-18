import Session from '../models/SessionModel.js';
import { StatusCodes } from 'http-status-codes';
import { addToQueueOrder } from './queueOrderController.js';
import { getWebTokenFromRequest } from '../utils/tokenUtils.js';
import { noSessionWithWebTokenError } from '../common/responseMessages.js';

export const createSession = async (jukebox, webToken, role) => {
  if (await Session.exists({ webToken: webToken })) return null;
  const session = await Session.create({ webToken: webToken, role: role, jukebox: jukebox._id });
  await addToQueueOrder(jukebox, session);
  return session;
};

export const getSession = async (req, res) => {
  const webToken = getWebTokenFromRequest(req, req.params.id);
  const session = await getSessionFromWebToken(webToken);
  if (!session) {
    return res.status(StatusCodes.NOT_FOUND).json(noSessionWithWebTokenError(webToken));
  }
  return res.status(StatusCodes.OK).json({ session: session });
};

export async function getSessionFromWebToken(webToken) {
  const session = await Session.findOne({ webToken: webToken });
  return session;
}

export async function getSessionFromId(sessionId) {
  const session = await Session.findOne({ _id: sessionId });
  return session;
}

export const updateSession = async (req, res) => {
  const newSession = { ...req.body };
  const updatedSession = await Session.findByIdAndUpdate(newSession._id, newSession, { new: true });
  return res.status(StatusCodes.OK).json({ session: updatedSession });
};

export const deleteSession = async (req, res) => {
  const sessionId = req.body.sessionId;
  const session = await Session.findOneAndDelete({ sessionId: sessionId });
  if (!session) {
    return res.status(404).json({ msg: `no session with id ${sessionId}` });
  }
  return res.status(StatusCodes.OK).json({ msg: 'user logged out and session deleted', session: session });
};

export async function deleteSessionFromId(sessionId) {
  const deletedSession = await Session.findByIdAndDelete(sessionId);
  return deletedSession;
}

export async function webTokenMatchesJukebox(webToken, jukebox) {
  const session = await getSessionFromWebToken(webToken);
  if (session) {
    return String(session.jukebox) === String(jukebox._id);
  }
  return false;
}

export async function deleteSessionsFromJukebox(jukebox) {
  await Session.deleteMany({ jukebox: jukebox });
}

export async function updateDisplayName(req, res) {
  const session = await Session.findOne({ _id: req.params.id });
  session.displayName = req.body.displayName;
  const updatedSession = await Session.findByIdAndUpdate(session._id, session, { new: true });
  return res.status(StatusCodes.OK).json({ session: updatedSession });
}
