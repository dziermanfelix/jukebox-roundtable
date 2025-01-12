import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  jukebox: String,
  username: String,
  tracks: [
    {
      id: String,
      uri: String,
      name: String,
      album: { images: [] },
      artists: [],
    },
  ],
});

export default mongoose.model('Queue', QueueSchema);
