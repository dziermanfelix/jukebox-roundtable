import { Router } from 'express';
import { login, logout } from './authController.js';
import { createJukebox, jukeboxExists } from './jukeboxController.js';
import { initAccessToken } from './accessTokenController.js';

const router = Router();
router.route('/jukebox-exists/:id').get(jukeboxExists);
router.route('/create').post(createJukebox);
router.route('/init-access-token').post(initAccessToken);
router.route('/login').post(login);
router.route('/logout').post(logout);

export default router;
