import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
  key: String,
  value: String,
});

export default mongoose.model('Config', ConfigSchema);
