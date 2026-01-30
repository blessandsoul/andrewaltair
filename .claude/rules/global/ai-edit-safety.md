---
trigger: always_on
---

> **SCOPE**: These rules apply to the **entire workspace** (server and client).

# AI Edit Safety Rules

## Version: 2.0

---

## Core Philosophy

This is a **production codebase**. Every change must be intentional, minimal, and reversible.

---

## 1. Change Scope Rules

### 1.1 Minimal Changes Only

```
ALWAYS:
- Make the smallest possible change to achieve the goal
- Change one thing at a time
- Keep refactoring separate from feature work

NEVER:
- Rewrite entire files when fixing a bug
- "Clean up" code that wasn't part of the request
- Add features that weren't explicitly requested
```

### 1.2 Protected Code Zones

These areas require **explicit user confirmation** before modification:

| Zone | Examples | Why Protected |
|------|----------|---------------|
| Authentication | Login, logout, token refresh, session management | Security critical |
| Payments | Payment processing, refunds, webhook handlers | Financial risk |
| Core Booking | Booking creation, cancellation, modification | Business critical |
| Database Schema | Migrations, model changes | Data integrity |
| Security Config | CORS, rate limiting, CSP headers | Security critical |

**Before modifying protected zones:**
1. State what you're about to change
2. Explain the impact
3. Wait for explicit confirmation

### 1.3 Breaking Changes

When a breaking change is unavoidable:

```markdown
## BREAKING CHANGE ALERT

**What's changing:** [description]
**Files affected:** [list]
**Migration required:** [yes/no]
**Rollback steps:** [description]
```

---

## 2. Code Modification Rules

### 2.1 Function Signatures

```typescript
// NEVER change existing signatures without explicit request
// ❌ BAD - Changed parameter order
function createTour(title: string, ownerId: string) // was (ownerId, title)

// ❌ BAD - Removed parameter
function createTour(title: string) // was (title, ownerId)

// ✅ OK - Added optional parameter (backwards compatible)
function createTour(title: string, ownerId: string, options?: CreateOptions)
```

### 2.2 Exports and Imports

```typescript
// NEVER remove or rename exports that other files depend on
// ❌ BAD
export { TourService as TourSvc } // renamed

// ❌ BAD
// export { TourService } // removed

// ✅ OK - Add new exports
export { TourService, TourServiceV2 }
```

### 2.3 Backwards Compatibility

When adding features, **extend** rather than replace:

```typescript
// ✅ GOOD - Extend existing
interface TourFilters {
  city?: string;
  // New fields added at the end
  minRating?: number;  // NEW
  hasAvailability?: boolean;  // NEW
}

// ❌ BAD - Replace existing
interface TourFiltersV2 {  // New interface that breaks existing code
  location: string;  // Renamed from city
}
```

---

## 3. Documentation Requirements

### 3.1 TODO Comments

Add `// TODO:` comments when:
- Something is intentionally incomplete
- A follow-up task is needed
- A temporary workaround is used
- An assumption needs verification

```typescript
// TODO: Add rate limiting once Redis is configured
// TODO: Verify this handles edge case of empty array
// TODO(2025-02): Remove after migration complete
// TODO: @username - Review this logic
```

### 3.2 Debug Logs

```typescript
// ❌ NEVER - Permanent debug logs
console.log('user:', user);
logger.debug('Processing tour:', tour);

// ✅ OK - Clearly marked temporary logs
// TODO: REMOVE - Debug log for issue #123
console.log('[DEBUG] Processing:', data);
```

Remove all debug logs before completing the task.

---

## 4. File Operations

### 4.1 File Creation

```
BEFORE creating a new file, verify:
1. No existing file serves this purpose
2. The location follows project conventions
3. The naming matches project patterns
```

### 4.2 File Deletion

```
NEVER delete files without explicit request.
If a file appears unused:
1. Comment that it may be unused
2. Ask user to confirm deletion
3. Only then proceed
```

### 4.3 File Moving/Renaming

```
Moving or renaming files:
1. Update ALL import statements
2. Verify no broken references
3. Update any path aliases if needed
```

---

## 5. Testing Requirements

### 5.1 When Tests Are Required

Tests are **mandatory** for:
- Business logic (services)
- Utility functions
- API endpoints (integration tests)
- Bug fixes (regression tests)

### 5.2 Test Modification Rules

```
NEVER:
- Delete existing tests without explanation
- Modify test assertions to make failing tests pass
- Skip tests to hide failures

ALWAYS:
- Add tests for new functionality
- Add regression tests for bug fixes
- Explain why a test was modified
```

---

## 6. Error Handling

### 6.1 Never Swallow Errors

```typescript
// ❌ NEVER
try {
  await riskyOperation();
} catch (e) {
  // silently ignored
}

// ✅ ALWAYS
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed:', error);
  throw new AppError('OPERATION_FAILED', 'Unable to complete operation');
}
```

### 6.2 Preserve Error Context

```typescript
// ❌ BAD - Lost context
catch (error) {
  throw new Error('Failed');
}

// ✅ GOOD - Preserved context
catch (error) {
  throw new AppError('TOUR_CREATE_FAILED', 'Failed to create tour', { cause: error });
}
```

---

## 7. Communication Rules

### 7.1 Before Making Changes

State your plan:
```markdown
I'll make the following changes:
1. [File]: [Change description]
2. [File]: [Change description]

This will/won't affect: [description]
```

### 7.2 After Making Changes

Summarize what was done:
```markdown
Changes made:
- [File]: [What changed]
- [File]: [What changed]

To test: [How to verify]
```

### 7.3 When Uncertain

```markdown
I'm unsure about:
- [Question 1]
- [Question 2]

My assumptions:
- [Assumption 1]
- [Assumption 2]

Please confirm before I proceed.
```

---

## 8. Rollback Readiness

Every change should be reversible:

1. **Git commits**: Each logical change = one commit
2. **Database migrations**: Always have a down migration
3. **Feature flags**: Consider for risky features
4. **Backups**: Remind user before destructive operations

---

## Quick Reference Checklist

Before submitting any change:

- [ ] Change is minimal and focused
- [ ] No unrelated modifications
- [ ] Protected zones untouched (or confirmed)
- [ ] Function signatures preserved
- [ ] Exports unchanged (or backwards compatible)
- [ ] TODOs added where needed
- [ ] Debug logs removed
- [ ] Tests added/updated
- [ ] Errors properly handled
- [ ] Change is documented

---

**Version**: 2.0
**Last Updated**: 2025-01-30
