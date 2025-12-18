import { Hono } from 'hono';
import ordersListRoute from './index';
import orderByIdRoute from './[id]';

const app = new Hono();

// Mount order list routes at /
app.route('/', ordersListRoute);

// Mount individual order routes at /:id
app.route('/', orderByIdRoute);

export default app;
