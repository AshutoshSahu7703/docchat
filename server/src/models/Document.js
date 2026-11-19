import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  name: String, mimeType: String, size: Number,
  pages: { type: Number, default: 0 }, chunkCount: { type: Number, default: 0 },
  status: { type: String, enum: ['processing', 'ready', 'failed'], default: 'processing' },
  error: String,
}, { timestamps: true });
export default mongoose.model('Document', schema);
