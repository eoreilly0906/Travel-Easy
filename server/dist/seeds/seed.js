import { User } from '../models/index.js';
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travel-easy');
const seedUsers = async () => {
    try {
        await User.deleteMany({});
        await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123',
        });
        console.log('Users seeded!');
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
seedUsers();
