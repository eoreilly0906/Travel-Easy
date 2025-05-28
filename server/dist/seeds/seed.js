import db from '../config/connection.js';
import { Thought, User } from '../models/index.js';
import cleanDB from './cleanDB.js';
import bcrypt from 'bcrypt';
import userData from './userData.json' with { type: 'json' };
import thoughtData from './thoughtData.json' with { type: 'json' };
const seedDatabase = async () => {
    try {
        await db();
        await cleanDB();
        // Hash passwords before inserting users
        const hashedUserData = await Promise.all(userData.map(async (user) => {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(user.password, saltRounds);
            return {
                ...user,
                password: hashedPassword
            };
        }));
        await Thought.insertMany(thoughtData);
        await User.insertMany(hashedUserData);
        console.log('Seeding completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};
seedDatabase();
