import mongoose from 'mongoose';
import { Role } from '../utils/roles.js';

const SessionSchema = new mongoose.Schema({
  displayName: {
    type: String,
    default: 'player1',
  },
  role: {
    type: String,
    enum: [Role.ADMIN, Role.SCRUB],
    required: true,
  },
  webToken: String,
  jukebox: String,
  queue: [
    {
      id: String,
      uri: String,
      name: String,
      album: { images: [] },
      artists: [],
      duration_ms: Number,
    },
  ],
});

export default mongoose.model('Session', SessionSchema);
