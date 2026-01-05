"use strict";(()=>{var e={};e.id=3424,e.ids=[3424],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},86469:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>h,patchFetch:()=>A,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>g});var s={};t.r(s),t.d(s,{POST:()=>u});var a=t(49303),o=t(88716),n=t(60670),i=t(87070);let p=process.env.GROQ_API_KEY||"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",l=`შენ ხარ Georgian SEO ექსპერტი. შენი ამოცანაა სტატიის კონტენტიდან 20 კონტექსტუალური, SEO-ოპტიმიზებული ჰეშთეგის ამოღება.

⚠️ მთავარი წესი: თეგები უნდა იყოს კონტენტიდან ამოღებული, არა ზოგადი!

როგორ აირჩევ:
1. იპოვე სტატიაში მოხსენიებული კონკრეტული სახელები, ბრენდები, ტექნოლოგიები
2. იპოვე სპეციფიკური თემები და კონცეფციები რაზეც საუბარია
3. Georgian ტერმინები + ინგლისური ბრენდები/ტექტერმინები
4. ემოციური თეგები დაამატე მხოლოდ 2-3

მაგალითი:
- სტატია Neuralink-ზე → "Neuralink", "ილონმასკი", "ნეიროტექნოლოგია", "ტვინისჩიპი", "პარალიზებულები"
- სტატია AI-ზე → "ChatGPT", "OpenAI", "გენერაციულიAI", "ხელოვნურიინტელექტი"

❌ არასწორი: ზოგადი თეგები როცა სტატია კონკრეტულ თემაზეა (მაგ: "ტექნოლოგიები", "სიახლეები")
✅ სწორი: კონკრეტული სახელები და თემები სტატიიდან

ფორმატი: JSON მასივი 20 თეგით (# გარეშე)
["Neuralink", "ილონმასკი", "ნეიროტექნოლოგია", ...]

მხოლოდ JSON მასივი დააბრუნე!`;async function u(e){try{let{title:r,excerpt:t,content:s,category:a}=await e.json();if(!r&&!s)return i.NextResponse.json({error:"title or content required"},{status:400});let o=`
სათაური: ${r||""}
კატეგორია: ${a||""}
შინაარსი (პირველი 1000 სიმბოლო): ${(t||s||"").slice(0,1e3)}

გენერირე 20 კონტექსტუალური SEO თეგი ქართულად!`,n=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${p}`,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:l},{role:"user",content:o}],temperature:.5,max_tokens:500})});if(!n.ok){let e=await n.text();throw console.error("Groq API error:",e),Error("Groq API error")}let u=await n.json(),c=u.choices?.[0]?.message?.content||"";try{let e=c.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim(),r=JSON.parse(e),t=[...new Set(r.slice(0,20))];for(;t.length<20;){let e=["ტექნოლოგიები","სიახლეები","ტრენდი","აქტუალური","საინტერესო","გასაოცარი","ინოვაცია","მომავალი","საქართველო","მსოფლიო","AndrewAltair","AI","ხელოვნურიინტელექტი","მეცნიერება","ბიზნესი","ეკონომიკა","პოლიტიკა","კულტურა","განათლება","ჯანმრთელობა"].find(e=>!t.includes(e));if(e)t.push(e);else break}return i.NextResponse.json({success:!0,tags:t})}catch(e){return console.error("JSON parse error:",e,"Raw:",c),i.NextResponse.json({success:!0,tags:["ტექნოლოგიები","AI","სიახლეები","ტრენდი","აქტუალური","საინტერესო","გასაოცარი","ინოვაცია","მომავალი","მეცნიერება","ხელოვნურიინტელექტი","AndrewAltair","მსოფლიო","საქართველო","ბიზნესი","ეკონომიკა","კულტურა","განათლება","ციფრული","პროგრესი"]})}}catch(e){return console.error("AI tags error:",e),i.NextResponse.json({success:!0,tags:["ტექნოლოგიები","AI","სიახლეები","ტრენდი","აქტუალური","საინტერესო","გასაოცარი","ინოვაცია","მომავალი","მეცნიერება","ხელოვნურიინტელექტი","AndrewAltair","მსოფლიო","საქართველო","ბიზნესი","ეკონომიკა","კულტურა","განათლება","ციფრული","პროგრესი"]})}}let c=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/posts/generate-tags/route",pathname:"/api/posts/generate-tags",filename:"route",bundlePath:"app/api/posts/generate-tags/route"},resolvedPagePath:"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\api\\posts\\generate-tags\\route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:g,serverHooks:m}=c,h="/api/posts/generate-tags/route";function A(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:g})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[8948,5972],()=>t(86469));module.exports=s})();