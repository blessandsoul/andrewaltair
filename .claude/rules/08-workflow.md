# Workflow: Git, AI Safety & Testing

## Git Commit Format
```
<type>(<scope>): <subject>
```
Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `revert`
- Lowercase subject, no period, imperative mood, max 50 chars
- One logical change per commit
- Never force push to main

## Branch Naming
```
<type>/<short-description>
```
Examples: `feat/tour-search`, `fix/token-refresh`, `chore/update-deps`

## AI Edit Safety Rules

**Minimal changes only:**
- Make the smallest change to achieve the goal
- Don't "clean up" or refactor code that wasn't part of the request
- Don't add features, comments, or type annotations beyond what was asked

**Protected zones (require explicit confirmation):**
- Authentication & session management
- Payment processing
- Database schema changes
- Security configuration (CORS, rate limiting)

**Preservation rules:**
- Don't change existing function signatures without explicit request
- Don't remove or rename exports other files depend on
- Don't delete files without explicit request
- Remove all debug `console.log` before completing

**Communication:**
- State your plan before making changes
- Summarize what was done after
- Ask when uncertain — don't make large assumptions

## Testing Conventions
- Test framework: **Vitest** + `@testing-library/react`
- Test file naming: `*.test.ts` / `*.test.tsx`
- Test structure: `describe` > `it` with AAA pattern (Arrange, Act, Assert)
- Test naming: `should [behavior] when [condition]`
- Tests required for: business logic (services), utilities, bug fixes (regression)
- Never delete existing tests without explanation
- Never modify assertions just to make failing tests pass
- Mock external APIs and database calls, not the code under test

## .gitignore Essentials
`node_modules/`, `.env`, `.env.local`, `.next/`, `dist/`, `coverage/`, `*.log`, `.DS_Store`
