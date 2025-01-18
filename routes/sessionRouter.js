import { Router } from 'express';
import { createStarterSession, createJoinerSession, getSession } from './sessionController.js';

const router = Router();

router.route('/').get(getSession);
router.route('/starter').post(createStarterSession);
router.route('/joiner').post(createJoinerSession);

export default router;
