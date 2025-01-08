import Jukebox from '../models/JukeboxModel.js';
import mongoose from 'mongoose';
import { mongoUrl } from '../utils/environmentVariables.js';

try {
  await mongoose.connect(mongoUrl);
  Jukebox.collection
    .drop()
    .then(() => {
      console.log('jukebox collection dropped successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error dropping jukebox collection', err);
      process.exit(1);
    });
} catch (error) {
  console.log(error);
}
