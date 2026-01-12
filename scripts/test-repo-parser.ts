
import { parseRepositoryPost } from '../src/lib/RepositoryParser';

const rawText = `
**icloud_photos_downloader**

☁️ **გსურს iCloud-იდან ადგილობრივ დისკზე ათასობით ფოტოს გადმოწერა, მაგრამ ვებიდან ან აპლიკაციიდან ეს ხელით გასაკეთებელი, დამღლელი და ხანგრძლივი პროცესია?**

GitHub-ზე შემთხვევით აღმოვაჩინე ღია კოდის მქონე icloud_photos_downloader — კონსოლური ხელსაწყო, რომელიც საშუალებას გაძლევს სკრიპტის მეშვეობით მთლიანი iCloud Photo Library ლოკალურ მოწყობილობაზე ჩამოტვირთო.

🛠 **რას გთავაზობს:**

* დაწერილია Python-ზე, გადის ავტორიზაციას ორფაქტორიანი (2FA) დაცვით და ერთი მარტივი ბრძანებით იწერს ფოტოებსა და ვიდეოებს არჩეულ დირექტორიაში.
* შეუძლია ჩამოტვირთვის გაგრძელება გაჩერების ადგილიდან, უკვე გადმოწერილ ფაილებს ტოვებს.
* შესაძლებელია გაფილტვრა თარიღის, ალბომების და სახის ამოცნობის (face recognition) ალბომების მიხედვითაც კი.
* ჩამოტვირთვის შემდეგ ფაილების დახარისხება შესაძლებელია წელი/თვე/დღე პრინციპით და ორიგინალი მეტამონაცემების შენარჩუნებით.
* თუ cron-ს ან სხვა დამგეგმავს (scheduler) დაუკავშირებ, შეგიძლია მიიღო iCloud-ის ავტომატური ლოკალური ბექაპი.
* ხელმისაწვდომია Docker-იმიჯი, რაც გამოსადეგია სერვერზე ხანგრძლივი მუშაობისთვის.

📊 **სტატისტიკა:**
📁 Language: #Python 93.7%
⭐️ Stars: 9.7k

🔗 **GitHub რეპოზიტორი:**
[https://github.com/icloud-photos-downloader/icloud_photos_downloader](https://github.com/icloud-photos-downloader/icloud_photos_downloader)

#iCloud #Backup #PythonScript #DataHoarder #OpenSource #აიქლაუდი #ბექაპი #ფოტოები #ავტომატიზაცია #ტექნოლოგიები

---

Prompt:

Format: Vertical 9:16
Title Text: "iCloud Downloader" (Rendered as a MASSIVE 3D HOLOGRAPHIC NEON TITLE behind the character, center composition).
Branding: "AndrewAltair.GE" (Large, highly visible, bright neon architectural watermark at the bottom).
Quality: Cinematic 3D Render, Unreal Engine 5, 8k, Masterpiece, Raytracing, Photorealistic textures.
Subject: Highly detailed CGI render of Looney Tunes character Daffy Duck [Action: furiously typing on a retro-futuristic terminal command line while a vortex of glowing holographic photos gets sucked into a server rack].
Environment: Dark cyberpunk hacker den, futuristic server room cluttered with hardware, wires, and screens.
Lighting: Moody volumetric neon lighting (cyan, magenta, deep blue), reflections on wet surfaces and monitors, dramatic shadows, noir aesthetic.
Style Details: Gritty, high-tech, extremely detailed fur/material textures, shallow depth of field.
Negative Prompt: 2d, cartoon, drawing, sketch, flat colors, bright daylight, clean room, low resolution, blurry, distorted face, ugly.

---

Prompt:

Format: Horizontal 16:9
Title Text: "iCloud Downloader" (Rendered as a MASSIVE 3D HOLOGRAPHIC NEON TITLE behind the character, center composition).
Branding: "AndrewAltair.GE" (Large, highly visible, bright neon architectural watermark at the bottom).
Quality: Cinematic 3D Render, Unreal Engine 5, 8k, Masterpiece, Raytracing, Photorealistic textures.
Subject: Wide shot, highly detailed CGI render of Looney Tunes character Daffy Duck [Action: furiously typing on a retro-futuristic terminal command line while a vortex of glowing holographic photos gets sucked into a server rack].
Environment: Dark cyberpunk hacker den, futuristic server room cluttered with hardware, wires, and screens.
Lighting: Moody volumetric neon lighting (cyan, magenta, deep blue), reflections on wet surfaces and monitors, dramatic shadows, noir aesthetic.
Style Details: Gritty, high-tech, extremely detailed fur/material textures, shallow depth of field.
Negative Prompt: 2d, cartoon, drawing, sketch, flat colors, bright daylight, clean room, low resolution, blurry, distorted face, ugly.
`;

console.log("Parsing Repository Post...");
const result = parseRepositoryPost(rawText);

if (result.success) {
    console.log("✅ Success!");
    console.log("Title:", result.title);
    console.log("Repo URL:", result.repository?.url);
    console.log("Repo Name:", result.repository?.name);
    console.log("Description:", result.repository?.description?.slice(0, 50) + "...");
    console.log("Stars:", result.repository?.stars);
    console.log("Language:", result.repository?.language);
    console.log("Tags:", result.tags);
    console.log("Sections count:", result.sections?.length);
    console.log("Section 1 Title:", result.sections?.[1]?.title);
    console.log("Section 2 Title:", result.sections?.[2]?.title);
} else {
    console.error("❌ Failed:", result.error);
}
