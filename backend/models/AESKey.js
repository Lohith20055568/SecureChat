// models/AESKey.js
import mongoose from 'mongoose';

const AESKeySchema = new mongoose.Schema({
  users: {
    type: [String], // Sorted [email1, email2]
    required: true,
    unique: true
  },
  key: {
    type: String,
    required: true
  }
});

export default mongoose.model('AESKey', AESKeySchema);
