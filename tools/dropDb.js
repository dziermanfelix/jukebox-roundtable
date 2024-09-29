import Jukebox from '../models/JukeboxModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

try {
  await mongoose.connect(process.env.MONGO_URL);
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
