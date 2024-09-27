import { Router } from 'express';
import { createJukebox, deleteJukebox, getJukebox, getJukeboxes } from './jukeboxController.js';

const router = Router();
router.route('/').get(getJukeboxes).post(createJukebox);
router.route('/:id').get(getJukebox).delete(deleteJukebox);

export default router;
