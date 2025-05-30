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

    try {
        const newUser = await prisma.user_authentication.create({
            data: {
                email,
                password_hash
            }
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
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

