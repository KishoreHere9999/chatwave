import express from 'express';
import {
  getRooms,
  createRoom,
  getRoomMessages,
  sendRoomMessage,
  addMember,
  removeMember,
} from '../controllers/room.controller.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getRooms);
router.post('/', protectRoute, createRoom);
router.get('/:roomId/messages', protectRoute, getRoomMessages);
router.post('/:roomId/messages', protectRoute, sendRoomMessage);
router.post('/:roomId/members', protectRoute, addMember);
router.delete('/:roomId/members/:userId', protectRoute, removeMember);

export default router;