import { Hono } from 'hono'
import vendorRoutes from './vendor.route'
import productRoutes from './product.route'
import searchRoutes from './search.route'

const app = new Hono()

// Mount routes
app.route('/vendors', vendorRoutes)
app.route('/products', productRoutes)
app.route('/search', searchRoutes)

export default app
