import { Router } from 'express';
import { getQueue, setQueue, getNextTrack } from './queueController.js';

const router = Router();
router.route('/get-queue/:id').post(getQueue);
router.route('/set-queue/:id').post(setQueue);
router.route('/get-next-track/:id').post(getNextTrack);

export default router;
