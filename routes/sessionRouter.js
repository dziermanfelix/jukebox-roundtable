import { Router } from 'express';
import { getSession, updateSession } from './sessionController.js';
import { getQueue, setQueue } from './queueController.js';

const router = Router();

router.route('/').get(getSession).patch(updateSession);
router.route('/get-queue/:id').get(getQueue);
router.route('/set-queue/:id').post(setQueue);

export default router;
