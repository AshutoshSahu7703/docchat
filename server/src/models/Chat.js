import mongoose from 'mongoose';
const source = new mongoose.Schema({ docId: mongoose.Schema.Types.ObjectId, docName: String, page: Number, snippet: String, score: Number }, { _id: false });
const message = new mongoose.Schema({ role: { type: String, enum: ['user', 'assistant'] }, content: String, sources: [source] }, { timestamps: true });
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
  title: { type: String, default: 'New chat' },
  docIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  messages: [message],
}, { timestamps: true });
export default mongoose.model('Chat', schema);
