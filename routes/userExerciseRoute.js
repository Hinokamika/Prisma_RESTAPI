import { Router } from 'express';
import userExerciseController from '../controllers/userExerciseController.js';

const router = Router();

// Get all exercise logs
router.get('/', userExerciseController.getExerciseLogs);

// Get exercise log by ID
router.get('/:id', userExerciseController.getExerciseLogById);

// Get exercise logs by user ID
router.get('/user/:userId', userExerciseController.getExerciseLogsByUserId);

// Create new exercise log
router.post('/', userExerciseController.createExerciseLog);

// Update exercise log
router.put('/:id', userExerciseController.updateExerciseLog);

// Delete exercise log
router.delete('/:id', userExerciseController.deleteExerciseLog);

export default router;