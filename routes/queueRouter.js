import { Router } from 'express';
import { getQueue, setQueue } from './queueController.js';

const router = Router();
router.route('/get-queue/:id').post(getQueue);
router.route('/set-queue/:id').post(setQueue);

export default router;
