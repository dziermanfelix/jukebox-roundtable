import Session from '../models/SessionModel.js';
import { Role } from '../utils/roles.js';
import { StatusCodes } from 'http-status-codes';

export const createStarterSession = async (req, res) => {
  req.body.role = Role.STARTER;
  req.body.jukebox = req.body.name;
  const { webToken } = req.cookies;
  req.body.webToken = webToken;
  const session = await Session.create(req.body);
  return res.status(StatusCodes.CREATED).json({ session });
};

export const createJoinerSession = async (req, res) => {
  req.body.role = Role.JOINER;
  req.body.jukebox = req.body.name;
  const { webToken } = req.cookies;
  req.body.webToken = webToken;
  const session = await Session.create(req.body);
  return res.status(StatusCodes.CREATED).json({ session });
};

export const createSession = async (req, res) => {
  const session = await Session.create(req.body);
  return res.status(StatusCodes.CREATED).json({ session });
};

export const getSession = async (req, res) => {
  const webToken = req.cookies.webToken;
  const session = await Session.findOne({ webToken: webToken });
  if (!session) {
    return res.status(404).json({ msg: `no session with webToken ${webToken}` });
  }
  return res.status(StatusCodes.OK).json({ session: session });
};

export const updateSession = async (req, res) => {};

export const deleteSession = async (req, res) => {
  const sessionId = req.body.sessionId;
  const session = await Session.findOneAndDelete({ sessionId: sessionId });
  if (!session) {
    return res.status(404).json({ msg: `no session with id ${sessionId}` });
  }
  return res.status(StatusCodes.OK).json({ msg: 'session deleted', session: session });
};
