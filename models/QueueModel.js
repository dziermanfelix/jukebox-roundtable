import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
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
  jukebox: String,
  sessionId: String,
});

export default mongoose.model('Queue', QueueSchema);
