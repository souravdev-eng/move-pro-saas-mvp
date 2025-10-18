import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: parseInt(process.env.PORT ?? '4000', 10),
    mongoUri: process.env.MONGODB_URI ?? '',
    mongoUsername: process.env.MONGODB_USERNAME ?? '',
    mongoPassword: process.env.MONGODB_PASSWORD ?? '',
};

if (!env.mongoUri) {
    // Fail fast for missing configuration
    throw new Error('MONGODB_URI is required');
}


