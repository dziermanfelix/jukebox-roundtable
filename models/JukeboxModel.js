import mongoose from 'mongoose';
import { currentTimeSeconds } from '../utils/time.js';

const JukeboxSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    playedTracks: {
      type: [
        {
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
    accessToken: {
      type: {
        _id: false,
        access_token: String,
        refresh_token: String,
        token_type: String,
        expires_in: Number,
        scope: String,
        accessTime: { type: Number, default: currentTimeSeconds() },
        expiresAt: Number,
      },
      default: {},
    },
    queueOrder: {
      type: [String],
      default: [],
    },
    previousSession: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Jukebox', JukeboxSchema);
