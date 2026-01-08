// Premium Content Update Script - Part 3
// Correct slugs for all remaining priority articles

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || '';

const articleSchema = new mongoose.Schema({
    slug: String,
    title: String,
    content: String,
    excerpt: String,
    estimatedMinutes: Number,
    version: Number,
}, { timestamps: true });

const Article = mongoose.models.EncyclopediaArticle || mongoose.model('EncyclopediaArticle', articleSchema, 'encyclopediaarticles');

// Correct slugs from database
const CONTENT_UPDATES: Record<string, string> = {
    // AI Automation Section
    'automation-intro': `# AI ავტომატიზაციის შესავალი

**AI ავტომატიზაცია** არის ბიზნეს პროცესების რევოლუცია. 2025 წელს კომპანიები, რომლებიც AI ავტომატიზაციას იყენებენ, **40% მეტ მოგებას** აჩვენებენ.

---

## 📊 რატომ AI ავტომატიზაცია?

| ტრადიციული | AI ავტომატიზაცია |
|:---|:---|
| წესებზე დაფუძნებული | ჭკვიანი გადაწყვეტილებები |
| სტატიკური | ადაპტაციური |
| მარტივი ამოცანები | კომპლექსური workflow |
| 24/7 მონიტორინგი საჭირო | თვით-მართვადი |

---

## 🎯 რა შეგიძლიათ ავტომატიზირება?

### 1. კომუნიკაცია
- **Email responses** — AI ავტომატურად ასწორებს და პასუხობს
- **Customer support** — 80% tickets-ს AI წყვეტს
- **Meeting scheduling** — კალენდრის ოპტიმიზაცია
- **Follow-up sequences** — პერსონალიზებული შეხსენებები

### 2. კონტენტი
- Blog post drafts — 10x სწრაფი
- Social media posts — ავტომატური დაგეგმვა
- Reports generation — მონაცემებიდან ანგარიშები
- Data summaries — უზარმაზარი რაოდენობის ანალიზი

### 3. Data Processing
- Document analysis — კონტრატების შემოწმება
- Data extraction — ავტომატური სტრუქტურირება
- Classification — კატეგორიზაცია
- Sentiment analysis — განწყობის ანალიზი

---

## 🛠️ ძირითადი Tools

| Tool | გამოყენება | ფასი |
|:---|:---|:---|
| **Zapier + AI** | Workflows | $29/თვე |
| **Make.com** | Complex automations | $15/თვე |
| **n8n** | Self-hosted | უფასო |
| **Bardeen** | Browser automation | $15/თვე |

---

## 💡 Real-World მაგალითი

### Email Auto-Response System:

\`\`\`markdown
Trigger: New email received
    ↓
AI analyzes content (3 წამი)
    ↓
Categorizes: Support/Sales/Spam
    ↓
Drafts appropriate response
    ↓
Routes to team OR sends auto-reply
\`\`\`

### შედეგი:
- **დაზოგილი დრო:** 10 საათი/კვირა
- **Response time:** 5 საათი → 5 წუთი
- **Customer satisfaction:** +35%

---

## 📈 ROI Calculator

\`\`\`
Manual Task: 2 საათი/დღე × $25/საათი = $50/დღე
AI Automation: $50/თვე subscription

Monthly Savings: $50 × 22 days = $1,100
Monthly Cost: $50
Net Savings: $1,050/თვე
Annual ROI: 2,520%
\`\`\`

---

## 🚀 5-Step Implementation

1. **Audit** — რომელი პროცესები იკავებს დროს?
2. **Prioritize** — ROI-ით დალაგება
3. **Prototype** — მინიმალური ავტომატიზაცია
4. **Test** — 2 კვირა პილოტი
5. **Scale** — სრული გაფართოება

> 💎 **Premium**: 20+ მზა automation workflow + video tutorials!
`,

    'zapier-ai': `# Zapier + AI Workflows - სრული გაიდი

**Zapier** ლიდერი no-code automation პლატფორმაა. AI ინტეგრაციით, შესაძლებლობები უსასრულოა.

---

## 🎯 რატომ Zapier + AI?

| ფუნქცია | აღწერა |
|:---|:---|
| **6,000+ აპები** | ყველა სერვისი დაკავშირებული |
| **AI Actions** | ChatGPT, Claude ინტეგრაცია |
| **No-code** | კოდინგი არ სჭირდება |
| **Templates** | მზა workflows |

---

## 💰 ფასები

| Plan | Zaps/თვე | ფასი |
|:---|:---|:---|
| Free | 5 | $0 |
| Starter | 750 | $29.99 |
| Professional | 2,000 | $73.50 |
| Team | 50,000 | $103.50 |

---

## 🛠️ Top AI Workflows

### 1. Email → Summary → Slack
\`\`\`markdown
Trigger: New Gmail email
↓
Action: OpenAI - Summarize email
↓
Action: Slack - Post summary to channel
\`\`\`

### 2. Form → AI Analysis → CRM
\`\`\`markdown
Trigger: New form submission
↓
Action: ChatGPT - Analyze lead
↓
Action: Add to HubSpot with AI score
\`\`\`

### 3. Support Ticket → AI Response
\`\`\`markdown
Trigger: New Zendesk ticket
↓
Action: AI - Generate response draft
↓
Action: Create Zendesk draft reply
\`\`\`

---

## 💡 AI Actions Zapier-ში

### ChatGPT Action:
\`\`\`markdown
Prompt: "Summarize this customer feedback:
{{feedback_text}}

Respond in JSON format:
{
  'sentiment': 'positive/negative/neutral',
  'key_points': [],
  'suggested_action': ''
}"
\`\`\`

### Claude Action:
\`\`\`markdown
System: "You are a professional email writer"
User: "Write a follow-up email for {{customer_name}} 
regarding {{topic}}"
\`\`\`

---

## 📊 Real Business Cases

### Case 1: E-commerce
**Problem:** Manual order notifications
**Solution:** 
- Order → AI personalizes thank you email → Sends
- **Result:** 40% higher open rates

### Case 2: Recruiting
**Problem:** Resume screening takes hours
**Solution:**
- New application → AI scores resume → Routes
- **Result:** 80% time saved

### Case 3: Content
**Problem:** Social media scheduling
**Solution:**
- Blog post → AI creates 5 social versions → Schedules
- **Result:** 10x content output

---

## 🚀 დაწყება

1. **Create Zapier account** (უფასო)
2. **Connect apps** (Gmail, Slack, etc.)
3. **Add OpenAI** integration
4. **Build first Zap** (use template)
5. **Test and iterate**

> 💎 **Premium**: 30+ მზა AI Zap template + step-by-step videos!
`,

    'email-automation': `# Email ავტომატიზაცია AI-ით

**Email** ჯერ კიდევ #1 ბიზნეს კომუნიკაციის არხია. AI ავტომატიზაცია დაზოგავს **5-10 საათს კვირაში**.

---

## 📊 Email სტატისტიკა

| მეტრიკა | მაჩვენებელი |
|:---|:---|
| საშუალო emails/დღე | 120+ |
| დრო email-ზე | 2.5 საათი/დღე |
| პასუხის მოლოდინი | <1 საათი |

---

## 🎯 რა შეიძლება ავტომატიზირება?

### 1. Auto-Responses
- Out of office
- FAQ პასუხები
- Ticket acknowledgments

### 2. Email Classification
- Priority sorting
- Spam filtering
- Department routing

### 3. Content Generation
- Follow-ups
- Thank you emails
- Meeting confirmations

### 4. Data Extraction
- Contact info
- Order details
- Key dates

---

## 🛠️ Tools

| Tool | ფუნქცია | ფასი |
|:---|:---|:---|
| **Superhuman** | AI-powered inbox | $30/თვე |
| **SaneBox** | Smart filtering | $7/თვე |
| **Mailbutler** | AI writing | $15/თვე |
| **Front** | Team inbox | $29/თვე |

---

## 💡 Workflow მაგალითები

### Support Auto-Response:

\`\`\`markdown
1. New email received
2. AI analyzes: 
   - Is it support? Sales? Spam?
   - What's the urgency?
   - What's the topic?
3. If FAQ → Auto-reply with answer
4. If complex → Route to human + AI draft
5. Always personalize greeting
\`\`\`

### Lead Nurture Sequence:

\`\`\`markdown
Day 0: Thank you email (personalized)
Day 2: Value content (AI-selected)
Day 5: Case study (relevant to industry)
Day 7: Soft CTA
Day 14: Follow-up (if no response)
\`\`\`

---

## 📝 AI Email Templates

### Professional Follow-up:
\`\`\`markdown
Subject: Following up on {{topic}}

Hi {{name}},

Hope this finds you well. I wanted to follow up on 
our conversation about {{topic}}.

[AI generates relevant content based on context]

Would {{day}} work for a quick call?

Best,
{{signature}}
\`\`\`

---

## 📈 მეტრიკები

თვალყური ადევნე:
- **Response time** — რამდენ ხანში პასუხობ
- **Open rates** — იხსნება თუ არა
- **Reply rates** — გეპასუხებიან თუ არა
- **Resolution time** — პრობლემის გადაწყვეტა

---

## 🚀 Action Steps

1. **Audit inbox** — რამდენი დრო სად მიდის?
2. **Categorize emails** — რა ტიპები არსებობს?
3. **Prioritize** — რომელი იკავებს მეტ დროს?
4. **Set up AI tool** — აირჩიე და დააინსტალირე
5. **Create templates** — ხშირი პასუხები

> 💎 **Premium**: 50+ email template + automation workflows!
`,

    // AI Tools Section
    'ai-tools-2025': `# AI ინსტრუმენტები 2025 - სრული გაიდი

**2025 წელს** AI tools ლანდშაფტი სწრაფად იცვლება. ეს გაიდი დაგეხმარებათ სწორი ინსტრუმენტების არჩევაში.

---

## 🏆 Top AI Tools 2025

### Text Generation:
| Tool | ფასი | საუკეთესო |
|:---|:---|:---|
| **ChatGPT** | $20/თვე | All-rounder |
| **Claude** | $20/თვე | Long-form, Coding |
| **Gemini** | $20/თვე | Research, Analysis |
| **Perplexity** | $20/თვე | Research, Citations |

### Image Generation:
| Tool | ფასი | სტილი |
|:---|:---|:---|
| **Midjourney** | $10-60/თვე | Artistic |
| **DALL-E 3** | $20/თვე | Realistic |
| **Stable Diffusion** | უფასო | Customizable |
| **Leonardo AI** | $12/თვე | Gaming assets |

### Video:
| Tool | ფასი | ფოკუსი |
|:---|:---|:---|
| **Runway** | $15/თვე | Pro editing |
| **Pika** | $10/თვე | Quick videos |
| **Sora** | TBD | Cinematic |

### Audio:
| Tool | ფასი | გამოყენება |
|:---|:---|:---|
| **ElevenLabs** | $5-22/თვე | Voice cloning |
| **Murf** | $29/თვე | Voiceovers |
| **Suno** | $10/თვე | Music |

---

## 💡 Use Case Matrix

### Content Creator:
- ChatGPT (writing)
- Midjourney (thumbnails)
- ElevenLabs (voiceovers)
- **Total:** ~$50/თვე

### Developer:
- Claude (coding)
- Cursor (IDE)
- GitHub Copilot (suggestions)
- **Total:** ~$60/თვე

### Marketer:
- ChatGPT (copy)
- DALL-E (images)
- Jasper (campaigns)
- **Total:** ~$80/თვე

---

## 🔮 2025 Trends

1. **Multimodal Models** — text + image + audio ერთად
2. **Agents** — AI რაც თვითონ მოქმედებს
3. **Local AI** — პირადი კომპიუტერზე
4. **Specialized Tools** — ინდუსტრია-სპეციფიკური
5. **Team Collaboration** — რამდენიმე user ერთდროულად

---

## 📊 Tool Selection Framework

### კითხვები:
1. რა ამოცანას წყვეტ?
2. რა ბიუჯეტი გაქვს?
3. რა სირთულის workflow გჭირდება?
4. გუნდი ხარ თუ ინდივიდი?

### რეკომენდაცია:

\`\`\`markdown
დამწყები ($0-30/თვე):
→ ChatGPT Free + Canva AI

ინტერმედიატე ($30-80/თვე):
→ ChatGPT Plus + Midjourney + ElevenLabs

პროფესიონალი ($80-200/თვე):
→ Claude + Multiple tools + API access
\`\`\`

---

## 🚀 როგორ დავიწყო?

1. **ერთი tool-ით დაიწყე** — ChatGPT
2. **დაეუფლე კარგად** — 2-4 კვირა
3. **მეორე დაამატე** — საჭიროებისამებრ
4. **Workflows ააგე** — tools-ის integration
5. **Optimize** — რა მუშაობს, რა არა

> 💎 **Premium**: Tool comparison matrix + setup guides!
`,

    'dalle-guide': `# DALL-E 3 გაიდი - ChatGPT-ში ჩაშენებული

**DALL-E 3** OpenAI-ის image generation მოდელია, ChatGPT Plus-ში ჩაშენებული.

---

## 🎨 DALL-E 3 vs Midjourney

| Feature | DALL-E 3 | Midjourney |
|:---|:---|:---|
| Access | ChatGPT Plus ($20) | Discord ($10+) |
| Ease | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Text in images | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Artistic style | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Realism | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 💡 Prompting Strategies

### Basic Structure:
\`\`\`markdown
[Subject] + [Style] + [Mood] + [Details]
\`\`\`

### მაგალითი:
\`\`\`markdown
"A Georgian man drinking coffee in a cozy café,
warm lighting, watercolor style, detailed"
\`\`\`

---

## 🛠️ Pro Techniques

### 1. Iteration
\`\`\`markdown
"Create this image"
→ "Make the lighting warmer"
→ "Add more details to the background"
→ "Change the style to oil painting"
\`\`\`

### 2. Reference Styles
\`\`\`markdown
"In the style of Studio Ghibli"
"Reminiscent of Wes Anderson films"
"Like a vintage travel poster"
\`\`\`

### 3. Technical Specifications
\`\`\`markdown
"16:9 aspect ratio"
"High resolution, 4K details"
"Shallow depth of field"
\`\`\`

---

## 📊 Use Cases

| Use Case | Example Prompt |
|:---|:---|
| Marketing | "Professional product shot with clean background" |
| Social Media | "Eye-catching thumbnail for YouTube video about AI" |
| Presentations | "Minimalist infographic about data flow" |
| Branding | "Modern logo for tech startup, simple, memorable" |

---

## ⚠️ ლიმიტაციები

- Hands ზოგჯერ problematic
- ძალიან სპეციფიკური სცენებში errors
- Text ჯერ კიდევ არა 100%
- Photorealism Midjourney-ს ჩამორჩება

---

## 🚀 Action Steps

1. **Open ChatGPT** → დაიწყე მარტივი prompt-ით
2. **Iterate** → გააუმჯობესე ნაბიჯ-ნაბიჯ
3. **Save best prompts** → library აიგე
4. **Experiment** → სხვადასხვა სტილი სცადე

> 💎 **Premium**: 100+ DALL-E prompt templates!
`,

    // AI Career Section
    'ai-future-jobs': `# AI და სამუშაოს მომავალი

**AI არ ჩაანაცვლებს ყველა სამუშაოს** — მაგრამ AI-ს მცოდნე ადამიანები ჩაანაცვლებენ მათ, ვინც ვერ იყენებს.

---

## 📊 სამუშაო ბაზრის ტრანსფორმაცია

| სფერო | AI გავლენა | პროგნოზი |
|:---|:---|:---|
| Admin/Clerical | 🔴 მაღალი | -30% 2030-მდე |
| Customer Service | 🟠 საშუალო | Hybrid models |
| Creative | 🟢 დაბალი | +20% (AI-assisted) |
| Technical | 🟢 დადებითი | +40% (AI specialists) |
| Healthcare | 🟡 Mixed | AI + Human combo |

---

## 💼 ახალი AI პოზიციები

### Already Hot:
- **Prompt Engineer** — $80-200K
- **AI Product Manager** — $130-250K
- **ML Engineer** — $150-300K

### Emerging:
- **AI Ethics Officer** — $90-150K
- **AI Trainer** — $60-100K
- **AI Auditor** — $100-180K

### Future (2-5 წელი):
- **AI-Human Collaboration Specialist**
- **Synthetic Media Producer**
- **AI Systems Therapist** (bias correction)

---

## 🎯 უნარები მომავლისთვის

### Technical:
- AI tools proficiency
- Data literacy
- Basic programming (optional)
- Automation understanding

### Soft Skills:
- Critical thinking
- Creative problem-solving
- Adaptability
- Emotional intelligence
- Complex communication

### Mindset:
- Lifelong learning
- Experimentation
- AI as partner, not threat

---

## 📈 როგორ მოვემზადოთ?

### Short-term (0-6 თვე):
1. დაეუფლე ChatGPT/Claude
2. თქვენს სფეროში AI გამოიყენე
3. დოკუმენტირე შედეგები

### Medium-term (6-18 თვე):
1. AI certification
2. Portfolio projects
3. Network with AI professionals

### Long-term (18+ თვე):
1. Specialization
2. Teaching/Mentoring
3. Thought leadership

---

## 🏢 ინდუსტრიების პროგნოზი

### გამარჯვებულები:
- **Tech** — AI development
- **Healthcare** — AI diagnostics
- **Finance** — AI trading/analysis
- **Education** — AI tutoring

### ტრანსფორმაცია:
- **Legal** — AI research + human judgment
- **Marketing** — AI content + human strategy
- **Retail** — AI operations + human experience

---

## 💡 Action Plan

1. **Assess** — სად ხარ ახლა?
2. **Learn** — რა უნარები გჭირდება?
3. **Practice** — AI-ს ყოველდღე გამოიყენე
4. **Document** — შედეგები დააფიქსირე
5. **Adapt** — მუდმივად განვითარდი

> 💎 **Premium**: Career transition playbook + interview prep!
`,

    'ai-interview': `# AI გამოყენება სამსახურის ძიებაში

**AI შეუძლია job search 10x ეფექტური გახადოს** — რეზიუმედან interview preparation-მდე.

---

## 🎯 AI Job Search Stack

| ეტაპი | AI Tool | გამოყენება |
|:---|:---|:---|
| Research | ChatGPT/Perplexity | Company research |
| Resume | ChatGPT/Teal | Tailoring |
| Cover Letter | Claude | Personalization |
| Interview | ChatGPT | Preparation |
| Negotiation | Claude | Strategy |

---

## 📝 AI Resume Optimization

### Prompt:
\`\`\`markdown
"Optimize my resume for this job posting:

[Job Description]

Current resume:
[Your resume]

Please:
1. Match keywords from JD
2. Quantify achievements
3. Improve action verbs
4. Suggest missing skills to add
5. Format for ATS compatibility"
\`\`\`

### Before/After Example:
\`\`\`markdown
Before: "Managed team projects"
After: "Led 5 cross-functional projects 
delivering $2M revenue increase 
with 95% on-time completion rate"
\`\`\`

---

## 💌 Cover Letter Generation

### Prompt:
\`\`\`markdown
"Write a cover letter for [position] at [company].

About me:
- [Key achievement 1]
- [Key achievement 2]
- [Relevant experience]

Why this company:
- [Reason 1]
- [Reason 2]

Tone: Professional but personable
Length: 250-300 words"
\`\`\`

---

## 🎤 Interview Preparation

### Mock Interview:
\`\`\`markdown
"Act as interviewer for [position] at [company].
Ask me common interview questions one by one.
After each answer, give feedback on:
- Content quality
- Structure (STAR method)
- Areas to improve

Start with 'Tell me about yourself'"
\`\`\`

### Company Research:
\`\`\`markdown
"Research [company]:
1. Recent news and developments
2. Company culture and values
3. Key challenges they face
4. Potential interview questions
5. Questions I should ask them"
\`\`\`

---

## 💰 Salary Negotiation

### Prompt:
\`\`\`markdown
"I received an offer for [position]:
- Offered: [amount]
- Market range: [range]
- My experience: [years]

Help me:
1. Analyze if offer is fair
2. Create negotiation script
3. Suggest counter-offer range
4. Prepare responses to pushback"
\`\`\`

---

## 📊 Tools

| Tool | ფუნქცია | ფასი |
|:---|:---|:---|
| **Teal** | Resume + tracking | Free/$29 |
| **Jobscan** | ATS optimization | $50/თვე |
| **Interviewing.io** | Mock interviews | $100+ |
| **Glassdoor** | Salary research | Free |

---

## 🚀 30-Day Job Search Plan

### Week 1: Foundation
- [ ] Optimize LinkedIn with AI
- [ ] Create master resume
- [ ] Research 20 target companies

### Week 2: Application
- [ ] Apply to 10-15 positions
- [ ] Tailor each resume with AI
- [ ] Personalized cover letters

### Week 3-4: Interview Prep
- [ ] 5 mock interviews with AI
- [ ] Company deep research
- [ ] Questions preparation

> 💎 **Premium**: Full job search playbook + 100 prompts!
`,

    // Vibe Coding Section (key articles)
    'what-is-vibe-coding': `# რა არის Vibe Coding?

**Vibe Coding** არის პროგრამირების ახალი მიდგომა, სადაც AI გვეხმარება კოდის წერაში ბუნებრივი ენით კომუნიკაციით.

---

## 🎯 განმარტება

> **Vibe Coding** = კოდის წერა AI-სთან საუბრით, სადაც "vibe"-ს (განწყობას, კონტექსტს) აწვდი და AI კოდს წერს.

**დაფუძნებულია:**
- AI LLMs (ChatGPT, Claude)
- Prompt Engineering
- Human-AI Collaboration

---

## 💡 როგორ მუშაობს?

### ტრადიციული პროგრამირება:
\`\`\`
იდეა → სინტაქსის სწავლა → კოდის წერა 
→ Debug → გამეორება
\`\`\`

### Vibe Coding:
\`\`\`
იდეა → AI-ს აღწერა → კოდის გენერაცია 
→ Review/Edit → გამეორება
\`\`\`

---

## 🛠️ ძირითადი Tools

| Tool | ტიპი | გამოყენება |
|:---|:---|:---|
| **Cursor** | IDE | სრული კოდინგი |
| **GitHub Copilot** | ადონი | Autocomplete |
| **ChatGPT** | Chat | Problem solving |
| **Claude** | Chat | Long context |
| **Bolt.new** | Web | Quick prototypes |

---

## 🎯 ვისთვის არის?

### იდეალურია:
- **დამწყებებისთვის** — კოდინგის სწავლა
- **არა-დეველოპერებისთვის** — იდეების რეალიზება
- **პროფესიონალებისთვის** — სიჩქარის გაზრდა
- **სტარტაპებისთვის** — სწრაფი MVP

### რას ცვლის?
| Before | After |
|:---|:---|
| 100 ხაზი კოდი = 2 საათი | 100 ხაზი = 10 წუთი |
| Stack Overflow ძიება | AI პასუხობს |
| Boilerplate ხელით | AI ავტომატურად |

---

## 📊 სტატისტიკა

\`\`\`
Developer Productivity Boost: +40-60%
Time to MVP: -70%
Code Quality: Same or Better
Learning Curve: 2 weeks vs 6 months
\`\`\`

---

## 💪 რა უნდა ისწავლო?

1. **Prompt Engineering** — AI-სთან კომუნიკაცია
2. **კოდის გაგება** — Review და debugging
3. **Architecture** — სისტემის დიზაინი
4. **Testing** — ხარისხის კონტროლი

---

## ⚠️ შეზღუდვები

- AI ყოველთვის არ არის correct
- Complex logic-ში ზოგჯერ ცდება
- Security review აუცილებელია
- Human oversight მნიშვნელოვანია

---

## 🚀 დაწყების ნაბიჯები

1. **Cursor დააინსტალირე**
2. **პირველი პროექტი სცადე**
3. **Prompt-ებს ივარჯიშე**
4. **Community-ში ჩაერთე**

> 💎 **Premium**: Vibe Coding სრული კურსი + 50 პროექტი!
`,

    'cursor-setup': `# Cursor - სრული დაყენების გზამკვლევი

**Cursor** არის #1 AI-powered IDE. VS Code-ზე დაფუძნებული, მაგრამ AI-სთვის ოპტიმიზებული.

---

## 🎯 რატომ Cursor?

| Feature | Cursor | VS Code + Copilot |
|:---|:---|:---|
| AI Chat | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Codebase Understanding | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Multi-file Edits | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Composer (Agent) | ✅ | ❌ |
| ფასი | $20/თვე | $10/თვე |

---

## 📥 ინსტალაცია

### Step 1: Download
1. ეწვიე [cursor.com](https://cursor.com)
2. Download for Windows/Mac/Linux
3. დააინსტალირე

### Step 2: Import Settings
\`\`\`
Cursor → Settings → Import from VS Code
\`\`\`

### Step 3: Login
- Create account ან Google login
- აირჩიე Plan (Free ან Pro)

---

## ⚙️ Configuration

### Recommended Settings:
\`\`\`json
{
  "cursor.autocomplete": true,
  "cursor.chat.defaultModel": "claude-3.5-sonnet",
  "cursor.composer.enabled": true,
  "cursor.codebaseIndexing": true
}
\`\`\`

### Extensions to Install:
- Prettier
- ESLint
- GitLens
- თქვენი language-ის extension

---

## 🛠️ Key Features

### 1. Cmd+K (Inline Edit)
აირჩიე კოდი → Cmd+K → აღწერე ცვლილება

### 2. Chat (Cmd+L)
AI-სთან საუბარი კოდის შესახებ

### 3. Composer (Cmd+I)
რამდენიმე ფაილის ერთდროული შეცვლა

### 4. @ Mentions
- @file — კონკრეტული ფაილი
- @folder — საქაღალდე
- @codebase — მთელი პროექტი
- @web — ინტერნეტ ძიება

---

## 💡 Pro Tips

### 1. Codebase Indexing
\`\`\`
Settings → Codebase Indexing → Enable
\`\`\`
AI მთელ კოდბეისს გაიგებს

### 2. Custom Rules
\`\`\`
.cursorrules ფაილი პროექტში:
"Always use TypeScript"
"Follow SOLID principles"
"Add JSDoc comments"
\`\`\`

### 3. Model Selection
- **Fast tasks:** GPT-4-mini
- **Complex tasks:** Claude 3.5 Sonnet
- **Long context:** Claude 3.5 (200K)

---

## 📊 ფასები

| Plan | ფასი | Features |
|:---|:---|:---|
| Free | $0 | 2,000 completions/თვე |
| Pro | $20/თვე | Unlimited + Claude |
| Business | $40/თვე | Team features |

---

## 🚀 First Project

1. **Create new project**
2. **Open terminal:** npx create-next-app .
3. **Ask Cursor:** "Let's build a todo app"
4. **Iterate:** გააუმჯობესე ნაბიჯ-ნაბიჯ

> 💎 **Premium**: Cursor advanced workflows + templates!
`,

    'first-7-days': `# პირველი 7 დღე Vibe Coding-ში

**7 დღეში** შეგიძლია Vibe Coding-ის საფუძვლები დაეუფლო. ეს structured გზამკვლევი დაგეხმარება.

---

## 📅 Day 1: Setup & Basics

### Goals:
- [ ] Cursor-ის ინსტალაცია
- [ ] პირველი AI interaction
- [ ] Hello World პროექტი

### Tasks:
1. Download & install Cursor
2. Import VS Code settings
3. Create simple HTML page with AI

### Prompt to Try:
\`\`\`markdown
"Create a simple HTML page with a greeting
and a button that shows an alert"
\`\`\`

---

## 📅 Day 2: Prompt Basics

### Goals:
- [ ] კარგი prompt-ის სტრუქტურა
- [ ] Context-ის მნიშვნელობა
- [ ] 5 პრაქტიკული prompt

### Learn:
- **Specific > Vague**
- **Context matters**
- **Iterate, don't repeat**

### Prompts to Try:
\`\`\`markdown
1. "Add a dark mode toggle to this page"
2. "Make this button more visually appealing"
3. "Add form validation to check email format"
\`\`\`

---

## 📅 Day 3: First Real Project

### Goals:
- [ ] Todo app შექმნა
- [ ] CRUD operations
- [ ] Local storage

### Project: Todo App
\`\`\`markdown
"Create a todo app with:
- Add new tasks
- Mark as complete
- Delete tasks
- Save to localStorage"
\`\`\`

---

## 📅 Day 4: Styling with AI

### Goals:
- [ ] CSS generation
- [ ] Responsive design
- [ ] Animations

### Tasks:
- Todo app-ს სტილი დაამატე
- Mobile-friendly გახადე
- Animations დაამატე

---

## 📅 Day 5: API Integration

### Goals:
- [ ] API-დან data fetch
- [ ] Error handling
- [ ] Loading states

### Project:
\`\`\`markdown
"Create a weather app that:
- Uses OpenWeatherMap API
- Shows current weather for city
- Has search functionality
- Handles loading and errors"
\`\`\`

---

## 📅 Day 6: Full Stack Basics

### Goals:
- [ ] Backend concepts
- [ ] Database basics
- [ ] Full-stack project

### Learn:
- Frontend vs Backend
- API endpoints
- Database storage

---

## 📅 Day 7: Review & Next Steps

### Goals:
- [ ] გაკეთებულის review
- [ ] რა ვისწავლე?
- [ ] შემდეგი ნაბიჯები

### Reflection Questions:
1. რა იყო ყველაზე challenging?
2. რა მომწონდა ყველაზე მეტად?
3. რაზე მინდა ფოკუსი?

---

## 📊 Progress Tracker

| Day | Topic | Status |
|:---|:---|:---|
| 1 | Setup | ⬜ |
| 2 | Prompts | ⬜ |
| 3 | Todo App | ⬜ |
| 4 | Styling | ⬜ |
| 5 | APIs | ⬜ |
| 6 | Full Stack | ⬜ |
| 7 | Review | ⬜ |

---

## 🎯 Success Metrics

თუ 7 დღის შემდეგ შეგიძლია:
- ✅ AI-ით მარტივი app შექმნა
- ✅ Prompt-ების iteration
- ✅ კოდის გაგება და review
- ✅ Debugging AI-ით

**მაშინ წარმატებით დაიწყე! 🎉**

> 💎 **Premium**: 7-Day Challenge + Daily Videos + Support!
`,

    'saas-in-week': `# SaaS აპლიკაცია 1 კვირაში

**Vibe Coding-ით SaaS-ის აგება** შესაძლებელია 1 კვირაში. ეს სტეპ-ბეშ-სტეპ გზამკვლევი გაჩვენებთ როგორ.

---

## 🎯 რას ავაშენებთ?

**AI Writing Assistant SaaS:**
- User authentication
- Credit-based billing
- AI content generation
- Dashboard
- Stripe payments

---

## 📅 Day 1: Foundation

### Tasks:
\`\`\`markdown
"Create a Next.js 14 project with:
- App router
- TypeScript
- Tailwind CSS
- MongoDB connection
- NextAuth for auth"
\`\`\`

### Output:
- Project structure
- Auth setup
- Database connection

---

## 📅 Day 2: Authentication

### Tasks:
\`\`\`markdown
"Add complete auth system:
- Google OAuth login
- Email/password option
- Protected routes
- User profile page"
\`\`\`

---

## 📅 Day 3: Core Feature

### Tasks:
\`\`\`markdown
"Create AI writing feature:
- Prompt input form
- OpenAI API integration
- Response display
- Copy to clipboard"
\`\`\`

---

## 📅 Day 4: Credits System

### Tasks:
\`\`\`markdown
"Add credit system:
- Each user gets 50 free credits
- Each AI request costs 1 credit
- Display remaining credits
- Block when credits = 0"
\`\`\`

---

## 📅 Day 5: Payments

### Tasks:
\`\`\`markdown
"Integrate Stripe:
- Pricing page (3 tiers)
- Checkout flow
- Webhook for payment success
- Credit addition on payment"
\`\`\`

---

## 📅 Day 6: Dashboard & Polish

### Tasks:
\`\`\`markdown
"Create dashboard:
- Usage statistics
- Generation history
- Account settings
- Beautiful UI"
\`\`\`

---

## 📅 Day 7: Deploy & Launch

### Tasks:
1. **Vercel deployment**
2. **Environment variables**
3. **Custom domain**
4. **Testing**
5. **Launch! 🚀**

---

## 💰 Cost Breakdown

| Service | ფასი |
|:---|:---|
| Cursor Pro | $20/თვე |
| Vercel | $0 (hobby) |
| MongoDB Atlas | $0 (free tier) |
| OpenAI API | $5-20/თვე |
| Stripe | 2.9% per transaction |
| **Total Startup** | ~$25/თვე |

---

## 📊 Expected Timeline

| Task | Time |
|:---|:---|
| Setup | 2 hours |
| Auth | 3 hours |
| Core Feature | 4 hours |
| Credits | 2 hours |
| Payments | 4 hours |
| Dashboard | 3 hours |
| Deploy | 2 hours |
| **Total** | ~20 hours |

---

## 🚀 Post-Launch

### Week 2:
- Landing page optimization
- First users feedback
- Bug fixes

### Week 3:
- Feature additions
- Email marketing
- Content marketing

### Week 4:
- Scale
- Analytics
- Iteration

> 💎 **Premium**: Full source code + Video walkthrough!
`,
};

async function updateContent() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    let updated = 0;
    let errors = 0;

    for (const [slug, content] of Object.entries(CONTENT_UPDATES)) {
        try {
            const result = await Article.findOneAndUpdate(
                { slug },
                {
                    content,
                    estimatedMinutes: Math.ceil(content.split(/\s+/).length / 200),
                    excerpt: content.substring(0, 200).replace(/[#*\`]/g, '').trim() + '...',
                    version: 2,
                },
                { new: true }
            );
            if (result) {
                console.log(`✅ Updated: ${slug}`);
                updated++;
            } else {
                console.log(`⚠️ Not found: ${slug}`);
            }
        } catch (err) {
            console.error(`❌ Error: ${slug}`, err);
            errors++;
        }
    }

    console.log(`\n📊 Results: ${updated} updated, ${errors} errors`);
    await mongoose.disconnect();
}

updateContent().catch(console.error);
