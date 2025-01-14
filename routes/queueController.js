import Queue from '../models/QueueModel.js';
import { StatusCodes } from 'http-status-codes';

export const setQueue = async (req, res) => {
  const queue = await setQueueDb(req.params.id, req.body.username, req.body);
  return res.status(StatusCodes.CREATED).json({ queue });
};

export const getQueue = async (req, res) => {
  const queue = await getQueueDb(req.params.id, req.body.username);
  if (!queue) {
    return res.status(StatusCodes.OK).json({ queue: { tracks: [] } });
  }
  return res.status(StatusCodes.OK).json({ queue });
};

export async function getQueueDb(jukebox, username) {
  return await Queue.findOne({ jukebox: jukebox, username: username });
}

export async function setQueueDb(jukebox, username, queue) {
  queue.jukebox = jukebox;
  return await Queue.replaceOne({ jukebox: jukebox, username: username }, queue, {
    upsert: true,
  });
}
