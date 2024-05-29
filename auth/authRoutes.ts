const router = require('express').Router();
import { authenticate } from 'middleware/authMiddleware';
import * as authController from '../controllers/authController';

router.post('/signup', authController.register);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.post('/logout', authenticate, authController.logout);

export default router;
