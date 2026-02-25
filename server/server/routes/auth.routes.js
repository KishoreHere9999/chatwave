import express from 'express';
import { register, login, getMe, updateProfile } from '../controllers/auth.controller.js';
import protectRoute from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protectRoute, getMe);
router.put('/profile', protectRoute, updateProfile);

export default router;