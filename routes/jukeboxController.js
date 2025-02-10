import Jukebox from '../models/JukeboxModel.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { jukeboxDoesNotExistError, jukeboxExistsError, deleteJukeboxSuccess } from '../common/responseMessages.js';
import { deleteSessionsFromJukebox } from './sessionController.js';

export const createJukebox = async (req, res) => {
  if (await jukeboxExistsByName(req.body.name)) {
    return res.status(StatusCodes.BAD_REQUEST).json(jukeboxExistsError(req.body.name));
  }
  const jukebox = await createJukeboxDb(req.body.name, req.body.code, req.body.role);
  return res.status(StatusCodes.CREATED).json({ jukebox });
};

export async function createJukeboxDb(jukeboxName, code, role) {
  const salt = await bcrypt.genSalt(10);
  const hashedCode = await bcrypt.hash(code, salt);
  code = hashedCode;
  return await Jukebox.create({ name: jukeboxName, code: code, role: role });
}

export const jukeboxExistsHttp = async (req, res) => {
  const name = req.params.id;
  if (await jukeboxExistsByName(name)) {
    return res.status(StatusCodes.OK).json({ jukebox: { name: name } });
  }
  return res.status(StatusCodes.OK).json({});
};

export async function jukeboxExistsByName(name) {
  return await Jukebox.exists({ name: name });
}

export const getJukebox = async (req, res) => {
  const name = req.params.id;
  const jukebox = await getJukeboxByName(name);
  if (!jukebox) {
    return res.status(StatusCodes.NOT_FOUND).json(jukeboxDoesNotExistError(name));
  }
  return res.status(StatusCodes.OK).json({ jukebox: jukebox });
};

export async function getJukeboxByName(jukeboxName) {
  return await Jukebox.findOne({ name: jukeboxName });
}

export const getJukeboxes = async (req, res) => {
  const jukeboxes = await Jukebox.find();
  return res.status(StatusCodes.OK).json({ jukeboxes });
};

export const updateJukebox = async (req, res) => {};

export const deleteJukebox = async (req, res) => {
  await deleteJukeboxFromName(req.params.id);
  return res.status(StatusCodes.OK).json(deleteJukeboxSuccess(req.params.id));
};

export async function deleteJukeboxFromName(jukeboxName) {
  const jukebox = await Jukebox.findOneAndDelete({ name: jukeboxName });
  await deleteSessionsFromJukebox(jukebox);
}

export const getPlayedTracks = async (req, res) => {
  const name = req.params.id;
  const jukebox = await Jukebox.findOne({ name: name });
  return res.status(StatusCodes.OK).json({ playedTracks: jukebox.playedTracks });
};

export async function updateJukeboxPlayedTracks(jukeboxName, track) {
  const updatedJukebox = Jukebox.findOneAndUpdate(
    { name: jukeboxName },
    { $push: { playedTracks: track } },
    { new: true }
  );
  return updatedJukebox;
}
