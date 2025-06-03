import { Router } from 'express';
import userHealthController from '../controllers/userHealthController.js';

const router = Router();

// Get all health logs
router.get('/', userHealthController.getHealthLogs);

// Get health log by ID
router.get('/:id', userHealthController.getHealthLogById);

// Get health logs by user ID
router.get('/user/:userId', userHealthController.getHealthLogsByUserId);

// Create new health log
router.post('/', userHealthController.createHealthLog);

// Update health log
router.put('/:id', userHealthController.updateHealthLog);

// Delete health log
router.delete('/:id', userHealthController.deleteHealthLog);

export default router;