import { Router } from 'express';
import { createJukebox, deleteJukebox, getJukebox } from './jukeboxController.js';

const router = Router();
router.route('/').post(createJukebox);
router.route('/:id').get(getJukebox).delete(deleteJukebox);

export default router;
