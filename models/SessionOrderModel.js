import mongoose from 'mongoose';
import Jukebox from './JukeboxModel.js';

const SessionOrderSchema = new mongoose.Schema({
  jukebox: { type: mongoose.Schema.Types.ObjectId, ref: Jukebox },
  sessions: [
    {
      _id: String,
    },
  ],
});

export default mongoose.model('SessionOrder', SessionOrderSchema);
