import Jukebox from '../models/JukeboxModel.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { jukeboxDoesNotExistError, jukeboxExistsError, deleteJukeboxSuccess } from '../common/responseMessages.js';
import { deleteSessionsFromJukebox } from './sessionController.js';

export const createJukebox = async (req, res) => {
  const name = req.body.name;
  const salt = await bcrypt.genSalt(10);
  const hashedCode = await bcrypt.hash(req.body.code, salt);
  req.body.code = hashedCode;
  if (await jukeboxExists(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json(jukeboxExistsError(name));
  }
  const jukebox = await Jukebox.create(req.body);
  return res.status(StatusCodes.CREATED).json({ jukebox });
};

async function jukeboxExists(name) {
  return await Jukebox.exists({ name: name });
}

export const getJukebox = async (req, res) => {
  const name = req.params.id;
  const jukebox = await getJukeboxDb(name);
  if (!jukebox) {
    return res.status(StatusCodes.NOT_FOUND).json(jukeboxDoesNotExistError(name));
  }
  return res.status(StatusCodes.OK).json({ jukebox: jukebox, sessionId: req.cookies.webToken });
};

export async function getJukeboxDb(name) {
  return await Jukebox.findOne({ name: name });
}

export const getJukeboxes = async (req, res) => {
  const jukeboxes = await Jukebox.find();
  return res.status(StatusCodes.OK).json({ jukeboxes });
};

export const updateJukebox = async (req, res) => {};

export async function updateJukeboxPlayedTracks(jukebox, track) {
  const updatedJukebox = Jukebox.findOneAndUpdate({ name: jukebox }, { $push: { playedTracks: track } }, { new: true });
  return updatedJukebox;
}

export const deleteJukebox = async (req, res) => {
  const name = req.params.id;
  await Jukebox.findOneAndDelete({ name: name });
  await deleteSessionsFromJukebox(name);
  return res.status(StatusCodes.OK).json(deleteJukeboxSuccess(name));
};

export const getPlayedTracks = async (req, res) => {
  const name = req.params.id;
  const jukebox = await Jukebox.findOne({ name: name });
  return res.status(StatusCodes.OK).json({ playedTracks: jukebox.playedTracks });
};
