import User from '../models/User.js';

// ✅ Mark User Online (called after OTP + fingerprint verification)
export const markUserOnline = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email, isVerified: true },
      { isOnline: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found or not verified' });
    }

    res.status(200).json({ message: 'User marked as online' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ Get Verified + Online + Fingerprint Verified Users
export const getVerifiedUsers = async (req, res) => {
  try {
    const users = await User.find({
      isVerified: true,
      isOnline: true,
      fingerprintID: { $exists: true, $ne: '' },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

