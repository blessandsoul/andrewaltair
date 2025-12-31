import dbConnect from '../lib/db';
import Lesson from '../models/Lesson';
import Quest from '../models/Quest';
import Deal from '../models/Deal';

const LESSONS = [
    {
        title: 'პრომპტის საფუძვლები',
        description: 'ისწავლე როგორ დაწერო ეფექტური პრომპტები AI-სთვის',
        content: `პრომპტი არის ინსტრუქცია, რომელსაც AI-ს აძლევ. კარგი პრომპტი შედგება 3 ნაწილისგან:

1. **კონტექსტი** - აუხსენი AI-ს რა როლში მოქმედებს
2. **დავალება** - მკაფიოდ აღწერე რა გინდა გააკეთოს
3. **ფორმატი** - მიუთითე როგორ გინდა პასუხი

მაგალითი: "შენ ხარ გამოცდილი კოპირაიტერი. დამეხმარე Instagram პოსტის დაწერაში ახალი პროდუქტისთვის. პოსტი უნდა იყოს მაქსიმუმ 150 სიტყვა."`,
        duration: 120,
        xpReward: 25,
        category: 'prompt',
        difficulty: 'beginner',
        order: 1,
        isActive: true,
    },
    {
        title: 'კონტექსტის ფანჯარა',
        description: 'გაიგე როგორ მუშაობს AI მეხსიერება',
        content: `კონტექსტის ფანჯარა (Context Window) არის AI-ს "მეხსიერება" - რამდენი ტექსტი შეუძლია დაიმახსოვროს ერთ საუბარში.

**მნიშვნელოვანი:**
- GPT-4 Turbo: 128K ტოკენი (~96K სიტყვა)
- Claude 3: 200K ტოკენი (~150K სიტყვა)

**პრაქტიკული რჩევები:**
- გრძელ საუბრებში AI "ივიწყებს" საწყის ინფორმაციას
- მნიშვნელოვანი ინფორმაცია გაიმეორე პერიოდულად
- გამოიყენე "Remember: ..." კონსტრუქცია`,
        duration: 120,
        xpReward: 30,
        category: 'concept',
        difficulty: 'beginner',
        order: 2,
        isActive: true,
    },
    {
        title: 'აზროვნების ჯაჭვი (Chain of Thought)',
        description: 'აიძულე AI ეტაპობრივად იფიქროს',
        content: `Chain of Thought (CoT) არის ტექნიკა, რომელიც AI-ს აიძულებს ეტაპობრივად იფიქროს პასუხზე.

**როგორ გამოვიყენოთ:**

პრომპტში დაამატე: "Think step by step" ან "Let's work through this step by step"

**მაგალითი:**
❌ ცუდი: "რა არის 17 x 28?"
✅ კარგი: "გამოთვალე 17 x 28. იფიქრე ეტაპობრივად და აჩვენე თითოეული ნაბიჯი."

ეს ტექნიკა განსაკუთრებით ეფექტურია:
- მათემატიკურ ამოცანებში
- ლოგიკურ მსჯელობაში
- კოდის debugging-ში`,
        duration: 120,
        xpReward: 35,
        category: 'prompt',
        difficulty: 'intermediate',
        order: 3,
        isActive: true,
    },
    {
        title: 'Few-Shot Learning',
        description: 'ასწავლე AI-ს მაგალითებით',
        content: `Few-Shot Learning არის ტექნიკა, სადაც AI-ს აძლევ რამდენიმე მაგალითს და შემდეგ სთხოვ მსგავს ამოცანას.

**სტრუქტურა:**
1. აუხსენი რა გინდა
2. მიეცი 2-3 მაგალითი
3. დაავალე ახალი ამოცანა

**მაგალითი:**

Input: "Happy" → Output: "Sad"
Input: "Hot" → Output: "Cold"  
Input: "Big" → Output: ?

AI პასუხი: "Small"

**რჩევა:** მაგალითები უნდა იყოს მკაფიო და თანმიმდევრული!`,
        duration: 120,
        xpReward: 40,
        category: 'prompt',
        difficulty: 'intermediate',
        order: 4,
        isActive: true,
    },
    {
        title: 'სისტემური პრომპტები',
        description: 'კონფიგურაცია AI-ს პიროვნებისთვის',
        content: `System Prompt არის სპეციალური ინსტრუქცია, რომელიც განსაზღვრავს AI-ს "პიროვნებას" და ქცევას მთელი საუბრის განმავლობაში.

**სტრუქტურა:**
\`\`\`
You are [role] with [expertise].
Your communication style is [tone].
You always [behaviors].
You never [limitations].
\`\`\`

**მაგალითი:**
"You are a senior Python developer with 10 years of experience. Your communication style is friendly but professional. You always provide code examples with comments. You never use deprecated libraries."

**გამოყენება:** API-ში system message-ად ან ChatGPT Custom Instructions-ში.`,
        duration: 120,
        xpReward: 45,
        category: 'prompt',
        difficulty: 'advanced',
        order: 5,
        isActive: true,
    },
];

const QUESTS = [
    {
        title: 'AI მოგზაურობის დაწყება',
        description: 'შეასრულე პირველი ნაბიჯები AI სამყაროში',
        steps: [
            { id: 'step1', title: 'პროფილის შევსება', description: 'შეავსე პროფილის ინფორმაცია', xpReward: 10 },
            { id: 'step2', title: 'პირველი გაკვეთილი', description: 'დაასრულე პირველი მიკრო-გაკვეთილი', xpReward: 25 },
            { id: 'step3', title: 'Mystery Box-ის გახსნა', description: 'გახსენი შენი პირველი Mystery Box', xpReward: 15 },
        ],
        totalXp: 50,
        difficulty: 'easy',
        category: 'learning',
        isActive: true,
    },
    {
        title: 'პრომპტ მასტერი',
        description: 'გახდი პრომპტების წერის ექსპერტი',
        steps: [
            { id: 'step1', title: 'ბაზისური პრომპტები', description: 'ისწავლე პრომპტის საფუძვლები', xpReward: 25 },
            { id: 'step2', title: 'Chain of Thought', description: 'აითვისე ეტაპობრივი მსჯელობა', xpReward: 35 },
            { id: 'step3', title: 'Few-Shot Learning', description: 'ისწავლე მაგალითებით სწავლება', xpReward: 40 },
            { id: 'step4', title: 'სისტემური პრომპტები', description: 'შექმენი AI პერსონა', xpReward: 50 },
        ],
        totalXp: 150,
        difficulty: 'medium',
        category: 'learning',
        isActive: true,
    },
    {
        title: 'AI ინსტრუმენტების გამოცდა',
        description: 'სცადე სხვადასხვა AI ხელსაწყოები',
        steps: [
            { id: 'step1', title: 'ტექსტის AI', description: 'გამოიყენე ChatGPT ან Claude', xpReward: 20 },
            { id: 'step2', title: 'სურათის AI', description: 'შექმენი სურათი Midjourney-ით', xpReward: 25 },
            { id: 'step3', title: 'კოდის AI', description: 'გამოიყენე GitHub Copilot', xpReward: 30 },
        ],
        totalXp: 75,
        difficulty: 'easy',
        category: 'engagement',
        isActive: true,
    },
];

const DEALS = [
    {
        title: 'AI კურსი - 50% ფასდაკლება',
        description: 'სრული AI ტრენინგ პროგრამა განსაკუთრებული ფასით',
        originalPrice: 199,
        discountedPrice: 99,
        discountPercent: 50,
        category: 'course',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        totalSlots: 50,
        claimedSlots: 12,
        isActive: true,
    },
    {
        title: 'პრემიუმ წვდომა - 30% OFF',
        description: 'წლიური პრემიუმ გამოწერა შეღავათიან ფასად',
        originalPrice: 120,
        discountedPrice: 84,
        discountPercent: 30,
        category: 'subscription',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        totalSlots: 100,
        claimedSlots: 34,
        isActive: true,
    },
    {
        title: '1-on-1 კონსულტაცია',
        description: 'პირადი AI კონსულტაცია 40% ფასდაკლებით',
        originalPrice: 150,
        discountedPrice: 90,
        discountPercent: 40,
        category: 'consultation',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
        totalSlots: 10,
        claimedSlots: 3,
        isActive: true,
    },
];

async function seed() {
    await dbConnect();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await Lesson.deleteMany({});
    await Quest.deleteMany({});
    await Deal.deleteMany({});

    // Insert lessons
    const lessons = await Lesson.insertMany(LESSONS);
    console.log(`✅ Created ${lessons.length} lessons`);

    // Insert quests
    const quests = await Quest.insertMany(QUESTS);
    console.log(`✅ Created ${quests.length} quests`);

    // Insert deals
    const deals = await Deal.insertMany(DEALS);
    console.log(`✅ Created ${deals.length} deals`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
