import SessionOrder from '../models/SessionOrderModel.js';
import { StatusCodes } from 'http-status-codes';
import { getJukeboxByName } from './jukeboxController.js';

export const setOrder = async (req, res) => {
  const sessions = await setOrderDb(req.params.id, req.body.order);
  return res.status(StatusCodes.OK).json({ sessions });
};

export const getOrder = async (req, res) => {
  const sessions = await getOrderDb(req.params.id);
  if (sessions.length == 0) {
    return res.status(StatusCodes.OK).json({ sessions: [] });
  }
  return res.status(StatusCodes.OK).json({ sessions });
};

export async function getSessionOrderForJukebox(jukeboxName) {
  const jukebox = await getJukeboxByName(jukeboxName);
  return await SessionOrder.find({ jukebox: jukebox._id });
}

export async function addToSessionOrder(jukebox, session) {
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

export async function removeFromSessionOrder(jukeboxName, sessionId) {
  let strippedSession = { _id: sessionId };
  let sessions = await getOrderDb(jukeboxName);
  if (sessions != null) {
    sessions.remove(strippedSession);
  }
  return await setOrderDb(jukeboxName, sessions);
}

export async function getOrderDb(jukeboxName) {
  const jukebox = await getJukeboxByName(jukeboxName);
  const sessionOrder = await SessionOrder.findOne({ jukebox: jukebox._id });
  if (sessionOrder) return sessionOrder.sessions;
  return null;
}

export async function setOrderDb(jukeboxName, sessions) {
  const jukebox = await getJukeboxByName(jukeboxName);
  let sessionOrder = await SessionOrder.findOne({ jukebox: jukebox._id });
  if (!sessionOrder) {
    sessionOrder = await createSessionOrder(jukebox, sessions);
  } else {
    sessionOrder.sessions = sessions;
    sessionOrder = await SessionOrder.findByIdAndUpdate(sessionOrder._id, sessionOrder, { new: true });
  }
  return sessionOrder.sessions;
}

async function createSessionOrder(jukebox, sessions) {
  return await SessionOrder.create({ jukebox: jukebox._id, sessions: sessions });
}
