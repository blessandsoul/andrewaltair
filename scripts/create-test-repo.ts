
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Post from '../src/models/Post';

dotenv.config({ path: '.env.local' });

async function createRepo() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const repoData = {
            title: "NanoBanana Studio",
            slug: "nanobanana-studio",
            excerpt: "gauxseni suratis scrafad damusaveba, magram Photoshop zedmetad gadatvirtulia da rtuli asatvisebelia? NanoBanana Studio — gia kodis mkone instrumenti.",
            content: `
<h2>🎨 რა არის NanoBanana Studio?</h2>
<p>გსურს სურათის სწრაფად დამუშავება, მაგრამ Photoshop ზედმეტად გადატვირთულია და რთული ასათვისებელია? მარტივი, თუმცა მძლავრი რედაქტორის პოვნა ნამდვილად არ არის იოლი საქმე.</p>

<p>შეგიძლია სცადო <strong>NanoBanana Studio</strong> — ღია კოდის მქონე ინსტრუმენტი, რომელიც აგებულია NanoBanana API-ზე. ის საშუალებას გაძლევს დაარედაქტირო გამოსახულებები ჩვეულებრივი ტექსტის მეშვეობით.</p>

<h3>🛠 რას გთავაზობს:</h3>
<ul>
    <li>მხარდაჭერილია რედაქტირება natural language-ბრძანებებით, როგორიცაა „გახადე ცა უფრო დრამატული“ ან „დაამატე მზის ჩასვლის ეფექტი“.</li>
    <li>ახალი გამოსახულებების გენერაცია ტექსტური აღწერილობის მიხედვით.</li>
    <li>სურათების რედაქტირების გარდა, შეუძლია პირდაპირ დააგენერიროს სურათები ტექსტიდან.</li>
    <li>გთავაზობს მარტივ, გასაგებ ინტერფეისს მოდელის სტანდარტულ და Pro ვერსიებს შორის გადართვის შესაძლებლობით.</li>
</ul>
            `,
            status: "published",
            categories: ["open-source", "ai-tools"],
            tags: ["AI", "ImageEditing", "OpenSource", "GenerativeAI", "DevTools"],
            author: {
                name: "Andrew Altair",
                role: "AI Developer"
            },
            repository: {
                type: "github",
                url: "https://github.com/amrrs/fal-nanobanana-studio",
                name: "fal-nanobanana-studio",
                description: "NanoBanana Studio - Edit images with text commands",
                stars: 298,
                forks: 45,
                language: "TypeScript",
                topics: ["ai", "image-editing", "generative-ai"]
            }
        };

        // Check if exists
        const existing = await Post.findOne({ slug: repoData.slug });
        if (existing) {
            console.log('Repo already exists, updating...');
            Object.assign(existing, repoData);
            await existing.save();
        } else {
            console.log('Creating new repo post...');
            await Post.create(repoData);
        }

        console.log('✅ Repo post created successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

createRepo();
