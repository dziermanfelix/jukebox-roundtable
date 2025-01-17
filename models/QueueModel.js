import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  jukebox: String,
  sessionId: String,
  tracks: [
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

export default mongoose.model('Queue', QueueSchema);
