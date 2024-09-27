import mongoose from 'mongoose';

const JukeboxSchema = new mongoose.Schema({
  name: String,
  code: String,
});

export default mongoose.model('Jukebox', JukeboxSchema);
