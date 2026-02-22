import Room from '../models/Room.model.js';
import Message from '../models/Message.model.js';

// Get all rooms for current user
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      members: { $in: [req.user._id] },
    })
      .populate('members', '-password')
      .populate('lastMessage');

    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const room = await Room.create({
      name,
      description,
      adminId: req.user._id,
      members: [...members, req.user._id],
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get room messages
export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await Message.find({ roomId })
      .populate('senderId', '-password')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add member to room
export const addMember = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only admin can add members
    if (room.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    // Check if already a member
    if (room.members.includes(userId)) {
      return res.status(400).json({ message: 'User already in room' });
    }

    room.members.push(userId);
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove member from room
export const removeMember = async (req, res) => {
  try {
    const { roomId, userId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Only admin can remove members
    if (room.adminId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    room.members = room.members.filter(
      member => member.toString() !== userId
    );
    await room.save();

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};