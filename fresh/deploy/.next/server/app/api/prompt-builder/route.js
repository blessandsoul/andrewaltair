"use strict";(()=>{var e={};e.id=1885,e.ids=[1885],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},48605:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>g,patchFetch:()=>f,requestAsyncStorage:()=>d,routeModule:()=>l,serverHooks:()=>m,staticGenerationAsyncStorage:()=>h});var r={};a.r(r),a.d(r,{POST:()=>u});var s=a(49303),o=a(88716),n=a(60670),i=a(87070);let p=process.env.GROQ_API_KEY||"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";async function c(e,t,a={}){let{model:r="llama-3.3-70b-versatile",temperature:s=.7,maxTokens:o=1500}=a,n=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${p}`,"Content-Type":"application/json"},body:JSON.stringify({model:r,messages:[{role:"system",content:e},{role:"user",content:t}],temperature:s,max_tokens:o})});if(!n.ok)throw Error("Groq API error");let i=await n.json();return i.choices?.[0]?.message?.content||""}async function u(e){try{let{action:t,prompt:a,task:r,role:s,context:o,targetLanguage:n,modelSettings:p}=await e.json(),u=p||{},l="";switch(t){case"enhance":l=await c(`შენ ხარ ექსპერტი პრომპტ ინჟინერი. შენი ამოცანაა მომხმარებლის პრომპტის გაუმჯობესება.

წესები:
1. შეინარჩუნე იგივე სტრუქტურა და მიზანი
2. დაამატე უფრო კონკრეტული ინსტრუქციები
3. ჩართე მაგალითები სადაც საჩიროა
4. დაამატე სპეციფიკური მოთხოვნები
5. გახადე უფრო აქტიური და პრაქტიკული
6. ყველაფერი უნდა იყოს ქართულ ენაზე (ქართული ენა)
7. დააბრუნე მხოლოდ გაუმჯობესებული პრომპტი, სხვა არაფერი`,`გააუმჯობესე ეს პრომპტი ქართულ ენაზე:

${a}`,u);break;case"suggest-task":l=await c(`You are a helpful assistant that suggests specific, actionable tasks.

Based on the user's chosen expert role and context, suggest 3 specific tasks they could ask the AI to help with.

RULES:
1. Make suggestions specific and actionable
2. Each suggestion should be 1-2 sentences
3. Focus on high-value tasks that match the role
4. ALWAYS respond in Georgian language (ქართული)
5. Format as a numbered list`,`Role: ${s}
Context: ${o||"No specific context provided"}

Suggest 3 specific tasks for this role in Georgian:`,u);break;case"improve-task":l=await c(`You are an expert at writing clear, specific task descriptions for AI assistants.

RULES:
1. Take the user's vague task and make it more specific
2. Add details about expected output, format, and constraints
3. Keep the original intent
4. Make it actionable
5. ALWAYS respond in Georgian language (ქართული)
6. Return ONLY the improved task description, no explanations`,`Improve this task description and respond in Georgian:

${r}`,u);break;case"score":l=await c(`შენ ხარ პრომპტების ექსპერტი შემფასებელი. გააანალიზე მოცემული პრომპტი და მიაწოდე:
1. ხარისხის ქულა 1-დან 10-მდე
2. მოკლე ფიდბექი რა არის კარგად
3. 2-3 კონკრეტული გაუმჯობესების წინადადება

ფორმატირება JSON-ით (ყველაფერი ქართულ ენაზე):
{
    "score": <რიცხვი 1-10>,
    "feedback": "<პოზიტიური ფიდბექი ქართულად>",
    "suggestions": ["<წინადადება 1 ქართულად>", "<წინადადება 2 ქართულად>", "<წინადადება 3 ქართულად>"]
}

დააბრუნე მხოლოდ ვალიდური JSON, სხვა არაფერი.`,`შეაფასე ეს პრომპტი:

${a}`,{...u,maxTokens:500});break;case"translate":let d={en:"English",ge:"Georgian",ru:"Russian"}[n]||"English";l=await c(`You are a professional translator. Translate the following prompt to ${d}.

RULES:
1. Keep the same structure and formatting
2. Preserve technical terms where appropriate
3. Maintain the same tone and style
4. Return ONLY the translated text, nothing else`,`Translate this prompt to ${d}:

${a}`,u);break;case"variations":l=await c(`You are a creative prompt engineer. Create 3 different variations of the given prompt.

Each variation should:
1. Keep the same core intent
2. Use different phrasing or approach
3. Potentially focus on different aspects
4. Be equally or more effective

Format as numbered list (1., 2., 3.)
Separate each variation with a blank line.`,`Create 3 variations of this prompt:

${a}`,{...u,maxTokens:2e3});break;case"test":l=await c(a,`გამარჯობა! გამოიყენე შენი შესაძლებლობები და აჩვენე რა შეგიძლიათ გააკეთოთ. მოაწოდეთ ერთი კონკრეტული მაგალითი თქვენი როლის შესაბამისად პასუხის სახით. პასუხი უნდა იყოს ქართულ ენაზე.`,{...u,maxTokens:2e3});break;default:return i.NextResponse.json({error:"Invalid action"},{status:400})}return i.NextResponse.json({result:l})}catch(e){return console.error("Prompt builder AI error:",e),i.NextResponse.json({error:"AI service unavailable"},{status:500})}}let l=new s.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/prompt-builder/route",pathname:"/api/prompt-builder",filename:"route",bundlePath:"app/api/prompt-builder/route"},resolvedPagePath:"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\api\\prompt-builder\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:d,staticGenerationAsyncStorage:h,serverHooks:m}=l,g="/api/prompt-builder/route";function f(){return(0,n.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:h})}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[8948,5972],()=>a(48605));module.exports=r})();