import { Router } from 'express';
import { login, getCurrentUser, refreshToken } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/refresh', refreshToken);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
