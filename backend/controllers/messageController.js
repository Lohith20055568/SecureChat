import Message from '../models/Message.js';

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, encryptedText } = req.body;
    const msg = new Message({ sender, receiver, text });
    await msg.save();
    res.status(201).json({ message: 'Sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getChatBetweenUsers = async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const chat = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(chat);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};