import mongoose from 'mongoose';
import { currentTimeSeconds } from '../utils/time.js';

const JukeboxSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    playedTracks: [
      {
        id: String,
        uri: String,
        name: String,
        album: { images: [] },
        artists: [],
        duration_ms: Number,
      },
    ],
    accessToken: {
      access_token: String,
      refresh_token: String,
      token_type: String,
      expires_in: Number,
      scope: String,
      accessTime: { type: Number, default: currentTimeSeconds() },
      expiresAt: Number,
    },
    queueOrder: [
      {
        _id: String,
      },
    ],
    // queueOrder: {
    //   type: [{ _id: String }],
    //   default: [],
    // },
  },
  { timestamps: true }
);

export default mongoose.model('Jukebox', JukeboxSchema);
