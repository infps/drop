import { serveStatic } from '@hono/node-server/serve-static';
import path from 'path';

// Serve static files from uploads directory
export const staticFilesMiddleware = serveStatic({
  root: path.join(process.cwd(), 'uploads'),
  rewriteRequestPath: (path) => path.replace(/^\/uploads/, ''),
});
