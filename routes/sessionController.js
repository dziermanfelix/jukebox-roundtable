import Session from '../models/SessionModel.js';
import { StatusCodes } from 'http-status-codes';
import { addToQueueOrder } from './queueOrderController.js';

export const createSession = async (req, jukebox, webToken) => {
  if (await Session.exists({ webToken: webToken })) return null;
  const sessionObj = { webToken: webToken, role: req.body.role, jukebox: jukebox._id };
  const session = await Session.create(sessionObj);
  await addToQueueOrder(jukebox, session);
  return session;
};

export const getSession = async (req, res) => {
  const webToken = req.cookies.webToken;
  const session = await getSessionFromWebToken(webToken);
  if (!session) {
    return res.status(404).json({ msg: `no session with webToken ${webToken}` });
  }
  return res.status(StatusCodes.OK).json({ session: session });
};

export async function getSessionFromWebToken(webToken) {
  const session = await Session.findOne({ webToken: webToken });
  return session;
}

export async function getSessionFromWebTokenAndJukebox(webToken, jukebox) {
  return await Session.findOne({ webToken: webToken, jukebox: jukebox });
}

export const updateSession = async (req, res) => {
  const newSession = { ...req.body };
  const updatedSession = await Session.findByIdAndUpdate(req.body._id, newSession, { new: true });
  return res.status(StatusCodes.OK).json({ msg: 'session updated', session: updatedSession });
};

export const deleteSession = async (req, res) => {
  const sessionId = req.body.sessionId;
  const session = await Session.findOneAndDelete({ sessionId: sessionId });
  if (!session) {
    return res.status(404).json({ msg: `no session with id ${sessionId}` });
  }
  return res.status(StatusCodes.OK).json({ msg: 'user logged out and session deleted', session: session });
};

export async function deleteSessionFromWebToken(webToken) {
  const deletedSession = await Session.findOneAndDelete({ webToken: webToken });
  return deletedSession;
}

export async function deleteSessionFromId(sessionId) {
  const deletedSession = await Session.findByIdAndDelete(sessionId);
  return deletedSession;
}

export async function webTokenMatchesJukebox(webToken, jukebox) {
  const session = await getSessionFromWebToken(webToken);
  if (session) {
    const val = String(session.jukebox) === String(jukebox._id);
    return val;
  }
  return false;
}

export async function cleanupOldSessionFromWebToken(webToken) {
  const { _id: sessionId } = await getSessionFromWebToken(webToken);
  await cleanupSessionFromId(sessionId);
}

export async function cleanupSessionFromId(sessionId) {
  await deleteSessionFromId(sessionId);
}

export async function deleteSessionsFromJukebox(jukebox) {
  await Session.deleteMany({ jukebox: jukebox });
}

export async function getSessionsFromJukebox(jukebox) {
  return await Session.find({ jukebox: jukebox });
}
