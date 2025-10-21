import { Router } from 'express';
import { createJobHandler, listJobsHandler, getJobByIdHandler, validateJobHandler } from './job.controller';

const router = Router();

router.post('/', createJobHandler);
router.get('/', listJobsHandler);
router.get('/:id', getJobByIdHandler);
router.post('/validate', validateJobHandler);

export default router;

