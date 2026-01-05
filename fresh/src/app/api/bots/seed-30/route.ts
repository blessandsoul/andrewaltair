import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Bot from '@/models/Bot';

const SEED_SECRET = 'seed-mongodb-2024';

// Helper to generate random stats
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

export async function POST(request: NextRequest) {
    try {
        const { secret } = await request.json();

        if (secret !== SEED_SECRET) {
            return NextResponse.json(
                { error: 'არასწორი საიდუმლო კოდი' },
                { status: 403 }
            );
        }

        await dbConnect();
        await Bot.deleteMany({});

        const creators = [
            { name: 'გიორგი მელაძე', verified: true, totalSales: 1250, rating: 4.9 },
            { name: 'ნინო ბერიძე', verified: true, totalSales: 890, rating: 5.0 },
            { name: 'დავით ხარაძე', verified: true, totalSales: 2100, rating: 4.8 },
            { name: 'ანა გელაშვილი', verified: false, totalSales: 340, rating: 4.7 },
            { name: 'ლევან წულაძე', verified: true, totalSales: 1560, rating: 4.9 }
        ];

        const botsData = [
            {
                name: 'კონტენტის მაგისტრი',
                codename: 'CONTENT_MASTER',
                version: '2.1',
                description: 'პროფესიონალური კონტენტის შექმნა სოციალური მედიისთვის. ქმნის ჩართულ პოსტებს, სტორიებს და რეელებს რომლებიც იზიდავენ აუდიტორიას და ზრდიან ჩართულობას.',
                shortDescription: 'სოციალური მედიის კონტენტის ექსპერტი',
                category: 'content',
                tier: 'free',
                price: 0,
                icon: 'MessageCircle',
                color: 'from-blue-500 to-cyan-500',
                features: ['Instagram, Facebook, TikTok პოსტები', 'ჰეშთეგების გენერაცია', 'სტორი იდეები', 'რეელების სცენარები', 'ჩართულობის ოპტიმიზაცია'],
                masterPrompt: 'You are a social media content expert. Create engaging posts for Instagram, Facebook, and TikTok.',
                rating: 4.8,
                downloads: 15420,
                likes: 892,
                isNew: true,
                isFeatured: false,
                isActive: true,
                creator: creators[0],
                guarantees: { moneyBack: 30, freeUpdates: true, support: { type: '24/7 ჩატი', responseTime: '< 2 საათი', languages: ['ქართული', 'English'] } }
            },
            {
                name: 'ბიზნეს სტრატეგი',
                codename: 'BIZ_STRATEGY',
                version: '1.5',
                description: 'ბიზნეს გეგმების, სტრატეგიების და ფინანსური პროგნოზების შექმნა. დაგეხმარებათ ბიზნესის ზრდაში და მომგებიანობის გაზრდაში.',
                shortDescription: 'ბიზნეს დაგეგმვის ასისტენტი',
                category: 'business',
                tier: 'premium',
                price: 49,
                icon: 'TrendingUp',
                color: 'from-green-500 to-emerald-500',
                features: ['ბიზნეს გეგმა', 'SWOT ანალიზი', 'ფინანსური პროგნოზი', 'მარკეტინგ სტრატეგია', 'კონკურენტების ანალიზი'],
                masterPrompt: 'You are a business strategy expert. Help create business plans, SWOT analysis, and financial forecasts.',
                rating: 4.9,
                downloads: 8930,
                likes: 654,
                isNew: false,
                isFeatured: true,
                isActive: true,
                creator: creators[1],
                guarantees: { moneyBack: 14, freeUpdates: true, support: { type: 'პრიორიტეტული', responseTime: '< 1 საათი', languages: ['ქართული', 'English'] } }
            },
            {
                name: 'მისტიკური მრჩეველი',
                codename: 'MYSTIC_ADVISOR',
                version: '3.0',
                description: 'ასტროლოგია, ტაროს წაკითხვა, სიზმრების განმარტება და პიროვნული პროგნოზები. მიიღეთ ღრმა ინსაიტები თქვენი ცხოვრების შესახებ.',
                shortDescription: 'ასტროლოგია და სიზმრების ექსპერტი',
                category: 'mystic',
                tier: 'premium',
                price: 29,
                icon: 'Sparkles',
                color: 'from-purple-500 to-pink-500',
                features: ['ასტროლოგიური პროგნოზი', 'ტაროს წაკითხვა', 'სიზმრების ანალიზი', 'ნუმეროლოგია', 'ენერგეტიკული წაკითხვა'],
                masterPrompt: 'You are a mystic advisor specializing in astrology, tarot reading, and dream interpretation.',
                rating: 4.7,
                downloads: 12340,
                likes: 1023,
                isNew: true,
                isFeatured: true,
                isActive: true,
                creator: creators[3],
                guarantees: { moneyBack: 7, freeUpdates: true, support: { type: 'სტანდარტული', responseTime: '< 4 საათი', languages: ['ქართული'] } }
            },
            {
                name: 'კრეატიული დიზაინერი',
                codename: 'CREATIVE_DESIGNER',
                version: '2.0',
                description: 'ლოგოების, ბანერების, პოსტერების და ბრენდინგის იდეების გენერაცია. შექმენით უნიკალური ვიზუალური კონცეფციები წამებში.',
                shortDescription: 'დიზაინის იდეების გენერატორი',
                category: 'creative',
                tier: 'free',
                price: 0,
                icon: 'Palette',
                color: 'from-pink-500 to-rose-500',
                features: ['ლოგოს კონცეფციები', 'ფერთა პალიტრა', 'ბრენდინგის იდეები', 'UI/UX დიზაინი', 'ილუსტრაციის სტილები'],
                masterPrompt: 'You are a creative designer. Generate logo concepts, color palettes, and branding ideas.',
                rating: 4.6,
                downloads: 9870,
                likes: 567,
                isNew: false,
                isFeatured: false,
                isActive: true,
                creator: creators[0],
                guarantees: { moneyBack: 30, freeUpdates: true, support: { type: 'საზოგადოებრივი ფორუმი', responseTime: '< 24 საათი', languages: ['ქართული', 'English'] } }
            },
            {
                name: 'თარგმნის ოსტატი',
                codename: 'TRANSLATION_PRO',
                version: '1.8',
                description: 'პროფესიონალური თარგმანი 50+ ენაზე კონტექსტის გათვალისწინებით. შენარჩუნებს ტონს, სტილს და კულტურულ ნიუანსებს.',
                shortDescription: 'მულტილინგვური თარგმანის ბოტი',
                category: 'translation',
                tier: 'premium',
                price: 39,
                icon: 'Share2',
                color: 'from-indigo-500 to-blue-500',
                features: ['50+ ენა', 'კონტექსტური თარგმანი', 'ტექნიკური ტერმინოლოგია', 'ლოკალიზაცია', 'კულტურული ადაპტაცია'],
                masterPrompt: 'You are a professional translator. Translate text to 50+ languages while preserving tone and cultural nuances.',
                rating: 4.9,
                downloads: 18920,
                likes: 1234,
                isNew: false,
                isFeatured: true,
                isActive: true,
                creator: creators[2],
                guarantees: { moneyBack: 14, freeUpdates: true, support: { type: 'პრიორიტეტული', responseTime: '< 2 საათი', languages: ['ქართული', 'English', 'Русский'] } }
            }
        ];

        // Generate 25 more bots programmatically
        const categories = ['content', 'business', 'mystic', 'creative', 'translation'];
        const tiers = ['free', 'premium', 'private'];
        const icons = ['Bot', 'Brain', 'Zap', 'Crown', 'Heart', 'Star', 'Rocket', 'Target', 'Gift', 'PenTool'];
        const colors = [
            'from-red-500 to-orange-500',
            'from-yellow-500 to-amber-500',
            'from-lime-500 to-green-500',
            'from-teal-500 to-cyan-500',
            'from-sky-500 to-blue-500',
            'from-violet-500 to-purple-500',
            'from-fuchsia-500 to-pink-500'
        ];

        const botNames = [
            'SEO ოპტიმიზატორი', 'ემაილ მარკეტინგი', 'ვიდეო სცენარისტი', 'პოდკასტის შემქმნელი',
            'ფინანსური მრჩეველი', 'HR ასისტენტი', 'იურიდიული კონსულტანტი', 'უძრავი ქონების ექსპერტი',
            'ჰოროსკოპის მწერალი', 'ენერგეტიკის მკითხველი', 'მედიტაციის გიდი', 'ჩაკრების ბალანსერი',
            'ილუსტრატორი', 'ფოტო რედაქტორი', 'მუსიკის კომპოზიტორი', 'პოეზიის გენერატორი',
            'ტექნიკური თარჯიმანი', 'სუბტიტრების შემქმნელი', 'ლოკალიზაციის ექსპერტი', 'ენის მასწავლებელი',
            'კოდის გენერატორი', 'დებაგინგის ასისტენტი', 'API დოკუმენტაცია', 'ტესტების შემქმნელი', 'DevOps მრჩეველი'
        ];

        for (let i = 0; i < 25; i++) {
            const category = categories[i % categories.length];
            const tier = tiers[randomInt(0, 2)];
            const price = tier === 'free' ? 0 : tier === 'premium' ? randomInt(19, 99) : 0;
            
            botsData.push({
                name: botNames[i],
                codename: `BOT_${i + 6}`,
                version: `${randomInt(1, 3)}.${randomInt(0, 9)}`,
                description: `პროფესიონალური ${botNames[i]} ბოტი რომელიც დაგეხმარებათ ამოცანების სწრაფად და ეფექტურად შესრულებაში. გამოიყენეთ უახლესი AI ტექნოლოგიები თქვენი მიზნების მისაღწევად.`,
                shortDescription: `${botNames[i]} - AI ასისტენტი`,
                category,
                tier,
                price,
                icon: icons[randomInt(0, icons.length - 1)],
                color: colors[randomInt(0, colors.length - 1)],
                features: [
                    'სწრაფი შედეგები',
                    'მაღალი ხარისხი',
                    'მარტივი გამოყენება',
                    'რეგულარული განახლებები',
                    'მხარდაჭერა'
                ],
                masterPrompt: `You are an AI assistant specialized in ${botNames[i]}. Help users with their tasks efficiently.`,
                rating: parseFloat(randomFloat(4.5, 5.0).toFixed(1)),
                downloads: randomInt(1000, 25000),
                likes: randomInt(100, 1500),
                isNew: randomInt(0, 1) === 1,
                isFeatured: randomInt(0, 3) === 1,
                isActive: true,
                creator: creators[randomInt(0, creators.length - 1)],
                guarantees: {
                    moneyBack: tier === 'premium' ? randomInt(7, 30) : 30,
                    freeUpdates: true,
                    support: {
                        type: tier === 'premium' ? 'პრიორიტეტული' : '24/7 ჩატი',
                        responseTime: `< ${randomInt(1, 4)} საათი`,
                        languages: ['ქართული', 'English']
                    }
                }
            });
        }

        const insertedBots = await Bot.insertMany(botsData);

        return NextResponse.json({
            success: true,
            message: `${insertedBots.length} ბოტი წარმატებით დაემატა`,
            count: insertedBots.length
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: 'Failed to seed bots' },
            { status: 500 }
        );
    }
}

