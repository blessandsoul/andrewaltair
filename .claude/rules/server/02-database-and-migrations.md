---
trigger: always_on
---

> **SCOPE**: These rules apply specifically to the **server** directory.

# Tourism Server – Database & Migrations

## Version: 2.0

---

## 1. Database Configuration

| Setting | Value |
|---------|-------|
| Engine | MySQL 8.0+ |
| ORM | Prisma 6.x |
| Schema Location | `prisma/schema.prisma` |
| Migrations | `prisma/migrations/` |

**Warning**: Do NOT upgrade to Prisma 7.x without thorough testing.

---

## 2. Critical Rules

### 2.1 Schema Changes = Migrations Only

```bash
# ✅ ALWAYS use Prisma migrations
npm run prisma:migrate dev --name add_tour_description

# ❌ NEVER run raw DDL
CREATE TABLE tours ...  # FORBIDDEN
ALTER TABLE tours ...   # FORBIDDEN
```

**Exception**: Data changes (INSERT, UPDATE, DELETE) can be raw SQL.

### 2.2 Development vs Production

| Environment | Allowed Commands | Forbidden |
|-------------|-----------------|-----------|
| Development | `prisma:reset`, `prisma:migrate dev`, `db push` | — |
| Production | `prisma:migrate deploy` only | `reset`, `db push` |

```bash
# Development: iterate freely
npm run prisma:reset        # Drops everything, reruns migrations
npm run prisma:seed         # Repopulate test data

# Production: safe only
npm run prisma:migrate deploy   # Applies pending migrations
```

### 2.3 Migration Conflicts

When you get migration errors in development:

```bash
# ❌ DON'T try to fix migration files manually
# ❌ DON'T delete migration folders
# ✅ DO reset and start clean
npm run prisma:reset
npm run prisma:seed
```

### 2.4 Never Use `db push` in Production

| Command | Purpose | Environment |
|---------|---------|-------------|
| `prisma db push` | Quick prototyping | Development only |
| `prisma migrate dev` | Proper migrations | Development |
| `prisma migrate deploy` | Apply migrations | Production |

---

## 3. Naming Conventions

### 3.1 Tables (Database)

```sql
-- Format: snake_case, plural
users
companies
tours
tour_locations
booking_payments
```

### 3.2 Columns

```sql
-- Format: snake_case
id
created_at
updated_at
deleted_at

-- Foreign keys: <table_singular>_id
user_id
company_id
location_id
```

### 3.3 Prisma Models

```prisma
// Format: PascalCase, singular
model User { ... }
model Company { ... }
model Tour { ... }
model TourLocation { ... }
```

### 3.4 Mapping Example

```prisma
model TourLocation {
  id        String @id @default(uuid())
  tourId    String @map("tour_id")
  locationId String @map("location_id")

  @@map("tour_locations")
}
```

---

## 4. Required Fields

### 4.1 Every Entity Table

```prisma
model EntityName {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("entity_names")
}
```

### 4.2 Optional But Recommended

```prisma
model Tour {
  // ... required fields

  deletedAt DateTime? @map("deleted_at")  // Soft deletes
  isActive  Boolean   @default(true) @map("is_active")

  @@map("tours")
}
```

---

## 5. Relationships

### 5.1 Core Entity Relationships

```
users (1) ──→ (many) bookings
users (1) ──→ (1) companies    [when role = COMPANY]
users (1) ──→ (1) guides       [when role = GUIDE]

companies (1) ──→ (many) tours
companies (1) ──→ (many) tour_agents

tours (many) ←──→ (many) locations    [via tour_locations]
guides (many) ←──→ (many) locations   [via guide_locations]
```

### 5.2 Location Strategy

```prisma
// ✅ CORRECT: Reference locations table
model Tour {
  locationId String   @map("location_id")
  location   Location @relation(fields: [locationId], references: [id])
}

model Location {
  id        String  @id @default(uuid())
  name      String  // Tbilisi, Batumi, Mtskheta
  region    String
  latitude  Decimal @db.Decimal(10, 8)
  longitude Decimal @db.Decimal(11, 8)

  @@map("locations")
}

// ❌ FORBIDDEN: Storing city as string in multiple tables
model Tour {
  city String  // DON'T DO THIS
}
```

### 5.3 Polymorphic Media

```prisma
model Media {
  id         String @id @default(uuid())
  entityType String @map("entity_type")  // 'tour', 'hotel', 'guide'
  entityId   String @map("entity_id")
  url        String
  type       String // 'image', 'video', 'document'
  order      Int    @default(0)

  @@index([entityType, entityId])
  @@map("media")
}
```

---

## 6. Indexing Strategy

### 6.1 Always Index

```prisma
model Tour {
  // Foreign keys (Prisma auto-indexes, but verify)
  @@index([companyId])
  @@index([locationId])

  // Filter columns (used in WHERE)
  @@index([isActive])
  @@index([isVerified])

  // Composite indexes (multiple columns filtered together)
  @@index([locationId, isActive])
  @@index([startDate, endDate])
  @@index([price, currency])

  // Unique constraints
  @@unique([slug])
}

// Junction tables
model TourLocation {
  @@unique([tourId, locationId])
}
```

### 6.2 When NOT to Index

| Don't Index | Reason |
|-------------|--------|
| Low-cardinality booleans alone | Not selective enough |
| TEXT/BLOB columns | Too large |
| Columns never in WHERE/ORDER | Waste of space |
| Every column | Hurts write performance |

---

## 7. Migration Workflow

### 7.1 Adding/Modifying Schema

```bash
# Step 1: Edit prisma/schema.prisma
# Step 2: Create migration
npm run prisma:migrate dev --name add_tour_description

# Step 3: Verify
cat prisma/migrations/<timestamp>_add_tour_description/migration.sql
npm run prisma:studio
```

### 7.2 Common Scenarios

**Adding New Table**:
```bash
# Add model to schema.prisma, then:
npm run prisma:migrate dev --name add_reviews_table
```

**Adding Column**:
```prisma
// If NOT NULL without default → error
// Solution: Add default or make optional
model Tour {
  rating Decimal? @db.Decimal(3, 2)  // Optional
  // or
  rating Decimal @default(0) @db.Decimal(3, 2)  // With default
}
```

**Renaming Column (Preserve Data)**:
```prisma
// Step 1: Add new column, keep old
model Tour {
  price       String?  // Old - make optional
  priceAmount Decimal? // New - add optional
}
// Run migration, write data migration script

// Step 2: Remove old in next migration
model Tour {
  priceAmount Decimal @map("price_amount")
}
```

---

## 8. Production Deployment

### 8.1 Pre-Deployment Checklist

- [ ] All migrations tested locally
- [ ] Seed data runs successfully
- [ ] No pending schema changes
- [ ] Migration files committed to git
- [ ] Database backup taken
- [ ] Rollback plan ready

### 8.2 Deployment Commands

```bash
# On production server
npm run prisma:migrate deploy  # Apply pending migrations
npm run prisma:generate        # Regenerate client
npm start                      # Restart application
```

### 8.3 Production Rules

| ❌ NEVER | ✅ ALWAYS |
|----------|----------|
| `prisma:reset` | Test migrations in staging first |
| `prisma db push` | Keep database backups |
| Manual schema edits | Have rollback plan |
| Edit committed migrations | Use forward-only migrations |

---

## 9. Data Integrity

### 9.1 Foreign Keys

```prisma
// Use cascading deletes for dependent data
model Booking {
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Use restrict for critical references
model Payment {
  booking Booking @relation(fields: [bookingId], references: [id], onDelete: Restrict)
}
```

### 9.2 Soft Deletes

```typescript
// Prefer soft deletes for user content
model Tour {
  deletedAt DateTime?
}

// Repository pattern
async function findAll() {
  return prisma.tour.findMany({
    where: { deletedAt: null },
  });
}

// Hard delete appropriate for:
// - System logs, sessions
// - GDPR deletion requests
// - Orphaned junction records
```

### 9.3 Transactions

```typescript
// Use transactions for multi-table operations
async function createBookingWithPayment(data: BookingData) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({ data: data.booking });
    const payment = await tx.payment.create({
      data: { ...data.payment, bookingId: booking.id },
    });
    return { booking, payment };
  });
}
```

---

## 10. Query Optimization

### 10.1 Avoid N+1 Queries

```typescript
// ❌ N+1 Problem
const tours = await prisma.tour.findMany();
for (const tour of tours) {
  tour.company = await prisma.company.findUnique({ where: { id: tour.companyId } });
}

// ✅ Use includes
const tours = await prisma.tour.findMany({
  include: { company: true },
});
```

### 10.2 Select Only Needed Fields

```typescript
// ❌ Selecting everything
const tours = await prisma.tour.findMany();

// ✅ Select specific fields
const tours = await prisma.tour.findMany({
  select: {
    id: true,
    title: true,
    price: true,
  },
});
```

### 10.3 Debugging Slow Queries

```sql
-- Use EXPLAIN in MySQL
EXPLAIN SELECT * FROM tours WHERE location_id = 'xxx';

-- Check for missing indexes
SHOW INDEX FROM tours;
```

---

## 11. Quick Reference

```bash
# Development Commands
npm run prisma:studio        # Visual DB browser
npm run prisma:migrate dev   # Create migration
npm run prisma:reset         # Nuclear option - clean slate
npm run prisma:seed          # Repopulate data
npm run prisma:generate      # Regenerate client

# Production Commands
npm run prisma:migrate deploy  # Apply migrations (safe)
npm run prisma:generate        # Regenerate client

# Database Access
# phpMyAdmin: http://localhost:8080
# Prisma Studio: http://localhost:5555
```

---

## 12. Troubleshooting

| Issue | Solution |
|-------|----------|
| "DATABASE_URL not found" | Check `.env` file exists with valid URL |
| "Table already exists" | Run `npm run prisma:reset` (dev only) |
| "Prisma Client not generated" | Run `npm run prisma:generate` |
| Slow queries | Add indexes, use EXPLAIN, limit fields |
| Migration conflict | Reset in dev, never edit committed migrations |

---

## 13. Checklist

- [ ] Schema changes via migrations only
- [ ] Tables use snake_case, models use PascalCase
- [ ] All entities have id, createdAt, updatedAt
- [ ] Foreign keys properly indexed
- [ ] Soft deletes for user content
- [ ] Transactions for multi-table operations
- [ ] Never reset/push in production
- [ ] Migration files committed to git

---

**Version**: 2.0
**Last Updated**: 2025-01-30
