import { Hono } from 'hono'
import * as vendorController from '@/controllers/user/vendor.controller'

const router = new Hono()

// Get vendors list (with filtering, search, location)
router.get('/', vendorController.getVendors)

// Get vendor by ID
router.get('/:id', vendorController.getVendorById)

// Get vendor menu/products
router.get('/:id/products', vendorController.getVendorProducts)

export default router
