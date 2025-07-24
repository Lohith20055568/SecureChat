import express from 'express';
import { sendMessage, getChatBetweenUsers ,getMessages} from '../controllers/messageController.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/history', getMessages);
router.get('/chat', getChatBetweenUsers);
router.post('/send', async (req, res) => {
  const { sender, receiver, text } = req.body;

  try {
    const msg = await Message.create({
      sender,
      receiver,
      text,
      timestamp: new Date()
    });

    res.status(201).json({ message: 'Message sent', msg });
  } catch (err) {
    console.error('❌ Error saving message:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get messages between two users
router.get('/history', async (req, res) => {
  const { sender, receiver } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: 1 }); // oldest to newest

    res.json(messages);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
