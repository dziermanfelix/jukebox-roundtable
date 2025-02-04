import Session from '../models/SessionModel.js';
import { StatusCodes } from 'http-status-codes';

export const setQueue = async (req, res) => {
  const queue = await setQueueDb(req.body.sessionId, req.body.queue);
  return res.status(StatusCodes.CREATED).json({ queue });
};

export const getQueue = async (req, res) => {
  const queue = await getQueueDb(req.body.sessionId);
  if (queue.length == 0) {
    return res.status(StatusCodes.OK).json({ queue: [] });
  }
  return res.status(StatusCodes.OK).json({ queue });
};

export async function getQueueDb(sessionId) {
  const session = await Session.findOne({ _id: sessionId });
  return session.queue;
}

export async function setQueueDb(sessionId, queue) {
  const session = await Session.findOne({ _id: sessionId });
  session.queue = queue;
  const newSession = await Session.findByIdAndUpdate(sessionId, session, { new: true });
  return newSession.queue;
}
