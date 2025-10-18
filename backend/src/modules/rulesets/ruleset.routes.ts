import { Router } from 'express';
import { createRulesetHandler, deleteRulesetByIdHandler, getRulesetByIdHandler, listRulesetsHandler } from './ruleset.controller';

const router = Router();

router.post('/', createRulesetHandler);
router.get('/', listRulesetsHandler);
router.get('/:id', getRulesetByIdHandler);
router.delete('/:id', deleteRulesetByIdHandler);

export default router;


