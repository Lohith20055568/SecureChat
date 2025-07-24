import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/email.js';


// POST /api/auth/signup
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: '✅ Signup successful', user });
  } catch (err) {
    res.status(500).json({ message: '❌ Signup error', error: err.message });
  }
};

// POST /api/auth/signin
export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: '❌ User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: '❌ Invalid password' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: '✅ Logged in', token, user });
  } catch (err) {
    res.status(500).json({ message: '❌ Login error', error: err.message });
  }
};

// controllers/authController.js



export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min from now

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { otp, otpExpiresAt: expiry },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendOtpEmail(email, otp);
    res.json({ message: '✅ OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: '❌ OTP error', error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: '❌ Invalid pika  or expired OTP' });
    }

    user.isVerified = true;
    await user.save();
    res.json({ message: '✅ OTP verified', user });
  } catch (err) {
    res.status(500).json({ message: '❌ OTP verify error', error: err.message });
  }
};


export const verifyFingerprint = async (req, res) => {
  const { email, fingerprintID } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email, isVerified: true },
      { fingerprintID, isOnline: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found or not OTP verified' });

    res.json({ message: '✅ Fingerprint verified', user });
  } catch (err) {
    res.status(500).json({ message: '❌ Fingerprint error', error: err.message });
  }
};

export const getVerifiedUsers = async (req, res) => {
  try {
    const users = await User.find({
      isVerified: true,
      fingerprintID: { $ne: null },
      isOnline: true
    }).select('username email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: '❌ Fetch error', error: err.message });
  }
};

