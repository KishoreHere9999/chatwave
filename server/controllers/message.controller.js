import Message from '../models/Message.model.js';
import User from '../models/User.model.js';
import { getOnlineUsers } from '../socket/socket.js';

// Get all users for DM sidebar
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ 
      _id: { $ne: loggedInUserId } 
    }).select('-password');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get DM conversation between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userId },
        { senderId: userId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a DM
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { userId } = req.params;
    const senderId = req.user._id;

    const message = await Message.create({
      senderId,
      receiverId: userId,
      text,
      image,
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reaction to message
export const addReaction = async (req, res) => {
  try {
    const { emoji } = req.body;
    const { id } = req.params;

    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user already reacted
    const existingReaction = message.reactions.find(
      r => r.userId.toString() === req.user._id.toString()
    );

    if (existingReaction) {
      // Update existing reaction
      existingReaction.emoji = emoji;
    } else {
      // Add new reaction
      message.reactions.push({ emoji, userId: req.user._id });
    }

    await message.save();
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};