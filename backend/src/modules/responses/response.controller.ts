import type { Request, Response } from 'express'
import { responseService } from './response.service'
import { CreateResponseDto, UpdateResponseDto, ListResponsesDto } from './response.dto'

export class ResponseController {
    async create(req: Request, res: Response) {
        const validated = CreateResponseDto.parse(req.body)
        const response = await responseService.create(validated)
        res.status(201).json(response)
    }

    async list(req: Request, res: Response) {
        const validated = ListResponsesDto.parse(req.query)
        const result = await responseService.list(validated)
        res.json(result)
    }

    async findById(req: Request, res: Response) {
        const { id } = req.params
        const response = await responseService.findById(id)
        res.json(response)
    }

    async update(req: Request, res: Response) {
        const { id } = req.params
        const validated = UpdateResponseDto.parse(req.body)
        const response = await responseService.update(id, validated)
        res.json(response)
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params
        await responseService.delete(id)
        res.status(204).send()
    }

    async getStats(req: Request, res: Response) {
        const { rulesetId } = req.params
        const stats = await responseService.getStats(rulesetId)
        res.json(stats)
    }
}

export const responseController = new ResponseController()

