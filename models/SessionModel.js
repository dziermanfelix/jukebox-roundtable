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
});

export default mongoose.model('Session', SessionSchema);
