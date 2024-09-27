import Jukebox from '../models/JukeboxModel.js';
import { comparePassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { StatusCodes } from 'http-status-codes';
import { createJwt } from '../utils/tokenUtils.js';

export const login = async (req, res) => {
  const jukebox = await Jukebox.findOne({ name: req.body.name });
  const isValidUser = jukebox && (await comparePassword(req.body.code, jukebox.code));
  if (!isValidUser) throw new UnauthenticatedError('invalid credentials');
  const token = createJwt({ name: jukebox.name });
  const oneDay = 1000 * 60 * 60 * 24; // in milliseconds
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
  });
  return res.status(StatusCodes.OK).json({ msg: `user logged into jukebox ${jukebox.name}` });
};

export const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.status(StatusCodes.OK).json({ msg: `user logged out of jukebox ${req.body.name}` });
};