import Jukebox from '../models/JukeboxModel.js';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';

export const createJukebox = async (req, res) => {
  const name = req.body.name;
  const salt = await bcrypt.genSalt(10);
  const hashedCode = await bcrypt.hash(req.body.code, salt);
  req.body.code = hashedCode;
  if (await jukeboxExists(name)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: `jukebox ${name} is being used` });
  }
  const jukebox = await Jukebox.create(req.body);
  return res.status(StatusCodes.CREATED).json({ jukebox });
};

const jukeboxExists = async (name) => {
  return await Jukebox.exists({ name: name });
};

export const getJukebox = async (req, res) => {
  const name = req.params.id;
  const jukebox = await getJukeboxDb(name);
  if (!jukebox) {
    return res.status(404).json({ msg: `no jukebox with name ${name}` });
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

export const deleteJukebox = async (req, res) => {
  const name = req.params.id;
  const jukebox = await Jukebox.findOneAndDelete({ name: name });
  if (!jukebox) {
    return res.status(404).json({ msg: `no jukebox with name ${name}` });
  }
  return res.status(StatusCodes.OK).json({ msg: 'jukebox deleted', jukebox: jukebox });
};
