import { Router } from 'express';
import userNutritionController from '../controllers/userNutritionController.js';

const router = Router();

// Get all nutrition logs
router.get('/', userNutritionController.getNutritionLogs);

// Get nutrition log by ID
router.get('/:id', userNutritionController.getNutritionLogById);

// Get nutrition logs by user ID
router.get('/user/:userId', userNutritionController.getNutritionLogsByUserId);

// Create new nutrition log
router.post('/', userNutritionController.createNutritionLog);

// Update nutrition log
router.put('/:id', userNutritionController.updateNutritionLog);

// Delete nutrition log
router.delete('/:id', userNutritionController.deleteNutritionLog);

export default router;