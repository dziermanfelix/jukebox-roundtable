import { StatusCodes } from 'http-status-codes';
import { getJukeboxByName } from './jukeboxController.js';
import Jukebox from '../models/JukeboxModel.js';

export const setOrder = async (req, res) => {
  const sessions = await setOrderDb(req.params.id, req.body.order);
  return res.status(StatusCodes.OK).json({ sessions: sessions });
};

export const getOrder = async (req, res) => {
  const sessions = await getOrderDb(req.params.id);
  if (sessions.length == 0) {
    return res.status(StatusCodes.OK).json({ sessions: [] });
  }
  return res.status(StatusCodes.OK).json({ sessions: sessions });
};

export async function getQueueOrderForJukebox(jukeboxName) {
  const jukebox = await getJukeboxByName(jukeboxName);
  return jukebox.queueOrder;
}

export async function addToQueueOrder(jukebox, session) {
  let strippedSession = { _id: session._id };
  let sessions = await getOrderDb(jukebox.name);
  if (sessions != null) {
    sessions.push(strippedSession);
  } else {
    sessions = [strippedSession];
    return await createSessionOrder(jukebox, sessions);
  }
  return await setOrderDb(jukebox.name, sessions);
}

export async function removeFromQueueOrder(jukeboxName, sessionId) {
  let strippedSession = { _id: sessionId };
  let sessions = await getOrderDb(jukeboxName);
  if (sessions != null) {
    sessions.remove(strippedSession);
  }
  return await setOrderDb(jukeboxName, sessions);
}

export async function getOrderDb(jukeboxName) {
  const jukebox = await getJukeboxByName(jukeboxName);
  const order = jukebox.queueOrder;
  if (order) return order;
  return null;
}

export async function setOrderDb(jukeboxName, sessions) {
  const jukebox = await getJukeboxByName(jukeboxName);
  jukebox.queueOrder = sessions;
  await Jukebox.updateOne({ name: jukeboxName }, jukebox, { new: true });
  return jukebox.queueOrder;
}
