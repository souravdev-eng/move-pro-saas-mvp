import { Router } from 'express';
import { createTenantHandler, getTenantByIdHandler, updateTenantHandler, listTenantsHandler } from './tenant.controller';

const router = Router();

router.post('/', createTenantHandler);
router.get('/', listTenantsHandler);
router.get('/:tenantId', getTenantByIdHandler);
router.put('/:tenantId', updateTenantHandler);

export default router;

