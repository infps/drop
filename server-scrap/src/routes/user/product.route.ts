import { Hono } from 'hono'
import * as productController from '@/controllers/user/product.controller'

const router = new Hono()

// Get products (with filtering)
router.get('/', productController.getProducts)

// Get product by ID
router.get('/:id', productController.getProductById)

export default router
