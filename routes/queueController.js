import Queue from '../models/QueueModel.js';
import { StatusCodes } from 'http-status-codes';

export const setQueue = async (req, res) => {
  const queue = await setQueueDb(req.params.id, req.body.sessionId, req.body);
  return res.status(StatusCodes.CREATED).json({ queue });
};

export const getQueue = async (req, res) => {
  const queue = await getQueueDb(req.params.id, req.body.sessionId);
  if (!queue) {
    return res.status(StatusCodes.OK).json({ queue: { tracks: [] } });
  }
  return res.status(StatusCodes.OK).json({ queue });
};

export async function getQueueDb(jukebox, sessionId) {
  return await Queue.findOne({ jukebox: jukebox, sessionId: sessionId });
}

export async function setQueueDb(jukebox, sessionId, queue) {
  queue.jukebox = jukebox;
  return await Queue.replaceOne({ jukebox: jukebox, sessionId: sessionId }, queue, {
    upsert: true,
  });
}

export async function deleteQueueFromSessionId(sessionId) {
  return await Queue.findOneAndDelete({ sessionId: sessionId });
}
