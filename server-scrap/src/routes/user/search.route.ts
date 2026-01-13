import { Hono } from 'hono'
import * as searchController from '@/controllers/user/search.controller'

const router = new Hono()

// Search across vendors and products
router.get('/', searchController.search)

export default router
