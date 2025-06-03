import { Router } from 'express';
import userDetailController from '../controllers/userDetailController.js';

const router = Router();

// Get all user details
router.get('/', userDetailController.getUserDetail);

// Get user detail by ID
router.get('/:id', userDetailController.getUserDetailById);

// Create new user detail
router.post('/', userDetailController.createUserDetail);

// Update user detail
router.put('/:id', userDetailController.updateUserDetail);

// Delete user detail
router.delete('/:id', userDetailController.deleteUserDetail);

export default router;