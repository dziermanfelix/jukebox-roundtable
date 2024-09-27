import { Router } from 'express';
import { login, logout } from './authController.js';
import { createJukebox } from './jukeboxController.js';

const router = Router();
router.route('/').post(createJukebox);
router.route('/login').post(login);
router.route('/logout').post(logout);

export default router;
