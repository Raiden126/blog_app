import {connect} from 'mongoose';

export const connectToDatabase = async () => {
    try {
        await connect(process.env.MONGODB_URI as string);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}