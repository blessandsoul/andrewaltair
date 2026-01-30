> **SCOPE**: These rules apply specifically to the **server** directory.

# Tourism Server – PM2 & Package Scripts

## Version: 1.0

---

## 1. PM2 Configuration

### 1.1 Ecosystem File (Required)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'tourism-api',
      script: 'dist/server.js',
      instances: 'max',           // Use all CPU cores
      exec_mode: 'cluster',       // Enable cluster mode
      watch: false,               // Disable in production
      max_memory_restart: '1G',   // Restart if memory exceeds 1GB
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3000,
      },

      // Logging
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Restart policy
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
    },
  ],
};
```

### 1.2 Development vs Production

| Setting | Development | Production |
|---------|-------------|------------|
| `instances` | 1 | 'max' (all cores) |
| `exec_mode` | 'fork' | 'cluster' |
| `watch` | true (optional) | false |
| `max_memory_restart` | — | '1G' |

### 1.3 Graceful Shutdown

```typescript
// src/server.ts
import { app } from './app';
import { prisma } from './libs/prisma';
import { redis } from './libs/redis';
import { logger } from './libs/logger';

const server = app.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' });

// Signal PM2 that app is ready
process.send?.('ready');

// Graceful shutdown handler
const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);

  // Stop accepting new connections
  server.close(async () => {
    logger.info('HTTP server closed');

    // Close database connections
    await prisma.$disconnect();
    logger.info('Database disconnected');

    // Close Redis connection
    await redis.quit();
    logger.info('Redis disconnected');

    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

---

## 2. Package.json Scripts Structure

### 2.1 Complete Scripts Configuration

```json
{
  "scripts": {
    "// ===== DEVELOPMENT =====": "",
    "dev": "tsx watch src/server.ts",
    "dev:debug": "tsx watch --inspect src/server.ts",

    "// ===== BUILD =====": "",
    "build": "tsc",
    "build:clean": "rm -rf dist && tsc",

    "// ===== PRODUCTION =====": "",
    "start": "node dist/server.js",
    "start:pm2": "pm2 start ecosystem.config.js --env production",
    "stop:pm2": "pm2 stop tourism-api",
    "restart:pm2": "pm2 restart tourism-api",
    "reload:pm2": "pm2 reload tourism-api",
    "delete:pm2": "pm2 delete tourism-api",
    "logs:pm2": "pm2 logs tourism-api",
    "monit:pm2": "pm2 monit",

    "// ===== DATABASE =====": "",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:migrate:reset": "prisma migrate reset",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:reset": "prisma migrate reset --force && tsx prisma/seed.ts",

    "// ===== TESTING =====": "",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:watch": "vitest --watch",

    "// ===== CODE QUALITY =====": "",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\"",
    "type-check": "tsc --noEmit",

    "// ===== UTILITIES =====": "",
    "clean": "rm -rf dist node_modules/.cache",
    "preinstall": "node -e \"if(process.env.npm_execpath.indexOf('pnpm')===-1) throw new Error('Use pnpm')\"",

    "// ===== CI/CD =====": "",
    "ci:test": "vitest run --coverage --reporter=junit --outputFile=./reports/junit.xml",
    "ci:build": "npm run build && npm run prisma:generate",
    "ci:deploy": "npm run prisma:migrate:deploy && pm2 reload ecosystem.config.js --env production"
  }
}
```

### 2.2 Script Categories Explained

| Category | Purpose | When to Use |
|----------|---------|-------------|
| **Development** | Local development with hot reload | `npm run dev` |
| **Build** | Compile TypeScript to JavaScript | Before deployment |
| **Production** | Run compiled app with PM2 | Production server |
| **Database** | Prisma migrations and seeding | Schema changes |
| **Testing** | Run test suites | Development & CI |
| **Code Quality** | Linting and formatting | Before commits |
| **Utilities** | Cleanup and maintenance | As needed |
| **CI/CD** | Automated pipeline commands | CI/CD pipelines |

---

## 3. Script Naming Conventions

### 3.1 Naming Rules

```
Format: <action>:<target>:<modifier>

Examples:
  test              → Primary action
  test:run          → Run once (no watch)
  test:coverage     → Run with coverage
  test:watch        → Run in watch mode

  prisma:migrate        → Run migration (dev)
  prisma:migrate:deploy → Run migration (prod)
  prisma:migrate:reset  → Reset and re-run

  start             → Basic start
  start:pm2         → Start with PM2
  restart:pm2       → Restart PM2 process
```

### 3.2 Common Prefixes

| Prefix | Meaning | Example |
|--------|---------|---------|
| `dev` | Development mode | `dev`, `dev:debug` |
| `build` | Compile/transpile | `build`, `build:clean` |
| `start` | Run application | `start`, `start:pm2` |
| `test` | Run tests | `test`, `test:coverage` |
| `lint` | Run linter | `lint`, `lint:fix` |
| `prisma` | Database operations | `prisma:migrate` |
| `ci` | CI/CD specific | `ci:test`, `ci:deploy` |

### 3.3 Common Suffixes

| Suffix | Meaning | Example |
|--------|---------|---------|
| `:run` | Run once (no watch) | `test:run` |
| `:watch` | Watch mode | `test:watch` |
| `:fix` | Auto-fix issues | `lint:fix` |
| `:check` | Check only (no changes) | `format:check` |
| `:deploy` | Production deployment | `prisma:migrate:deploy` |
| `:reset` | Reset/clean state | `prisma:reset` |
| `:pm2` | PM2 related | `start:pm2` |

---

## 4. PM2 Commands Reference

### 4.1 Essential Commands

```bash
# Start application
pm2 start ecosystem.config.js --env production

# Process management
pm2 list                    # List all processes
pm2 show tourism-api        # Show process details
pm2 monit                   # Real-time monitoring

# Logs
pm2 logs tourism-api        # Stream logs
pm2 logs --lines 100        # Show last 100 lines
pm2 flush                   # Clear all logs

# Restart strategies
pm2 restart tourism-api     # Hard restart
pm2 reload tourism-api      # Zero-downtime reload (cluster mode)

# Stop and delete
pm2 stop tourism-api        # Stop process
pm2 delete tourism-api      # Remove from PM2

# Startup script (auto-start on reboot)
pm2 startup                 # Generate startup script
pm2 save                    # Save current process list
```

### 4.2 Cluster Mode Operations

```bash
# Scale instances
pm2 scale tourism-api 4     # Set to 4 instances
pm2 scale tourism-api +2    # Add 2 instances
pm2 scale tourism-api -1    # Remove 1 instance

# Zero-downtime deployment
pm2 reload ecosystem.config.js --env production
```

---

## 5. Environment-Specific Configuration

### 5.1 Environment Files

```
.env                 # Shared defaults (committed)
.env.development     # Development overrides
.env.staging         # Staging overrides
.env.production      # Production overrides (not committed)
.env.local           # Local overrides (not committed)
```

### 5.2 Loading Order

```bash
# PM2 loads in order:
1. ecosystem.config.js env_<environment>
2. .env file (via dotenv in app)
3. System environment variables (highest priority)
```

### 5.3 Environment-Specific Scripts

```json
{
  "scripts": {
    "start:dev": "pm2 start ecosystem.config.js --env development",
    "start:staging": "pm2 start ecosystem.config.js --env staging",
    "start:prod": "pm2 start ecosystem.config.js --env production"
  }
}
```

---

## 6. Deployment Workflow

### 6.1 First-Time Deployment

```bash
# 1. Clone and install
git clone <repo>
cd server
npm install

# 2. Setup environment
cp .env.example .env.production
# Edit .env.production with production values

# 3. Build
npm run build
npm run prisma:generate

# 4. Run migrations
npm run prisma:migrate:deploy

# 5. Start with PM2
npm run start:pm2

# 6. Setup startup script
pm2 startup
pm2 save
```

### 6.2 Update Deployment

```bash
# 1. Pull changes
git pull origin main

# 2. Install dependencies
npm install

# 3. Build
npm run build

# 4. Run migrations (if any)
npm run prisma:migrate:deploy

# 5. Zero-downtime reload
npm run reload:pm2
```

---

## 7. Monitoring & Logs

### 7.1 Log Configuration

```javascript
// ecosystem.config.js
{
  // Separate error and output logs
  error_file: './logs/error.log',
  out_file: './logs/output.log',

  // Combined logs with timestamps
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  merge_logs: true,

  // Log rotation (requires pm2-logrotate)
  // pm2 install pm2-logrotate
}
```

### 7.2 Log Rotation Setup

```bash
# Install log rotation module
pm2 install pm2-logrotate

# Configure rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'  # Daily at midnight
```

### 7.3 Health Checks

```typescript
// src/modules/health/health.routes.ts
export async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get('/health', async () => ({ status: 'ok' }));

  // Detailed health check
  fastify.get('/health/ready', async () => {
    const dbHealthy = await checkDatabase();
    const redisHealthy = await checkRedis();

    if (!dbHealthy || !redisHealthy) {
      throw new InternalError('SERVICE_UNHEALTHY', 'Service dependencies unhealthy');
    }

    return {
      status: 'ok',
      database: dbHealthy,
      redis: redisHealthy,
      uptime: process.uptime(),
    };
  });
}
```

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| App not starting | Port in use | `lsof -i :3000` then kill process |
| Memory leak | No max_memory_restart | Add `max_memory_restart: '1G'` |
| Logs not rotating | pm2-logrotate not installed | `pm2 install pm2-logrotate` |
| Cluster not working | exec_mode: 'fork' | Change to `exec_mode: 'cluster'` |
| App crashes on startup | Bad config | Check `pm2 logs` for errors |

### 8.2 Debug Commands

```bash
# Check PM2 status
pm2 status

# View detailed info
pm2 show tourism-api

# Check for errors
pm2 logs tourism-api --err --lines 50

# Monitor in real-time
pm2 monit

# Restart with fresh state
pm2 delete tourism-api && pm2 start ecosystem.config.js
```

---

## 9. Checklist

### 9.1 PM2 Setup

- [ ] `ecosystem.config.js` created with all environments
- [ ] Graceful shutdown implemented in server.ts
- [ ] Cluster mode enabled for production
- [ ] Memory limit configured
- [ ] Log files configured
- [ ] Log rotation installed
- [ ] Startup script configured (`pm2 startup && pm2 save`)

### 9.2 Package Scripts

- [ ] Scripts organized by category with comments
- [ ] Development scripts (dev, dev:debug)
- [ ] Build scripts (build, build:clean)
- [ ] PM2 scripts (start:pm2, stop:pm2, reload:pm2)
- [ ] Database scripts (prisma:*)
- [ ] Test scripts (test, test:coverage)
- [ ] Lint scripts (lint, lint:fix)
- [ ] CI/CD scripts (ci:test, ci:deploy)

---

**Version**: 1.0
**Last Updated**: 2025-01-30
