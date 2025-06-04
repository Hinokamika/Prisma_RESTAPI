import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getHealthLogs = async (req, res) => {
    try {
        const healthLogs = await prisma.user_health_log.findMany({
            select: {
                id: true,
                user_id: true,
                health_activity_id: true,
                date_performed: true,
                start_time: true,
                duration_minutes: true,
                completion_status: true,
                stress_level_before: true,
                stress_level_after: true,
                mood_before: true,
                mood_after: true,
                effectiveness_rating: true,
                notes: true,
                created_at: true
            }
        });

        res.status(200).json(healthLogs);
    } catch (error) {
        console.error('Error fetching health logs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getHealthLogById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const healthLog = await prisma.user_health_log.findUnique({
            where: { id: parseInt(id) },
            include: {
                user_detail: {
                    select: {
                        name: true,
                        primary_health_goal: true
                    }
                }
            }
        });

        if (!healthLog) {
            return res.status(404).json({ error: 'Health log not found' });
        }

        res.status(200).json(healthLog);
    } catch (error) {
        console.error('Error fetching health log by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getHealthLogsByUserId = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const healthLogs = await prisma.user_health_log.findMany({
            where: { user_id: parseInt(userId) },
            orderBy: { date_performed: 'desc' }
        });

        res.status(200).json(healthLogs);
    } catch (error) {
        console.error('Error fetching health logs by user ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createHealthLog = async (req, res) => {
    const { 
        user_id, 
        health_activity_id, 
        date_performed, 
        start_time,
        duration_minutes, 
        completion_status, 
        stress_level_before,
        stress_level_after,
        mood_before,
        mood_after,
        effectiveness_rating,
        notes
    } = req.body;

    try {
        // Validate required fields
        if (!user_id || !health_activity_id || !date_performed || !duration_minutes) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure date is properly formatted
        const parsedDate = new Date(date_performed);
        
        // Parse time if provided
        let parsedTime = null;
        if (start_time) {
            // If start_time is provided as HH:MM or HH:MM:SS format
            if (typeof start_time === 'string' && (start_time.includes(':') || /^\d{1,2}(:\d{2}){1,2}$/.test(start_time))) {
                const [hours, minutes, seconds = '00'] = start_time.split(':').map(Number);
                parsedTime = new Date();
                parsedTime.setHours(hours, minutes, seconds || 0, 0);
            } else {
                parsedTime = new Date(start_time);
            }
        }
        
        const newHealthLog = await prisma.user_health_log.create({
            data: {
                user_id: parseInt(user_id),
                health_activity_id: parseInt(health_activity_id),
                date_performed: parsedDate,
                start_time: parsedTime,
                duration_minutes: parseInt(duration_minutes),
                completion_status,
                stress_level_before,
                stress_level_after,
                mood_before,
                mood_after,
                effectiveness_rating: effectiveness_rating ? parseInt(effectiveness_rating) : null,
                notes
            }
        });

        res.status(201).json(newHealthLog);
    } catch (error) {
        console.error('Error creating health log:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const updateHealthLog = async (req, res) => {
    const { id } = req.params;
    const { 
        health_activity_id, 
        date_performed, 
        start_time,
        duration_minutes, 
        completion_status, 
        stress_level_before,
        stress_level_after,
        mood_before,
        mood_after,
        effectiveness_rating,
        notes
    } = req.body;

    try {
        // Prepare update data
        const updateData = {};
        
        if (health_activity_id !== undefined) updateData.health_activity_id = parseInt(health_activity_id);
        if (date_performed !== undefined) updateData.date_performed = new Date(date_performed);
        
        if (start_time !== undefined) {
            if (start_time === null) {
                updateData.start_time = null;
            } else {
                // Handle time format (HH:MM or HH:MM:SS)
                if (typeof start_time === 'string' && (start_time.includes(':') || /^\d{1,2}(:\d{2}){1,2}$/.test(start_time))) {
                    const [hours, minutes, seconds = '00'] = start_time.split(':').map(Number);
                    const parsedTime = new Date();
                    parsedTime.setHours(hours, minutes, seconds || 0, 0);
                    updateData.start_time = parsedTime;
                } else {
                    updateData.start_time = new Date(start_time);
                }
            }
        }
        
        if (duration_minutes !== undefined) updateData.duration_minutes = parseInt(duration_minutes);
        if (completion_status !== undefined) updateData.completion_status = completion_status;
        if (stress_level_before !== undefined) updateData.stress_level_before = stress_level_before;
        if (stress_level_after !== undefined) updateData.stress_level_after = stress_level_after;
        if (mood_before !== undefined) updateData.mood_before = mood_before;
        if (mood_after !== undefined) updateData.mood_after = mood_after;
        if (effectiveness_rating !== undefined) {
            updateData.effectiveness_rating = effectiveness_rating !== null ? parseInt(effectiveness_rating) : null;
        }
        if (notes !== undefined) updateData.notes = notes;

        const updatedHealthLog = await prisma.user_health_log.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.status(200).json(updatedHealthLog);
    } catch (error) {
        console.error('Error updating health log:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const deleteHealthLog = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user_health_log.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting health log:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { 
    getHealthLogs, 
    getHealthLogById, 
    getHealthLogsByUserId,
    createHealthLog, 
    updateHealthLog, 
    deleteHealthLog 
};