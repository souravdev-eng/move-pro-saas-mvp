import mongoose from 'mongoose';
import { env } from '../config/env';

mongoose.set('strictQuery', true);

export async function connectToDatabase(): Promise<typeof mongoose> {
    console.log('Connecting to MongoDB');
    return await mongoose.connect(env.mongoUri);
}

export async function disconnectFromDatabase(): Promise<void> {
    await mongoose.disconnect();
}


