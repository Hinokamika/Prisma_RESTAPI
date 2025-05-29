import { Router } from 'express';
import userAuthController from '../controllers/userAuthController.js';

const router = Router();

router.get('/get', userAuthController.getUser);
router.post('/create', userAuthController.createUser);
router.put('/update/:id', userAuthController.updateUser);
router.delete('/delete/:id', userAuthController.deleteUser);
router.get('/get/:id', userAuthController.getUserById);

export default router;