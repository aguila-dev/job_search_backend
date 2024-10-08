const router = require('express').Router();
import { authenticate } from 'middleware/authMiddleware';
import * as authController from '../controllers/authController';

router.post('/signup', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/login-auth0', authController.loginAuth0User);
router.post('/signup-auth0', authController.signupAuth0User);
router.get('/refresh-token', authController.refreshToken);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/me', authenticate, authController.me);

export default router;
