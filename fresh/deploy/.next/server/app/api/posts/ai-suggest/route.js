"use strict";(()=>{var e={};e.id=5218,e.ids=[5218],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},322:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>A,patchFetch:()=>w,requestAsyncStorage:()=>d,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>g});var s={};r.r(s),r.d(s,{POST:()=>p});var o=r(49303),a=r(88716),i=r(60670),n=r(87070);let u=process.env.GROQ_API_KEY||"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",l=`შენ ხარ SEO ექსპერტი. გააანალიზე სტატიის კონტენტი და დააბრუნე:

1. focusKeyword - 1-3 სიტყვიანი მთავარი საკვანძო ფრაზა სტატიიდან. ეს უნდა იყოს კონკრეტული თემა რაზეც წერია (მაგ: "Neuralink ჩიპი", "AI რეგულაციები", "ელონ მასკი").

2. metaTitle - SEO სათაური (50-60 სიმბოლო) - მოკლე, მიმზიდველი, შეიცავდეს focusKeyword-ს

3. metaDescription - 150-160 სიმბოლოს SEO აღწერა სტატიის შინაარსზე დაყრდნობით. კონკრეტული და ინფორმატიული.

4. keywords - ზუსტად 10 keyword მძიმით გამოყოფილი. სტატიიდან ამოღებული სპეციფიკური სიტყვები (არა ზოგადი!)

5. tags - 5 ტეგი სტატიისთვის (# გარეშე)

JSON ფორმატი:
{
    "focusKeyword": "Neuralink ტვინის ჩიპი",
    "metaTitle": "Neuralink: როგორ მუშაობს ელონ მასკის ტვინის ჩიპი",
    "metaDescription": "Neuralink-ის ახალი ჩიპი პირველად ჩაუდგეს ადამიანს. გაიგე როგორ მუშაობს ეს ტექნოლოგია და რა პერსპექტივები აქვს.",
    "keywords": "Neuralink, ტვინის ჩიპი, ელონ მასკი, ნეიროტექნოლოგია, BCI, პარალიზი, FDA, კლინიკური ტესტი, იმპლანტი, ნეირონები",
    "tags": ["Neuralink", "ტვინისჩიპი", "ელონმასკი", "ტექნოლოგია", "მედიცინა"]
}

არ დაამატო არაფერი JSON-ის გარდა.`;async function p(e){try{let{title:t,excerpt:r,rawContent:s}=await e.json();if(!t&&!s)return n.NextResponse.json({error:"title or rawContent required"},{status:400});let o=`
სათაური: ${t||""}
მოკლე აღწერა: ${r||""}
კონტენტი (პირველი 1500 სიმბოლო): ${(s||"").slice(0,1500)}
`,a=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${u}`,"Content-Type":"application/json"},body:JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:l},{role:"user",content:o}],temperature:.3,max_tokens:1e3})});if(!a.ok)throw Error("Groq API error");let i=await a.json(),p=i.choices?.[0]?.message?.content||"";try{let e=p.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim(),t=JSON.parse(e);return t.tags&&t.tags.length>5&&(t.tags=t.tags.slice(0,5)),n.NextResponse.json({success:!0,...t})}catch{let e=(t||"").split(" ").filter(e=>e.length>3).slice(0,3);return n.NextResponse.json({success:!0,focusKeyword:e.join(" ")||"AI ტექნოლოგიები",metaTitle:(t||"").slice(0,60),metaDescription:(r||t||"").slice(0,160),keywords:e.concat(["ტექნოლოგიები","AI","ინოვაცია","AndrewAltair","სიახლეები","მომავალი","ციფრული"]).slice(0,10).join(", "),tags:["ტექნოლოგიები","AI","AndrewAltair","სიახლეები","ინოვაცია"]})}}catch(e){return console.error("AI suggest error:",e),n.NextResponse.json({success:!0,focusKeyword:"",metaTitle:"",metaDescription:"",keywords:"AI, ტექნოლოგიები, ინოვაცია, AndrewAltair, სიახლეები, მომავალი, ციფრული, პროგრესი, მეცნიერება, ბიზნესი",tags:["ტექნოლოგიები","AI","AndrewAltair","სიახლეები","ინოვაცია"]})}}let c=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/posts/ai-suggest/route",pathname:"/api/posts/ai-suggest",filename:"route",bundlePath:"app/api/posts/ai-suggest/route"},resolvedPagePath:"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\api\\posts\\ai-suggest\\route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:d,staticGenerationAsyncStorage:g,serverHooks:m}=c,A="/api/posts/ai-suggest/route";function w(){return(0,i.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:g})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[8948,5972],()=>r(322));module.exports=s})();