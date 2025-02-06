import { Router } from 'express';
import { getJukeboxes, getPlayedTracks, jukeboxExistsHttp, createJukebox } from './jukeboxController.js';
import { startJukeboxRequest } from './playerController.js';
import { getAccessTokenHttp, initAccessToken } from './accessTokenController.js';
import { getOrder, setOrder } from './queueOrderController.js';

const router = Router();
router.route('/').get(getJukeboxes);
router.route('/start/:id').post(startJukeboxRequest);
router.route('/played-tracks/:id').get(getPlayedTracks);
router.route('/jukebox-exists/:id').get(jukeboxExistsHttp);
router.route('/create').post(createJukebox);
router.route('/access-token').post(getAccessTokenHttp);
router.route('/init-access-token').post(initAccessToken);
router.route('/get-queue-order/:id').get(getOrder);
router.route('/set-queue-order/:id').post(setOrder);

export default router;
