import Jukebox from '../models/JukeboxModel.js';
import Session from '../models/SessionModel.js';
import mongoose from 'mongoose';
import { mongoUrl } from '../utils/environmentVariables.js';

const drop = async (table, name) => {
  try {
    await mongoose.connect(mongoUrl);
    await table.collection
      .drop()
      .then(() => {
        console.log(`${name} dropped successfully`);
      })
      .catch((err) => {
        console.error(`error dropping ${name}`, err);
      });
  } catch (error) {
    console.log(error);
  }
};

await drop(Jukebox, 'jukebox');
await drop(Session, 'session');
process.exit(0);
