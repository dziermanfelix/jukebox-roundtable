import { Router } from 'express';
import { getAccessTokenHttp } from './accessTokenController.js';

const router = Router();
router.route('/').post(getAccessTokenHttp);

export default router;
