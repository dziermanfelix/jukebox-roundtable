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
      access_token: String,
      refresh_token: String,
      token_type: String,
      expires_in: Number,
      scope: String,
      accessTime: { type: Number, default: currentTimeSeconds() },
      expiresAt: Number,
    },
    queueOrder: {
      type: [{ _id: String }],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Jukebox', JukeboxSchema);
