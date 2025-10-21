import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import tenantRoutes from './modules/tenants/tenant.routes';
import branchRoutes from './modules/branches/branch.routes';
import rulesetRoutes from './modules/rulesets/ruleset.routes';
import responseRoutes from './modules/responses/response.routes';
import jobRoutes from './modules/jobs/job.routes';
import formRoutes from './modules/jobs/form.routes';
import { errorHandler } from './middleware/error';

export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '1mb' }));
    app.use(morgan('dev'));

    app.use('/api/tenants', tenantRoutes);
    app.use('/api/branches', branchRoutes);
    app.use('/api/rulesets', rulesetRoutes);
    app.use('/api/responses', responseRoutes);
    app.use('/api/jobs', jobRoutes);
    app.use('/api/form', formRoutes);

    app.use(errorHandler);

    return app;
}


