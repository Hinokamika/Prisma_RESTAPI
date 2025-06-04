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

const createUser = async (req, res) => {
    const { email, password_hash } = req.body;

    // Validate required fields before attempting to create
    if (!email || !password_hash) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Generate a unique user_auth_id (required field in schema)
        const user_auth_id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        const newUser = await prisma.user_authentication.create({
            data: {
                email,
                password_hash,
                user_auth_id
            }
        });

        res.status(201).json(newUser);
    } catch (error) {        console.error('Error creating user:', error);
        
        // Handle specific error types
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(409).json({ error: 'Email already exists' });
        } else if (error.code === 'P2002' && error.meta?.target?.includes('user_auth_id')) {
            // This should be rare due to our generation method, but handle it just in case
            return res.status(409).json({ error: 'User ID collision, please try again' });
        } else if (error.code === 'P2000') {
            return res.status(400).json({ error: 'Invalid input data' });
        } else {
            // Log the full error details in development for debugging
            console.error('Detailed error:', JSON.stringify(error, null, 2));
            return res.status(500).json({ 
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password_hash } = req.body;

    try {
        const updatedUser = await prisma.user_authentication.update({
            where: { id: parseInt(id) },
            data: {
                email,
                password_hash
            }
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user_authentication.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user_authentication.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                email: true,
                password_hash: true,
                created_at: true,
                last_login: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getUser, createUser, updateUser, deleteUser, getUserById };

