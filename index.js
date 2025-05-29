import express from 'express';
import userAuthRoutes from './routes/userAuthRoute.js';

const app = express();
app.use(express.json());

app.use('/user', userAuthRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);