import { Router } from 'express';
import { deleteJukebox, getJukebox } from './jukeboxController.js';

const router = Router();
router.route('/:id').get(getJukebox).delete(deleteJukebox);

export default router;
