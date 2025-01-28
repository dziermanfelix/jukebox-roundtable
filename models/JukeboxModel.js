import mongoose from 'mongoose';

const JukeboxSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
});

export default mongoose.model('Jukebox', JukeboxSchema);
