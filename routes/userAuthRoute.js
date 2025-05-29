import { Router } from 'express';
import userAuthController from '../controllers/userAuthController.js';

const router = Router();

router.get('/', userAuthController.getUser);

export default router;