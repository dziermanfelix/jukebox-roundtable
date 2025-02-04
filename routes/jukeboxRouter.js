import { Router } from 'express';
import { getJukeboxes, getPlayedTracks, jukeboxExists, createJukebox } from './jukeboxController.js';
import { startJukeboxRequest } from './playerController.js';
import { getAccessTokenHttp, initAccessToken } from './accessTokenController.js';

const router = Router();
router.route('/').get(getJukeboxes);
router.route('/start/:id').post(startJukeboxRequest);
router.route('/played-tracks/:id').get(getPlayedTracks);
router.route('/jukebox-exists/:id').get(jukeboxExists);
router.route('/create').post(createJukebox);
router.route('/access-token').post(getAccessTokenHttp);
router.route('/init-access-token').post(initAccessToken);

export default router;
