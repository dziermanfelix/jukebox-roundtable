import Session from '../models/SessionModel.js';
import { StatusCodes } from 'http-status-codes';

export const setQueue = async (req, res) => {
  const queue = await setQueueForSessionId(req.params.id, req.body.queue);
  return res.status(StatusCodes.CREATED).json({ queue });
};

export const getQueue = async (req, res) => {
  const queue = await getQueueFromSessionId(req.params.id);
  if (queue.length == 0) {
    return res.status(StatusCodes.OK).json({ queue: [] });
  }
  return res.status(StatusCodes.OK).json({ queue });
};

export async function getQueueFromSessionId(sessionId) {
  const session = await Session.findOne({ _id: sessionId });
  return session.queue;
}

export async function setQueueForSessionId(sessionId, queue) {
  const session = await Session.findOne({ _id: sessionId });
  session.queue = queue;
  const newSession = await Session.findByIdAndUpdate(sessionId, session, { new: true });
  return newSession.queue;
}
