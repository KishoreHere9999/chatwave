import express from 'express';
import { 
  getUsersForSidebar, 
  getMessages, 
  sendMessage,
  addReaction 
} from '../controllers/message.controller.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:userId', protectRoute, getMessages);
router.post('/send/:userId', protectRoute, sendMessage);
router.put('/:id/react', protectRoute, addReaction);

export default router;