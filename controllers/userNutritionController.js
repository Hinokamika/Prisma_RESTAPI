import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getNutritionLogs = async (req, res) => {
    try {
        const nutritionLogs = await prisma.user_nutrition_log.findMany({
            select: {
                id: true,
                user_id: true,
                nutrition_id: true,
                date_consumed: true,
                meal_time: true,
                serving_amount: true,
                total_calories: true,
                notes: true,
                created_at: true
            }
        });

        res.status(200).json(nutritionLogs);
    } catch (error) {
        console.error('Error fetching nutrition logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getNutritionLogById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const nutritionLog = await prisma.user_nutrition_log.findUnique({
            where: { id: parseInt(id) },
            include: {
                user_detail: {
                    select: {
                        name: true,
                        dietary_preferences: true,
                        dietary_restrictions: true
                    }
                }
            }
        });

        if (!nutritionLog) {
            return res.status(404).json({ error: 'Nutrition log not found' });
        }

        res.status(200).json(nutritionLog);
    } catch (error) {
        console.error('Error fetching nutrition log by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getNutritionLogsByUserId = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const nutritionLogs = await prisma.user_nutrition_log.findMany({
            where: { user_id: parseInt(userId) },
            orderBy: { date_consumed: 'desc' }
        });

        res.status(200).json(nutritionLogs);
    } catch (error) {
        console.error('Error fetching nutrition logs by user ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createNutritionLog = async (req, res) => {
    const { 
        user_id, 
        nutrition_id, 
        date_consumed, 
        meal_time,
        serving_amount, 
        total_calories,
        notes
    } = req.body;

    try {
        // Validate required fields
        if (!user_id || !nutrition_id || !date_consumed) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure date is properly formatted
        const parsedDate = new Date(date_consumed);
        
        // Parse time if provided
        let parsedTime = null;
        if (meal_time) {
            // If meal_time is provided as HH:MM or HH:MM:SS format
            if (typeof meal_time === 'string' && (meal_time.includes(':') || /^\d{1,2}(:\d{2}){1,2}$/.test(meal_time))) {
                const [hours, minutes, seconds = '00'] = meal_time.split(':').map(Number);
                parsedTime = new Date();
                parsedTime.setHours(hours, minutes, seconds || 0, 0);
            } else {
                parsedTime = new Date(meal_time);
            }
        }
        
        const newNutritionLog = await prisma.user_nutrition_log.create({
            data: {
                user_id: parseInt(user_id),
                nutrition_id: parseInt(nutrition_id),
                date_consumed: parsedDate,
                meal_time: parsedTime,
                serving_amount: serving_amount ? parseFloat(serving_amount) : 1.00,
                total_calories: total_calories ? parseFloat(total_calories) : null,
                notes
            }
        });

        res.status(201).json(newNutritionLog);
    } catch (error) {
        console.error('Error creating nutrition log:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const updateNutritionLog = async (req, res) => {
    const { id } = req.params;
    const { 
        nutrition_id, 
        date_consumed, 
        meal_time,
        serving_amount, 
        total_calories,
        notes
    } = req.body;

    try {
        // Prepare update data
        const updateData = {};
        
        if (nutrition_id !== undefined) updateData.nutrition_id = parseInt(nutrition_id);
        if (date_consumed !== undefined) updateData.date_consumed = new Date(date_consumed);
        
        if (meal_time !== undefined) {
            if (meal_time === null) {
                updateData.meal_time = null;
            } else {
                // Handle time format (HH:MM or HH:MM:SS)
                if (typeof meal_time === 'string' && (meal_time.includes(':') || /^\d{1,2}(:\d{2}){1,2}$/.test(meal_time))) {
                    const [hours, minutes, seconds = '00'] = meal_time.split(':').map(Number);
                    const parsedTime = new Date();
                    parsedTime.setHours(hours, minutes, seconds || 0, 0);
                    updateData.meal_time = parsedTime;
                } else {
                    updateData.meal_time = new Date(meal_time);
                }
            }
        }
        
        if (serving_amount !== undefined) updateData.serving_amount = parseFloat(serving_amount);
        if (total_calories !== undefined) updateData.total_calories = total_calories !== null ? parseFloat(total_calories) : null;
        if (notes !== undefined) updateData.notes = notes;

        const updatedNutritionLog = await prisma.user_nutrition_log.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.status(200).json(updatedNutritionLog);
    } catch (error) {
        console.error('Error updating nutrition log:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const deleteNutritionLog = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user_nutrition_log.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting nutrition log:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { 
    getNutritionLogs, 
    getNutritionLogById, 
    getNutritionLogsByUserId,
    createNutritionLog, 
    updateNutritionLog, 
    deleteNutritionLog 
};