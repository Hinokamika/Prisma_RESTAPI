-- CreateTable
CREATE TABLE `user_authentication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `user_auth_id` VARCHAR(50) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_login` TIMESTAMP(0) NULL,

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `user_auth_id`(`user_auth_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `gender` ENUM('male', 'female', 'other', 'prefer_not_to_say') NOT NULL,
    `primary_health_goal` ENUM('weight_loss', 'weight_gain', 'muscle_building', 'endurance', 'flexibility', 'general_fitness', 'stress_reduction', 'rehabilitation') NOT NULL,
    `specific_fitness_goals` JSON NULL,
    `fitness_level` ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    `exercise_status` ENUM('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active') NOT NULL,
    `phone` VARCHAR(20) NULL,
    `allergies` JSON NULL,
    `preferred_workout_time` ENUM('morning', 'afternoon', 'evening', 'flexible') NULL,
    `available_equipment` JSON NULL,
    `dietary_preferences` JSON NULL,
    `dietary_restrictions` JSON NULL,
    `current_stat_id` INTEGER NULL,
    `preferred_nutrition_plan_id` INTEGER NULL,
    `preferred_health_activity_id` INTEGER NULL,
    `preferred_exercise_routine_id` INTEGER NULL,
    `profile_picture_url` VARCHAR(500) NULL,
    `timezone` VARCHAR(50) NULL DEFAULT 'UTC',
    `language_preference` VARCHAR(10) NULL DEFAULT 'vn',
    `notification_preferences` JSON NULL,
    `privacy_settings` JSON NULL,
    `subscription_type` ENUM('free', 'premium', 'pro') NULL DEFAULT 'free',
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_exercise_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `exercise_id` INTEGER NOT NULL,
    `date_performed` DATE NOT NULL,
    `duration_minutes` INTEGER NULL,
    `sets_completed` INTEGER NULL,
    `reps_completed` INTEGER NULL,
    `weight_used_kg` DECIMAL(5, 2) NULL,
    `calories_burned` INTEGER NULL,
    `difficulty_rating` ENUM('too_easy', 'just_right', 'too_hard') NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_user_date`(`user_id`, `date_performed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_health_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `health_activity_id` INTEGER NOT NULL,
    `date_performed` DATE NOT NULL,
    `start_time` TIME(0) NULL,
    `duration_minutes` INTEGER NOT NULL,
    `completion_status` ENUM('completed', 'partial', 'skipped') NULL DEFAULT 'completed',
    `stress_level_before` ENUM('low', 'moderate', 'high') NULL,
    `stress_level_after` ENUM('low', 'moderate', 'high') NULL,
    `mood_before` ENUM('poor', 'fair', 'good', 'excellent') NULL,
    `mood_after` ENUM('poor', 'fair', 'good', 'excellent') NULL,
    `effectiveness_rating` INTEGER NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_user_date`(`user_id`, `date_performed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_nutrition_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `nutrition_id` INTEGER NOT NULL,
    `date_consumed` DATE NOT NULL,
    `meal_time` TIME(0) NULL,
    `serving_amount` DECIMAL(5, 2) NULL DEFAULT 1.00,
    `total_calories` DECIMAL(6, 2) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_user_date`(`user_id`, `date_consumed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_detail` ADD CONSTRAINT `id` FOREIGN KEY (`user_id`) REFERENCES `user_authentication`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_exercise_log` ADD CONSTRAINT `user_exercise_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_detail`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_health_log` ADD CONSTRAINT `user_health_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_detail`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_nutrition_log` ADD CONSTRAINT `user_nutrition_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_detail`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
