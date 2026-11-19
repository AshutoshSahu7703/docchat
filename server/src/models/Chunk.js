import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, index: true },
  doc: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', index: true },
  text: String, page: Number, index: Number,
  embedding: { type: [Number], select: false },
});
export default mongoose.model('Chunk', schema);
