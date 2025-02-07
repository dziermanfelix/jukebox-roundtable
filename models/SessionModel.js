import mongoose from 'mongoose';
import Jukebox from './JukeboxModel.js';
import { Role } from '../utils/roles.js';

const SessionSchema = new mongoose.Schema({
  webToken: String,
  jukebox: { type: mongoose.Schema.Types.ObjectId, ref: Jukebox },
  role: {
    type: String,
    enum: [Role.ADMIN, Role.SCRUB],
    required: true,
  },
  displayName: {
    type: String,
    default: 'player1',
  },
  queue: {
    type: [
      {
        _id: false,
        id: String,
        uri: String,
        name: String,
        album: { images: [] },
        artists: [],
        duration_ms: Number,
      },
    ],
    default: [],
  },
});

export default mongoose.model('Session', SessionSchema);
