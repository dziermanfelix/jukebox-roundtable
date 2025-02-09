import { Router } from 'express';
import { getSession, updateSession } from './sessionController.js';
import { getQueue, setQueue } from './queueController.js';

const router = Router();

router.route('/').patch(updateSession);
router.route('/:id').get(getSession);
router.route('/get-queue/:id').get(getQueue);
router.route('/set-queue/:id').post(setQueue);

export default router;
