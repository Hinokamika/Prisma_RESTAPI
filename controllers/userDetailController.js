import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

const getUserDetail = async (req, res) => {
    try{
        const userDetail = await prisma.user_detail.findMany({
            select: {
                id: true,
                user_id: true,
                name: true,
                date_of_birth: true,
                gender: true,
                primary_health_goal: true,
                specific_fitness_goals: true,
                fitness_level: true,
                exercise_status: true,
                phone: true,
                allergies: true,
                preferred_workout_time: true,
                available_equipment: true,
                dietary_preferences: true,
                dietary_restrictions: true,
                current_stat_id: true,
                preferred_nutrition_plan_id: true,
                preferred_health_activity_id: true,
                preferred_exercise_routine_id: true,
                profile_picture_url: true,
                timezone: true,
                language_preference: true,
                notification_preferences: true,
                privacy_settings: true,
                subscription_type: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!userDetail) {
            return res.status(404).json({ error: 'User details not found' });
        }

        res.status(200).json(userDetail);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserDetailById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const userDetail = await prisma.user_detail.findUnique({
            where: { id: parseInt(id) },
            include: {
                user_authentication: {
                    select: {
                        email: true,
                        created_at: true,
                        last_login: true
                    }
                }
            }
        });

        if (!userDetail) {
            return res.status(404).json({ error: 'User detail not found' });
        }

        res.status(200).json(userDetail);
    } catch (error) {
        console.error('Error fetching user detail by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createUserDetail = async (req, res) => {
    const { 
        user_id, 
        name, 
        date_of_birth, 
        gender, 
        primary_health_goal, 
        specific_fitness_goals,
        fitness_level,
        exercise_status,
        phone,
        allergies,
        preferred_workout_time,
        available_equipment,
        dietary_preferences,
        dietary_restrictions,
        current_stat_id,
        preferred_nutrition_plan_id,
        preferred_health_activity_id,
        preferred_exercise_routine_id,
        profile_picture_url,
        timezone,
        language_preference,
        notification_preferences,
        privacy_settings,
        subscription_type
    } = req.body;

    try {
        // Validate required fields
        if (!user_id || !name || !date_of_birth || !gender || !primary_health_goal || !fitness_level || !exercise_status) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Ensure date is properly formatted
        const parsedDate = new Date(date_of_birth);
        
        const newUserDetail = await prisma.user_detail.create({
            data: {
                user_id: parseInt(user_id),
                name,
                date_of_birth: parsedDate,
                gender,
                primary_health_goal,
                specific_fitness_goals: specific_fitness_goals ? JSON.parse(JSON.stringify(specific_fitness_goals)) : undefined,
                fitness_level,
                exercise_status,
                phone,
                allergies: allergies ? JSON.parse(JSON.stringify(allergies)) : undefined,
                preferred_workout_time,
                available_equipment: available_equipment ? JSON.parse(JSON.stringify(available_equipment)) : undefined,
                dietary_preferences: dietary_preferences ? JSON.parse(JSON.stringify(dietary_preferences)) : undefined,
                dietary_restrictions: dietary_restrictions ? JSON.parse(JSON.stringify(dietary_restrictions)) : undefined,
                current_stat_id: current_stat_id ? parseInt(current_stat_id) : undefined,
                preferred_nutrition_plan_id: preferred_nutrition_plan_id ? parseInt(preferred_nutrition_plan_id) : undefined,
                preferred_health_activity_id: preferred_health_activity_id ? parseInt(preferred_health_activity_id) : undefined,
                preferred_exercise_routine_id: preferred_exercise_routine_id ? parseInt(preferred_exercise_routine_id) : undefined,
                profile_picture_url,
                timezone,
                language_preference,
                notification_preferences: notification_preferences ? JSON.parse(JSON.stringify(notification_preferences)) : undefined,
                privacy_settings: privacy_settings ? JSON.parse(JSON.stringify(privacy_settings)) : undefined,
                subscription_type
            }
        });

        res.status(201).json(newUserDetail);
    } catch (error) {
        console.error('Error creating user detail:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const updateUserDetail = async (req, res) => {
    const { id } = req.params;
    const { 
        name, 
        date_of_birth, 
        gender, 
        primary_health_goal, 
        specific_fitness_goals,
        fitness_level,
        exercise_status,
        phone,
        allergies,
        preferred_workout_time,
        available_equipment,
        dietary_preferences,
        dietary_restrictions,
        current_stat_id,
        preferred_nutrition_plan_id,
        preferred_health_activity_id,
        preferred_exercise_routine_id,
        profile_picture_url,
        timezone,
        language_preference,
        notification_preferences,
        privacy_settings,
        subscription_type
    } = req.body;

    try {
        // Prepare update data
        const updateData = {};
        
        if (name !== undefined) updateData.name = name;
        if (date_of_birth !== undefined) updateData.date_of_birth = new Date(date_of_birth);
        if (gender !== undefined) updateData.gender = gender;
        if (primary_health_goal !== undefined) updateData.primary_health_goal = primary_health_goal;
        if (specific_fitness_goals !== undefined) updateData.specific_fitness_goals = JSON.parse(JSON.stringify(specific_fitness_goals));
        if (fitness_level !== undefined) updateData.fitness_level = fitness_level;
        if (exercise_status !== undefined) updateData.exercise_status = exercise_status;
        if (phone !== undefined) updateData.phone = phone;
        if (allergies !== undefined) updateData.allergies = JSON.parse(JSON.stringify(allergies));
        if (preferred_workout_time !== undefined) updateData.preferred_workout_time = preferred_workout_time;
        if (available_equipment !== undefined) updateData.available_equipment = JSON.parse(JSON.stringify(available_equipment));
        if (dietary_preferences !== undefined) updateData.dietary_preferences = JSON.parse(JSON.stringify(dietary_preferences));
        if (dietary_restrictions !== undefined) updateData.dietary_restrictions = JSON.parse(JSON.stringify(dietary_restrictions));
        if (current_stat_id !== undefined) updateData.current_stat_id = parseInt(current_stat_id);
        if (preferred_nutrition_plan_id !== undefined) updateData.preferred_nutrition_plan_id = parseInt(preferred_nutrition_plan_id);
        if (preferred_health_activity_id !== undefined) updateData.preferred_health_activity_id = parseInt(preferred_health_activity_id);
        if (preferred_exercise_routine_id !== undefined) updateData.preferred_exercise_routine_id = parseInt(preferred_exercise_routine_id);
        if (profile_picture_url !== undefined) updateData.profile_picture_url = profile_picture_url;
        if (timezone !== undefined) updateData.timezone = timezone;
        if (language_preference !== undefined) updateData.language_preference = language_preference;
        if (notification_preferences !== undefined) updateData.notification_preferences = JSON.parse(JSON.stringify(notification_preferences));
        if (privacy_settings !== undefined) updateData.privacy_settings = JSON.parse(JSON.stringify(privacy_settings));
        if (subscription_type !== undefined) updateData.subscription_type = subscription_type;
        
        // Add updated_at timestamp
        updateData.updated_at = new Date();

        const updatedUserDetail = await prisma.user_detail.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.status(200).json(updatedUserDetail);
    } catch (error) {
        console.error('Error updating user detail:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const deleteUserDetail = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user_detail.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user detail:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { 
    getUserDetail, 
    getUserDetailById, 
    createUserDetail, 
    updateUserDetail, 
    deleteUserDetail 
};