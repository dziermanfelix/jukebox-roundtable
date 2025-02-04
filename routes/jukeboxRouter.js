import { Router } from 'express';
import { getJukeboxes, getPlayedTracks } from './jukeboxController.js';
import { startJukeboxRequest } from './playerController.js';

const router = Router();
router.route('/').get(getJukeboxes);
router.route('/start/:id').post(startJukeboxRequest);
router.route('/played-tracks/:id').get(getPlayedTracks);

export default router;
