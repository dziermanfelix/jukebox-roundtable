import { Router } from 'express';
import { getAccessTokenHttp } from './accessTokenController.js';

const router = Router();
router.route('/').get(getAccessTokenHttp);

export default router;
