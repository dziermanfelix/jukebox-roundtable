import { Router } from 'express';
import { getSession, updateSession } from './sessionController.js';

const router = Router();

router.route('/').get(getSession).patch(updateSession);

export default router;
