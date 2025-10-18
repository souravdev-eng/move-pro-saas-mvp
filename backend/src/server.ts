import { createApp } from './app';
import { env } from './config/env';
import { connectToDatabase } from './db/mongoose';

async function bootstrap(): Promise<void> {
    await connectToDatabase();
    const app = createApp();
    app.listen(env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Rules Engine API listening on port ${env.port}`);
    });
}

bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
});


