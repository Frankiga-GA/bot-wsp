import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  name: { type: String, default: null },
  updatedAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', userSchema);
