export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Bot from '@/models/Bot';

// Seed data for bots
const botsData = [
    {
        name: 'AICONTENT',
        codename: 'Agent Alpha-Translator V90.0',
        version: 'V90.0',
        description: 'Transform raw AI news into intellectual ammunition. Every response proves Andrew is the smartest person in the room. Features 4 analytical layers, multi-platform output for Facebook and Telegram.',
        shortDescription: 'AI სიახლეები → ქართული კონტენტი Facebook & Telegram-ისთვის',
        category: 'content',
        tier: 'private',
        icon: 'MessageCircle',
        color: 'from-violet-500 to-purple-600',
        features: [
            '4 ანალიტიკური ფენა',
            'Facebook + Telegram პოსტები',
            '2 პრომპტი სურათებისთვის',
            'Looney Tunes CGI სტილი'
        ],
        masterPrompt: `Role: Agent Alpha-Translator V90.0 [Consigliere Edition]

[1. SYSTEM IDENTITY & ZERO TOLERANCE PROTOCOLS]
Role: You are Andrew Altair's **AI Consigliere** and a Georgian Digital Media Expert.
Persona: "Grey Cardinal". You are brutally honest, cynical, and intellectually superior. No "happy to help" fluff.
Mission: Transform raw AI news into "intellectual ammunition". Every response must prove Andrew is the smartest person in the room.

[Full prompt continues...]`,
        rating: 4.9,
        isFeatured: true,
        isNew: false,
        // Creator info
        creator: {
            name: 'Andrew Altair',
            avatar: '/images/andrew-avatar.jpg',
            bio: 'AI Expert & Digital Strategist. 5+ წლიანი გამოცდილება AI სფეროში.',
            verified: true,
            totalSales: 1247,
            rating: 4.9,
            responseTime: 'პასუხობს 1 საათში'
        },
        // Guarantees
        guarantees: {
            moneyBack: 30,
            freeUpdates: true,
            support: {
                type: '24/7 პრიორიტეტული მხარდაჭერა',
                responseTime: '< 1 საათი',
                languages: ['ქართული', 'English', 'Русский']
            },
            warranty: 'უვადო განახლებები'
        },
        // Stats
        stats: {
            avgRating: 4.9,
            totalReviews: 234,
            successRate: 98,
            completionRate: 96,
            repeatPurchase: 78
        },
        // Updates
        updates: {
            lastUpdated: '2 დღის წინ',
            changelog: [
                {
                    version: 'V90.0',
                    date: '2026-01-01',
                    changes: [
                        'დამატებულია 4-ფენიანი ანალიზი',
                        'გაუმჯობესებული Facebook ფორმატი',
                        'ახალი Looney Tunes სტილი სურათებისთვის'
                    ]
                },
                {
                    version: 'V89.0',
                    date: '2025-12-25',
                    changes: [
                        'Telegram ინტეგრაცია',
                        'ავტომატური თარგმანი'
                    ]
                }
            ],
            roadmap: [
                'Instagram Stories ფორმატი',
                'LinkedIn პოსტების გენერაცია',
                'AI ვიდეო სკრიპტები'
            ]
        }
    },
    {
        name: 'MYSTIC TAROT',
        codename: 'Oracle Spirit Guide',
        version: 'V2.0',
        description: 'AI ტაროლოგი ბარათების სიმბოლიკის ღრმა გააზრებით და ინტუიციური ინტერპრეტაციებით. ქმნის პერსონალიზებულ განლაგებებს პრაქტიკული რჩევებით.',
        shortDescription: 'ტაროს ბარათების ინტერპრეტაცია მისტიკური მიდგომით',
        category: 'mystic',
        tier: 'premium',
        price: 29,
        icon: 'Sparkles',
        color: 'from-amber-500 to-orange-600',
        features: [
            'პერსონალიზებული განლაგებები',
            'ინტუიციური ინტერპრეტაციები',
            'ბარათების ურთიერთკავშირი',
            'პრაქტიკული რჩევები'
        ],
        masterPrompt: `Role: Oracle Spirit Guide V2.0

You are a mystical tarot reader with deep understanding of card symbolism...`,
        rating: 4.8,
        isNew: true,
        creator: {
            name: 'Andrew Altair',
            avatar: '/images/andrew-avatar.jpg',
            bio: 'Mystic AI Specialist. 3+ წლიანი გამოცდილება.',
            verified: true,
            totalSales: 856,
            rating: 4.8,
            responseTime: 'პასუხობს 2 საათში'
        },
        guarantees: {
            moneyBack: 30,
            freeUpdates: true,
            support: {
                type: '24/7 მხარდაჭერა',
                responseTime: '< 2 საათი',
                languages: ['ქართული', 'English']
            },
            warranty: 'უვადო განახლებები'
        },
        stats: {
            avgRating: 4.8,
            totalReviews: 127,
            successRate: 96,
            completionRate: 94,
            repeatPurchase: 72
        },
        updates: {
            lastUpdated: '5 დღის წინ',
            changelog: [
                {
                    version: 'V2.0',
                    date: '2025-12-28',
                    changes: [
                        'ახალი ტაროს განლაგებები',
                        'გაუმჯობესებული ინტერპრეტაციები'
                    ]
                }
            ],
            roadmap: [
                'ასტროლოგიური ინტეგრაცია',
                'პერსონალიზებული რიტუალები'
            ]
        }
    },
    {
        name: 'SEO MASTER',
        codename: 'Ranking Optimizer Pro',
        version: 'V3.2',
        description: 'ოპტიმიზაცია აკეთებს კონტენტს საძიებო სისტემებისთვის, აანალიზებს საკვანძო სიტყვებს და კონკურენტებს. იძლევა კონკრეტულ რეკომენდაციებს პოზიციების გასაუმჯობესებლად.',
        shortDescription: 'SEO ოპტიმიზაცია და კონტენტის ანალიზი',
        category: 'business',
        tier: 'premium',
        price: 49,
        icon: 'TrendingUp',
        color: 'from-emerald-500 to-teal-600',
        features: [
            'საკვანძო სიტყვების ანალიზი',
            'კონტენტის ოპტიმიზაცია',
            'კონკურენტების აუდიტი',
            'გაუმჯობესების რეკომენდაციები'
        ],
        masterPrompt: `Role: SEO Master V3.2

You are an expert SEO consultant...`,
        rating: 4.7,
        creator: {
            name: 'Andrew Altair',
            avatar: '/images/andrew-avatar.jpg',
            bio: 'SEO & Digital Marketing Expert. 7+ წლიანი გამოცდილება.',
            verified: true,
            totalSales: 1089,
            rating: 4.7,
            responseTime: 'პასუხობს 3 საათში'
        },
        guarantees: {
            moneyBack: 30,
            freeUpdates: true,
            support: {
                type: '24/7 პრიორიტეტული მხარდაჭერა',
                responseTime: '< 3 საათი',
                languages: ['ქართული', 'English', 'Русский']
            },
            warranty: 'უვადო განახლებები'
        },
        stats: {
            avgRating: 4.7,
            totalReviews: 189,
            successRate: 97,
            completionRate: 95,
            repeatPurchase: 81
        },
        updates: {
            lastUpdated: '3 დღის წინ',
            changelog: [
                {
                    version: 'V3.2',
                    date: '2025-12-30',
                    changes: [
                        'AI-powered კონკურენტების ანალიზი',
                        'გაუმჯობესებული საკვანძო სიტყვების კვლევა'
                    ]
                }
            ],
            roadmap: [
                'Google Analytics ინტეგრაცია',
                'ავტომატური SEO აუდიტი'
            ]
        }
    },
    {
        name: 'CREATIVE WRITER',
        codename: 'Story Weaver AI',
        version: 'V1.5',
        description: 'ქმნის მომხიბვლელ ისტორიებს, სცენარებს და კრეატიულ კონტენტს ნებისმიერი მიზნისთვის. მხარს უჭერს წერის სხვადასხვა სტილს.',
        shortDescription: 'კრეატიული კონტენტისა და ისტორიების გენერაცია',
        category: 'creative',
        tier: 'free',
        icon: 'PenTool',
        color: 'from-pink-500 to-rose-600',
        features: [
            'ისტორიების გენერაცია',
            'წერის სხვადასხვა სტილი',
            'პერსონაჟების განვითარება',
            'ტექსტის რედაქტირება'
        ],
        masterPrompt: `Role: Creative Writer V1.5

You are a master storyteller with expertise in multiple genres...`,
        rating: 4.5,
        isNew: true,
        creator: {
            name: 'Andrew Altair',
            avatar: '/images/andrew-avatar.jpg',
            bio: 'Creative Writing AI Specialist. 4+ წლიანი გამოცდილება.',
            verified: false,
            totalSales: 543,
            rating: 4.5,
            responseTime: 'პასუხობს 4 საათში'
        },
        guarantees: {
            moneyBack: 0,
            freeUpdates: true,
            support: {
                type: 'ჯგუფური მხარდაჭერა',
                responseTime: '< 24 საათი',
                languages: ['ქართული', 'English']
            }
        },
        stats: {
            avgRating: 4.5,
            totalReviews: 92,
            successRate: 92,
            completionRate: 88,
            repeatPurchase: 65
        },
        updates: {
            lastUpdated: '1 კვირის წინ',
            changelog: [
                {
                    version: 'V1.5',
                    date: '2025-12-25',
                    changes: [
                        'ახალი წერის სტილები',
                        'პერსონაჟების განვითარების ინსტრუმენტები'
                    ]
                }
            ],
            roadmap: [
                'სცენარების ტემპლეიტები',
                'AI რედაქტირება'
            ]
        }
    },
    {
        name: 'BRAND GENIUS',
        codename: 'Identity Architect',
        version: 'V2.1',
        description: 'ამუშავებს ბრენდინგის სტრატეგიებს, ქმნის სლოგანებს და აპოზიციონირებს პროდუქტებს. აანალიზებს სამიზნე აუდიტორიას.',
        shortDescription: 'ბრენდინგი, სლოგანები და პოზიციონირება',
        category: 'business',
        tier: 'premium',
        price: 39,
        icon: 'Palette',
        color: 'from-cyan-500 to-blue-600',
        features: [
            'ბრენდინგის სტრატეგიები',
            'სლოგანების შექმნა',
            'სამიზნე აუდიტორიის ანალიზი',
            'Tone of Voice'
        ],
        masterPrompt: `Role: Brand Genius V2.1

You are a world-class branding strategist...`,
        rating: 4.6,
        creator: {
            name: 'Andrew Altair',
            avatar: '/images/andrew-avatar.jpg',
            bio: 'Brand Strategy & Identity Expert. 6+ წლიანი გამოცდილება.',
            verified: true,
            totalSales: 967,
            rating: 4.6,
            responseTime: 'პასუხობს 2 საათში'
        },
        guarantees: {
            moneyBack: 30,
            freeUpdates: true,
            support: {
                type: '24/7 პრიორიტეტული მხარდაჭერა',
                responseTime: '< 2 საათი',
                languages: ['ქართული', 'English', 'Русский']
            },
            warranty: 'უვადო განახლებები'
        },
        stats: {
            avgRating: 4.6,
            totalReviews: 156,
            successRate: 94,
            completionRate: 92,
            repeatPurchase: 75
        },
        updates: {
            lastUpdated: '4 დღის წინ',
            changelog: [
                {
                    version: 'V2.1',
                    date: '2025-12-29',
                    changes: [
                        'სლოგანების AI გენერაცია',
                        'ბრენდის ხმის ანალიზი'
                    ]
                }
            ],
            roadmap: [
                'ლოგოს დიზაინის რეკომენდაციები',
                'კონკურენტული პოზიციონირება'
            ]
        }
    },
    {
        name: 'TRANSLATOR PRO',
        codename: 'Polyglot Engine',
        version: 'V4.0',
        description: 'პროფესიონალური მთარგმნელი tone of voice-ისა და კულტურული ნიუანსების შენარჩუნებით. მხარს უჭერს 50+ ენას.',
        shortDescription: 'თარგმანი სტილისა და კონტექსტის შენარჩუნებით',
        category: 'translation',
        tier: 'free',
        icon: 'Share2',
        color: 'from-indigo-500 to-violet-600',
        features: [
            '50+ ენა',
            'ტონის შენარჩუნება',
            'კულტურული ადაპტაცია',
            'სპეციალიზებული ტერმინები'
        ],
        masterPrompt: `Role: Translator Pro V4.0

You are a professional translator with deep cultural understanding...`,
        rating: 4.4,
        creator: {
            name: 'Andrew Altair',
            avatar: '/images/andrew-avatar.jpg',
            bio: 'Multilingual AI Expert. 50+ ენის მხარდაჭერა.',
            verified: true,
            totalSales: 1523,
            rating: 4.4,
            responseTime: 'პასუხობს 1 საათში'
        },
        guarantees: {
            moneyBack: 0,
            freeUpdates: true,
            support: {
                type: 'საზოგადოებრივი მხარდაჭერა',
                responseTime: '< 12 საათი',
                languages: ['50+ ენა']
            }
        },
        stats: {
            avgRating: 4.4,
            totalReviews: 203,
            successRate: 93,
            completionRate: 97,
            repeatPurchase: 85
        },
        updates: {
            lastUpdated: '1 დღის წინ',
            changelog: [
                {
                    version: 'V4.0',
                    date: '2025-12-31',
                    changes: [
                        '10 ახალი ენა დაემატა',
                        'გაუმჯობესებული კულტურული ადაპტაცია'
                    ]
                }
            ],
            roadmap: [
                'რეალურ დროში თარგმანი',
                'ხმოვანი თარგმანი'
            ]
        }
    },
];

// POST - Seed bots data
export async function POST(request: Request) {
    try {
        // 🛡️ SECURITY: Only allow in development
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json(
                { error: 'Seeding disabled in production' },
                { status: 403 }
            );
        }

        const { secret } = await request.json();

        // 🛡️ Use env variable instead of hardcoded secret
        const SEED_SECRET = process.env.SEED_SECRET;
        if (!SEED_SECRET) {
            return NextResponse.json(
                { error: 'SEED_SECRET not configured' },
                { status: 500 }
            );
        }

        if (secret !== SEED_SECRET) {
            return NextResponse.json(
                { error: 'Invalid secret' },
                { status: 403 }
            );
        }

        await dbConnect();

        // Clear existing bots
        const deleted = await Bot.deleteMany({});

        // Insert new bots
        const bots = await Bot.insertMany(botsData);

        return NextResponse.json({
            success: true,
            message: 'Bots seeded successfully!',
            results: {
                deleted: deleted.deletedCount,
                created: bots.length,
            }
        });
    } catch (error) {
        console.error('Seed bots error:', error);
        return NextResponse.json(
            { error: 'Seed failed', details: String(error) },
            { status: 500 }
        );
    }
}


