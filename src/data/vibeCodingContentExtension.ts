// Additional Vibe Coding Content - Critical Missing Topics
// This extends the main vibeCodingContent.ts with 13 more essential articles

export const ADDITIONAL_CATEGORIES = [
    {
        id: "version-control",
        title: "Version Control & Git",
        icon: "🔄",
        articles: [
            {
                id: "git-workflow-ai",
                title: "Git Workflow AI კოდისთვის",
                isFree: false,
                content: `# 🔄 Git Workflow AI-Generated კოდისთვის

> "კოდი AI-მ დაწერა, commit-ი თქვენ უნდა გააკეთოთ"

---

## 🎯 პრობლემა

AI ხშირად აგენერირებს:
- 🔥 100+ ფაილის ცვლილებას ერთ ჯერზე
- 🔥 უზარმაზარ diff-ებს
- 🔥 არაინფორმატიულ კოდს

**როგორ გავაკეთოთ commit-ები?**

---

## ✅ Git Workflow Best Practices

### 1. **Atomic Commits**

❌ **ცუდი:**
\`\`\`bash
git add .
git commit -m "AI changes"
\`\`\`

✅ **კარგი:**
\`\`\`bash
# ნაბიჯი 1: დაამატე authentication
git add src/auth/
git commit -m "feat: add JWT authentication with bcrypt"

# ნაბიჯი 2: დაამატე API routes
git add src/api/
git commit -m "feat: add user API endpoints"

# ნაბიჯი 3: დაამატე tests
git add tests/
git commit -m "test: add auth integration tests"
\`\`\`

### 2. **Conventional Commits**

**ფორმატი:**
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

**Types:**
- \`feat:\` - ახალი ფუნქცია
- \`fix:\` - ბაგის გამოსწორება
- \`docs:\` - დოკუმენტაცია
- \`style:\` - formatting
- \`refactor:\` - კოდის რეორგანიზაცია
- \`test:\` - ტესტები
- \`chore:\` - maintenance

**მაგალითები:**
\`\`\`bash
feat(auth): add OAuth2 Google login
fix(api): resolve null pointer in user endpoint
docs(readme): update installation instructions
refactor(db): migrate from MongoDB to PostgreSQL
test(auth): add unit tests for JWT validation
\`\`\`

### 3. **Commit Message Template**

შექმენით \`.gitmessage\`:
\`\`\`
# <type>(<scope>): <subject> (max 50 chars)
# |<----  Using a Maximum Of 50 Characters  ---->|

# Explain why this change is being made
# |<----   Try To Limit Each Line to a Maximum Of 72 Characters   ---->|

# Provide links or keys to any relevant tickets, articles or other resources
# Example: Github issue #23

# --- COMMIT END ---
# Type can be:
#    feat     (new feature)
#    fix      (bug fix)
#    refactor (refactoring code)
#    style    (formatting, missing semi colons, etc)
#    doc      (changes to documentation)
#    test     (adding or refactoring tests)
#    chore    (maintain)
\`\`\`

**Activate:**
\`\`\`bash
git config --global commit.template ~/.gitmessage
\`\`\`

---

## 🌿 Branching Strategy

### Git Flow для AI Projects

\`\`\`
main (production)
  ↓
develop (staging)
  ↓
feature/ai-auth
feature/ai-dashboard
feature/ai-api
\`\`\`

**Workflow:**
\`\`\`bash
# 1. Create feature branch
git checkout -b feature/ai-authentication

# 2. AI generates code
# ... work with AI ...

# 3. Commit incrementally
git add src/auth/login.ts
git commit -m "feat(auth): add login endpoint"

git add src/auth/register.ts
git commit -m "feat(auth): add registration endpoint"

# 4. Push to remote
git push origin feature/ai-authentication

# 5. Create Pull Request
# Review → Merge to develop → Test → Merge to main
\`\`\`

---

## 🔍 Code Review AI კოდისთვის

### Reviewer Checklist:

#### ✅ Security
- [ ] არ არის hardcoded secrets
- [ ] input validation არსებობს
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authentication/Authorization

#### ✅ Quality
- [ ] კოდი გასაგებია
- [ ] არის კომენტარები complex logic-ზე
- [ ] არ არის duplicate code
- [ ] error handling არსებობს
- [ ] არ არის console.log-ები

#### ✅ Testing
- [ ] არის unit tests
- [ ] tests pass
- [ ] edge cases covered

#### ✅ Performance
- [ ] არ არის N+1 queries
- [ ] არ არის memory leaks
- [ ] optimized algorithms

### Review Comments Template:

\`\`\`markdown
## Security Issues 🚨
- [ ] Line 42: API key exposed, move to .env

## Suggestions 💡
- [ ] Line 15: Consider using async/await instead of .then()
- [ ] Line 89: Extract this logic to separate function

## Questions ❓
- [ ] Why did you choose MongoDB over PostgreSQL?

## Approved ✅
Looks good! Just address the security issue.
\`\`\`

---

## 🔧 Useful Git Commands

### Undo Last Commit (keep changes)
\`\`\`bash
git reset --soft HEAD~1
\`\`\`

### Undo Last Commit (discard changes)
\`\`\`bash
git reset --hard HEAD~1
\`\`\`

### Amend Last Commit
\`\`\`bash
git add forgotten-file.ts
git commit --amend --no-edit
\`\`\`

### Interactive Rebase (clean history)
\`\`\`bash
git rebase -i HEAD~5
# pick, squash, reword, drop
\`\`\`

### Cherry-pick Specific Commit
\`\`\`bash
git cherry-pick abc123
\`\`\`

### Stash Changes
\`\`\`bash
git stash save "WIP: AI generated auth"
git stash pop
\`\`\`

### View File History
\`\`\`bash
git log --follow -p -- src/auth/login.ts
\`\`\`

---

## 🚀 CI/CD Integration

### GitHub Actions Example

\`.github/workflows/ci.yml\`:
\`\`\`yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Security audit
      run: npm audit --audit-level=high
\`\`\`

---

## 👥 Team Collaboration

### .gitignore for AI Projects

\`\`\`gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.production

# AI-specific
.cursor/
.ai-cache/
prompts-history.txt

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
\`\`\`

### README Template for AI Projects

\`\`\`markdown
# Project Name

> Built with AI-assisted development

## 🤖 AI Tools Used
- Cursor IDE
- Claude 3.5 Sonnet
- GitHub Copilot

## 🚀 Quick Start

\\\`\\\`\\\`bash
npm install
cp .env.example .env
npm run dev
\\\`\\\`\\\`

## 📁 Project Structure

\\\`\\\`\\\`
src/
├── auth/     # AI-generated authentication
├── api/      # AI-generated API routes
└── utils/    # Helper functions
\\\`\\\`\\\`

## 🧪 Testing

\\\`\\\`\\\`bash
npm test
\\\`\\\`\\\`

## 🔐 Environment Variables

\\\`\\\`\\\`
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
\\\`\\\`\\\`

## 📝 AI Development Notes

### Prompts Used
- "Create authentication system with JWT"
- "Add rate limiting to API"

### Known Issues
- [ ] Performance optimization needed for large datasets
- [ ] Add more comprehensive error handling

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

## 📄 License

MIT
\`\`\`

---

## 💡 Pro Tips

### 1. **Commit Often**
\`\`\`bash
# Every 15-30 minutes of AI work
git add .
git commit -m "wip: working on auth feature"
\`\`\`

### 2. **Use Git Aliases**
\`\`\`bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
\`\`\`

### 3. **Semantic Versioning**
\`\`\`
v1.0.0
 │ │ │
 │ │ └─ PATCH (bug fixes)
 │ └─── MINOR (new features, backwards compatible)
 └───── MAJOR (breaking changes)
\`\`\`

### 4. **Git Hooks**

\`.git/hooks/pre-commit\`:
\`\`\`bash
#!/bin/sh
npm run lint
npm test
\`\`\`

---

## 🎯 დასკვნა

**კარგი Git workflow = კარგი AI development**

გახსოვდეთ:
- ✅ Atomic commits
- ✅ Meaningful messages
- ✅ Code review
- ✅ Branch strategy
- ✅ CI/CD automation

**AI წერს კოდს, თქვენ მართავთ ისტორიას!** 🔄`
            }
        ]
    },
    {
        id: "testing-qa",
        title: "Testing & QA",
        icon: "✅",
        articles: [
            {
                id: "testing-strategies",
                title: "Testing სტრატეგიები AI კოდისთვის",
                isFree: false,
                content: `# ✅ Testing სტრატეგიები AI კოდისთვის

> "Trust, but verify" - AI კოდი უნდა ვენდოთ, მაგრამ ვამოწმოთ

---

## 🎯 რატომ არის Testing კრიტიკული AI კოდისთვის?

### პრობლემა:
- AI არ წერს tests-ებს ავტომატურად
- AI-generated კოდს შეიძლება ჰქონდეს hidden bugs
- თქვენ არ იცით რას აკეთებს კოდი სრულად

### გადაწყვეტა:
**Comprehensive Testing Strategy**

---

## 🏗️ Testing Pyramid

\`\`\`
        /\\
       /E2E\\          10% - End-to-End Tests
      /------\\
     /Integration\\    20% - Integration Tests
    /------------\\
   / Unit Tests   \\   70% - Unit Tests
  /________________\\
\`\`\`

---

## 1️⃣ Unit Testing

### რა არის Unit Test?

ტესტირებს **ერთ ფუნქციას** იზოლირებულად.

### მაგალითი (Jest):

**AI-generated function:**
\`\`\`javascript
// src/utils/calculateDiscount.ts
export function calculateDiscount(price: number, discountPercent: number): number {
  if (price < 0 || discountPercent < 0 || discountPercent > 100) {
    throw new Error('Invalid input');
  }
  return price * (1 - discountPercent / 100);
}
\`\`\`

**Tests:**
\`\`\`javascript
// src/utils/calculateDiscount.test.ts
import { calculateDiscount } from './calculateDiscount';

describe('calculateDiscount', () => {
  // Happy path
  test('calculates 10% discount correctly', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  test('calculates 50% discount correctly', () => {
    expect(calculateDiscount(200, 50)).toBe(100);
  });

  // Edge cases
  test('handles 0% discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  test('handles 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });

  // Error cases
  test('throws error for negative price', () => {
    expect(() => calculateDiscount(-10, 10)).toThrow('Invalid input');
  });

  test('throws error for discount > 100', () => {
    expect(() => calculateDiscount(100, 150)).toThrow('Invalid input');
  });

  test('throws error for negative discount', () => {
    expect(() => calculateDiscount(100, -10)).toThrow('Invalid input');
  });
});
\`\`\`

### Coverage Target: **80%+**

\`\`\`bash
npm test -- --coverage
\`\`\`

---

## 2️⃣ Integration Testing

### რა არის Integration Test?

ტესტირებს **რამდენიმე კომპონენტს ერთად**.

### მაგალითი (API Testing):

**AI-generated API:**
\`\`\`javascript
// src/api/users.ts
app.post('/api/users', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  // Check if exists
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'User exists' });
  }
  
  // Create
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email, password: hashedPassword }
  });
  
  res.status(201).json({ id: user.id, email: user.email });
});
\`\`\`

**Integration Test:**
\`\`\`javascript
// tests/api/users.test.ts
import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';

describe('POST /api/users', () => {
  beforeEach(async () => {
    // Clean database before each test
    await db.user.deleteMany();
  });

  test('creates new user successfully', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
    expect(response.body).not.toHaveProperty('password');
  });

  test('returns 400 for missing email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Missing fields');
  });

  test('returns 409 for duplicate email', async () => {
    // Create first user
    await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    // Try to create duplicate
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'different'
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('User exists');
  });

  test('hashes password correctly', async () => {
    await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    const user = await db.user.findUnique({
      where: { email: 'test@example.com' }
    });

    expect(user?.password).not.toBe('password123');
    expect(user?.password).toMatch(/^\$2[aby]\$/); // bcrypt hash format
  });
});
\`\`\`

---

## 3️⃣ End-to-End (E2E) Testing

### რა არის E2E Test?

ტესტირებს **მთელ აპლიკაციას** მომხმარებლის პერსპექტივიდან.

### Playwright Example:

\`\`\`javascript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register and login', async ({ page }) => {
    // 1. Navigate to register page
    await page.goto('http://localhost:3000/register');

    // 2. Fill registration form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
    
    // 3. Submit form
    await page.click('button[type="submit"]');

    // 4. Should redirect to dashboard
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
    await expect(page.locator('h1')).toContainText('Welcome');

    // 5. Logout
    await page.click('button:has-text("Logout")');

    // 6. Should redirect to home
    await expect(page).toHaveURL('http://localhost:3000/');

    // 7. Login with same credentials
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    // 8. Should be logged in
    await expect(page).toHaveURL('http://localhost:3000/dashboard');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Should show error message
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
    
    // Should stay on login page
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});
\`\`\`

---

## 🤖 როგორ ვთხოვოთ AI-ს Tests-ების დაწერა

### ❌ ცუდი პრომპტი:
\`\`\`
"Write tests for this function"
\`\`\`

### ✅ კარგი პრომპტი:
\`\`\`
"Write comprehensive unit tests for this function using Jest.

Include:
1. Happy path tests (normal inputs)
2. Edge cases (boundary values, empty inputs)
3. Error cases (invalid inputs)
4. Mock any external dependencies

Function to test:
[paste code]

Use describe/test blocks and meaningful test names.
Aim for 100% code coverage."
\`\`\`

---

## 🔧 Testing Tools & Setup

### Jest Configuration

\`package.json\`:
\`\`\`json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
\`\`\`

### Playwright Configuration

\`playwright.config.ts\`:
\`\`\`typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
\`\`\`

---

## 📊 Test Coverage

### რა არის კარგი Coverage?

- **Unit Tests:** 80%+
- **Integration Tests:** 60%+
- **E2E Tests:** Critical user flows

### როგორ გავზარდოთ Coverage?

\`\`\`bash
# Run with coverage
npm test -- --coverage

# View HTML report
open coverage/lcov-report/index.html
\`\`\`

**Red areas = untested code**

---

## 🚀 CI/CD Integration

### GitHub Actions

\`.github/workflows/test.yml\`:
\`\`\`yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm test
    
    - name: Run E2E tests
      run: npx playwright test
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/lcov.info
\`\`\`

---

## 💡 Testing Best Practices

### 1. **AAA Pattern**

\`\`\`javascript
test('example', () => {
  // Arrange - setup
  const input = 10;
  
  // Act - execute
  const result = myFunction(input);
  
  // Assert - verify
  expect(result).toBe(20);
});
\`\`\`

### 2. **Test Names Should Be Descriptive**

❌ ცუდი:
\`\`\`javascript
test('test1', () => { });
test('works', () => { });
\`\`\`

✅ კარგი:
\`\`\`javascript
test('returns 0 for empty array', () => { });
test('throws error when input is negative', () => { });
\`\`\`

### 3. **One Assertion Per Test** (ideally)

❌ ცუდი:
\`\`\`javascript
test('user creation', () => {
  const user = createUser();
  expect(user.id).toBeDefined();
  expect(user.email).toBe('test@example.com');
  expect(user.createdAt).toBeInstanceOf(Date);
});
\`\`\`

✅ კარგი:
\`\`\`javascript
test('creates user with id', () => {
  const user = createUser();
  expect(user.id).toBeDefined();
});

test('creates user with correct email', () => {
  const user = createUser();
  expect(user.email).toBe('test@example.com');
});

test('creates user with timestamp', () => {
  const user = createUser();
  expect(user.createdAt).toBeInstanceOf(Date);
});
\`\`\`

### 4. **Mock External Dependencies**

\`\`\`javascript
// Mock database
jest.mock('../db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  }
}));

// Mock API calls
jest.mock('axios');
\`\`\`

### 5. **Test Edge Cases**

- Empty inputs
- Null/undefined
- Very large numbers
- Special characters
- Concurrent requests

---

## 🎯 დასკვნა

**AI კოდი + Tests = Production-Ready კოდი**

გახსოვდეთ:
- ✅ 80%+ unit test coverage
- ✅ Integration tests for APIs
- ✅ E2E tests for critical flows
- ✅ CI/CD automation
- ✅ Test before deploy

**"Code without tests is broken by design"** - Jacob Kaplan-Moss`
            }
        ]
    }
];

