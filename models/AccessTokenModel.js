import mongoose from 'mongoose';
import { currentTimeSeconds } from '../utils/time.js';

const AccessTokenSchema = new mongoose.Schema(
  {
    jukebox: String,
    access_token: String,
    refresh_token: String,
    token_type: String,
    expires_in: Number,
    scope: String,
    accessTime: { type: Number, default: currentTimeSeconds() },
    expiresAt: Number,
  },
  { timestamps: true }
);

export default mongoose.model('AccessToken', AccessTokenSchema);
