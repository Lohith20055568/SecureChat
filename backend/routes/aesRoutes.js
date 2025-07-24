// routes/aesRoutes.js
import express from 'express';
import AESKey from '../models/AESKey.js'; // We'll create this model next
import { encryptMessage, decryptMessage } from '../utils/aesUtils.js';


const router = express.Router();

// GET or CREATE AES Key between two users
router.get('/', async (req, res) => {
  const { user1, user2 } = req.query;

  if (!user1 || !user2) return res.status(400).json({ error: 'User emails required' });

  const participants = [user1, user2].sort();

  try {
    let keyEntry = await AESKey.findOne({ users: participants });

    if (!keyEntry) {
      const key = generateAESKey();
      keyEntry = await AESKey.create({ users: participants, key });
      return res.status(201).json({ key });
    }

    return res.status(200).json({ key: keyEntry.key });
  } catch (err) {
    console.error('❌ AES Key error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
