import { User } from '../models/index.js';
import mongoose from 'mongoose';
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travel-easy');
const cleanDB = async () => {
    try {
        await User.deleteMany({});
        console.log('All users deleted');
    }
    catch (err) {
        console.error(err);
    }
};
cleanDB();
