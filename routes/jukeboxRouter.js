import { Router } from 'express';
import { createJukebox, deleteJukebox, getJukebox, getJukeboxes } from './jukeboxController.js';
import { startJukeboxRequest } from './playerController.js';

const router = Router();
router.route('/').get(getJukeboxes).post(createJukebox);
router.route('/:id').get(getJukebox).delete(deleteJukebox);
router.route('/start/:id').post(startJukeboxRequest);

export default router;
