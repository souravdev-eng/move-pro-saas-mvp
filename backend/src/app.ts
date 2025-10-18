import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rulesetRoutes from './modules/rulesets/ruleset.routes';
import responseRoutes from './modules/responses/response.routes';
import { errorHandler } from './middleware/error';

export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '1mb' }));
    app.use(morgan('dev'));

    app.use('/api/rulesets', rulesetRoutes);
    app.use('/api/responses', responseRoutes);

    app.use(errorHandler);

    return app;
}


