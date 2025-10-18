import { Router } from 'express'
import { asyncHandler } from '../../middleware/error'
import { responseController } from './response.controller'

const router = Router()

router.post('/', asyncHandler(responseController.create.bind(responseController)))
router.get('/', asyncHandler(responseController.list.bind(responseController)))
router.get('/stats/:rulesetId', asyncHandler(responseController.getStats.bind(responseController)))
router.get('/:id', asyncHandler(responseController.findById.bind(responseController)))
router.patch('/:id', asyncHandler(responseController.update.bind(responseController)))
router.delete('/:id', asyncHandler(responseController.delete.bind(responseController)))

export default router

