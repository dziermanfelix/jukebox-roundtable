import { Router } from 'express';
import { createStarterSession, createJoinerSession, getSession, updateSession } from './sessionController.js';

const router = Router();

router.route('/').get(getSession).patch(updateSession);
router.route('/starter').post(createStarterSession);
router.route('/joiner').post(createJoinerSession);

export default router;
