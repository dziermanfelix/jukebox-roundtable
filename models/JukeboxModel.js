import mongoose from 'mongoose';

const JukeboxSchema = new mongoose.Schema({
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
});

export default mongoose.model('Jukebox', JukeboxSchema);
