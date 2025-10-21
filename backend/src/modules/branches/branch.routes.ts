import { Router } from 'express';
import { createBranchHandler, getBranchByIdHandler, updateBranchHandler, listBranchesHandler } from './branch.controller';

const router = Router();

router.post('/', createBranchHandler);
router.get('/', listBranchesHandler);
router.get('/:branchId', getBranchByIdHandler);
router.put('/:branchId', updateBranchHandler);

export default router;

