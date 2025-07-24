// backend/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true },
  password: String,
  otp: String,
  otpExpiresAt: Date,
  isVerified: { type: Boolean, default: false },
  fingerprintID: String,
  isOnline: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);

// ✅ EXPORT LIKE THIS:
export default User;
