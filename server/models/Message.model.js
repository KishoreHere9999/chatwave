import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  },
  text: {
    type: String,
  },
  image: {
    type: String,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  reactions: [
    {
      emoji: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);