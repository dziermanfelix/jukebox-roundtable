import { Router } from 'express';
import { createJukebox, deleteJukebox, getJukebox, getJukeboxes } from './jukeboxController.js';
import { getQueue, setQueue } from './queueController.js';

const router = Router();
router.route('/').get(getJukeboxes).post(createJukebox);
router.route('/:id').get(getJukebox).delete(deleteJukebox);

router.route('/get-queue/:id').post(getQueue);
router.route('/set-queue/:id').post(setQueue);

export default router;
