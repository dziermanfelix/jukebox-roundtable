import { Router } from 'express';
import { getSession, updateDisplayName, updateSession } from './sessionController.js';
import { getQueue, setQueue } from './queueController.js';

const router = Router();

router.route('/').patch(updateSession);
router.route('/:id').get(getSession);
router.route('/get-queue/:id').get(getQueue);
router.route('/set-queue/:id').post(setQueue);
router.route('/update-display-name/:id').post(updateDisplayName);

export default router;
