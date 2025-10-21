import { Router } from 'express';
import { getFormSchemaHandler } from './job.controller';

const router = Router();

router.get('/:branchId/:serviceType', getFormSchemaHandler);

export default router;

