import AESKey from '../models/AESKey.js';

/**
 * ✅ POST: Save AES key (only if not already stored)
 * Route: POST /api/messages/aes-key
 * Body: { user1, user2, key }
 */

// controllers/keyController.js


export const storeAESKey = async (req, res) => {
  try {
    const { user1, user2, key } = req.body;
    console.log('📥 Incoming AES Key:', { user1, user2, key });  // Add this line

    if (!user1 || !user2 || !key) {
      return res.status(400).json({ message: 'Missing user1, user2 or key' });
    }

    const existingKey = await AESKey.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 }
      ]
    });

    if (existingKey) {
      return res.status(200).json({ message: 'Key already exists' });
    }

    const newKey = new AESKey({ user1, user2, key });
    await newKey.save();

    console.log('✅ AES Key stored in DB');
    return res.status(201).json({ message: 'AES Key stored successfully' });
  } catch (error) {
    console.error('❌ Error storing AES key:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



/**
 * ✅ GET: Fetch AES key between user1 and user2 (bidirectional)
 * Route: GET /api/messages/aes-key?user1=email1&user2=email2
 */
export const getAESKey = async (req, res) => {
  const { sender, receiver } = req.query;

  if (!sender || !receiver) {
    return res.status(400).json({ message: 'Missing sender or receiver in query' });
  }

  try {
    const keyDoc = await AESKey.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    });

    if (!keyDoc) {
      return res.status(200).json({ key: null });
    }

    return res.status(200).json({ key: keyDoc.key });
  } catch (error) {
    console.error('❌ Error fetching AES key:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


