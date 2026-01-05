"use strict";(()=>{var e={};e.id=7433,e.ids=[7433],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},32081:e=>{e.exports=require("child_process")},6113:e=>{e.exports=require("crypto")},9523:e=>{e.exports=require("dns")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},41808:e=>{e.exports=require("net")},22037:e=>{e.exports=require("os")},71017:e=>{e.exports=require("path")},12781:e=>{e.exports=require("stream")},24404:e=>{e.exports=require("tls")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},81575:(e,r,t)=>{t.r(r),t.d(r,{originalPathname:()=>x,patchFetch:()=>h,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>m,staticGenerationAsyncStorage:()=>d});var s={};t.r(s),t.d(s,{POST:()=>u});var o=t(49303),a=t(88716),i=t(60670),n=t(87070),p=t(20471);async function u(e){try{let r;let{type:t,to:s,...o}=await e.json();if(!s)return n.NextResponse.json({error:"Recipient email is required"},{status:400});switch(t){case"welcome":if(!o.name)return n.NextResponse.json({error:"Name is required for welcome email"},{status:400});r=await (0,p.Pi)(o.name,s);break;case"notification":if(!o.title||!o.message)return n.NextResponse.json({error:"Title and message are required"},{status:400});r=await (0,p.L6)(s,o.title,o.message,o.actionUrl,o.actionText);break;case"custom":if(!o.subject||!o.html)return n.NextResponse.json({error:"Subject and html are required"},{status:400});r=await (0,p.Cz)({to:s,subject:o.subject,html:o.html,text:o.text});break;default:return n.NextResponse.json({error:"Unknown email type"},{status:400})}if(r.success)return n.NextResponse.json({success:!0,messageId:r.messageId,previewUrl:r.previewUrl});return n.NextResponse.json({error:r.error},{status:500})}catch(e){return console.error("Email API error:",e),n.NextResponse.json({error:"Failed to send email"},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/email/route",pathname:"/api/email",filename:"route",bundlePath:"app/api/email/route"},resolvedPagePath:"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\api\\email\\route.ts",nextConfigOutput:"standalone",userland:s}),{requestAsyncStorage:l,staticGenerationAsyncStorage:d,serverHooks:m}=c,x="/api/email/route";function h(){return(0,i.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:d})}},20471:(e,r,t)=>{t.d(r,{Cz:()=>i,L6:()=>p,Pi:()=>n});var s=t(55245);let o=async()=>{if(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASS)return s.createTransport({host:process.env.SMTP_HOST,port:parseInt(process.env.SMTP_PORT||"587"),secure:"true"===process.env.SMTP_SECURE,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}});let e=await s.createTestAccount();return s.createTransport({host:"smtp.ethereal.email",port:587,secure:!1,auth:{user:e.user,pass:e.pass}})},a={welcome:(e,r)=>({subject:"მოგესალმებით Fresh-ზე! \uD83C\uDF89",html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #6366f1;">გამარჯობა, ${e}! 👋</h1>
                <p>მადლობა რომ დარეგისტრირდით Fresh პლატფორმაზე.</p>
                <p>თქვენი ელ-ფოსტა: <strong>${r}</strong></p>
                <div style="margin: 30px 0;">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL||"http://localhost:3000"}" 
                       style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                        გადავიდეთ პლატფორმაზე
                    </a>
                </div>
                <p style="color: #666; font-size: 12px;">Fresh Team</p>
            </div>
        `}),notification:(e,r,t,s)=>({subject:e,html:`
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #6366f1;">${e}</h2>
                <p>${r}</p>
                ${t?`
                    <div style="margin: 30px 0;">
                        <a href="${t}" 
                           style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
                            ${s||"გადასვლა"}
                        </a>
                    </div>
                `:""}
                <p style="color: #666; font-size: 12px;">Fresh Team</p>
            </div>
        `})};async function i({to:e,subject:r,html:t,text:a}){try{let i=await o(),n=await i.sendMail({from:process.env.SMTP_FROM||'"Fresh Platform" <noreply@fresh.ge>',to:Array.isArray(e)?e.join(", "):e,subject:r,text:a||r,html:t}),p=s.getTestMessageUrl(n);return{success:!0,messageId:n.messageId,previewUrl:p||void 0}}catch(e){return console.error("Email send error:",e),{success:!1,error:e instanceof Error?e.message:"Email send failed"}}}async function n(e,r){let t=a.welcome(e,r);return i({to:r,...t})}async function p(e,r,t,s,o){return i({to:e,...a.notification(r,t,s,o)})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[8948,5972,5245],()=>t(81575));module.exports=s})();