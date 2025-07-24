import AESKey from '../models/AESKey.js';
import crypto from 'crypto';

export const getOrGenerateAESKey = async (req, res) => {
  const { userA, userB } = req.body;

  const user1 = userA < userB ? userA : userB;
  const user2 = userA < userB ? userB : userA;

  try {
    let keyDoc = await AESKey.findOne({ user1, user2 });

    if (!keyDoc) {
      const newKey = crypto.randomBytes(32).toString('hex'); // 256-bit key
      keyDoc = new AESKey({ user1, user2, aesKey: newKey });
      await keyDoc.save();
    }

    res.json({ aesKey: keyDoc.aesKey });
  } catch (error) {
    console.error('❌ AES key error:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
