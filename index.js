import express from 'express';
import userAuthRoutes from './routes/userAuthRoute.js';
import userDetailRoutes from './routes/userDetailRoute.js';
import userExerciseRoutes from './routes/userExerciseRoute.js';
import userHealthRoutes from './routes/userHealthRoute.js';
import userNutritionRoutes from './routes/userNutritionRoute.js';

const app = express();
app.use(express.json());

app.use('/user', userAuthRoutes);
app.use('/user-detail', userDetailRoutes);
app.use('/exercise-log', userExerciseRoutes);
app.use('/health-log', userHealthRoutes);
app.use('/nutrition-log', userNutritionRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);