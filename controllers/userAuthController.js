import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

const getUser = async (req, res) => {
    try {
        const user = await prisma.user_authentication.findMany({
            select: {
                id: true,
                email: true,
                password_hash: true,
                created_at: true,
                last_login: true
            }
        });
    
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
    
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getUser };

