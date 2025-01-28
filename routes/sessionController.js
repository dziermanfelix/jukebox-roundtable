import Session from '../models/SessionModel.js';
import { StatusCodes } from 'http-status-codes';
import { deleteQueueFromSessionId } from './queueController.js';

export const createSession = async (req, res, webToken) => {
  req.body.jukebox = req.body.name;
  req.body.webToken = webToken;
  return await Session.create(req.body);
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
  const session = getSessionFromWebToken(webToken);
  return session.jukebox === jukebox;
}

export async function cleanupSessionFromWebToken(webToken) {
  const { _id: sessionId } = await getSessionFromWebToken(webToken);
  await cleanupSessionFromId(sessionId);
}

export async function cleanupSessionFromId(sessionId) {
  await deleteSessionFromId(sessionId);
  await deleteQueueFromSessionId(sessionId);
}
