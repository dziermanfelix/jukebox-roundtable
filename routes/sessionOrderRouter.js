import { Router } from 'express';
import { getOrder, setOrder } from './sessionOrderController.js';

const router = Router();

router.route('/get-order/:id').get(getOrder);
router.route('/set-order/:id').post(setOrder);

export default router;
