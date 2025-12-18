import { Hono } from 'hono';
import profileRoute from './profile';
import addressesRoute from './addresses';

const app = new Hono();

// User routes
app.route('/profile', profileRoute);
app.route('/addresses', addressesRoute);

export default app;
