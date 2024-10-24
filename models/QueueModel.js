import mongoose from 'mongoose';

const QueueSchema = new mongoose.Schema({
  jukebox: String,
  username: String,
  tracks: [
    {
      id: String,
      name: String,
    },
  ],
});

export default mongoose.model('Queue', QueueSchema);
