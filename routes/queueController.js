import Queue from '../models/QueueModel.js';
import { StatusCodes } from 'http-status-codes';

export const setQueue = async (req, res) => {
  const newQueue = req.body;
  newQueue.jukebox = req.params.id;
  const queue = await Queue.replaceOne({ jukebox: newQueue.jukebox, username: newQueue.username }, newQueue, {
    upsert: true,
  });
  return res.status(StatusCodes.CREATED).json({ queue });
};

export const getQueue = async (req, res) => {
  const jukebox = req.params.id;
  const username = req.body.username;
  var queue = await Queue.findOne({ jukebox: jukebox, username: username });
  if (!queue) {
    // return empty list
    return res.status(StatusCodes.OK).json({ queue: { tracks: [] } });
  }
  return res.status(StatusCodes.OK).json({ queue });
};
