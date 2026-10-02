import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createBoomboxEvent } from "../db";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  // Unload-safe analytics endpoint used by LINE CTA clicks. It accepts
  // application/json from navigator.sendBeacon and keepalive fetch alike.
  app.post("/api/analytics/line-click", async (req, res) => {
    const input = req.body as Record<string, unknown> | undefined;
    const packageCode = typeof input?.packageCode === "string" ? input.packageCode.slice(0, 4) : undefined;
    const deviceColor = typeof input?.deviceColor === "string" ? input.deviceColor.slice(0, 120) : undefined;
    const scentSummary = typeof input?.scentSummary === "string" ? input.scentSummary.slice(0, 2000) : undefined;
    const source = typeof input?.source === "string" ? input.source.slice(0, 120) : undefined;
    try {
      await createBoomboxEvent({ eventName: "line_click", packageCode, deviceColor, scentSummary, source });
      res.status(204).end();
    } catch (error) {
      console.warn("[Analytics] Failed to persist LINE click:", error);
      // The navigation should never be blocked by analytics.
      res.status(204).end();
    }
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
