import express from 'express';
import userAuthRoutes from './routes/userAuthRoute.js';
import userDetailRoutes from './routes/userDetailRoute.js';

const app = express();
app.use(express.json());

app.use('/user', userAuthRoutes);
app.use('/user-detail', userDetailRoutes);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
    }
);