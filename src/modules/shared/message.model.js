import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  userNumber: { type: String, required: true },
  userMessage: { type: String, required: true },
  botResponse: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const MessageModel = mongoose.model('Message', messageSchema);
