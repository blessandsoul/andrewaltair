---
trigger: always_on
---

> **SCOPE**: These rules apply to the **entire workspace** (server and client).

# Git Conventions

## Version: 1.0

---

## 1. Commit Message Format

### 1.1 Structure

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### 1.2 Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(tours): add search by location` |
| `fix` | Bug fix | `fix(auth): resolve token refresh loop` |
| `docs` | Documentation only | `docs(readme): update setup instructions` |
| `style` | Formatting, no logic change | `style(tours): fix indentation` |
| `refactor` | Code change without fix/feature | `refactor(api): extract validation logic` |
| `perf` | Performance improvement | `perf(queries): add index for tour search` |
| `test` | Adding/fixing tests | `test(booking): add unit tests for pricing` |
| `chore` | Build, deps, config | `chore(deps): update prisma to 6.2` |
| `ci` | CI/CD changes | `ci(github): add deploy workflow` |
| `revert` | Revert previous commit | `revert: feat(tours): add search by location` |

### 1.3 Scopes

Use the domain/module name:

```
# Server scopes
auth, users, tours, bookings, payments, companies, hotels, restaurants

# Client scopes
auth, tours, bookings, ui, forms, state, api

# Shared scopes
deps, config, ci, docs, types
```

### 1.4 Subject Rules

```
✅ GOOD:
- Lowercase first letter
- No period at end
- Imperative mood ("add" not "added")
- Max 50 characters

❌ BAD:
- "Added new feature for tours."
- "FEAT: Add Tours"
- "This commit adds the ability to search tours by location and filter by price range and date"
```

### 1.5 Body (Optional)

When the subject isn't enough:

```
feat(bookings): implement cancellation with refund

- Add CancellationService with refund calculation
- Integrate with payment provider refund API
- Send cancellation confirmation email
- Update booking status to CANCELLED

Closes #142
```

### 1.6 Footer (Optional)

```
# Breaking changes
BREAKING CHANGE: Tour.price is now a Decimal type

# Issue references
Closes #123
Fixes #456
Refs #789
```

---

## 2. Branch Naming

### 2.1 Format

```
<type>/<issue-number>-<short-description>
```

### 2.2 Examples

```
feat/123-tour-search
fix/456-token-refresh
refactor/789-extract-validation
chore/update-dependencies
hotfix/critical-payment-bug
```

### 2.3 Branch Types

| Type | Purpose | Base Branch |
|------|---------|-------------|
| `feat/` | New features | `develop` or `main` |
| `fix/` | Bug fixes | `develop` or `main` |
| `hotfix/` | Critical production fixes | `main` |
| `refactor/` | Code improvements | `develop` |
| `chore/` | Maintenance | `develop` |
| `release/` | Release preparation | `develop` |

---

## 3. Commit Best Practices

### 3.1 Atomic Commits

Each commit should be **one logical change**:

```
✅ GOOD - Separate concerns:
1. feat(tours): add TourSearch component
2. feat(tours): add search API endpoint
3. test(tours): add search tests

❌ BAD - Mixed concerns:
1. feat(tours): add search with API and tests and fix header bug
```

### 3.2 Commit Frequency

```
COMMIT when:
- A logical unit of work is complete
- Before switching tasks
- Before risky operations
- Tests are passing

DON'T COMMIT:
- Broken code that doesn't compile
- Failing tests (unless WIP branch)
- Half-implemented features to main
```

### 3.3 Work in Progress

For incomplete work:

```bash
# WIP commits (squash before merge)
git commit -m "wip: tour search - api done"
git commit -m "wip: tour search - frontend started"

# Before merge, squash into proper commit
git rebase -i HEAD~3
```

---

## 4. Git Workflow

### 4.1 Feature Development

```bash
# 1. Create branch from main/develop
git checkout main
git pull origin main
git checkout -b feat/123-tour-search

# 2. Make changes and commit
git add src/modules/tours/search.ts
git commit -m "feat(tours): add search service"

# 3. Keep branch updated
git fetch origin
git rebase origin/main

# 4. Push and create PR
git push -u origin feat/123-tour-search
```

### 4.2 Merge Strategy

```
# Default: Squash and merge for features
# Result: Clean, linear history

# Merge commit for: Release branches, hotfixes
# Result: Preserves branch history
```

---

## 5. Protected Branches

### 5.1 Branch Protection Rules

| Branch | Protection | Required |
|--------|------------|----------|
| `main` | Protected | PR + 1 approval + CI pass |
| `develop` | Protected | PR + CI pass |
| `release/*` | Protected | PR + 1 approval |

### 5.2 Never Push Directly

```bash
# ❌ NEVER
git push origin main
git push --force origin main

# ✅ ALWAYS
git push origin feat/123-tour-search
# Then create PR
```

---

## 6. Commit Signing (Recommended)

```bash
# Setup GPG signing
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_KEY_ID

# Commits will show as "Verified"
```

---

## 7. Common Scenarios

### 7.1 Fixing Last Commit

```bash
# Fix message
git commit --amend -m "feat(tours): correct message"

# Add forgotten file (same commit)
git add forgotten-file.ts
git commit --amend --no-edit
```

### 7.2 Squashing Commits

```bash
# Squash last 3 commits
git rebase -i HEAD~3

# In editor, change "pick" to "squash" for commits to combine
pick abc123 feat(tours): add search
squash def456 wip: fix types
squash ghi789 wip: add tests
```

### 7.3 Reverting Changes

```bash
# Revert a specific commit
git revert abc123

# Revert merge commit
git revert -m 1 abc123
```

### 7.4 Cherry-picking

```bash
# Apply specific commit to current branch
git cherry-pick abc123

# Cherry-pick for hotfix
git checkout main
git cherry-pick abc123
```

---

## 8. .gitignore Requirements

### 8.1 Always Ignore

```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
.next/

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Test coverage
coverage/

# Prisma
prisma/*.db
prisma/*.db-journal
```

### 8.2 Never Commit

```
❌ NEVER commit:
- .env files with real secrets
- API keys or tokens
- Private SSH keys
- Database dumps
- Large binary files (>10MB)
- node_modules/
- Build artifacts
```

---

## 9. Pull Request Guidelines

### 9.1 PR Title

Same format as commit message:
```
feat(tours): add location-based search
```

### 9.2 PR Description Template

```markdown
## Summary
Brief description of changes.

## Changes
- Added TourSearchService
- Created /api/v1/tours/search endpoint
- Added location index to tours table

## Testing
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Manual testing completed

## Screenshots (if UI changes)
[Add screenshots]

## Checklist
- [ ] Code follows project conventions
- [ ] Self-reviewed the code
- [ ] No console.logs or debug code
- [ ] Types are correct
- [ ] Tests pass locally
```

---

## 10. AI Agent Git Rules

### 10.1 Before Committing

```
1. Verify all changes are intentional
2. Ensure tests pass
3. Remove debug code
4. Use correct commit type and scope
5. Write clear commit message
```

### 10.2 Commit Command Format

```bash
git commit -m "$(cat <<'EOF'
type(scope): subject line here

Optional body with more details.

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 10.3 Never Do

```bash
# ❌ NEVER
git push --force origin main
git reset --hard  # Without confirmation
git clean -fd  # Without confirmation
git checkout .  # Discards all changes without confirmation
```

---

## Quick Reference

```bash
# Good commit messages
git commit -m "feat(tours): add price filter"
git commit -m "fix(auth): handle expired refresh token"
git commit -m "refactor(api): extract validation middleware"
git commit -m "test(bookings): add cancellation tests"
git commit -m "docs(readme): add deployment section"
git commit -m "chore(deps): update to node 20"

# Good branch names
feat/123-tour-search
fix/456-token-refresh
refactor/api-validation
chore/update-deps
```

---

**Version**: 1.0
**Last Updated**: 2025-01-30
