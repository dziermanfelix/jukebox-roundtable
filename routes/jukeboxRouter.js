import { Router } from 'express';
import { getJukeboxes, getPlayedTracks, jukeboxExists, createJukebox } from './jukeboxController.js';
import { startJukeboxRequest } from './playerController.js';

const router = Router();
router.route('/').get(getJukeboxes);
router.route('/start/:id').post(startJukeboxRequest);
router.route('/played-tracks/:id').get(getPlayedTracks);
router.route('/jukebox-exists/:id').get(jukeboxExists);
router.route('/create').post(createJukebox);

export default router;
