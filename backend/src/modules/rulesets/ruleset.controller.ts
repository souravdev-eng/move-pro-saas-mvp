import type { Request, Response } from 'express';
import { z } from 'zod';
import { CreateRulesetSchema, ListRulesetsQuerySchema } from './ruleset.dto';
import { createRuleset, getRulesetById, listRulesets, deleteRulesetById } from './ruleset.service';
import { getPagination } from '../../utils/pagination';

export async function createRulesetHandler(req: Request, res: Response): Promise<void> {
    try {
        const parsed = CreateRulesetSchema.parse(req.body);
        // Extra validation: definitions minimally contain fields[] and layout{}
        if (!parsed.definitions || !Array.isArray((parsed.definitions as any).fields) || !(parsed.definitions as any).layout) {
            const err = new Error('definitions must include fields[] and layout{}');
            (err as any).status = 400;
            throw err;
        }
        const created = await createRuleset(parsed);
        res.status(201).json(created);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: { message: 'Validation failed', details: err.flatten() } });
            return;
        }
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

export async function listRulesetsHandler(req: Request, res: Response): Promise<void> {
    try {
        const queryParsed = ListRulesetsQuerySchema.parse(req.query);
        const { page, limit } = getPagination({ page: queryParsed.page, limit: queryParsed.limit, maxLimit: 100 });
        const result = await listRulesets(queryParsed, page, limit);
        res.json(result);
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({ error: { message: 'Validation failed', details: err.flatten() } });
            return;
        }
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}

export async function getRulesetByIdHandler(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: { message: 'id param is required' } });
            return;
        }
        const doc = await getRulesetById(id);
        if (!doc) {
            res.status(404).json({ error: { message: 'Ruleset not found' } });
            return;
        }
        res.json(doc);
    } catch (err) {
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}


export async function deleteRulesetByIdHandler(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: { message: 'id param is required' } });
            return;
        }
        await deleteRulesetById(id);
        res.status(204).send();
    } catch (err) {
        const anyErr = err as any;
        const status = anyErr?.status ?? 500;
        res.status(status).json({ error: { message: anyErr?.message ?? 'Internal Server Error' } });
    }
}
