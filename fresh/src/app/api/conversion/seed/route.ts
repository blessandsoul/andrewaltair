import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lesson from '@/models/Lesson';
import Quest from '@/models/Quest';
import Deal from '@/models/Deal';
import Challenge from '@/models/Challenge';
import Testimonial from '@/models/Testimonial';

const LESSONS = [
    {
        title: 'პრომპტის საფუძვლები',
        description: 'ისწავლე როგორ დაწერო ეფექტური პრომპტები AI-სთვის',
        content: 'პრომპტი არის ინსტრუქცია, რომელსაც AI-ს აძლევ. კარგი პრომპტი შედგება 3 ნაწილისგან:\n\n1. კონტექსტი - აუხსენი AI-ს რა როლში მოქმედებს\n2. დავალება - მკაფიოდ აღწერე რა გინდა გააკეთოს\n3. ფორმატი - მიუთითე როგორ გინდა პასუხი',
        duration: 120, xpReward: 25, category: 'prompt', difficulty: 'beginner', order: 1, isActive: true,
    },
    {
        title: 'კონტექსტის ფანჯარა',
        description: 'გაიგე როგორ მუშაობს AI მეხსიერება',
        content: 'კონტექსტის ფანჯარა არის AI-ს მეხსიერება.\n\nGPT-4 Turbo: 128K ტოკენი\nClaude 3: 200K ტოკენი\n\nრჩევა: გრძელ საუბრებში AI ივიწყებს საწყის ინფორმაციას.',
        duration: 120, xpReward: 30, category: 'concept', difficulty: 'beginner', order: 2, isActive: true,
    },
    {
        title: 'აზროვნების ჯაჭვი (Chain of Thought)',
        description: 'აიძულე AI ეტაპობრივად იფიქროს',
        content: 'Chain of Thought არის ტექნიკა, რომელიც AI-ს აიძულებს ეტაპობრივად იფიქროს.\n\nპრომპტში დაამატე: Think step by step',
        duration: 120, xpReward: 35, category: 'prompt', difficulty: 'intermediate', order: 3, isActive: true,
    },
    {
        title: 'Few-Shot Learning',
        description: 'ასწავლე AI-ს მაგალითებით',
        content: 'Few-Shot Learning: მიეცი AI-ს მაგალითები.\n\nInput: Happy → Output: Sad\nInput: Hot → Output: Cold\nInput: Big → Output: ?',
        duration: 120, xpReward: 40, category: 'prompt', difficulty: 'intermediate', order: 4, isActive: true,
    },
    {
        title: 'სისტემური პრომპტები',
        description: 'კონფიგურაცია AI-ს პიროვნებისთვის',
        content: 'System Prompt განსაზღვრავს AI-ს პიროვნებას.\n\nYou are [role] with [expertise].\nYour communication style is [tone].',
        duration: 120, xpReward: 45, category: 'prompt', difficulty: 'advanced', order: 5, isActive: true,
    },
];

const QUESTS = [
    {
        title: 'AI მოგზაურობის დაწყება',
        description: 'შეასრულე პირველი ნაბიჯები AI სამყაროში',
        steps: [
            { id: 'step1', title: 'პროფილის შევსება', description: 'შეავსე პროფილის ინფორმაცია', xpReward: 10 },
            { id: 'step2', title: 'პირველი გაკვეთილი', description: 'დაასრულე პირველი მიკრო-გაკვეთილი', xpReward: 25 },
            { id: 'step3', title: 'Mystery Box', description: 'გახსენი შენი პირველი Mystery Box', xpReward: 15 },
        ],
        totalXp: 50, difficulty: 'easy', category: 'learning', isActive: true,
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
        totalXp: 150, difficulty: 'medium', category: 'learning', isActive: true,
    },
    {
        title: 'AI ინსტრუმენტების გამოცდა',
        description: 'სცადე სხვადასხვა AI ხელსაწყოები',
        steps: [
            { id: 'step1', title: 'ტექსტის AI', description: 'გამოიყენე ChatGPT ან Claude', xpReward: 20 },
            { id: 'step2', title: 'სურათის AI', description: 'შექმენი სურათი Midjourney-ით', xpReward: 25 },
            { id: 'step3', title: 'კოდის AI', description: 'გამოიყენე GitHub Copilot', xpReward: 30 },
        ],
        totalXp: 75, difficulty: 'easy', category: 'engagement', isActive: true,
    },
];

const DEALS = [
    {
        title: 'AI კურსი - 50% ფასდაკლება',
        description: 'სრული AI ტრენინგ პროგრამა განსაკუთრებული ფასით',
        originalPrice: 199, discountedPrice: 99, discount: 50, category: 'course',
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), totalSlots: 50, claimedSlots: 12, isActive: true,
    },
    {
        title: 'პრემიუმ წვდომა - 30% OFF',
        description: 'წლიური პრემიუმ გამოწერა შეღავათიან ფასად',
        originalPrice: 120, discountedPrice: 84, discount: 30, category: 'subscription',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), totalSlots: 100, claimedSlots: 34, isActive: true,
    },
    {
        title: '1-on-1 კონსულტაცია',
        description: 'პირადი AI კონსულტაცია 40% ფასდაკლებით',
        originalPrice: 150, discountedPrice: 90, discount: 40, category: 'consultation',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), totalSlots: 10, claimedSlots: 3, isActive: true,
    },
];

const CHALLENGES = [
    {
        title: '5 გაკვეთილის დასრულება',
        description: 'დაასრულე 5 მიკრო-გაკვეთილი დღეს',
        xpReward: 100,
        type: 'daily',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
        participants: [],
        isActive: true,
    },
    {
        title: 'კვესტ მასტერი',
        description: 'დაასრულე 3 კვესტი ამ კვირაში',
        xpReward: 250,
        type: 'weekly',
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        participants: [],
        isActive: true,
    },
    {
        title: 'ახალი წლის სპეშალი',
        description: 'მოაგროვე 500 XP იანვარში',
        xpReward: 500,
        type: 'special',
        startsAt: new Date(),
        endsAt: new Date('2025-01-31'),
        participants: [],
        isActive: true,
    },
];

const TESTIMONIALS = [
    { name: 'გიორგი კ.', company: 'ტექ სტარტაპი', avatar: '👨‍💼', metric: 'პროდუქტიულობა', improvement: '+65%', testimonial: 'AI ინსტრუმენტებმა სრულად შეცვალა ჩვენი მუშაობის სტილი.', rating: 5, isActive: true, order: 1 },
    { name: 'ნინო მ.', company: 'მარკეტინგ ეიჯენსი', avatar: '👩‍💻', metric: 'კონტენტის წარმოება', improvement: '+3x', testimonial: 'თვეში 3-ჯერ მეტ კონტენტს ვაწარმოებთ იგივე გუნდით.', rating: 5, isActive: true, order: 2 },
    { name: 'დავით ლ.', company: 'ელ-კომერცია', avatar: '👨‍🚀', metric: 'მომხმარებლის სერვისი', improvement: '-50% დრო', testimonial: 'AI ჩატბოტმა განახევრა მომხმარებელთა მომსახურების დრო.', rating: 5, isActive: true, order: 3 },
    { name: 'მარიამ დ.', company: 'ფრილანსერი', avatar: '👩‍🎨', metric: 'შემოსავალი', improvement: '+40%', testimonial: 'AI ხელსაწყოებით პროექტებს უფრო სწრაფად ვასრულებ.', rating: 5, isActive: true, order: 4 },
];

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        await Lesson.deleteMany({});
        await Quest.deleteMany({});
        await Deal.deleteMany({});
        await Challenge.deleteMany({});
        await Testimonial.deleteMany({});

        const lessons = await Lesson.insertMany(LESSONS);
        const quests = await Quest.insertMany(QUESTS);
        const deals = await Deal.insertMany(DEALS);
        const challenges = await Challenge.insertMany(CHALLENGES);
        const testimonials = await Testimonial.insertMany(TESTIMONIALS);

        return NextResponse.json({
            success: true,
            message: 'All conversion data seeded!',
            data: {
                lessons: lessons.length,
                quests: quests.length,
                deals: deals.length,
                challenges: challenges.length,
                testimonials: testimonials.length,
            }
        });
    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const [lessons, quests, deals, challenges, testimonials] = await Promise.all([
            Lesson.countDocuments(),
            Quest.countDocuments(),
            Deal.countDocuments(),
            Challenge.countDocuments(),
            Testimonial.countDocuments(),
        ]);
        return NextResponse.json({ lessons, quests, deals, challenges, testimonials });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to get counts' }, { status: 500 });
    }
}

