import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

const getExerciseLogs = async (req, res) => {
    try {
        const exerciseLogs = await prisma.user_exercise_log.findMany({
            select: {
                id: true,
                user_id: true,
                exercise_id: true,
                date_performed: true,
                duration_minutes: true,
                sets_completed: true,
                reps_completed: true,
                weight_used_kg: true,
                calories_burned: true,
                difficulty_rating: true,
                notes: true,
                created_at: true
            }
        });

        res.status(200).json(exerciseLogs);
    } catch (error) {
        console.error('Error fetching exercise logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getExerciseLogById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const exerciseLog = await prisma.user_exercise_log.findUnique({
            where: { id: parseInt(id) },
            include: {
                user_detail: {
                    select: {
                        name: true,
                        fitness_level: true
                    }
                }
            }
        });

        if (!exerciseLog) {
            return res.status(404).json({ error: 'Exercise log not found' });
        }

        res.status(200).json(exerciseLog);
    } catch (error) {
        console.error('Error fetching exercise log by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getExerciseLogsByUserId = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const exerciseLogs = await prisma.user_exercise_log.findMany({
            where: { user_id: parseInt(userId) },
            orderBy: { date_performed: 'desc' }
        });

        res.status(200).json(exerciseLogs);
    } catch (error) {
        console.error('Error fetching exercise logs by user ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createExerciseLog = async (req, res) => {
    const { 
        user_id, 
        exercise_id, 
        date_performed, 
        duration_minutes, 
        sets_completed, 
        reps_completed,
        weight_used_kg,
        calories_burned,
        difficulty_rating,
        notes
    } = req.body;

    try {
        // Validate required fields
        if (!user_id || !exercise_id || !date_performed) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure date is properly formatted
        const parsedDate = new Date(date_performed);
        
        const newExerciseLog = await prisma.user_exercise_log.create({
            data: {
                user_id: parseInt(user_id),
                exercise_id: parseInt(exercise_id),
                date_performed: parsedDate,
                duration_minutes: duration_minutes ? parseInt(duration_minutes) : null,
                sets_completed: sets_completed ? parseInt(sets_completed) : null,
                reps_completed: reps_completed ? parseInt(reps_completed) : null,
                weight_used_kg: weight_used_kg ? parseFloat(weight_used_kg) : null,
                calories_burned: calories_burned ? parseInt(calories_burned) : null,
                difficulty_rating,
                notes
            }
        });

        res.status(201).json(newExerciseLog);
    } catch (error) {
        console.error('Error creating exercise log:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const updateExerciseLog = async (req, res) => {
    const { id } = req.params;
    const { 
        exercise_id, 
        date_performed, 
        duration_minutes, 
        sets_completed, 
        reps_completed,
        weight_used_kg,
        calories_burned,
        difficulty_rating,
        notes
    } = req.body;

    try {
        // Prepare update data
        const updateData = {};
        
        if (exercise_id !== undefined) updateData.exercise_id = parseInt(exercise_id);
        if (date_performed !== undefined) updateData.date_performed = new Date(date_performed);
        if (duration_minutes !== undefined) updateData.duration_minutes = duration_minutes !== null ? parseInt(duration_minutes) : null;
        if (sets_completed !== undefined) updateData.sets_completed = sets_completed !== null ? parseInt(sets_completed) : null;
        if (reps_completed !== undefined) updateData.reps_completed = reps_completed !== null ? parseInt(reps_completed) : null;
        if (weight_used_kg !== undefined) updateData.weight_used_kg = weight_used_kg !== null ? parseFloat(weight_used_kg) : null;
        if (calories_burned !== undefined) updateData.calories_burned = calories_burned !== null ? parseInt(calories_burned) : null;
        if (difficulty_rating !== undefined) updateData.difficulty_rating = difficulty_rating;
        if (notes !== undefined) updateData.notes = notes;

        const updatedExerciseLog = await prisma.user_exercise_log.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.status(200).json(updatedExerciseLog);
    } catch (error) {
        console.error('Error updating exercise log:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const deleteExerciseLog = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user_exercise_log.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting exercise log:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { 
    getExerciseLogs, 
    getExerciseLogById, 
    getExerciseLogsByUserId,
    createExerciseLog, 
    updateExerciseLog, 
    deleteExerciseLog 
};