import { Hono } from 'hono'
import { updateLocation, getLocationStatus } from '@/controllers/rider/location.controller'

const location = new Hono()

location.post('/', updateLocation)
location.get('/', getLocationStatus)

export default location
