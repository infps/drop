import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { staticFilesMiddleware } from "./middleware/static";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [
        "http://localhost:5173",
      ];
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 600,
    credentials: true,
  }),
);

app.use("*", logger);

app.use("/uploads/*", staticFilesMiddleware);

app.get("/", (c) => {
  return c.json({
    status: "success",
    message: "Drop API Server is running",
    version: process.env.API_VERSION || "v1",
    timestamp: new Date().toISOString(),
  });
});

app.get("/status", (c) => {
  return c.json({
    status: "healthy",
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    database: "connected", // TODO: Add actual database health check
  });
});

// Import routes
import routes from "./routes";

// API Routes
app.route("/api/v1", routes);

// 404 Handler
app.notFound((c) => {
  return c.json(
    {
      status: "error",
      message: "Route not found",
      path: c.req.path,
    },
    404,
  );
});

// Error Handler Middleware (should be last)
app.onError(errorHandler);

// Export the app as default
export default app;

// Start server
const port = Number(process.env.PORT) || 3001;
console.log(`Server is starting on port ${port}...`);

export const server = Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on http://localhost:${port}`);
