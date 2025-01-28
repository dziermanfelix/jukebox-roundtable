import { Router } from 'express';
import { deleteJukebox, getJukebox, getJukeboxes } from './jukeboxController.js';
import { startJukeboxRequest } from './playerController.js';

const router = Router();
router.route('/').get(getJukeboxes);
router.route('/:id').get(getJukebox).delete(deleteJukebox);
router.route('/start/:id').post(startJukeboxRequest);

export default router;
