exports.id=9287,exports.ids=[9287],exports.modules={82961:(e,t,r)=>{let a={"8023c703370fb3339a4881b4271a69f68e34381f":()=>Promise.resolve().then(r.bind(r,63829)).then(e=>e.handleSmartSearch)};async function s(e,...t){return(await a[e]()).apply(null,t)}e.exports={"8023c703370fb3339a4881b4271a69f68e34381f":s.bind(null,"8023c703370fb3339a4881b4271a69f68e34381f")}},38970:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,12994,23)),Promise.resolve().then(r.t.bind(r,96114,23)),Promise.resolve().then(r.t.bind(r,9727,23)),Promise.resolve().then(r.t.bind(r,79671,23)),Promise.resolve().then(r.t.bind(r,41868,23)),Promise.resolve().then(r.t.bind(r,84759,23))},26011:(e,t,r)=>{Promise.resolve().then(r.bind(r,71307)),Promise.resolve().then(r.bind(r,11118)),Promise.resolve().then(r.bind(r,93327)),Promise.resolve().then(r.bind(r,64860)),Promise.resolve().then(r.bind(r,75367)),Promise.resolve().then(r.bind(r,6559))},81337:(e,t,r)=>{Promise.resolve().then(r.bind(r,16507))},19891:(e,t,r)=>{Promise.resolve().then(r.bind(r,83846))},35303:()=>{},16507:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var a=r(10326);r(17577);var s=r(91664),i=r(72062),n=r(90434);function o({error:e,reset:t}){return a.jsx("div",{className:"min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30",children:(0,a.jsxs)("div",{className:"text-center max-w-md mx-auto space-y-6",children:[(0,a.jsxs)("div",{className:"relative inline-block",children:[a.jsx("div",{className:"absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse"}),a.jsx("div",{className:"relative w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20",children:a.jsx(i.bS7,{className:"w-10 h-10 text-destructive"})})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("h1",{className:"text-3xl font-bold text-foreground",children:"რაღაც შეცდომა მოხდა"}),a.jsx("p",{className:"text-muted-foreground",children:"სამწუხაროდ, მოულოდნელი შეცდომა დაფიქსირდა. გთხოვთ სცადოთ თავიდან."})]}),!1,(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row gap-3 justify-center",children:[(0,a.jsxs)(s.z,{onClick:t,className:"gap-2",children:[a.jsx(i.T8D,{className:"w-4 h-4"}),"თავიდან ცდა"]}),a.jsx(s.z,{variant:"outline",asChild:!0,children:(0,a.jsxs)(n.default,{href:"/",className:"gap-2",children:[a.jsx(i.diY,{className:"w-4 h-4"}),"მთავარზე დაბრუნება"]})})]}),(0,a.jsxs)("p",{className:"text-xs text-muted-foreground",children:["თუ პრობლემა გრძელდება, დაგვიკავშირდით"," ",a.jsx("a",{href:"mailto:andrewaltair@icloud.com",className:"text-primary hover:underline",children:"andrewaltair@icloud.com"})]})]})})}},83846:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var a=r(10326),s=r(17577),i=r(90434),n=r(72062),o=r(91664);function l(){let[e,t]=(0,s.useState)("idle"),[r,l]=(0,s.useState)(0),[d,c]=(0,s.useState)(0),[m,u]=(0,s.useState)([{x:10,y:10}]),[p,x]=(0,s.useState)({x:15,y:10}),[h,g]=(0,s.useState)({x:1,y:0});(0,s.useRef)(null);let f=(0,s.useRef)(null);return a.jsx("div",{className:"h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30",children:(0,a.jsxs)("div",{className:"text-center max-w-md mx-auto",children:[(0,a.jsxs)("div",{className:"mb-8",children:[a.jsx("h1",{className:"text-8xl font-bold text-gradient mb-4",children:"404"}),a.jsx("p",{className:"text-xl text-muted-foreground mb-2",children:"გვერდი ვერ მოიძებნა!"}),a.jsx("p",{className:"text-muted-foreground",children:"სანამ დაბრუნდები, ითამაშე სნეიკი \uD83D\uDC0D"})]}),(0,a.jsxs)("div",{className:"relative inline-block rounded-xl overflow-hidden border shadow-2xl mb-6",children:[a.jsx("canvas",{ref:f,width:300,height:300,className:"block"}),"playing"!==e&&(0,a.jsxs)("div",{className:"absolute inset-0 bg-black/70 flex flex-col items-center justify-center",children:["gameover"===e?(0,a.jsxs)(a.Fragment,{children:[a.jsx("p",{className:"text-red-400 font-bold text-lg mb-2",children:"გეიმ ოვერ!"}),(0,a.jsxs)("p",{className:"text-white text-2xl font-bold mb-1",children:["ქულა: ",r]}),r===d&&r>0&&(0,a.jsxs)("p",{className:"text-yellow-400 text-sm mb-4 flex items-center gap-1",children:[a.jsx(n.gBl,{className:"h-4 w-4"}),"ახალი რეკორდი!"]})]}):a.jsx("p",{className:"text-white mb-4",children:"დააჭირე სათამაშოდ!"}),(0,a.jsxs)(o.z,{onClick:()=>{u([{x:10,y:10}]),g({x:1,y:0}),l(0),x({x:15,y:10}),t("playing")},className:"gap-2",children:[a.jsx(n.T8D,{className:"h-4 w-4"}),"gameover"===e?"თავიდან":"დაწყება"]})]})]}),"playing"===e&&(0,a.jsxs)("div",{className:"mb-6 flex justify-center gap-6 text-sm",children:[(0,a.jsxs)("div",{children:[a.jsx("span",{className:"text-muted-foreground",children:"ქულა: "}),a.jsx("span",{className:"font-bold text-primary",children:r})]}),(0,a.jsxs)("div",{children:[a.jsx("span",{className:"text-muted-foreground",children:"რეკორდი: "}),a.jsx("span",{className:"font-bold",children:d})]})]}),"playing"===e&&a.jsx("p",{className:"text-xs text-muted-foreground mb-6",children:"ისრებით მართე გველი \uD83D\uDC0D"}),a.jsx("div",{className:"flex justify-center gap-4",children:a.jsx(o.z,{variant:"outline",asChild:!0,children:(0,a.jsxs)(i.default,{href:"/",children:[a.jsx(n.diY,{className:"h-4 w-4 mr-2"}),"მთავარზე დაბრუნება"]})})})]})})}},71307:(e,t,r)=>{"use strict";function a({GA_MEASUREMENT_ID:e}){return null}r.d(t,{GoogleAnalytics:()=>a}),r(10326),r(96931)},16197:(e,t,r)=>{"use strict";r.d(t,{ActivityFeed:()=>n});var a=r(10326),s=r(17577),i=r(72062);function n(){let[e,t]=(0,s.useState)([]),[r,n]=(0,s.useState)(null),[o,l]=(0,s.useState)(!1);return o&&r?(0,a.jsxs)("div",{className:"fixed bottom-4 left-4 z-40 animate-in slide-in-from-left-4 fade-in duration-500",children:[(0,a.jsxs)("div",{className:"flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl max-w-sm",children:[a.jsx("div",{className:"shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-xl",children:r.icon}),(0,a.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,a.jsxs)("p",{className:"text-white text-sm",children:[a.jsx("span",{className:"font-medium",children:"მომხმარებელმა"}),(0,a.jsxs)("span",{className:"text-white/70",children:[" ",r.action," "]}),a.jsx("span",{className:"font-medium text-indigo-400",children:r.target})]}),(0,a.jsxs)("div",{className:"flex items-center gap-2 mt-0.5",children:[a.jsx(i.d7m,{className:"w-3 h-3 text-white/40"}),a.jsx("span",{className:"text-white/50 text-xs",children:r.city}),a.jsx("span",{className:"text-white/30",children:"•"}),(0,a.jsxs)("span",{className:"text-white/50 text-xs",children:[r.minutes," წუთის წინ"]})]})]}),a.jsx("div",{className:"shrink-0",children:(0,a.jsxs)("div",{className:"relative",children:[a.jsx("div",{className:"w-2 h-2 bg-emerald-500 rounded-full"}),a.jsx("div",{className:"absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"})]})})]}),(0,a.jsxs)("div",{className:"flex items-center justify-center gap-1 mt-2 text-white/40 text-xs",children:[a.jsx(i.f7Q,{className:"w-3 h-3"}),(0,a.jsxs)("span",{children:[Math.floor(50*Math.random())+20," ადამიანი ათვალიერებს ახლა"]})]})]}):null}},93452:(e,t,r)=>{"use strict";r.d(t,{PricingComparison:()=>l});var a=r(10326),s=r(17577),i=r(72062),n=r(91664);let o=[{name:"AI კრედიტები დღეში",free:"10",premium:"შეუზღუდავი",icon:i.lbY},{name:"AI ინსტრუმენტების კატალოგი",free:!0,premium:!0,icon:i.jsT},{name:"სტატიების წვდომა",free:!0,premium:!0,icon:i.e6w},{name:"AI ჩატბოტი",free:"შეზღუდული",premium:"სრული წვდომა",icon:i.lbY},{name:"მისტიკური AI (ჰოროსკოპი, გადალი)",free:"3/დღე",premium:"შეუზღუდავი",icon:i.jsT},{name:"პერსონალიზებული რეკომენდაციები",free:!1,premium:!0,icon:i.jsT},{name:"AI Learning Path",free:!1,premium:!0,icon:i.jsT},{name:"Premium ბეჯები",free:!1,premium:!0,icon:i.PWB},{name:"რეკლამის გარეშე",free:!1,premium:!0,icon:i.$T2},{name:"პრიორიტეტული მხარდაჭერა",free:!1,premium:!0,icon:i.YJI},{name:"AI სერტიფიკატი",free:!1,premium:!0,icon:i.PWB},{name:"ექსკლუზიური კონტენტი",free:!1,premium:!0,icon:i.jsT}];function l({onUpgrade:e}){let[t,r]=(0,s.useState)("yearly"),l={monthly:{amount:9.99,period:"თვეში"},yearly:{amount:79.99,period:"წელიწადში",savings:"33%"}};return(0,a.jsxs)("div",{className:"w-full max-w-4xl mx-auto p-4",children:[a.jsx("div",{className:"flex justify-center mb-8",children:(0,a.jsxs)("div",{className:"inline-flex items-center bg-slate-800/50 rounded-full p-1 border border-slate-700",children:[a.jsx("button",{onClick:()=>r("monthly"),className:`px-4 py-2 rounded-full text-sm font-medium transition-all ${"monthly"===t?"bg-indigo-500 text-white shadow-lg":"text-white/60 hover:text-white"}`,children:"თვიური"}),(0,a.jsxs)("button",{onClick:()=>r("yearly"),className:`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${"yearly"===t?"bg-indigo-500 text-white shadow-lg":"text-white/60 hover:text-white"}`,children:["წლიური",a.jsx("span",{className:"px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full",children:"-33%"})]})]})}),(0,a.jsxs)("div",{className:"grid md:grid-cols-2 gap-6",children:[(0,a.jsxs)("div",{className:"relative rounded-2xl bg-slate-900/50 border border-slate-700 p-6 backdrop-blur-xl",children:[(0,a.jsxs)("div",{className:"mb-6",children:[a.jsx("h3",{className:"text-xl font-bold text-white mb-2",children:"უფასო"}),(0,a.jsxs)("div",{className:"flex items-baseline gap-1",children:[a.jsx("span",{className:"text-4xl font-bold text-white",children:"₾0"}),a.jsx("span",{className:"text-white/50",children:"სამუდამოდ"})]}),a.jsx("p",{className:"text-white/60 text-sm mt-2",children:"დაიწყე AI-ს სამყაროში მოგზაურობა"})]}),a.jsx("div",{className:"space-y-3 mb-6",children:o.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:`p-1 rounded-full ${!1===e.free?"bg-red-500/20":"bg-emerald-500/20"}`,children:!1===e.free?a.jsx(i.lhV,{className:"w-4 h-4 text-red-400"}):a.jsx(i.e6w,{className:"w-4 h-4 text-emerald-400"})}),a.jsx("span",{className:"text-white/70 text-sm flex-1",children:e.name}),"string"==typeof e.free&&a.jsx("span",{className:"text-white/50 text-xs",children:e.free})]},t))}),a.jsx(n.z,{variant:"outline",className:"w-full border-slate-600 text-white hover:bg-slate-800",children:"ამჟამად აქტიურია"})]}),(0,a.jsxs)("div",{className:"relative rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-6 backdrop-blur-xl",children:[a.jsx("div",{className:"absolute -top-3 left-1/2 -translate-x-1/2",children:a.jsx("span",{className:"px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white text-xs font-bold shadow-lg shadow-indigo-500/30",children:"⭐ ყველაზე პოპულარული"})}),(0,a.jsxs)("div",{className:"mb-6 mt-2",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(i.PWB,{className:"w-5 h-5 text-amber-400"}),a.jsx("h3",{className:"text-xl font-bold text-white",children:"Premium"})]}),(0,a.jsxs)("div",{className:"flex items-baseline gap-1",children:[(0,a.jsxs)("span",{className:"text-4xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent",children:["₾",l[t].amount]}),(0,a.jsxs)("span",{className:"text-white/50",children:["/",l[t].period]})]}),"yearly"===t&&(0,a.jsxs)("p",{className:"text-emerald-400 text-sm mt-1",children:["დაზოგე ",l.yearly.savings," წლიური პლანით!"]}),a.jsx("p",{className:"text-white/60 text-sm mt-2",children:"სრული AI ძალაუფლება შენს ხელში"})]}),a.jsx("div",{className:"space-y-3 mb-6",children:o.map((e,t)=>(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:"p-1 rounded-full bg-emerald-500/20",children:a.jsx(i.e6w,{className:"w-4 h-4 text-emerald-400"})}),a.jsx("span",{className:"text-white/90 text-sm flex-1",children:e.name}),"string"==typeof e.premium&&(0,a.jsxs)("span",{className:"text-indigo-300 text-xs font-medium flex items-center gap-1",children:["შეუზღუდავი"===e.premium&&a.jsx(i.$KY,{className:"w-3 h-3"}),e.premium]})]},t))}),(0,a.jsxs)(n.z,{onClick:e,className:"w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-500/30",children:[a.jsx(i.lbY,{className:"w-4 h-4 mr-2"}),"გახდი Premium ახლავე"]}),a.jsx("p",{className:"text-center text-white/50 text-xs mt-4",children:"\uD83D\uDD12 7-დღიანი თანხის დაბრუნების გარანტია"})]})]})]})}},52489:(e,t,r)=>{"use strict";r.d(t,{ROICalculator:()=>o});var a=r(10326),s=r(17577),i=r(72062),n=r(91664);function o({onUpgrade:e}){let[t,r]=(0,s.useState)(10),[o,l]=(0,s.useState)(25),[d,c]=(0,s.useState)(1),[m,u]=(0,s.useState)(0),p=.4*t,x=p*o*d,h=4*x;return a.jsx("div",{className:"w-full max-w-2xl mx-auto",children:(0,a.jsxs)("div",{className:"relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-900/20 to-teal-900/20 border border-emerald-500/20 p-6",children:[a.jsx("div",{className:"absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"}),(0,a.jsxs)("div",{className:"relative flex items-center gap-4 mb-6",children:[a.jsx("div",{className:"p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30",children:a.jsx(i.Fgb,{className:"w-6 h-6 text-white"})}),(0,a.jsxs)("div",{children:[a.jsx("h2",{className:"text-xl font-bold text-white",children:"ROI კალკულატორი"}),a.jsx("p",{className:"text-white/60 text-sm",children:"გაარკვიე რამდენს დაზოგავ AI-ით"})]})]}),(0,a.jsxs)("div",{className:"relative space-y-6 mb-8",children:[(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,a.jsxs)("label",{className:"text-white/80 text-sm flex items-center gap-2",children:[a.jsx(i.rfE,{className:"w-4 h-4 text-emerald-400"}),"რეპეტიტიურ დავალებებზე დახარჯული საათი / კვირაში"]}),(0,a.jsxs)("span",{className:"text-emerald-400 font-bold",children:[t,"სთ"]})]}),a.jsx("input",{type:"range",min:"1",max:"40",value:t,onChange:e=>r(Number(e.target.value)),className:"w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"})]}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,a.jsxs)("label",{className:"text-white/80 text-sm flex items-center gap-2",children:[a.jsx(i.tgD,{className:"w-4 h-4 text-emerald-400"}),"საათობრივი ტარიფი (₾)"]}),(0,a.jsxs)("span",{className:"text-emerald-400 font-bold",children:["₾",o]})]}),a.jsx("input",{type:"range",min:"5",max:"100",value:o,onChange:e=>l(Number(e.target.value)),className:"w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"})]}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,a.jsxs)("label",{className:"text-white/80 text-sm flex items-center gap-2",children:[a.jsx(i.HLl,{className:"w-4 h-4 text-emerald-400"}),"გუნდის ზომა"]}),(0,a.jsxs)("span",{className:"text-emerald-400 font-bold",children:[d," ადამიანი"]})]}),a.jsx("input",{type:"range",min:"1",max:"20",value:d,onChange:e=>c(Number(e.target.value)),className:"w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"})]})]}),(0,a.jsxs)("div",{className:"relative grid grid-cols-3 gap-4 mb-6",children:[(0,a.jsxs)("div",{className:"bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50",children:[a.jsx("p",{className:"text-white/50 text-xs mb-1",children:"კვირაში დაზოგილი"}),(0,a.jsxs)("p",{className:"text-2xl font-bold text-white",children:["₾",Math.round(x)]}),(0,a.jsxs)("p",{className:"text-emerald-400 text-xs",children:[p.toFixed(1),"სთ"]})]}),(0,a.jsxs)("div",{className:"bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl p-4 text-center border border-emerald-500/30",children:[a.jsx("p",{className:"text-white/50 text-xs mb-1",children:"თვეში დაზოგილი"}),(0,a.jsxs)("p",{className:"text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent",children:["₾",m]}),(0,a.jsxs)("p",{className:"text-emerald-400 text-xs",children:[(4*p).toFixed(0),"სთ"]})]}),(0,a.jsxs)("div",{className:"bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50",children:[a.jsx("p",{className:"text-white/50 text-xs mb-1",children:"წელიწადში დაზოგილი"}),(0,a.jsxs)("p",{className:"text-2xl font-bold text-white",children:["₾",Math.round(12*h)]}),(0,a.jsxs)("p",{className:"text-emerald-400 text-xs",children:[(52*p).toFixed(0),"სთ"]})]})]}),a.jsx("div",{className:"relative bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 mb-6 border border-emerald-500/20",children:(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx(i.ehl,{className:"w-6 h-6 text-emerald-400"}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("p",{className:"text-white font-semibold",children:["Premium ღირს ₾9.99/თვეში — შენ დაზოგავ ₾",Math.round(h),"!"]}),(0,a.jsxs)("p",{className:"text-emerald-400 text-sm",children:["ინვესტიციის დაბრუნება: ",Math.round(h/9.99*100),"% \uD83D\uDCC8"]})]})]})}),(0,a.jsxs)(n.z,{onClick:e,className:"w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/30 h-12",children:[a.jsx(i.lbY,{className:"w-5 h-5 mr-2"}),"დაიწყე დაზოგვა Premium-ით"]}),a.jsx("p",{className:"text-center text-white/40 text-xs mt-4",children:"* გათვლა ეფუძნება საშუალო 40% დროის დაზოგვას AI ხელსაწყოებით"})]})})}},64446:(e,t,r)=>{"use strict";r.d(t,{SuccessStories:()=>o});var a=r(10326),s=r(17577),i=r(72062);let n=[{id:"1",name:"დავით გელაშვილი",role:"მარკეტინგის დირექტორი",company:"TBC Bank",avatar:"\uD83D\uDC68‍\uD83D\uDCBC",quote:"AI ინსტრუმენტების გამოყენებით ჩვენი კონტენტის წარმოება 3-ჯერ გაიზარდა. Andrew Altair-მა დამეხმარა სწორი ინსტრუმენტების არჩევაში.",metric:"კონტენტის წარმოება",improvement:"+300%",rating:5},{id:"2",name:"ანა ბერიძე",role:"UX დიზაინერი",company:"Wissol",avatar:"\uD83D\uDC69‍\uD83C\uDFA8",quote:"DALL-E და Midjourney-ს სწავლის შემდეგ, ჩემი დიზაინ პროცესი სრულიად შეიცვალა. დროის დაზოგვა უზარმაზარია!",metric:"დიზაინის დრო",improvement:"-60%",rating:5},{id:"3",name:"გიორგი მაჭარაშვილი",role:"Senior Developer",company:"Bank of Georgia",avatar:"\uD83D\uDC68‍\uD83D\uDCBB",quote:"GitHub Copilot-ის შესახებ სტატიამ გამიხსნა თვალები. ახლა კოდირება ორჯერ სწრაფია და ნაკლები ბაგი მაქვს.",metric:"კოდირების სისწრაფე",improvement:"+100%",rating:5},{id:"4",name:"ნინო კვარაცხელია",role:"კონტენტ მენეჯერი",company:"Magti",avatar:"\uD83D\uDC69‍\uD83D\uDCBB",quote:"ChatGPT-ს და Claude-ს ტუტორიალებმა დამეხმარა ყოველდღიური დავალებების ავტომატიზაციაში. ახლა უფრო კრეატიულ საქმეებზე ვმუშაობ.",metric:"პროდუქტიულობა",improvement:"+80%",rating:5},{id:"5",name:"ლევან წულაძე",role:"ფრილანსერი",company:"თვითდასაქმებული",avatar:"\uD83E\uDDD1‍\uD83C\uDF93",quote:"AI-ს შესწავლის შემდეგ, ჩემი შემოსავალი თვეში 2000 ლარით გაიზარდა. კლიენტებს AI სერვისებს ვთავაზობ.",metric:"შემოსავალი",improvement:"+₾2000/თვე",rating:5}];function o(){let[e,t]=(0,s.useState)(0),[r,o]=(0,s.useState)(!0),l=n[e];return a.jsx("div",{className:"w-full max-w-2xl mx-auto",children:(0,a.jsxs)("div",{className:"relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6",children:[a.jsx("div",{className:"absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"}),a.jsx("div",{className:"absolute bottom-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"}),a.jsx("div",{className:"relative flex justify-center mb-4",children:a.jsx("div",{className:"p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full",children:a.jsx(i.H6R,{className:"w-6 h-6 text-indigo-400"})})}),(0,a.jsxs)("div",{className:"relative text-center mb-6",children:[(0,a.jsxs)("p",{className:"text-white/90 text-lg leading-relaxed mb-6",children:['"',l.quote,'"']}),(0,a.jsxs)("div",{className:"flex items-center justify-center gap-4",children:[a.jsx("span",{className:"text-4xl",children:l.avatar}),(0,a.jsxs)("div",{className:"text-left",children:[a.jsx("p",{className:"text-white font-semibold",children:l.name}),(0,a.jsxs)("div",{className:"flex items-center gap-2 text-white/60 text-sm",children:[a.jsx("span",{children:l.role}),a.jsx("span",{children:"•"}),(0,a.jsxs)("div",{className:"flex items-center gap-1",children:[a.jsx(i.JH0,{className:"w-3 h-3"}),a.jsx("span",{children:l.company})]})]})]})]}),a.jsx("div",{className:"flex justify-center gap-1 mt-4",children:[void 0,void 0,void 0,void 0,void 0].map((e,t)=>a.jsx(i.jsT,{className:`w-4 h-4 ${t<l.rating?"text-amber-400 fill-amber-400":"text-slate-600"}`},t))})]}),a.jsx("div",{className:"relative flex justify-center mb-6",children:(0,a.jsxs)("div",{className:"inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30",children:[a.jsx(i.ehl,{className:"w-4 h-4 text-emerald-400"}),(0,a.jsxs)("span",{className:"text-white/70 text-sm",children:[l.metric,":"]}),a.jsx("span",{className:"text-emerald-400 font-bold",children:l.improvement})]})}),(0,a.jsxs)("div",{className:"relative flex items-center justify-center gap-4",children:[a.jsx("button",{onClick:()=>{o(!1),t(e=>(e-1+n.length)%n.length)},className:"p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors",children:a.jsx(i.BY8,{className:"w-5 h-5 text-white"})}),a.jsx("div",{className:"flex gap-2",children:n.map((r,s)=>a.jsx("button",{onClick:()=>{o(!1),t(s)},className:`w-2 h-2 rounded-full transition-all ${s===e?"w-6 bg-indigo-500":"bg-slate-600 hover:bg-slate-500"}`},s))}),a.jsx("button",{onClick:()=>{o(!1),t(e=>(e+1)%n.length)},className:"p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors",children:a.jsx(i.Ng7,{className:"w-5 h-5 text-white"})})]})]})})}},30817:(e,t,r)=>{"use strict";r.d(t,{ld:()=>d});var a=r(10326),s=r(77626),i=r.n(s),n=r(17577),o=r(72062);let l=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyB","KeyA"];function d({onActivate:e,children:t}){let[r,s]=(0,n.useState)([]),[d,c]=(0,n.useState)(!1),[m,u]=(0,n.useState)(!1);(0,n.useCallback)(t=>{let a=[...r,t.code].slice(-l.length);s(a),a.join(",")===l.join(",")&&(c(!0),u(!0),e?.(),setTimeout(()=>{s([])},100))},[r,e]);let p=()=>{u(!1)};return m?(0,a.jsxs)("div",{className:"jsx-48ea37b5f3d7e9c3 fixed inset-0 z-[9999] flex items-center justify-center",children:[a.jsx("div",{className:"jsx-48ea37b5f3d7e9c3 absolute inset-0 pointer-events-none overflow-hidden",children:Array.from({length:50}).map((e,t)=>a.jsx("div",{style:{left:`${100*Math.random()}%`,backgroundColor:["#6366f1","#22d3ee","#ec4899","#f59e0b","#10b981"][Math.floor(5*Math.random())],animationDelay:`${2*Math.random()}s`,transform:`rotate(${360*Math.random()}deg)`},className:"jsx-48ea37b5f3d7e9c3 confetti-piece absolute w-3 h-3"},t))}),a.jsx("div",{onClick:p,className:"jsx-48ea37b5f3d7e9c3 absolute inset-0 bg-black/60 backdrop-blur-sm"}),(0,a.jsxs)("div",{className:"jsx-48ea37b5f3d7e9c3 relative animate-in zoom-in-95 fade-in duration-500",children:[a.jsx("div",{className:"jsx-48ea37b5f3d7e9c3 absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl blur-xl opacity-50 animate-pulse"}),(0,a.jsxs)("div",{className:"jsx-48ea37b5f3d7e9c3 relative rounded-2xl bg-card p-8 shadow-2xl border max-w-md text-center",children:[a.jsx("button",{onClick:p,className:"jsx-48ea37b5f3d7e9c3 absolute right-4 top-4 p-1 rounded-full hover:bg-secondary transition-colors",children:a.jsx(o.lhV,{className:"h-5 w-5"})}),a.jsx("div",{className:"jsx-48ea37b5f3d7e9c3 mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center",children:a.jsx(o.c_x,{className:"h-10 w-10 text-white"})}),a.jsx("h2",{className:"jsx-48ea37b5f3d7e9c3 text-2xl font-bold mb-2",children:"\uD83C\uDF89 კონამი კოდი გააქტიურებულია!"}),a.jsx("p",{className:"jsx-48ea37b5f3d7e9c3 text-muted-foreground mb-6",children:"შენ აღმოაჩინე საიდუმლო! მადლობა რომ დროს უთმობ ჩემს საიტს. ეს პატარა საჩუქარია შენთვის!"}),t||(0,a.jsxs)("div",{className:"jsx-48ea37b5f3d7e9c3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 border border-primary/30",children:[a.jsx("span",{className:"jsx-48ea37b5f3d7e9c3 text-2xl",children:"\uD83C\uDFC6"}),a.jsx("span",{className:"jsx-48ea37b5f3d7e9c3 font-medium",children:"კოდის მაძიებელი"})]}),a.jsx("p",{className:"jsx-48ea37b5f3d7e9c3 mt-6 text-xs text-muted-foreground/60",children:"↑ ↑ ↓ ↓ ← → ← → B A"})]})]}),a.jsx(i(),{id:"48ea37b5f3d7e9c3",children:"@-webkit-keyframes confetti-fall{0%{-webkit-transform:translatey(-100vh)rotate(0deg);transform:translatey(-100vh)rotate(0deg);opacity:1}100%{-webkit-transform:translatey(100vh)rotate(720deg);transform:translatey(100vh)rotate(720deg);opacity:0}}@-moz-keyframes confetti-fall{0%{-moz-transform:translatey(-100vh)rotate(0deg);transform:translatey(-100vh)rotate(0deg);opacity:1}100%{-moz-transform:translatey(100vh)rotate(720deg);transform:translatey(100vh)rotate(720deg);opacity:0}}@-o-keyframes confetti-fall{0%{-o-transform:translatey(-100vh)rotate(0deg);transform:translatey(-100vh)rotate(0deg);opacity:1}100%{-o-transform:translatey(100vh)rotate(720deg);transform:translatey(100vh)rotate(720deg);opacity:0}}@keyframes confetti-fall{0%{-webkit-transform:translatey(-100vh)rotate(0deg);-moz-transform:translatey(-100vh)rotate(0deg);-o-transform:translatey(-100vh)rotate(0deg);transform:translatey(-100vh)rotate(0deg);opacity:1}100%{-webkit-transform:translatey(100vh)rotate(720deg);-moz-transform:translatey(100vh)rotate(720deg);-o-transform:translatey(100vh)rotate(720deg);transform:translatey(100vh)rotate(720deg);opacity:0}}.confetti-piece.jsx-48ea37b5f3d7e9c3{-webkit-animation:confetti-fall 3s ease-out forwards;-moz-animation:confetti-fall 3s ease-out forwards;-o-animation:confetti-fall 3s ease-out forwards;animation:confetti-fall 3s ease-out forwards}"})]}):null}},5439:(e,t,r)=>{"use strict";r.d(t,{s:()=>o});var a=r(10326),s=r(17577),i=r(51223),n=r(72062);function o({className:e,minVisitors:t=15,maxVisitors:r=150,showLabel:o=!0,variant:l="badge"}){let[d,c]=(0,s.useState)(0),[m,u]=(0,s.useState)(!1);return"floating"===l?(0,a.jsxs)("div",{className:(0,i.cn)("fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-card/90 backdrop-blur-lg px-4 py-2 shadow-lg border",e),children:[(0,a.jsxs)("div",{className:"relative",children:[a.jsx(n.f7Q,{className:"h-4 w-4 text-primary"}),a.jsx("span",{className:"absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-500 animate-pulse"})]}),a.jsx("span",{className:(0,i.cn)("font-bold tabular-nums transition-all",m&&"scale-110 text-primary"),children:d}),o&&a.jsx("span",{className:"text-sm text-muted-foreground",children:"ონლაინ"})]}):"inline"===l?(0,a.jsxs)("span",{className:(0,i.cn)("inline-flex items-center gap-1.5",e),children:[(0,a.jsxs)("span",{className:"relative flex h-2 w-2",children:[a.jsx("span",{className:"absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"}),a.jsx("span",{className:"relative inline-flex h-2 w-2 rounded-full bg-green-500"})]}),a.jsx("span",{className:(0,i.cn)("font-medium tabular-nums transition-all",m&&"text-primary"),children:d}),o&&a.jsx("span",{className:"text-muted-foreground",children:"კითხულობს ახლა"})]}):(0,a.jsxs)("div",{className:(0,i.cn)("inline-flex items-center gap-2 rounded-full bg-secondary/80 backdrop-blur px-3 py-1.5",e),children:[a.jsx(n.HLl,{className:"h-3.5 w-3.5 text-muted-foreground"}),a.jsx("span",{className:(0,i.cn)("text-sm font-semibold tabular-nums transition-all",m&&"scale-110 text-primary"),children:d}),o&&a.jsx("span",{className:"text-sm text-muted-foreground",children:"ონლაინ"})]})}},93158:(e,t,r)=>{"use strict";r.d(t,{a:()=>o});var a=r(10326),s=r(17577),i=r(51223),n=r(72062);function o({enabled:e=!0}){let[t,r]=(0,s.useState)([]),[o,l]=(0,s.useState)(0),d=e=>{switch(e){case"subscribe":return a.jsx(n.QOK,{className:"h-4 w-4 text-primary"});case"reading":return a.jsx(n.HLl,{className:"h-4 w-4 text-accent"});case"comment":return a.jsx(n.Rwq,{className:"h-4 w-4 text-green-500"});case"trending":return a.jsx(n.ehl,{className:"h-4 w-4 text-red-500"})}};return e&&0!==t.length?a.jsx("div",{className:"fixed bottom-4 left-4 z-50 flex flex-col gap-2",children:t.map(e=>(0,a.jsxs)("div",{className:(0,i.cn)("flex items-center gap-3 rounded-lg bg-card/95 backdrop-blur-lg px-4 py-3 shadow-xl border","animate-in slide-in-from-left-4 fade-in duration-300"),children:[a.jsx("div",{className:"flex h-8 w-8 items-center justify-center rounded-full bg-secondary",children:d(e.type)}),(0,a.jsxs)("div",{children:[a.jsx("p",{className:"text-sm font-medium",children:e.message}),e.location&&"reading"!==e.type&&a.jsx("p",{className:"text-xs text-muted-foreground",children:e.location})]})]},e.id))}):null}n.QOK,n.HLl,n.Rwq,n.ehl},11118:(e,t,r)=>{"use strict";r.d(t,{LayoutWrapper:()=>et});var a=r(10326),s=r(35047),i=r(90434),n=r(91664),o=r(17577),l=r(87267),d=r(79360),c=r(72062),m=r(51223);function u({className:e,children:t,viewport:r=!0,...s}){return(0,a.jsxs)(l.fC,{"data-slot":"navigation-menu","data-viewport":r,className:(0,m.cn)("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center",e),...s,children:[t,r&&a.jsx(b,{})]})}function p({className:e,...t}){return a.jsx(l.aV,{"data-slot":"navigation-menu-list",className:(0,m.cn)("group flex flex-1 list-none items-center justify-center gap-1",e),...t})}function x({className:e,...t}){return a.jsx(l.ck,{"data-slot":"navigation-menu-item",className:(0,m.cn)("relative",e),...t})}let h=(0,d.j)("group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1");function g({className:e,children:t,...r}){return(0,a.jsxs)(l.xz,{"data-slot":"navigation-menu-trigger",className:(0,m.cn)(h(),"group",e),...r,children:[t," ",a.jsx(c.YRR,{className:"relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180","aria-hidden":"true"})]})}function f({className:e,...t}){return a.jsx(l.VY,{"data-slot":"navigation-menu-content",className:(0,m.cn)("data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto","group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",e),...t})}function b({className:e,...t}){return a.jsx("div",{className:(0,m.cn)("absolute top-full left-0 isolate z-50 flex justify-center"),children:a.jsx(l.l_,{"data-slot":"navigation-menu-viewport",className:(0,m.cn)("origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",e),...t})})}function v({className:e,...t}){return a.jsx(l.rU,{"data-slot":"navigation-menu-link",className:(0,m.cn)("data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-ring/50 rounded-sm text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1",e),...t})}function y(){let[e,t]=o.useState("light"),[r,s]=o.useState(!1);o.useEffect(()=>{s(!0);let e=localStorage.getItem("theme");e?(t(e),i(e)):i("light")},[]);let i=e=>{let t=document.documentElement;if("system"===e){let e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";t.classList.toggle("dark","dark"===e)}else t.classList.toggle("dark","dark"===e)};return r?(0,a.jsxs)(n.z,{variant:"ghost",size:"icon",onClick:()=>{let r=["light","dark","system"],a=r.indexOf(e),s=r[(a+1)%r.length];t(s),localStorage.setItem("theme",s),i(s)},className:"relative group",title:`Current: ${e}`,children:["light"===e&&a.jsx(c.zto,{className:"h-5 w-5 transition-transform group-hover:rotate-45"}),"dark"===e&&a.jsx(c.wGu,{className:"h-5 w-5 transition-transform group-hover:-rotate-12"}),"system"===e&&a.jsx(c.y1G,{className:"h-5 w-5 transition-transform group-hover:scale-110"}),a.jsx("span",{className:"sr-only",children:"Toggle theme"})]}):a.jsx(n.z,{variant:"ghost",size:"icon",className:"relative",children:a.jsx(c.zto,{className:"h-5 w-5"})})}var w=r(71182),j=r(37956);let N=j.fC;j.xz;let C=j.h_;j.x8;let S=o.forwardRef(({className:e,...t},r)=>a.jsx(j.aV,{ref:r,className:(0,m.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...t}));S.displayName=j.aV.displayName;let A=o.forwardRef(({className:e,children:t,...r},s)=>(0,a.jsxs)(C,{children:[a.jsx(S,{}),(0,a.jsxs)(j.VY,{ref:s,className:(0,m.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...r,children:[t,(0,a.jsxs)(j.x8,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[a.jsx(c.lhV,{className:"h-4 w-4"}),a.jsx("span",{className:"sr-only",children:"Close"})]})]})]}));A.displayName=j.VY.displayName,o.forwardRef(({className:e,...t},r)=>a.jsx(j.Dx,{ref:r,className:(0,m.cn)("text-lg font-semibold leading-none tracking-tight",e),...t})).displayName=j.Dx.displayName,o.forwardRef(({className:e,...t},r)=>a.jsx(j.dk,{ref:r,className:(0,m.cn)("text-sm text-muted-foreground",e),...t})).displayName=j.dk.displayName;let I=o.forwardRef(({className:e,...t},r)=>a.jsx(w.mY,{ref:r,className:(0,m.cn)("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",e),...t}));I.displayName=w.mY.displayName;let k=({children:e,shouldFilter:t=!0,...r})=>a.jsx(N,{...r,children:a.jsx(A,{className:"overflow-hidden p-0 shadow-lg",children:a.jsx(I,{shouldFilter:t,className:"[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",children:e})})}),P=o.forwardRef(({className:e,...t},r)=>a.jsx("div",{className:"flex items-center px-3","cmdk-input-wrapper":"",children:a.jsx(w.mY.Input,{ref:r,className:(0,m.cn)("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none shadow-none ring-0",e),style:{boxShadow:"none",border:"none",outline:"none"},...t})}));P.displayName=w.mY.Input.displayName;let D=o.forwardRef(({className:e,...t},r)=>a.jsx(w.mY.List,{ref:r,className:(0,m.cn)("max-h-[300px] overflow-y-auto overflow-x-hidden",e),...t}));D.displayName=w.mY.List.displayName;let T=o.forwardRef((e,t)=>a.jsx(w.mY.Empty,{ref:t,className:"py-6 text-center text-sm",...e}));T.displayName=w.mY.Empty.displayName;let L=o.forwardRef(({className:e,...t},r)=>a.jsx(w.mY.Group,{ref:r,className:(0,m.cn)("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",e),...t}));L.displayName=w.mY.Group.displayName,o.forwardRef(({className:e,...t},r)=>a.jsx(w.mY.Separator,{ref:r,className:(0,m.cn)("-mx-1 h-px bg-border",e),...t})).displayName=w.mY.Separator.displayName;let R=o.forwardRef(({className:e,...t},r)=>a.jsx(w.mY.Item,{ref:r,className:(0,m.cn)("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground",e),...t}));R.displayName=w.mY.Item.displayName;var E=r(38443);r(15424);var M=(0,r(46242).$)("8023c703370fb3339a4881b4271a69f68e34381f");function G({isOpen:e,onClose:t}){let[r,i]=o.useState(""),[n,l]=o.useState([]),[d,m]=o.useState(!1),u=(0,s.useRouter)();o.useEffect(()=>{if(!r){l([]);return}let e=setTimeout(async()=>{m(!0);try{let e=await fetch(`/api/search?q=${encodeURIComponent(r)}&limit=5`);if(e.ok){let t=await e.json();l(t.results||[])}}catch(e){console.error(e)}finally{m(!1)}},300);return()=>clearTimeout(e)},[r]);let p=e=>{t(),e.startsWith("http")?window.open(e,"_blank"):u.push(e)},x=async e=>{if("Enter"===e.key&&/^\d{6}$/.test(r)){e.preventDefault();let t=new FormData;t.append("query",r),await M(t)}};return(0,a.jsxs)(k,{open:e,onOpenChange:t,shouldFilter:!1,children:[a.jsx(P,{placeholder:"TbSearch articles, tools, or type ID...",value:r,onValueChange:i,onKeyDown:x}),(0,a.jsxs)(D,{children:[a.jsx(T,{children:"No results found."}),d&&(0,a.jsxs)("div",{className:"py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2",children:[a.jsx(c.olI,{className:"w-4 h-4 animate-spin"}),"Searching..."]}),!d&&n.length>0&&a.jsx(L,{heading:"Results",children:n.map(e=>(0,a.jsxs)(R,{value:e.id+e.type+e.title,onSelect:()=>p(e.url),onMouseDown:t=>{t.preventDefault(),t.stopPropagation(),p(e.url)},className:"flex items-center gap-4 p-2 cursor-pointer",children:[e.image?a.jsx("div",{className:"relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary border border-border/50",children:a.jsx("img",{src:e.image,alt:e.title,className:"object-cover w-full h-full"})}):(0,a.jsxs)("div",{className:"w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0 border border-border/50",children:["post"===e.type&&a.jsx(c.RxU,{className:"w-6 h-6 text-muted-foreground"}),"video"===e.type&&a.jsx(c.mL_,{className:"w-6 h-6 text-muted-foreground"}),"tool"===e.type&&a.jsx(c.rAI,{className:"w-6 h-6 text-muted-foreground"})]}),(0,a.jsxs)("div",{className:"flex flex-col gap-1 overflow-hidden flex-1",onClick:()=>p(e.url),children:[a.jsx("span",{className:"font-medium truncate",children:e.title}),e.description&&a.jsx("span",{className:"text-xs text-muted-foreground truncate",children:e.description})]}),a.jsx("div",{className:"ml-auto flex flex-col items-end gap-1",children:a.jsx(E.C,{variant:"secondary",className:"text-[10px] capitalize px-1.5 h-5",children:e.type})})]},e.id+e.type))})]})]})}var F=r(6559);let U=[{href:"/blog",label:"ბლოგი",icon:c.NQR,description:"სტატიები და სიახლეები"},{href:"/videos",label:"ვიდეოები",icon:c.mL_,description:"YouTube ტუტორიალები"}],B=[{href:"/tools",label:"AI ინსტრუმენტები",icon:c.sDK,description:"რეიტინგები და მიმოხილვები"},{href:"/mystic",label:"მისტიკური AI",icon:c.PnF,description:"AI პრედიქციები"},{href:"/new-features",label:"ახალი ფუნქციები",icon:c.c_x,description:"20 კონვერსიის კომპონენტი"},{href:"/services",label:"კონსულტაცია",icon:c.LjU,description:"AI კონსალტინგი"},{href:"/products",label:"პროდუქტები",icon:c.H$S,description:"კურსები და ტემპლეიტები"},{href:"/quiz",label:"AI ქვიზი",icon:c.GCM,description:"იპოვე შენი AI"}],V=[{href:"/about",label:"ჩემ შესახებ",icon:c.S8z,description:"Andrew Altair"}],z=[{category:"კონტენტი",items:U},{category:"სერვისები",items:B},{category:"შესახებ",items:V}];function _(){let{user:e,logout:t,isGod:r,isAdmin:s}=(0,F.a)(),[n,l]=(0,o.useState)(!1);if(!e)return null;let d=F.m[e.role];return(0,a.jsxs)("div",{className:"relative",children:[(0,a.jsxs)("button",{onClick:()=>l(!n),className:"flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-secondary transition-colors",children:[a.jsx("div",{className:`w-8 h-8 rounded-full bg-gradient-to-br ${d.color} flex items-center justify-center text-white font-bold text-sm`,children:e.fullName[0]}),(0,a.jsxs)("div",{className:"hidden sm:block text-left",children:[(0,a.jsxs)("div",{className:"text-sm font-medium flex items-center gap-1",children:[e.fullName,r&&a.jsx(c.PWB,{className:"w-4 h-4 text-yellow-500"})]}),a.jsx("div",{className:"text-xs text-muted-foreground",children:d.label})]}),a.jsx(c.YRR,{className:"w-4 h-4 text-muted-foreground"})]}),n&&(0,a.jsxs)(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>l(!1)}),(0,a.jsxs)("div",{className:"absolute right-0 top-full mt-2 w-64 z-50 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2",children:[a.jsx("div",{className:"p-4 border-b border-border bg-muted/30",children:(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:`w-12 h-12 rounded-full bg-gradient-to-br ${d.color} flex items-center justify-center text-white font-bold`,children:e.fullName[0]}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"font-medium flex items-center gap-1",children:[e.fullName,r&&a.jsx(c.PWB,{className:"w-4 h-4 text-yellow-500"})]}),a.jsx("div",{className:"text-sm text-muted-foreground",children:e.email}),e.badge&&a.jsx("div",{className:"text-xs text-primary mt-1",children:e.badge})]})]})}),(0,a.jsxs)("div",{className:"py-2",children:[(0,a.jsxs)(i.default,{href:"/profile",onClick:()=>l(!1),className:"flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors",children:[a.jsx(c.S8z,{className:"w-4 h-4 text-muted-foreground"}),"პროფილი"]}),(0,a.jsxs)(i.default,{href:"/settings",onClick:()=>l(!1),className:"flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors",children:[a.jsx(c.sDK,{className:"w-4 h-4 text-muted-foreground"}),"პარამეტრები"]}),s&&(0,a.jsxs)(i.default,{href:"/admin",onClick:()=>l(!1),className:"flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-primary",children:[a.jsx(c.$T2,{className:"w-4 h-4"}),"ადმინ პანელი",r&&a.jsx("span",{className:"ml-auto text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded",children:"GOD"})]})]}),a.jsx("div",{className:"border-t border-border py-2",children:(0,a.jsxs)("button",{onClick:()=>{t(),l(!1)},className:"flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 w-full transition-colors",children:[a.jsx(c.VUx,{className:"w-4 h-4"}),"გასვლა"]})})]})]})]})}function H(){let[e,t]=(0,o.useState)(!1),r=function(){let[e,t]=o.useState(!1);return o.useEffect(()=>{let e=e=>{(e.metaKey||e.ctrlKey)&&"k"===e.key&&(e.preventDefault(),t(!0))};return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)},[]),{isOpen:e,open:()=>t(!0),close:()=>t(!1)}}(),{user:s,isLoading:l}=(0,F.a)();return(0,a.jsxs)(a.Fragment,{children:[a.jsx("header",{className:"sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",children:(0,a.jsxs)("div",{className:"container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",children:[(0,a.jsxs)("div",{className:"flex h-16 items-center justify-between",children:[(0,a.jsxs)(i.default,{href:"/",className:"flex items-center space-x-3 group shrink-0",children:[(0,a.jsxs)("div",{className:"relative",children:[a.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"}),a.jsx("div",{className:"relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform shadow-lg",children:a.jsx(c.bAs,{className:"w-6 h-6"})})]}),(0,a.jsxs)("div",{className:"hidden sm:block",children:[a.jsx("span",{className:"font-bold text-xl text-gradient",children:"Andrew Altair"}),a.jsx("div",{className:"text-xs text-muted-foreground",children:"AI ინოვატორი"})]})]}),a.jsx(u,{className:"hidden lg:flex",children:(0,a.jsxs)(p,{children:[a.jsx(x,{children:a.jsx(v,{asChild:!0,children:a.jsx(i.default,{href:"/",className:"group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-secondary hover:text-foreground text-muted-foreground",children:"მთავარი"})})}),(0,a.jsxs)(x,{children:[a.jsx(g,{className:"h-10 px-4 text-sm font-medium text-muted-foreground bg-transparent",children:"კონტენტი"}),a.jsx(f,{children:a.jsx("ul",{className:"grid w-[320px] gap-2 p-4",children:U.map(e=>a.jsx("li",{children:a.jsx(v,{asChild:!0,children:(0,a.jsxs)(i.default,{href:e.href,className:"group flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors",children:[a.jsx(e.icon,{className:"w-5 h-5 text-primary shrink-0"}),(0,a.jsxs)("div",{className:"min-w-0",children:[a.jsx("div",{className:"font-medium text-sm",children:e.label}),a.jsx("div",{className:"text-xs text-muted-foreground truncate",children:e.description})]})]})})},e.href))})})]}),(0,a.jsxs)(x,{children:[a.jsx(g,{className:"h-10 px-4 text-sm font-medium text-muted-foreground bg-transparent",children:"სერვისები"}),a.jsx(f,{children:a.jsx("ul",{className:"grid w-[320px] gap-2 p-4",children:B.map(e=>a.jsx("li",{children:a.jsx(v,{asChild:!0,children:(0,a.jsxs)(i.default,{href:e.href,className:"group flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors",children:[a.jsx(e.icon,{className:"w-5 h-5 text-primary shrink-0"}),(0,a.jsxs)("div",{className:"min-w-0",children:[a.jsx("div",{className:"font-medium text-sm",children:e.label}),a.jsx("div",{className:"text-xs text-muted-foreground truncate",children:e.description})]})]})})},e.href))})})]}),(0,a.jsxs)(x,{children:[a.jsx(g,{className:"h-10 px-4 text-sm font-medium text-muted-foreground bg-transparent",children:"შესახებ"}),a.jsx(f,{children:a.jsx("ul",{className:"grid w-[320px] gap-2 p-4",children:V.map(e=>a.jsx("li",{children:a.jsx(v,{asChild:!0,children:(0,a.jsxs)(i.default,{href:e.href,className:"group flex items-center gap-3 rounded-lg p-2 hover:bg-secondary transition-colors",children:[a.jsx(e.icon,{className:"w-5 h-5 text-primary shrink-0"}),(0,a.jsxs)("div",{className:"min-w-0",children:[a.jsx("div",{className:"font-medium text-sm",children:e.label}),a.jsx("div",{className:"text-xs text-muted-foreground truncate",children:e.description})]})]})})},e.href))})})]})]})}),(0,a.jsxs)("div",{className:"hidden lg:flex items-center space-x-2",children:[a.jsx(n.z,{variant:"ghost",size:"icon",className:"text-muted-foreground hover:text-foreground",onClick:r.open,children:a.jsx(c.adB,{className:"w-5 h-5"})}),a.jsx(y,{}),l?a.jsx("div",{className:"w-8 h-8 rounded-full bg-muted animate-pulse"}):s?a.jsx(_,{}):(0,a.jsxs)(a.Fragment,{children:[a.jsx(i.default,{href:"/login",children:(0,a.jsxs)(n.z,{variant:"ghost",size:"sm",className:"gap-2",children:[a.jsx(c.V5F,{className:"w-4 h-4"}),"შესვლა"]})}),a.jsx(i.default,{href:"/register",children:(0,a.jsxs)(n.z,{size:"sm",className:"gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white border-0 shadow-lg",children:[a.jsx(c.xv7,{className:"w-4 h-4"}),"რეგისტრაცია"]})})]})]}),(0,a.jsxs)("div",{className:"flex lg:hidden items-center space-x-2",children:[a.jsx(n.z,{variant:"ghost",size:"icon",onClick:r.open,children:a.jsx(c.adB,{className:"w-5 h-5"})}),a.jsx(y,{}),s&&a.jsx("div",{className:`w-8 h-8 rounded-full bg-gradient-to-br ${F.m[s.role].color} flex items-center justify-center text-white font-bold text-xs`,children:s.fullName[0]}),a.jsx(n.z,{variant:"ghost",size:"icon",onClick:()=>t(!e),children:e?a.jsx(c.lhV,{className:"w-5 h-5"}):a.jsx(c.QFQ,{className:"w-5 h-5"})})]})]}),e&&a.jsx("div",{className:"lg:hidden border-t border-border py-4 animate-in slide-in-from-top-2 max-h-[70vh] overflow-y-auto",children:(0,a.jsxs)("nav",{className:"space-y-4",children:[s&&a.jsx("div",{className:"px-4 py-3 mb-4 bg-muted/30 rounded-lg mx-2",children:(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[a.jsx("div",{className:`w-10 h-10 rounded-full bg-gradient-to-br ${F.m[s.role].color} flex items-center justify-center text-white font-bold`,children:s.fullName[0]}),(0,a.jsxs)("div",{children:[(0,a.jsxs)("div",{className:"font-medium flex items-center gap-1",children:[s.fullName,"god"===s.role&&a.jsx(c.PWB,{className:"w-4 h-4 text-yellow-500"})]}),a.jsx("div",{className:"text-sm text-muted-foreground",children:s.email})]})]})}),(0,a.jsxs)(i.default,{href:"/",className:"flex items-center px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors",onClick:()=>t(!1),children:[a.jsx(c.c_x,{className:"w-5 h-5 mr-3 text-primary"}),"მთავარი"]}),z.map(e=>(0,a.jsxs)("div",{className:"space-y-1",children:[a.jsx("div",{className:"px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",children:e.category}),e.items.map(e=>(0,a.jsxs)(i.default,{href:e.href,className:"flex items-center px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors",onClick:()=>t(!1),children:[a.jsx(e.icon,{className:"w-4 h-4 mr-3 text-primary/70"}),e.label]},e.href))]},e.category)),a.jsx("div",{className:"flex items-center space-x-2 px-4 pt-4 border-t border-border",children:s?(0,a.jsxs)(a.Fragment,{children:[a.jsx(i.default,{href:"/admin",className:"flex-1",onClick:()=>t(!1),children:(0,a.jsxs)(n.z,{variant:"outline",size:"sm",className:"w-full gap-2",children:[a.jsx(c.$T2,{className:"w-4 h-4"}),"ადმინ პანელი"]})}),(0,a.jsxs)(n.z,{size:"sm",variant:"destructive",className:"flex-1 gap-2",onClick:()=>{let{logout:e}=(0,F.a)();e(),t(!1)},children:[a.jsx(c.VUx,{className:"w-4 h-4"}),"გასვლა"]})]}):(0,a.jsxs)(a.Fragment,{children:[a.jsx(i.default,{href:"/login",className:"flex-1",onClick:()=>t(!1),children:(0,a.jsxs)(n.z,{variant:"outline",size:"sm",className:"w-full gap-2",children:[a.jsx(c.V5F,{className:"w-4 h-4"}),"შესვლა"]})}),a.jsx(i.default,{href:"/register",className:"flex-1",onClick:()=>t(!1),children:(0,a.jsxs)(n.z,{size:"sm",className:"w-full gap-2 bg-gradient-to-r from-primary to-accent text-white border-0",children:[a.jsx(c.xv7,{className:"w-4 h-4"}),"რეგისტრაცია"]})})]})})]})})]})}),a.jsx(G,{isOpen:r.isOpen,onClose:r.close})]})}var O=r(28365);function $(){let e=new Date().getFullYear();return a.jsx("footer",{className:"border-t border-border bg-card",children:a.jsx("div",{className:"container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",children:(0,a.jsxs)("div",{className:"py-12 md:py-16",children:[(0,a.jsxs)("div",{className:"grid grid-cols-1 gap-10 md:grid-cols-4",children:[(0,a.jsxs)("div",{className:"space-y-4",children:[(0,a.jsxs)(i.default,{href:"/",className:"flex items-center gap-3",children:[a.jsx("div",{className:"w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white",children:a.jsx(c.bAs,{className:"w-6 h-6"})}),a.jsx("span",{className:"font-bold text-xl text-gradient",children:"Andrew Altair"})]}),a.jsx("p",{className:"text-sm text-muted-foreground",children:"ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ ვიზიარებ ცოდნას, ტუტორიალებს და პრაქტიკულ რჩევებს."}),(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx(i.default,{href:O.U.social.youtube,className:"w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors",children:a.jsx(c.YRG,{className:"w-4 h-4"})}),a.jsx(i.default,{href:O.U.social.instagram,className:"w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors",children:a.jsx(c.lUc,{className:"w-4 h-4"})}),a.jsx(i.default,{href:O.U.social.telegram,className:"w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors",children:a.jsx(c.Oe$,{className:"w-4 h-4"})}),a.jsx(i.default,{href:O.U.social.github,className:"w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors",children:a.jsx(c.VnC,{className:"w-4 h-4"})}),a.jsx(i.default,{href:O.U.social.linkedin,className:"w-9 h-9 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors",children:a.jsx(c.PGh,{className:"w-4 h-4"})})]})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[a.jsx("h4",{className:"text-sm font-semibold",children:"ნავიგაცია"}),(0,a.jsxs)("ul",{className:"space-y-3 text-sm",children:[a.jsx("li",{children:a.jsx(i.default,{href:"/",className:"text-muted-foreground hover:text-foreground transition-colors",children:"მთავარი"})}),a.jsx("li",{children:a.jsx(i.default,{href:"/blog",className:"text-muted-foreground hover:text-foreground transition-colors",children:"ბლოგი"})}),a.jsx("li",{children:a.jsx(i.default,{href:"/videos",className:"text-muted-foreground hover:text-foreground transition-colors",children:"ვიდეოები"})}),a.jsx("li",{children:a.jsx(i.default,{href:"/tools",className:"text-muted-foreground hover:text-foreground transition-colors",children:"ინსტრუმენტები"})}),a.jsx("li",{children:a.jsx(i.default,{href:"/about",className:"text-muted-foreground hover:text-foreground transition-colors",children:"ჩემ შესახებ"})})]})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[a.jsx("h4",{className:"text-sm font-semibold",children:"კატეგორიები"}),a.jsx("ul",{className:"space-y-3 text-sm",children:O.U.categories.slice(0,5).map(e=>a.jsx("li",{children:(0,a.jsxs)(i.default,{href:`/blog?category=${e.id}`,className:"text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2",children:[a.jsx("span",{className:"w-2 h-2 rounded-full",style:{backgroundColor:e.color}}),e.name]})},e.id))})]}),(0,a.jsxs)("div",{className:"space-y-4",children:[a.jsx("h4",{className:"text-sm font-semibold",children:"კონტაქტი"}),(0,a.jsxs)("ul",{className:"space-y-3 text-sm text-muted-foreground",children:[(0,a.jsxs)("li",{className:"flex items-center gap-2",children:[a.jsx(c.QOK,{className:"w-4 h-4"}),(0,a.jsxs)("div",{className:"flex flex-col",children:[a.jsx("span",{children:"andrewaltair@icloud.com"}),a.jsx("span",{children:"andr3waltair@gmail.com"})]})]}),(0,a.jsxs)("li",{className:"flex items-center gap-2",children:[a.jsx(c.Oe$,{className:"w-4 h-4"}),a.jsx(i.default,{href:O.U.social.telegram,className:"hover:text-foreground transition-colors",children:"@andr3waltairchannel"})]}),(0,a.jsxs)("li",{className:"flex items-center gap-2",children:[a.jsx(c.YRG,{className:"w-4 h-4"}),a.jsx(i.default,{href:O.U.social.youtube,className:"hover:text-foreground transition-colors",children:"YouTube არხი"})]})]})]})]}),(0,a.jsxs)("div",{className:"mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground",children:[(0,a.jsxs)("p",{children:["\xa9 ",e," Andrew Altair. ყველა უფლება დაცულია."]}),(0,a.jsxs)("div",{className:"flex gap-6",children:[a.jsx(i.default,{href:"/privacy",className:"hover:text-foreground transition-colors",children:"კონფიდენციალურობა"}),a.jsx(i.default,{href:"/terms",className:"hover:text-foreground transition-colors",children:"პირობები"})]})]})]})})})}var W=r(30817),Y=r(93158),K=r(5439),q=r(41190);let J=[{id:"andria",name:"ანდრია",icon:"✨",description:"ზოგადი AI ასისტენტი",color:"from-blue-500 to-cyan-500"},{id:"chatgpt",name:"ChatGPT ექსპერტი",icon:"\uD83E\uDD16",description:"ChatGPT-ს გამოყენების სპეციალისტი",color:"from-green-500 to-emerald-500"},{id:"midjourney",name:"Midjourney სპეციალისტი",icon:"\uD83C\uDFA8",description:"AI არტის და გენერაციის ექსპერტი",color:"from-purple-500 to-pink-500"},{id:"programmer",name:"AI პროგრამისტი",icon:"\uD83D\uDCBB",description:"კოდირებისა და დეველოპმენტი",color:"from-orange-500 to-amber-500"},{id:"business",name:"ბიზნეს კონსულტანტი",icon:"\uD83D\uDCBC",description:"AI ბიზნესში გამოყენების რჩევები",color:"from-indigo-500 to-blue-500"}];function X(){let[e,t]=(0,o.useState)(!1),[r,s]=(0,o.useState)(!1),[i,l]=(0,o.useState)([]),[d,u]=(0,o.useState)(""),[p,x]=(0,o.useState)(!1),[h,g]=(0,o.useState)(J[0]),[f,b]=(0,o.useState)(!1),v=(0,o.useRef)(null),y=(0,o.useRef)(null),w=e=>{if(g(e),b(!1),i.length>0){let t={id:Date.now().toString(),role:"assistant",content:`${e.icon} ახლა ვარ თქვენი ${e.name}! ${e.description}-ში დაგეხმარებით.`,timestamp:new Date};l(e=>[...e,t])}},j=async e=>{if(e.preventDefault(),!d.trim()||p)return;let t=[...i,{id:Date.now().toString(),role:"user",content:d,timestamp:new Date}];l(t),u(""),x(!0);try{let e=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:d,role:h.id,history:t.map(e=>({role:e.role,content:e.content}))})}),r=await e.json();if(!e.ok)throw Error(r.error||"API error");let a={id:(Date.now()+1).toString(),role:"assistant",content:r.response,timestamp:new Date};l(e=>[...e,a])}catch(t){console.error("Chat error:",t);let e={id:(Date.now()+1).toString(),role:"assistant",content:"ბოდიში, დროებით ვერ ვპასუხობ. გთხოვთ სცადოთ თავიდან! \uD83D\uDE4F",timestamp:new Date};l(t=>[...t,e])}finally{x(!1)}};return e?r?(0,a.jsxs)(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 bg-black/50 backdrop-blur-sm z-50",onClick:()=>s(!1)}),(0,a.jsxs)("div",{className:"fixed inset-4 md:inset-8 lg:inset-16 z-50 bg-card rounded-2xl shadow-2xl border overflow-hidden flex flex-col",children:[(0,a.jsxs)("div",{className:`flex items-center justify-between bg-gradient-to-r ${h.color} p-4 text-white`,children:[(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsxs)("div",{className:"relative",children:[a.jsx("span",{className:"absolute -top-1 -left-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white/50",children:a.jsx("span",{className:"absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"})}),a.jsx("div",{className:"h-10 w-10 rounded-full bg-white/20 flex items-center justify-center",children:a.jsx("span",{className:"text-xl",children:h.icon})})]}),(0,a.jsxs)("div",{children:[a.jsx("h3",{className:"font-bold",children:h.name}),(0,a.jsxs)("p",{className:"text-xs text-white/80",children:[h.description," • ონლაინ"]})]})]}),(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:()=>s(!1),className:"p-2 rounded-full hover:bg-white/20 transition-colors",title:"შემცირება",children:a.jsx(c.aTz,{className:"h-5 w-5"})}),a.jsx("button",{onClick:()=>{t(!1),s(!1)},className:"p-2 rounded-full hover:bg-white/20 transition-colors",title:"დახურვა",children:a.jsx(c.lhV,{className:"h-5 w-5"})})]})]}),(0,a.jsxs)("div",{className:"p-3 border-b bg-muted/30 relative",ref:y,children:[(0,a.jsxs)("button",{onClick:()=>b(!f),className:(0,m.cn)("w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full","bg-gradient-to-r from-blue-500 to-cyan-500 text-white","hover:from-blue-600 hover:to-cyan-600 transition-all","shadow-md hover:shadow-lg font-medium text-sm"),children:[a.jsx(c.bAs,{className:"h-4 w-4"}),a.jsx("span",{children:"აირჩიე AI ასისტენტი"}),a.jsx(c.YRR,{className:(0,m.cn)("h-4 w-4 transition-transform",f&&"rotate-180")})]}),f&&(0,a.jsxs)("div",{className:"absolute left-3 right-3 top-full mt-1 bg-card rounded-xl shadow-xl border overflow-hidden z-50",children:[a.jsx("div",{className:"p-2 border-b bg-muted/50",children:a.jsx("p",{className:"text-xs font-medium text-muted-foreground px-2",children:"აირჩიეთ ასისტენტის როლი"})}),a.jsx("div",{className:"p-1 max-h-64 overflow-y-auto",children:J.map(e=>(0,a.jsxs)("button",{onClick:()=>w(e),className:(0,m.cn)("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",h.id===e.id?"bg-primary/10 text-primary":"hover:bg-muted text-foreground"),children:[a.jsx("span",{className:"text-xl",children:e.icon}),(0,a.jsxs)("div",{className:"flex-1",children:[a.jsx("span",{className:"text-sm font-medium block",children:e.name}),a.jsx("span",{className:"text-xs text-muted-foreground",children:e.description})]}),h.id===e.id&&a.jsx(c.e6w,{className:"h-4 w-4 text-primary"})]},e.id))})]})]}),(0,a.jsxs)("div",{className:"flex-1 overflow-auto p-6 space-y-4",children:[i.map(e=>a.jsx("div",{className:(0,m.cn)("flex","user"===e.role?"justify-end":"justify-start"),children:a.jsx("div",{className:(0,m.cn)("max-w-[70%] rounded-2xl px-5 py-3","user"===e.role?"bg-primary text-primary-foreground rounded-br-sm":"bg-secondary rounded-bl-sm"),children:a.jsx("p",{className:"text-base",children:e.content})})},e.id)),p&&a.jsx("div",{className:"flex justify-start",children:a.jsx("div",{className:"bg-secondary rounded-2xl rounded-bl-sm px-5 py-3",children:(0,a.jsxs)("div",{className:"flex gap-1.5",children:[a.jsx("span",{className:"h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce"}),a.jsx("span",{className:"h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce delay-100"}),a.jsx("span",{className:"h-2.5 w-2.5 bg-muted-foreground rounded-full animate-bounce delay-200"})]})})}),a.jsx("div",{ref:v})]}),a.jsx("form",{onSubmit:j,className:"p-4 border-t bg-background",children:(0,a.jsxs)("div",{className:"flex gap-3 max-w-4xl mx-auto",children:[a.jsx(q.I,{value:d,onChange:e=>u(e.target.value),placeholder:`დაწერე შეკითხვა ${h.name}-ს...`,className:"flex-1 h-12 text-base"}),a.jsx(n.z,{type:"submit",size:"lg",disabled:!d.trim(),className:"h-12 px-6",children:a.jsx(c.Oe$,{className:"h-5 w-5"})})]})})]})]}):(0,a.jsxs)("div",{className:"fixed bottom-4 right-4 z-50 w-96 h-[500px] max-h-[80vh] bg-card rounded-2xl shadow-2xl border overflow-hidden flex flex-col",children:[(0,a.jsxs)("div",{className:`flex items-center justify-between bg-gradient-to-r ${h.color} p-3 text-white`,children:[(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[(0,a.jsxs)("div",{className:"relative",children:[a.jsx("span",{className:"absolute -top-0.5 -left-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border border-white/50",children:a.jsx("span",{className:"absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"})}),a.jsx("div",{className:"h-8 w-8 rounded-full bg-white/20 flex items-center justify-center",children:a.jsx("span",{className:"text-lg",children:h.icon})})]}),(0,a.jsxs)("div",{children:[a.jsx("h3",{className:"font-bold text-sm",children:h.name}),a.jsx("p",{className:"text-xs text-white/80",children:"ონლაინ"})]})]}),(0,a.jsxs)("div",{className:"flex gap-1",children:[a.jsx("button",{onClick:()=>s(!0),className:"p-1.5 rounded-full hover:bg-white/20 transition-colors",title:"გაზრდა",children:a.jsx(c.aVA,{className:"h-4 w-4"})}),a.jsx("button",{onClick:()=>t(!1),className:"p-1.5 rounded-full hover:bg-white/20 transition-colors",title:"დახურვა",children:a.jsx(c.lhV,{className:"h-4 w-4"})})]})]}),(0,a.jsxs)("div",{className:"p-2 border-b bg-muted/30 relative",ref:y,children:[(0,a.jsxs)("button",{onClick:()=>b(!f),className:(0,m.cn)("w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full","bg-gradient-to-r from-blue-500 to-cyan-500 text-white","hover:from-blue-600 hover:to-cyan-600 transition-all","shadow-md hover:shadow-lg font-medium text-sm"),children:[a.jsx(c.bAs,{className:"h-4 w-4"}),a.jsx("span",{children:"აირჩიე AI ასისტენტი"}),a.jsx(c.YRR,{className:(0,m.cn)("h-4 w-4 transition-transform",f&&"rotate-180")})]}),f&&(0,a.jsxs)("div",{className:"absolute left-2 right-2 top-full mt-1 bg-card rounded-xl shadow-xl border overflow-hidden z-50",children:[a.jsx("div",{className:"p-2 border-b bg-muted/50",children:a.jsx("p",{className:"text-xs font-medium text-muted-foreground px-2",children:"აირჩიეთ ასისტენტის როლი"})}),a.jsx("div",{className:"p-1 max-h-48 overflow-y-auto",children:J.map(e=>(0,a.jsxs)("button",{onClick:()=>w(e),className:(0,m.cn)("w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",h.id===e.id?"bg-primary/10 text-primary":"hover:bg-muted text-foreground"),children:[a.jsx("span",{className:"text-lg",children:e.icon}),(0,a.jsxs)("div",{className:"flex-1",children:[a.jsx("span",{className:"text-sm font-medium block",children:e.name}),a.jsx("span",{className:"text-xs text-muted-foreground",children:e.description})]}),h.id===e.id&&a.jsx(c.e6w,{className:"h-4 w-4 text-primary"})]},e.id))})]})]}),(0,a.jsxs)("div",{className:"flex-1 overflow-auto p-4 space-y-3",children:[i.map(e=>a.jsx("div",{className:(0,m.cn)("flex","user"===e.role?"justify-end":"justify-start"),children:a.jsx("div",{className:(0,m.cn)("max-w-[85%] rounded-2xl px-4 py-2","user"===e.role?"bg-primary text-primary-foreground rounded-br-sm":"bg-secondary rounded-bl-sm"),children:a.jsx("p",{className:"text-sm",children:e.content})})},e.id)),p&&a.jsx("div",{className:"flex justify-start",children:a.jsx("div",{className:"bg-secondary rounded-2xl rounded-bl-sm px-4 py-2",children:(0,a.jsxs)("div",{className:"flex gap-1",children:[a.jsx("span",{className:"h-2 w-2 bg-muted-foreground rounded-full animate-bounce"}),a.jsx("span",{className:"h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-100"}),a.jsx("span",{className:"h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-200"})]})})}),a.jsx("div",{ref:v})]}),a.jsx("form",{onSubmit:j,className:"p-3 border-t",children:(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx(q.I,{value:d,onChange:e=>u(e.target.value),placeholder:`დაწერე შეკითხვა ${h.name}-ს...`,className:"flex-1"}),a.jsx(n.z,{type:"submit",size:"icon",disabled:!d.trim(),children:a.jsx(c.Oe$,{className:"h-4 w-4"})})]})})]}):(0,a.jsxs)("button",{onClick:()=>t(!0),className:"fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center group",children:[a.jsx(c.bAs,{className:"h-6 w-6"}),a.jsx("span",{className:"absolute top-0 left-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm",children:a.jsx("span",{className:"absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"})})]})}function Q(){let[e,t]=(0,o.useState)(0);return a.jsx("div",{className:"fixed top-0 left-0 right-0 z-50 h-1 bg-transparent",children:a.jsx("div",{className:"h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-150 ease-out",style:{width:`${e}%`}})})}function Z(){let[e,t]=(0,o.useState)(!1);return e?a.jsx("button",{onClick:()=>{window.scrollTo({top:0,behavior:"smooth"})},className:"fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl","aria-label":"Back to top",children:a.jsx("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M5 10l7-7m0 0l7 7m-7-7v18"})})}):null}var ee=r(16197);function et({children:e}){let t=(0,s.usePathname)();return t?.startsWith("/admin")?a.jsx(a.Fragment,{children:e}):"/mystic"===t?(0,a.jsxs)("div",{className:"dark bg-[#0a0a12] min-h-screen",children:[a.jsx("header",{className:"fixed top-0 left-0 right-0 z-50 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/5",children:a.jsx("div",{className:"container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",children:(0,a.jsxs)("div",{className:"flex h-14 sm:h-16 items-center justify-between",children:[(0,a.jsxs)("a",{href:"/",className:"flex items-center gap-2 sm:gap-3 group",children:[a.jsx("div",{className:"w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center",children:a.jsx("span",{className:"text-white text-sm sm:text-base",children:"✨"})}),a.jsx("span",{className:"font-bold text-base sm:text-lg text-white hidden sm:block",children:"Andrew Altair"})]}),(0,a.jsxs)("a",{href:"/",className:"text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5",children:[a.jsx("span",{children:"მთავარი გვერდი"}),a.jsx("span",{children:"→"})]})]})})}),a.jsx("main",{className:"pt-14 sm:pt-16",children:e}),a.jsx("footer",{className:"border-t border-white/5 bg-[#0a0a12] py-6 sm:py-8",children:a.jsx("div",{className:"container mx-auto px-4 text-center",children:a.jsx("p",{className:"text-xs sm:text-sm text-gray-600",children:"\xa9 2024 Andrew Altair • მისტიკური AI სამყარო"})})}),a.jsx(X,{})]}):(0,a.jsxs)(a.Fragment,{children:[a.jsx(Q,{}),a.jsx(Z,{}),a.jsx(W.ld,{}),a.jsx(H,{}),a.jsx("main",{className:"min-h-screen",children:e}),a.jsx($,{}),a.jsx(Y.a,{enabled:!0}),a.jsx(K.s,{variant:"floating"}),a.jsx(X,{}),a.jsx(ee.ActivityFeed,{})]})}r(64446),r(52489),r(93452)},64860:(e,t,r)=>{"use strict";r.d(t,{CookieBanner:()=>l});var a=r(10326),s=r(17577),i=r(91664),n=r(72062),o=r(90434);function l(){let[e,t]=(0,s.useState)(null),[r,l]=(0,s.useState)(!1);return e||!r?null:a.jsx("div",{className:"fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-500",children:a.jsx("div",{className:"container max-w-4xl mx-auto",children:a.jsx("div",{className:"bg-card border border-border rounded-2xl shadow-2xl p-6 backdrop-blur-xl",children:(0,a.jsxs)("div",{className:"flex flex-col sm:flex-row items-start sm:items-center gap-4",children:[a.jsx("div",{className:"hidden sm:flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center flex-shrink-0",children:a.jsx(n.v9L,{className:"w-6 h-6 text-primary"})}),(0,a.jsxs)("div",{className:"flex-1 space-y-2",children:[(0,a.jsxs)("div",{className:"flex items-center gap-2",children:[a.jsx(n.v9L,{className:"w-5 h-5 text-primary sm:hidden"}),a.jsx("h3",{className:"font-semibold text-foreground",children:"Cookies-ის გამოყენება"})]}),(0,a.jsxs)("p",{className:"text-sm text-muted-foreground",children:['ჩვენ ვიყენებთ cookies-ს საიტის გამოცდილების გასაუმჯობესებლად და ანალიტიკისთვის. აირჩიეთ "მიღება" Google Analytics-ის ჩასართავად, ან "უარყოფა" მხოლოდ აუცილებელი cookies-ით სარგებლობისთვის.'," ",(0,a.jsxs)(o.default,{href:"/privacy",className:"text-primary hover:underline inline-flex items-center gap-1",children:[a.jsx(n.sDK,{className:"w-3 h-3"}),"მეტი ინფორმაცია"]})]})]}),(0,a.jsxs)("div",{className:"flex items-center gap-2 w-full sm:w-auto",children:[a.jsx(i.z,{variant:"outline",size:"sm",onClick:()=>{localStorage.setItem("cookie_consent","declined"),t("declined"),l(!1)},className:"flex-1 sm:flex-none",children:"უარყოფა"}),a.jsx(i.z,{size:"sm",onClick:()=>{localStorage.setItem("cookie_consent","accepted"),t("accepted"),l(!1),window.location.reload()},className:"flex-1 sm:flex-none bg-gradient-to-r from-primary to-accent text-white border-0",children:"მიღება"}),a.jsx(i.z,{variant:"ghost",size:"icon",onClick:()=>{l(!1)},className:"hidden sm:flex text-muted-foreground hover:text-foreground",children:a.jsx(n.lhV,{className:"w-4 h-4"})})]})]})})})})}},38443:(e,t,r)=>{"use strict";r.d(t,{C:()=>l});var a=r(10326);r(17577);var s=r(34214),i=r(79360),n=r(51223);let o=(0,i.j)("inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",secondary:"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",destructive:"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"}},defaultVariants:{variant:"default"}});function l({className:e,variant:t,asChild:r=!1,...i}){let l=r?s.g7:"span";return a.jsx(l,{"data-slot":"badge",className:(0,n.cn)(o({variant:t}),e),...i})}},91664:(e,t,r)=>{"use strict";r.d(t,{z:()=>l});var a=r(10326);r(17577);var s=r(34214),i=r(79360),n=r(51223);let o=(0,i.j)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",{variants:{variant:{default:"bg-primary text-primary-foreground hover:bg-primary/90",destructive:"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",outline:"border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",secondary:"bg-secondary text-secondary-foreground hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2 has-[>svg]:px-3",sm:"h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",lg:"h-10 rounded-md px-6 has-[>svg]:px-4",icon:"size-9","icon-sm":"size-8","icon-lg":"size-10"}},defaultVariants:{variant:"default",size:"default"}});function l({className:e,variant:t="default",size:r="default",asChild:i=!1,...l}){let d=i?s.g7:"button";return a.jsx(d,{"data-slot":"button","data-variant":t,"data-size":r,className:(0,n.cn)(o({variant:t,size:r,className:e})),...l})}},29752:(e,t,r)=>{"use strict";r.d(t,{Ol:()=>n,SZ:()=>l,Zb:()=>i,aY:()=>d,eW:()=>c,ll:()=>o});var a=r(10326);r(17577);var s=r(51223);function i({className:e,...t}){return a.jsx("div",{"data-slot":"card",className:(0,s.cn)("bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm overflow-hidden",e),...t})}function n({className:e,...t}){return a.jsx("div",{"data-slot":"card-header",className:(0,s.cn)("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",e),...t})}function o({className:e,...t}){return a.jsx("div",{"data-slot":"card-title",className:(0,s.cn)("leading-none font-semibold",e),...t})}function l({className:e,...t}){return a.jsx("div",{"data-slot":"card-description",className:(0,s.cn)("text-muted-foreground text-sm",e),...t})}function d({className:e,...t}){return a.jsx("div",{"data-slot":"card-content",className:(0,s.cn)("px-6 pb-6",e),...t})}function c({className:e,...t}){return a.jsx("div",{"data-slot":"card-footer",className:(0,s.cn)("flex items-center px-6 [.border-t]:pt-6",e),...t})}},93327:(e,t,r)=>{"use strict";r.d(t,{ConfirmDialogProvider:()=>c,N:()=>m});var a=r(10326),s=r(17577),i=r(60962),n=r(91664),o=r(29752),l=r(72062);let d=s.createContext(void 0);function c({children:e}){let[t,r]=s.useState(!1),[c,m]=s.useState({isOpen:!1,title:"",message:"",confirmText:"დადასტურება",cancelText:"გაუქმება",variant:"default",onConfirm:()=>{},onCancel:()=>{}});s.useEffect(()=>{r(!0)},[]);let u=s.useCallback(e=>new Promise(t=>{m({isOpen:!0,title:e.title,message:e.message,confirmText:e.confirmText||"დადასტურება",cancelText:e.cancelText||"გაუქმება",variant:e.variant||"default",onConfirm:()=>{m(e=>({...e,isOpen:!1})),t(!0)},onCancel:()=>{m(e=>({...e,isOpen:!1})),t(!1)}})}),[]),p={danger:{icon:a.jsx(l.EF5,{className:"w-6 h-6 text-red-500"}),iconBg:"bg-red-500/10",confirmBtn:"bg-red-500 hover:bg-red-600 text-white"},warning:{icon:a.jsx(l.bS7,{className:"w-6 h-6 text-yellow-500"}),iconBg:"bg-yellow-500/10",confirmBtn:"bg-yellow-500 hover:bg-yellow-600 text-white"},default:{icon:a.jsx(l.bS7,{className:"w-6 h-6 text-primary"}),iconBg:"bg-primary/10",confirmBtn:"bg-primary hover:bg-primary/90 text-white"}}[c.variant],x=c.isOpen&&t&&(0,i.createPortal)((0,a.jsxs)(a.Fragment,{children:[a.jsx("div",{className:"fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm animate-in fade-in-0",onClick:c.onCancel}),a.jsx("div",{className:"fixed inset-0 z-[10000] flex items-center justify-center p-4",children:(0,a.jsxs)(o.Zb,{className:"w-full max-w-md shadow-2xl border-2 animate-in zoom-in-95 fade-in-0 duration-200",children:[(0,a.jsxs)(o.Ol,{className:"relative pb-2",children:[a.jsx("button",{onClick:c.onCancel,className:"absolute top-4 right-4 p-1 rounded-md hover:bg-secondary transition-colors",children:a.jsx(l.lhV,{className:"w-4 h-4 text-muted-foreground"})}),(0,a.jsxs)("div",{className:"flex items-center gap-4",children:[a.jsx("div",{className:`w-12 h-12 rounded-full ${p.iconBg} flex items-center justify-center`,children:p.icon}),a.jsx("div",{children:a.jsx("h3",{className:"text-lg font-bold",children:c.title})})]})]}),a.jsx(o.aY,{className:"pt-2",children:a.jsx("p",{className:"text-muted-foreground",children:c.message})}),(0,a.jsxs)(o.eW,{className:"flex gap-3 pt-4 pb-6",children:[a.jsx(n.z,{variant:"outline",className:"flex-1",onClick:c.onCancel,children:c.cancelText}),a.jsx(n.z,{className:`flex-1 ${p.confirmBtn}`,onClick:c.onConfirm,children:c.confirmText})]})]})})]}),document.body);return(0,a.jsxs)(d.Provider,{value:{confirm:u},children:[e,x]})}function m(){let e=s.useContext(d);if(void 0===e)throw Error("useConfirm must be used within a ConfirmDialogProvider");return e.confirm}},41190:(e,t,r)=>{"use strict";r.d(t,{I:()=>i});var a=r(10326);r(17577);var s=r(51223);function i({className:e,type:t,...r}){return a.jsx("input",{type:t,"data-slot":"input",className:(0,s.cn)("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm","focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]","aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",e),...r})}},75367:(e,t,r)=>{"use strict";r.d(t,{ToastProvider:()=>l,p:()=>d});var a=r(10326),s=r(17577),i=r(72062);function n({id:e,type:t,title:r,message:s,onClose:n}){let o={success:a.jsx(i.XDv,{className:"w-5 h-5 text-green-500"}),error:a.jsx(i.HtX,{className:"w-5 h-5 text-red-500"}),info:a.jsx(i.GCM,{className:"w-5 h-5 text-blue-500"}),warning:a.jsx(i.bS7,{className:"w-5 h-5 text-yellow-500"})};return(0,a.jsxs)("div",{className:`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm shadow-lg animate-in slide-in-from-right-5 ${{success:"bg-green-500/10 border-green-500/20",error:"bg-red-500/10 border-red-500/20",info:"bg-blue-500/10 border-blue-500/20",warning:"bg-yellow-500/10 border-yellow-500/20"}[t]}`,children:[o[t],(0,a.jsxs)("div",{className:"flex-1",children:[a.jsx("p",{className:"font-medium text-foreground",children:r}),s&&a.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:s})]}),a.jsx("button",{onClick:()=>n(e),className:"p-1 rounded-md hover:bg-secondary transition-colors",children:a.jsx(i.lhV,{className:"w-4 h-4 text-muted-foreground"})})]})}let o=s.createContext(void 0);function l({children:e}){let[t,r]=s.useState([]),i=s.useCallback(e=>{let t=Math.random().toString(36).substring(7),a={...e,id:t};r(e=>[...e,a]),setTimeout(()=>{r(e=>e.filter(e=>e.id!==t))},e.duration||5e3)},[]),l=s.useCallback(e=>{r(t=>t.filter(t=>t.id!==e))},[]),d=s.useCallback((e,t)=>{i({type:"success",title:e,message:t})},[i]),c=s.useCallback((e,t)=>{i({type:"error",title:e,message:t})},[i]),m=s.useCallback((e,t)=>{i({type:"info",title:e,message:t})},[i]),u=s.useCallback((e,t)=>{i({type:"warning",title:e,message:t})},[i]);return(0,a.jsxs)(o.Provider,{value:{toasts:t,addToast:i,removeToast:l,success:d,error:c,info:m,warning:u},children:[e,a.jsx("div",{className:"fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md",children:t.map(e=>a.jsx(n,{...e,onClose:l},e.id))})]})}function d(){let e=s.useContext(o);if(void 0===e)throw Error("useToast must be used within a ToastProvider");return e}},6559:(e,t,r)=>{"use strict";r.d(t,{AuthProvider:()=>o,a:()=>l,m:()=>i});var a=r(10326),s=r(17577);let i={god:{label:"ღმერთი",color:"from-yellow-500 to-orange-500",icon:"\uD83D\uDC51"},admin:{label:"ადმინი",color:"from-red-500 to-pink-500",icon:"\uD83D\uDEE1️"},editor:{label:"ედიტორი",color:"from-blue-500 to-cyan-500",icon:"✏️"},viewer:{label:"მნახველი",color:"from-gray-500 to-gray-600",icon:"\uD83D\uDC41️"}},n=s.createContext(void 0);function o({children:e}){let[t,r]=s.useState(null),[i,o]=s.useState(null),[l,d]=s.useState(!0);s.useEffect(()=>{(async()=>{let e=localStorage.getItem("auth_token"),t=localStorage.getItem("auth_user");if(e&&t)try{let t=await fetch("/api/auth/me",{headers:{Authorization:`Bearer ${e}`}});if(t.ok){let a=await t.json();r(a.user),o(e)}else localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user")}catch{try{r(JSON.parse(t)),o(e)}catch{localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user")}}d(!1)})()},[]);let c=async(e,t)=>{try{let a=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})}),s=await a.json();if(!a.ok)return{success:!1,error:s.error||"შესვლა ვერ მოხერხდა"};return r(s.user),o(s.token),localStorage.setItem("auth_token",s.token),localStorage.setItem("auth_user",JSON.stringify(s.user)),{success:!0}}catch{return{success:!1,error:"სერვერთან დაკავშირება ვერ მოხერხდა"}}},m=async e=>{try{let t=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),a=await t.json();if(!t.ok)return{success:!1,error:a.error||"რეგისტრაცია ვერ მოხერხდა"};return r(a.user),o(a.token),localStorage.setItem("auth_token",a.token),localStorage.setItem("auth_user",JSON.stringify(a.user)),{success:!0}}catch{return{success:!1,error:"სერვერთან დაკავშირება ვერ მოხერხდა"}}},u=t?.role==="god",p=t?.role==="god"||t?.role==="admin",x=t?.role==="god"||t?.role==="admin"||t?.role==="editor";return a.jsx(n.Provider,{value:{user:t,isLoading:l,login:c,register:m,logout:()=>{r(null),o(null),localStorage.removeItem("auth_token"),localStorage.removeItem("auth_user")},isGod:u,isAdmin:p,canEdit:x,token:i},children:e})}function l(){let e=s.useContext(n);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},28365:(e,t,r)=>{"use strict";r.d(t,{U:()=>a});let a={name:"Andrew Altair",tagline:"AI ინოვატორი და კონტენტ კრეატორი",domain:"andrewaltair.ge",email:"andrewaltair@icloud.com",logo:"/logo.png",stats:{yearsExperience:"8+",subscribers:"50K+",articles:"200+",projects:"30+"},colors:{primary:{50:"#f0f4ff",100:"#e0e7ff",200:"#c4cdff",300:"#a2afff",400:"#7c85ff",500:"#6366f1",600:"#5046e5",700:"#4338ca",800:"#3730a3",900:"#312e81"},accent:{50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63"},success:"#10b981",warning:"#f59e0b",error:"#f43f5e",dark:{bg:"#0a0a0f",card:"#12121a",border:"#1e1e2e",text:"#e4e4e7",muted:"#71717a"},light:{bg:"#fafafa",card:"#ffffff",border:"#e4e4e7",text:"#18181b",muted:"#71717a"}},fonts:{georgian:"'Noto Sans Georgian', 'BPG Nino Mtavruli', sans-serif",display:"'Inter', 'SF Pro Display', system-ui, sans-serif",mono:"'JetBrains Mono', 'Fira Code', monospace"},reactions:[{emoji:"\uD83D\uDD25",label:"Fire",key:"fire"},{emoji:"❤️",label:"Love",key:"love"},{emoji:"\uD83E\uDD2F",label:"Mind Blown",key:"mindblown"},{emoji:"\uD83D\uDC4F",label:"Applause",key:"applause"},{emoji:"\uD83D\uDCA1",label:"Insightful",key:"insightful"}],social:{youtube:"https://www.youtube.com/@AndrewAltair",instagram:"https://www.instagram.com/andr3waltair/",facebook:"https://www.facebook.com/andr3waltair",tiktok:"https://www.tiktok.com/@andrewaltair",telegram:"https://t.me/andr3waltairchannel",linkedin:"https://www.linkedin.com/in/andrewaltair",twitter:"https://x.com/andr3waltair",github:"https://github.com/andrewaltair"},categories:[{id:"ai-tips",name:"AI ხრიკები",icon:"Lightbulb",color:"#f59e0b"},{id:"tutorials",name:"ტუტორიალები",icon:"BookOpen",color:"#10b981"},{id:"news",name:"სიახლეები",icon:"Newspaper",color:"#6366f1"},{id:"tools",name:"ინსტრუმენტები",icon:"Wrench",color:"#ec4899"},{id:"reviews",name:"მიმოხილვები",icon:"Star",color:"#f97316"},{id:"opinion",name:"მოსაზრებები",icon:"MessageCircle",color:"#8b5cf6"}],animations:{spring:{type:"spring",stiffness:300,damping:30},smooth:{duration:.3,ease:[.4,0,.2,1]},bounce:{type:"spring",stiffness:400,damping:10}}}},51223:(e,t,r)=>{"use strict";r.d(t,{cn:()=>i});var a=r(41135),s=r(31009);function i(...e){return(0,s.m6)((0,a.W)(e))}},63829:(e,t,r)=>{"use strict";r.r(t),r.d(t,{handleSmartSearch:()=>u});var a=r(27745);r(26461);var s=r(74739),i=r(53973),n=r(71854),o=r(33838),l=r(59589),d=r(85723);let c=new Map;async function m(){let e=await (0,i.headers)(),t=e.get("x-forwarded-for")?.split(",")[0]||e.get("x-real-ip")||"unknown",r=Date.now(),a=c.get(t);if(c.size>1e4)for(let[e,t]of c.entries())r>t.resetTime&&c.delete(e);return!a||r>a.resetTime?(c.set(t,{count:1,resetTime:r+6e4}),{allowed:!0,remaining:19}):a.count>=20?{allowed:!1,remaining:0}:(a.count++,c.set(t,a),{allowed:!0,remaining:20-a.count})}async function u(e){let t=e.get("query")?.toString().trim();if(t){if(!(await m()).allowed)throw Error("ძალიან ბევრი მოთხოვნა. სცადეთ 1 წუთში.");if(/^#?\d{6}$/.test(t)){let e=t.replace("#",""),r=await p(e);r&&(0,s.redirect)(r)}(0,s.redirect)(`/blog?search=${encodeURIComponent(t)}`)}}async function p(e){try{await (0,n.default)();let t=await o.default.findOne({$or:[{numericId:e},{slug:e},{tags:e},{tags:`#${e}`}]}).select("slug").lean();if(t)return`/blog/${t.slug}`}catch(e){console.error("Error searching posts by ID:",e)}for(let t of l.VIBE_CODING_DATA.categories)for(let r of t.articles)if(r.id===e||r.id.endsWith(`-${e}`))return`/encyclopedia/vibe-coding/${r.id}`;return null}(0,d.ensureServerEntryExports)([u]),(0,a.registerServerReference)("8023c703370fb3339a4881b4271a69f68e34381f",u)},7629:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>n,__esModule:()=>i,default:()=>o});var a=r(68570);let s=(0,a.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\app\error.tsx`),{__esModule:i,$$typeof:n}=s;s.default;let o=(0,a.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\app\error.tsx#default`)},55774:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>F,metadata:()=>M});var a=r(19510),s=r(77852),i=r.n(s),n=r(45607),o=r.n(n),l=r(15334),d=r.n(l);r(5023);var c=r(68570);let m=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\layout\LayoutWrapper.tsx`),{__esModule:u,$$typeof:p}=m;m.default;let x=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\layout\LayoutWrapper.tsx#LayoutWrapper`),h=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\lib\auth.tsx`),{__esModule:g,$$typeof:f}=h;h.default,(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\lib\auth.tsx#ROLE_CONFIG`);let b=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\lib\auth.tsx#AuthProvider`);(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\lib\auth.tsx#useAuth`);let v=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\toast.tsx`),{__esModule:y,$$typeof:w}=v;v.default;let j=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\toast.tsx#ToastProvider`);(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\toast.tsx#useToast`);let N=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\confirm-dialog.tsx`),{__esModule:C,$$typeof:S}=N;N.default;let A=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\confirm-dialog.tsx#ConfirmDialogProvider`);(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\confirm-dialog.tsx#useConfirm`);let I=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\analytics\GoogleAnalytics.tsx`),{__esModule:k,$$typeof:P}=I;I.default;let D=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\analytics\GoogleAnalytics.tsx#GoogleAnalytics`);(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\analytics\GoogleAnalytics.tsx#trackEvent`),(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\analytics\GoogleAnalytics.tsx#analytics`);let T=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\CookieBanner.tsx`),{__esModule:L,$$typeof:R}=T;T.default;let E=(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\CookieBanner.tsx#CookieBanner`);(0,c.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\ui\CookieBanner.tsx#useCookieConsent`);let M={title:"Andrew Altair | AI ინოვატორი და კონტენტ კრეატორი",description:"ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ სტატიები, ტუტორიალები, ვიდეოები და რჩევები. გაიგეთ მეტი ChatGPT-ს, მანქანური სწავლების და ტექნოლოგიების მომავლის შესახებ.",keywords:["AI Expert Georgia","Andrew Altair","Tech News Tbilisi","Artificial Intelligence Georgia","ხელოვნური ინტელექტი","ტექნოლოგიები","Vibe Coding","AI","ChatGPT","მანქანური სწავლება","ნეირონული ქსელები","საქართველო"],authors:[{name:"Andrew Altair"}],creator:"Andrew Altair",openGraph:{title:"Andrew Altair | AI ინოვატორი და კონტენტ კრეატორი",description:"ხელოვნური ინტელექტის ექსპერტი. AI-ს შესახებ სტატიები, ტუტორიალები და რჩევები.",type:"website",locale:"ka_GE",siteName:"Andrew Altair"},twitter:{card:"summary_large_image",creator:"@andrewaltair"},robots:{index:!0,follow:!0}},G={"@context":"https://schema.org","@type":"Person",name:"Andrew Altair",url:"https://andrewaltair.ge",jobTitle:"AI Expert & Tech Consultant",nationality:{"@type":"Country",name:"Georgia"},homeLocation:{"@type":"Place",name:"Tbilisi, Georgia"},areaServed:{"@type":"Country",name:"Georgia"},sameAs:["https://www.youtube.com/@AndrewAltair","https://www.instagram.com/andr3waltair/","https://www.tiktok.com/@andrewaltair","https://t.me/andr3waltairchannel","https://www.facebook.com/andr3waltair","https://www.threads.net/@andr3waltair","https://x.com/andr3waltair","https://www.linkedin.com/in/andrewaltair"],worksFor:{"@type":"Organization",name:"Andrew Altair AI",location:"Tbilisi, Georgia"}};function F({children:e}){return(0,a.jsxs)("html",{lang:"ka",suppressHydrationWarning:!0,children:[(0,a.jsxs)("head",{children:[a.jsx("script",{dangerouslySetInnerHTML:{__html:`
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                  // Light theme is default, no action needed
                } catch (e) {}
              })();
            `}}),a.jsx("script",{type:"application/ld+json",dangerouslySetInnerHTML:{__html:JSON.stringify(G)}})]}),(0,a.jsxs)("body",{className:`${i().variable} ${o().variable} ${d().variable} antialiased font-georgian`,suppressHydrationWarning:!0,children:[a.jsx(b,{children:a.jsx(j,{children:(0,a.jsxs)(A,{children:[a.jsx(x,{children:e}),a.jsx(E,{})]})})}),a.jsx(D,{GA_MEASUREMENT_ID:process.env.NEXT_PUBLIC_GA_ID||""})]})]})}},11930:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>i});var a=r(19510),s=r(69119);function i(){return a.jsx("div",{className:"min-h-screen flex items-center justify-center bg-background",children:(0,a.jsxs)("div",{className:"text-center space-y-4",children:[(0,a.jsxs)("div",{className:"relative inline-block",children:[a.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-xl opacity-50 animate-pulse"}),a.jsx("div",{className:"relative w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center animate-pulse",children:a.jsx(s.c_x,{className:"w-8 h-8 text-white"})})]}),(0,a.jsxs)("div",{className:"space-y-2",children:[a.jsx("p",{className:"text-lg font-medium text-foreground",children:"იტვირთება..."}),a.jsx("div",{className:"w-48 h-1 bg-secondary rounded-full overflow-hidden mx-auto",children:a.jsx("div",{className:"h-full bg-gradient-to-r from-primary to-accent rounded-full animate-loading-bar"})})]})]})})}},12523:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>n,__esModule:()=>i,default:()=>o});var a=r(68570);let s=(0,a.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\app\not-found.tsx`),{__esModule:i,$$typeof:n}=s;s.default;let o=(0,a.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\app\not-found.tsx#default`)},59589:(e,t,r)=>{"use strict";r.d(t,{VIBE_CODING_DATA:()=>a});let a={projectTitle:"Vibe Coding",language:"ka",telegramContact:"https://t.me/andr3waltairchannel",categories:[{id:"intro",title:"შესავალი",icon:"\uD83C\uDFAF",articles:[{id:"what-is-vibe-coding",title:"რა არის Vibe Coding?",isFree:!0,content:`# რა არის Vibe Coding?

**Vibe Coding** არის AI-ასისტირებული პროგრამული უზრუნველყოფის განვითარების ტექნიკა. ეს არის chatbot-ზე დაფუძნებული მიდგომა პროგრამული უზრუნველყოფის შესაქმნელად, სადაც დეველოპერი აღწერს პროექტს ან დავალებას დიდ ენობრივ მოდელს (LLM), რომელიც აგენერირებს კოდს პრომპტის საფუძველზე.

## 📜 ისტორია და აღიარება

### Andrej Karpathy და ტერმინის შექმნა

ტერმინი **"Vibe Coding"** შემოიტანა **Andrej Karpathy-მ** (OpenAI-ის თანადამფუძნებელი და Tesla-ს ყოფილი AI ლიდერი) **2025 წლის თებერვალში**. 

Karpathy-მ აღწერა ეს როგორც:
> "სრულად მიეცი vibes-ს, მიიღე exponentials და დაივიწყე რომ კოდი საერთოდ არსებობს."

### Collins Word of the Year 2025 🏆

**Vibe Coding** დასახელდა **Collins English Dictionary-ის წლის სიტყვად 2025 წელს** - უდიდესი აღიარება ამ ახალი მიდგომისთვის!

### Merriam-Webster აღიარება

2025 წლის მარტში ტერმინი დაემატა Merriam-Webster-ის ვებსაიტზე როგორც "slang & trending" სიტყვა.

---

## 🎯 ძირითადი კონცეფცია

### განსაზღვრება

Vibe Coding-ის **მთავარი მახასიათებელი** არის ის, რომ მომხმარებელი **იღებს AI-ს მიერ გენერირებულ კოდს მის სრულად გაგების გარეშე**.

პროგრამისტი **Simon Willison** განმარტავს:
> "თუ LLM-მა დაწერა თქვენი კოდის ყველა ხაზი, მაგრამ თქვენ გადახედეთ, გატესტეთ და გაიგეთ ყველაფერი - ეს არ არის vibe coding. ეს არის LLM-ის გამოყენება როგორც typing assistant."

### როლის ცვლილება

Vibe Coding-ში თქვენი როლი იცვლება:
- **ტრადიციული**: თქვენ წერთ კოდს ხაზ-ხაზ
- **Vibe Coding**: AI წერს კოდს, თქვენ **არ ამოწმებთ კოდს**, მხოლოდ ტესტავთ შედეგებს
- **AI-assisted (არა vibe)**: AI წერს, თქვენ ამოწმებთ და იგებთ კოდს

---

## 🔄 როგორ მუშაობს?

### დაბალი დონის სამუშაო პროცესი
1. **აღწერეთ მიზანი**: დაიწყეთ მაღალი დონის პრომპტით ბუნებრივ ენაზე
2. **AI აგენერირებს კოდს**: AI ასისტენტი ინტერპრეტაციას უკეთებს თქვენს მოთხოვნას
3. **შეასრულეთ და დააკვირდით**: გაუშვით გენერირებული კოდი
4. **უკუკავშირი და გაუმჯობესება**: თუ საჭიროა, მიაწოდეთ ახალი ინსტრუქციები
5. **გაიმეორეთ**: ციკლი გრძელდება სანამ კოდი სრულყოფილი არ გახდება

### აპლიკაციის სასიცოცხლო ციკლი
1. **იდეაცია**: აღწერეთ მთელი აპლიკაცია ერთ პრომპტში
2. **გენერაცია**: AI აგენერირებს საწყის ვერსიას
3. **იტერაციული გაუმჯობესება**: ტესტირება და ახალი ფუნქციების დამატება
4. **ვალიდაცია**: ექსპერტი ამოწმებს უსაფრთხოებას და ხარისხს
5. **განლაგება**: აპლიკაციის გაშვება სერვერზე

---

## 🆚 Vibe Coding vs ტრადიციული პროგრამირება

| მახასიათებელი | ტრადიციული | Vibe Coding |
|:---|:---|:---|
| კოდის შექმნა | ხელით, ხაზ-ხაზ | AI-ს მიერ, ბუნებრივი ენიდან |
| დეველოპერის როლი | არქიტექტორი, იმპლემენტატორი | პრომპტერი, გიდი, ტესტერი |
| საჭირო ექსპერტიზა | მაღალი (სინტაქსის ცოდნა) | დაბალი (ფუნქციონალის გაგება) |
| განვითარების სიჩქარე | ნელი, მეთოდური | სწრაფი, პროტოტიპირებისთვის |
| შეცდომების მართვა | ხელით დებაგი | საუბრის საშუალებით გაუმჯობესება |

---

## 🎨 ორი მიდგომა

### 1. "სუფთა" Vibe Coding
სრულად ენდობით AI-ს გამოსავალს. იდეალურია სწრაფი პროტოტიპირებისთვის და "შაბათ-კვირის პროექტებისთვის".

### 2. პასუხისმგებლიანი AI-ასისტირებული განვითარება
AI მოქმედებს როგორც ძლიერი თანამშრომელი. თქვენ მართავთ AI-ს, მაგრამ ამოწმებთ, ტესტავთ და იგებთ გენერირებულ კოდს, იღებთ სრულ პასუხისმგებლობას საბოლოო პროდუქტზე.

---

## 📊 რეალური სტატისტიკა

### Y Combinator Winter 2025

**2025 წლის მარტში** Y Combinator-მა გამოაცხადა:
- **25%** startup-ების codebase-ი იყო **95% AI-გენერირებული**
- ეს ასახავს ძლიერ ცვლილებას AI-ასისტირებული განვითარებისკენ

### Wall Street Journal (ივლისი 2025)

Vibe Coding დაიწყო **პროფესიონალი software engineers-ის** მიერ გამოყენება და შევიდა **კომერციულ გამოყენებაში**.

### Fast Company (სექტემბერი 2025)

სტატია "Vibe Coding Hangover" - senior software engineers აღნიშნავენ **'development hell'**-ს AI-გენერირებულ კოდთან მუშაობისას.

---

## 🚀 უპირატესობები

### ✅ დადებითი მხარეები

- **სიჩქარე**: იდეიდან პროტოტიპამდე საათებში
- **ხელმისაწვდომობა**: არა-პროგრამისტებსაც შეუძლიათ აპლიკაციების შექმნა
- **სწავლა**: ახალი ენებისა და ტექნოლოგიების სწრაფი დაუფლება
- **"Software for One"**: პერსონალიზებული ინსტრუმენტები კონკრეტული საჭიროებებისთვის

### ❌ შეზღუდვები და რისკები

#### 1. **უსაფრთხოების პრობლემები**

**Lovable App (მაისი 2025)**:
- 170 / 1,645 Lovable-ით შექმნილ აპლიკაციას ჰქონდა უსაფრთხოების პრობლემა
- პირადი ინფორმაცია ხელმისაწვდომი იყო ნებისმიერი ადამიანისთვის

#### 2. **Debugging გამოწვევები**

- LLM-ები აგენერირებენ კოდს დინამიურად, სტრუქტურა იცვლება
- დეველოპერმა არ დაწერა კოდი → ძნელია სინტაქსისა და კონცეფციების გაგება

#### 3. **Task სირთულე**

AI კარგად უმკლავდება:
- ✅ მარტივ ალგორითმებს
- ✅ ერთფაილიან პროექტებს

AI ცუდად უმკლავდება:
- ❌ მრავალფაილიან პროექტებს
- ❌ ცუდად დოკუმენტირებულ ბიბლიოთეკებს
- ❌ safety-critical კოდს

#### 4. **ხარისხი და პასუხისმგებლობა**

Simon Willison:
> "Vibe coding-ით production codebase-ის შექმნა აშკარად რისკიანია. ჩვენი სამუშაოს უმეტესობა მოიცავს არსებული სისტემების ევოლუციას, სადაც კოდის ხარისხი და გასაგებობა კრიტიკულია."

#### 5. **რეალური შემთხვევები**

**Kevin Roose (NY Times, თებერვალი 2025)**:
- შექმნა რამდენიმე მცირე აპლიკაცია vibe coding-ით
- AI გენერირებულმა კოდმა შექმნა **ყალბი reviews** e-commerce საიტისთვის
- აპლიკაციები იყო **შეზღუდული და error-prone**

**SaaStr Founder (ივლისი 2025)**:
- Replit-ის AI აგენტმა **წაშალა მონაცემთა ბაზა** მიუხედავად ექსპლიციტური ინსტრუქციისა არაფრის შეცვლის შესახებ

---

## ⚠️ ექსპერტთა აზრი

### Andrew Ng

იწინააღმდეგებს ტერმინს, ამბობს რომ ის **ცდუნებს ადამიანებს** იფიქრონ რომ software engineers უბრალოდ "go with the vibes" AI ინსტრუმენტების გამოყენებისას.

### Gary Marcus (Cognitive Scientist)

თქვა რომ AI-ს ენთუზიაზმი მომდინარეობს **რეპროდუქციიდან, არა ორიგინალურობიდან** - ალგორითმი ვარჯიშდება არსებულ კოდზე მსგავსი დავალებებისთვის.

### IEEE Spectrum Engineers

3 ინჟინერი თანხმდება: vibe coding არის გზა **ახალი ენებისა და ტექნოლოგიების სწავლისთვის**.

---

## 🎯 სად გამოიყენება?

### ✅ იდეალურია:
- **პროტოტიპირება**
- **"Throwaway weekend projects"** (Karpathy-ს სიტყვებით)
- **პერსონალური ინსტრუმენტები**
- **სწავლა და ექსპერიმენტები**

### ❌ არ არის რეკომენდებული:
- **Production codebase**
- **უსაფრთხოების-კრიტიკული სისტემები**
- **გრძელვადიანი პროექტები**
- **გუნდური განვითარება**

---

## 💡 შემდეგი ნაბიჯები

გაეცანით სხვა სტატიებს, რომ ისწავლოთ:
- Vibe Coding-ის ინსტრუმენტები
- საუკეთესო პრაქტიკები და მეთოდოლოგია
- რეალური მაგალითები და პროექტები`},{id:"tools-overview",title:"Vibe Coding ინსტრუმენტები",isFree:!1,content:`# Vibe Coding ინსტრუმენტები

AI-ასისტირებული პროგრამირებისთვის არსებობს მრავალი ინსტრუმენტი. თქვენი არჩევანი დამოკიდებულია თქვენს მიზანზე და გამოცდილების დონეზე.

---

## 🎨 UI-ცენტრული ინსტრუმენტები

### 1. **Bolt.new / Bolt.diy**
**შექმნილია**: StackBlitz-ის მიერ

**ძირითადი ფუნქციები**:
- სრული სტეკის აპლიკაციების ვიზუალური აგება
- Figma დიზაინების პირდაპირ იმპორტი
- VS Code IDE ბრაუზერში
- Supabase ინტეგრაცია

**საუკეთესოა**: დიზაინერებისთვის და ვიზუალური მიდგომის მოყვარულებისთვის

---

### 2. **Lovable.dev**
**ყველაზე მარტივი**: დამწყებთათვის

**ძირითადი ფუნქციები**:
- ელემენტების არჩევა და ცვლილება UI-ში
- Supabase ინტეგრაცია (ავთენტიფიკაცია + DB)
- GitHub რეპოზიტორიის სინქრონიზაცია
- ავტომატური pull/push

**საუკეთესოა**: არა-კოდერებისთვის და სწრაფი პროტოტიპირებისთვის

---

### 3. **Tempo Labs**
**ბალანსირებული**: low-code და intermediate პროგრამისტებისთვის

**ძირითადი ფუნქციები**:
- PRD (Product Requirements Document) გენერაცია
- მომხმარებლის ნაკადის დიაგრამები
- Stripe/Polar გადახდის ინტეგრაცია
- GitHub რეპოდან პროექტის შექმნა

**საუკეთესოა**: სტრუქტურირებული მიდგომის მოყვარულებისთვის

---

## 💻 IDE-ინტეგრირებული ინსტრუმენტები

### 1. **Cursor**
**ყველაზე პოპულარული**: პროფესიონალებისთვის

**ძირითადი ფუნქციები**:
- VS Code-ზე დაფუძნებული
- Claude/GPT-4 ინტეგრაცია
- Composer Mode (მთელი პროექტის რედაქტირება)
- @-mentions (ფაილების კონტექსტი)

**საუკეთესოა**: არსებულ პროექტებზე მუშაობისთვის

---

### 2. **Windsurf**
**ახალი**: Codeium-ის მიერ

**ძირითადი ფუნქციები**:
- Cascade AI აგენტი
- მრავალფაილიანი რედაქტირება
- ავტომატური დებაგი

**საუკეთესოა**: კომპლექსური პროექტებისთვის

---

### 3. **GitHub Copilot**
**კლასიკა**: GitHub-ის მიერ

**ძირითადი ფუნქციები**:
- კოდის ავტოდასრულება
- ფუნქციების გენერაცია
- ყველა IDE-ში მუშაობს

**საუკეთესოა**: ტრადიციული დეველოპერებისთვის

---

## 🌐 No-Code პლატფორმები

### 1. **Google AI Studio**
**ყველაზე სწრაფი**: იდეიდან აპლიკაციამდე

**ძირითადი ფუნქციები**:
- ერთი პრომპტით აპლიკაციის შექმნა
- ერთი დაწკაპუნებით Cloud Run-ზე განლაგება
- ცოცხალი preview

**საუკეთესოა**: სწრაფი პროტოტიპებისთვის

---

### 2. **Firebase Studio**
**Production-ready**: სრული სტეკის აპლიკაციებისთვის

**ძირითადი ფუნქციები**:
- აპლიკაციის Blueprint გენერაცია
- Firebase backend ინტეგრაცია
- მომხმარებლის ავთენტიფიკაცია
- მონაცემთა ბაზა

**საუკეთესოა**: სერიოზული პროექტებისთვის

---

## 🎯 როგორ ავირჩიოთ?

| თუ გსურთ... | გამოიყენეთ... |
|:---|:---|
| სწრაფი პროტოტიპი | Google AI Studio, Bolt.new |
| Production აპლიკაცია | Firebase Studio, Cursor |
| არსებული პროექტის გაუმჯობესება | Cursor, Windsurf, Copilot |
| ვიზუალური განვითარება | Lovable.dev, Tempo Labs |
| სწავლა | Cursor + Cursor Directory |

---

## 💡 რჩევები

1. **დაიწყეთ უფასოთი**: ყველა ინსტრუმენტს აქვს უფასო გეგმა
2. **ექსპერიმენტირეთ**: სცადეთ რამდენიმე ინსტრუმენტი
3. **კომბინირება**: გამოიყენეთ სხვადასხვა ინსტრუმენტი სხვადასხვა ეტაპზე
4. **დოკუმენტაცია**: ყოველთვის წაიკითხეთ ოფიციალური დოკუმენტაცია`}]},{id:"tools-ranking",title:"ინსტრუმენტების რეიტინგი 2025",icon:"\uD83C\uDFC6",articles:[{id:"tools-matrix-2025",title:"2025 წლის საუკეთესო Vibe Coding ინსტრუმენტები",isFree:!0,content:`# 🏆 2025 წლის საუკეთესო Vibe Coding ინსტრუმენტები

> სრული რეიტინგი და შედარება - რომელი ინსტრუმენტი აირჩიოთ 2026 წლისთვის?

---

## 📊 ინსტრუმენტების მატრიცა

ყველა ინსტრუმენტი დაჯგუფებულია ორი პარამეტრით:
- **X ღერძი**: ადვილი გამოყენება ↔️ უფრო ტექნიკური
- **Y ღერძი**: დაბალი შესაძლებლობები ↔️ მაღალი შესაძლებლობები

---

## 🎯 TOP ინსტრუმენტები კატეგორიებით

### 🥇 ადვილი + ძლიერი (საუკეთესო დამწყებთათვის)
1. **Base44** - ყველაზე ბალანსირებული
2. **Mocha** - Apple of vibe coding
3. **Lovable** - პოპულარული და მარტივი

### 🥈 ტექნიკური + ძალიან ძლიერი (პროფესიონალებისთვის)
1. **Cursor** - #1 არჩევანი დეველოპერებისთვის
2. **Claude Code** - ტერმინალში, სუპერ აგენტური
3. **Google Anti-Gravity** - Cursor-ის კონკურენტი

### 🥉 სპეციალიზებული
- **Replit** - სრული პლატფორმა deployment-ით
- **V0** - UI/UX პროტოტიპირება
- **Bolt.new** - სწრაფი MVP შექმნა

---

## 💎 დეტალური შედარება

**🔓 სრული რეიტინგი 15+ ინსტრუმენტით, დეტალური შედარება, pros/cons და რეკომენდაციები ხელმისაწვდომია პრემიუმ წევრებისთვის.**

შეიყვანეთ კოდი **1212** და მიიღეთ 1 საათიანი წვდომა!`},{id:"andrej-karpathy-insights",title:"Andrej Karpathy: Software-ის მომავალი AI ეპოქაში",isFree:!1,content:`# 🎤 Andrej Karpathy: Software-ის მომავალი AI ეპოქაში

> ყოფილი Tesla AI დირექტორი და OpenAI თანადამფუძნებელი Vibe Coding-ის შესახებ

---

## 🌟 ძირითადი თეზისები

### Software-ის 3 ეპოქა

**Software 1.0** - ტრადიციული კოდი (Python, JavaScript)
- ადამიანი წერს კოდს
- 70 წლის ისტორია

**Software 2.0** - Neural Networks
- Weights პროგრამირებს neural networks
- Hugging Face = GitHub for AI

**Software 3.0** - LLMs (ახალი!)
- **Prompts პროგრამირებს LLM-ებს**
- პროგრამირების ენა = **ინგლისური**

---

## 🔥 "ყველაზე ცხელი პროგრამირების ენა არის ინგლისური"

Karpathy-ს ციტატა 2023 წლიდან რომელიც გახდა რეალობა:
> "ჩვენ ახლა ვაპროგრამებთ კომპიუტერებს ინგლისურ ენაზე"

---

## 🖥️ LLMs = ახალი Operating System

### რატომ LLMs არიან OS-ის მსგავსი?

| OS კონცეფცია | LLM ეკვივალენტი |
|:---|:---|
| CPU | LLM მოდელი |
| Memory (RAM) | Context Window |
| Apps | AI აგენტები/ინსტრუმენტები |
| GUI | Chat ინტერფეისი |

### Closed Source vs Open Source

**Closed Source "OS":**
- OpenAI (GPT)
- Anthropic (Claude)
- Google (Gemini)

**Open Source "Linux":**
- Llama ecosystem
- Local models

---

## ⚡ LLMs = Utilities (როგორც ელექტროობა)

### Utility-ს მსგავსი თვისებები:
- ✅ Capex: LLM-ების ტრენინგი
- ✅ Opex: API-ით სერვისი
- ✅ Metered access: გადახდა per million tokens
- ✅ High uptime demands

### "Intelligence Brownout"
როდესაც GPT-4 ან Claude down არის = **პლანეტა უფრო სულელი ხდება** 🤯

---

## 🧠 LLMs-ის ფსიქოლოგია

### Superpowers 💪
- **Encyclopedic memory** - იხსენებს ყველაფერს
- **Instant recall** - SHA hashes, ფაქტები
- **Multilingual** - ყველა ენა

### Cognitive Deficits ⚠️
- **Hallucinations** - გამოგონილი ინფორმაცია
- **Jagged intelligence** - superhuman + stupid შეცდომები
- **Anterograde amnesia** - არ ახსოვს წინა სესიები
- **No self-knowledge** - არ იცის რას არ იცის

### 🎬 ფილმების ანალოგიები:
- **Rain Man** - perfect memory, but...
- **Memento** - weights fixed, context wiped daily
- **50 First Dates** - ყოველ დილას იწყებს თავიდან

---

## 🦾 Iron Man Suit Analogy

Karpathy-ს რეკომენდაცია:

❌ **არა**: Autonomous robots (ჯერ კიდევ)
✅ **კი**: **Iron Man Suits** - augmentation + autonomy slider

### Autonomy Slider 🎚️

**Low Autonomy** (Cursor Tab completion)
- თქვენ აკონტროლებთ
- AI ეხმარება

**Medium Autonomy** (Cursor Composer)
- AI + თქვენ ერთად
- თქვენ ამოწმებთ

**High Autonomy** (Full Agent Mode)
- AI აკეთებს ყველაფერს
- თქვენ ზედამხედველობთ

---

## 🚗 Tesla Autopilot Lesson

Karpathy Tesla-ში 5 წელი იმუშავა Autopilot-ზე:

**2013**: პირველი Waymo ტესტ-დრაივი - **იდეალური!**
**2025**: 12 წელი გავიდა - **ჯერ კიდევ არ არის სრულად ავტონომიური**

### გაკვეთილი:
> "2025 is the year of agents" ❌
> 
> "This is the **DECADE of agents**" ✅

**Partial autonomy products** > Flashy autonomous demos

---

## 👥 Generation-Verification Loop

### როგორ ვიმუშაოთ AI-თან?

1. **AI generates** (სწრაფი)
2. **Human verifies** (ბოთლნეკი!)

### როგორ დავაჩქაროთ?

#### ✅ Speed up Verification:
- **GUI-ები** - ვიზუალური diff-ები
- **Color coding** - წითელი/მწვანე
- **Keyboard shortcuts** - Cmd+Y / Cmd+N

#### ✅ Keep AI on Leash:
- **Small chunks** - არა 10,000 ხაზიანი diff
- **Incremental** - ნაბიჯ-ნაბიჯ
- **Concrete prompts** - არა ბუნდოვანი

---

## 🎯 Vibe Coding Best Practices (Karpathy)

### რას აკეთებს Karpathy?

1. **Concrete prompts** - სპეციფიკური, არა ვაგი
2. **Small iterations** - მცირე ცვლილებები
3. **Fast verification** - სწრაფი შემოწმება
4. **Stay in control** - AI leash-ზე

### ❌ რას არ აკეთებს:

- არ კითხულობს diffs-ებს (ხუმრობს)
- Accept all always (ირონიულად)
- Copy-paste errors without comment (სატირა)

---

## 🏗️ Building for Agents

### ახალი კატეგორია: AI Agents

**ადრე**: Humans (GUI) + Computers (API)
**ახლა**: **+ AI Agents** (ახალი!)

### როგორ ავაშენოთ Agent-friendly software?

#### 1. **robots.txt** → **llms.txt**
\`\`\`
# llms.txt - AI-ებისთვის
This domain: Studio setup inspiration
Main features: Browse, search, upload
API: /api/images, /api/search
\`\`\`

#### 2. **Markdown Docs**
- ❌ HTML with images (AI-ს ძნელი)
- ✅ **Markdown** (AI-ს მარტივი)

**მაგალითები**:
- Vercel docs → Markdown for LLMs
- Stripe docs → LLM-friendly

#### 3. **Replace "Click" with curl**
\`\`\`
❌ "Click the Deploy button"
✅ "Run: curl -X POST /api/deploy"
\`\`\`

#### 4. **Model Context Protocol (MCP)**
Anthropic-ის პროტოკოლი AI agents-თან საუბრისთვის

---

## 🛠️ Helpful Tools

### GitIngest
\`\`\`
github.com/user/repo → gitingest.com/user/repo
\`\`\`
ყველა ფაილი → ერთ text ფაილში (LLM-ready!)

### DeepWiki (by Devon)
GitHub repo → AI-generated documentation

---

## 🌍 Technology Diffusion - Flipped!

### ტრადიციული Tech:
Government/Corps → Consumers

**მაგალითები**: Internet, GPS, Cryptography
1. Military/Gov first
2. Corporations second  
3. Consumers last

### LLMs - **BACKWARDS!** 🔄

Consumers → Corporations → Government

**ChatGPT**: 
- Consumers: "How to boil an egg" 🥚
- Corps/Gov: Lagging behind

---

## 💡 Key Takeaways

1. **LLMs = New Operating System** (1960s era)
2. **English = Programming Language**
3. **Build Iron Man Suits, not robots**
4. **Keep AI on leash** - small chunks
5. **Speed up verification** - GUI, visual diffs
6. **Build for agents** - llms.txt, markdown docs
7. **This is the DECADE of agents** - not year

---

## 🎓 Karpathy-ს რჩევა სტუდენტებისთვის

> "What an amazing time to enter the industry. We need to rewrite a ton of code. Software is changing fundamentally for the first time in 70 years."

**შესაძლებლობები**:
- ♾️ უსასრულო სამუშაო
- 🆕 ახალი პარადიგმა
- 🌟 ყველა იწყებს თავიდან

---

**სრული ტრანსკრიპტი, დეტალური ანალიზი და დამატებითი insights ხელმისაწვდომია პრემიუმ წევრებისთვის!**`}]},{id:"basic-guide",title:"ძირითადი სახელმძღვანელო",icon:"\uD83D\uDCDA",articles:[{id:"best-practices",title:"საუკეთესო პრაქტიკები Cursor-თან",isFree:!1,content:`# საუკეთესო პრაქტიკები Cursor-თან მუშაობისას

> 6+ თვის გამოცდილება და 2500+ პრომპტი - ყველაფერი რაც უნდა იცოდეთ

---

## 🎯 1. განსაზღვრეთ თქვენი ხედვა მკაფიოდ

დაიწყეთ ძლიერი, დეტალური ხედვით იმისა, რასაც აშენებთ და როგორ უნდა იმუშაოს. თუ თქვენი შეყვანა ბუნდოვანია, გამოსავალიც ბუნდოვანი იქნება.

**გახსოვდეთ**: Garbage in, garbage out.

**რჩევა**: გამოიყენეთ Gemini 2.5 Pro Google AI Studio-ში თქვენი იდეების სტრუქტურირებისთვის.

---

## 🎨 2. დაგეგმეთ UI/UX პირველ რიგში

UI-ის დაგეგმვას დაუთმეთ დრო **კოდის დაწერამდე**:
- გამოიყენეთ **v0.dev** ლეიაუთების ვიზუალიზაციისთვის
- შექმენით დიზაინ სისტემა და დაიცავით იგი
- შექმენით მრავალჯერადი გამოყენების კომპონენტები (ღილაკები, ლოადერები)

**ბონუსი**: გამოიყენეთ **21st.dev** - AI პრომპტებით კომპონენტების ბიბლიოთეკა!

---

## 🔧 3. დაეუფლეთ Git & GitHub-ს

Git არის თქვენი საუკეთესო მეგობარი:
- ✅ შეინახეთ ყველა ცვლილება
- ✅ დაბრუნდით ძველ ვერსიაზე AI-ს შეცდომის შემთხვევაში
- ✅ Commit გააკეთეთ თითოეული დიდი ფუნქციის შემდეგ

**გარეშე Git-ის თქვენი კოდბეისი შეიძლება განადგურდეს ერთი არასწორი ცვლილებით!**

---

## 🛠️ 4. აირჩიეთ პოპულარული Tech Stack

გამოიყენეთ ფართოდ გავრცელებული ტექნოლოგიები. AI მოდელები ვარჯიშდებიან საჯარო მონაცემებზე - რაც უფრო გავრცელებულია სტეკი, მით უკეთესად დაგეხმარებათ AI.

**რეკომენდაცია**:
- **Next.js** (frontend + API)
- **Supabase** (database + auth)
- **TailwindCSS** (styling)
- **Vercel** (hosting)

---

## 📋 5. გამოიყენეთ Cursor Rules

Cursor Rules არის თქვენი მეგობარი. შექმენით დეტალური წესები:
- ყველა tech stack რომელსაც იყენებთ
- ინსტრუქციები AI მოდელისთვის
- Best practices და patterns
- რაც უნდა თავიდან აიცილოს

**რესურსი**: **cursor.directory** - შაბლონების ბიბლიოთეკა

---

## 📁 6. შექმენით Instructions საქაღალდე

ყოველთვის ჰქონდეთ \`instructions/\` საქაღალდე:
- Markdown ფაილები დოკუმენტაციით
- მაგალითი კომპონენტები
- კონტექსტი AI-სთვის

**ალტერნატივა**: გამოიყენეთ Context7 MCP - დოკუმენტაციის ბიბლიოთეკა

---

## ✍️ 7. დაწერეთ დეტალური პრომპტები

**Garbage in, garbage out** - ეს მთავარი წესია.

თუ ვერ წერთ კარგ პრომპტს:
1. გადადით Gemini 2.5 Pro-ზე
2. აიძულეთ შექმნას დეტალური ვერსია
3. არ დატოვოთ ადგილი AI-ს გამოსაცნობად

---

## 🧩 8. დაყავით კომპლექსური ფუნქციები

**არასოდეს** დაწეროთ: "ააშენე მთელი ეს ფუნქცია"

AI დაიწყებს ჰალუცინაციას და შექმნის ნაგავს.

**სწორად**: დაყავით 3-5 ფაზად:
1. მონაცემთა სტრუქტურა
2. UI კომპონენტები
3. API ლოგიკა
4. ინტეგრაცია
5. ტესტირება

---

## 💬 9. მართეთ Chat კონტექსტი

როდესაც chat ძალიან დიდი ხდება - **გახსენით ახალი**.

რატომ?
- AI-ს აქვს შეზღუდული context window
- დიდ chat-ში AI ივიწყებს ადრეულ ნაწილებს
- იწყებს ცუდი კოდის გენერირებას

**როდესაც ხსნით ახალ chat-ს**:
- მოკლედ აღწერეთ ფუნქცია რომელზეც მუშაობთ
- მიუთითეთ ფაილები რომლებზეც მუშაობთ

---

## 🔄 10. არ გეშინოდეთ Restart/Refine

როდესაც AI არასწორ გზაზე წავიდა:
- ✅ დაბრუნდით უკან
- ✅ შეცვალეთ პრომპტი
- ✅ გაუშვით თავიდან

**არ** სცადოთ AI-ს შეცდომების გასწორება - ის შექმნის ახალ შეცდომებს!

---

## 📌 11. მიაწოდეთ ზუსტი კონტექსტი

**კონტექსტი = ყველაფერი**

- მიუთითეთ სწორი ფაილები
- არ გადატვირთოთ ზედმეტი კონტექსტით
- @mention გამოიყენეთ სწორად

---

## 🎨 12. გამოიყენეთ არსებული კომპონენტები

ახალი კომპონენტის შექმნისას:
- @mention ადრე შექმნილი მსგავსი კომპონენტები
- AI ავტომატურად გამოიყენებს იგივე პატერნებს
- კონსისტენტურობა უზრუნველყოფილია

---

## 🔍 13. გადაამოწმეთ კოდი AI-თან

თითოეული ფუნქციის შემდეგ:
1. დააკოპირეთ კოდი
2. ჩასვით Gemini 2.5 Pro-ში
3. სთხოვეთ security vulnerabilities-ის შემოწმება
4. სთხოვეთ performance issues-ის პოვნა
5. დაუბრუნეთ Claude-ს გასასწორებლად

**გაიმეორეთ სანამ Gemini არ იტყვის "100% OK"**

---

## 🔒 14. უსაფრთხოების პრაქტიკები

**ძირითადი შეცდომები**:

| შეცდომა | გამოსავალი |
|:---|:---|
| Client-ის მონაცემების ნდობა | Server-ზე ვალიდაცია |
| API Keys Frontend-ში | მხოლოდ Server-side |
| სუსტი Authorization | ყოველი მოქმედების შემოწმება |
| დეტალური Errors | Generic შეტყობინებები |
| IDOR (ID-ით წვდომა) | Ownership შემოწმება |

---

## 🐛 15. შეცდომების ეფექტური მართვა

**ვარიანტი 1**: დაბრუნდით და თავიდან სცადეთ

**ვარიანტი 2**: 
- დააკოპირეთ console error
- მიაწოდეთ AI-ს
- თუ 3 მცდელობის შემდეგ არ გაასწორა - დაბრუნდით

---

## 🔍 16. ჯიუტი შეცდომების სისტემატური Debug

თუ AI 3+ მცდელობის შემდეგ ვერ აგვარებს:

1. სთხოვეთ კომპონენტის overview
2. სთხოვეთ top suspects-ის ჩამონათვალი
3. სთხოვეთ logs-ის დამატება
4. მიაწოდეთ logs-ის output

**ეს მუშაობს 90% შემთხვევაში!**

---

## ⚠️ 17. აკრძალეთ არასასურველი ცვლილებები

Claude ხშირად ამატებს/შლის/ცვლის რაც არ სთხოვეთ.

**გამოსავალი**: თითოეულ პრომპტში დაამატეთ:

> "არ შეცვალო არაფერი რაც არ გითხარი. გააკეთე მხოლოდ ის რაც მითხარი."

**მუშაობს ძალიან კარგად!**

---

## 📝 18. შექმენით "Common Mistakes" ფაილი

შექმენით ფაილი Claude-ის ხშირი შეცდომებით:
- დაამატეთ ყველა განმეორებადი შეცდომა
- @mention ეს ფაილი ახალი ფუნქციის დამატებისას
- თავიდან აიცილეთ იგივე შეცდომები

---

## 🎉 დასკვნა

ეს არ არის "vibe coding" როგორც ყველა აღწერს - ეს არის **რეალური სამუშაო**.

მაგრამ ეს არის ის, რაც საჭიროა **production-ready** პროექტის შესაქმნელად.

**Happy Vibing! 🚀**`},{id:"glue-coding",title:"Glue Coding (წებოვანი პროგრამირება)",isFree:!1,content:`# 🧬 Glue Coding (წებოვანი პროგრამირება)

> **პროგრამული ინჟინერიის წმინდა გრაალი და ვერცხლის ტყვია — საბოლოოდ გამოჩნდა.**

---

## 🚀 რევოლუციური მანიფესტი

**Glue Coding არ არის ტექნოლოგია, ეს არის რევოლუცია.**

| ტრადიციული Vibe Coding-ის ტკივილი | Glue Coding-ის გამოსავალი |
|:---|:---|
| 🎭 **AI ჰალუცინაციები** | ✅ **ნულოვანი ჰალუცინაცია** - გამოიყენება მხოლოდ დადასტურებული კოდი |
| 🧩 **სირთულის აფეთქება** | ✅ **სირთულის განულება** - თითოეული მოდული გამოცდილია |
| 🎓 **მაღალი ბარიერი** | ✅ **ბარიერის გაქრობა** - მხოლოდ კავშირის აღწერა გჭირდებათ |

---

## 💡 ძირითადი ფილოსოფია

\`\`\`
ტრადიციული პროგრამირება: ადამიანი წერს კოდს
Vibe Coding: AI წერს კოდს, ადამიანი ამოწმებს
Glue Coding: AI აკავშირებს კოდს, ადამიანი ამოწმებს კავშირს
\`\`\`

### პარადიგმის ცვლილება

- ❌ აღარ აიძულოთ AI-ს კოდის ნულიდან დაწერა
- ❌ აღარ გამოიგონოთ ბორბალი ხელახლა
- ✅ გამოიყენეთ მხოლოდ მწიფე, წარმოებაში გამოცდილი პროექტები
- ✅ AI-ს ერთადერთი მოვალეობა: გაიგოს თქვენი განზრახვა და დააკავშიროს მოდულები

---

## 🎖️ შეჯამება

> **თუ შეგიძლია დააკოპირო - არ დაწერო, თუ შეგიძლია დააკავშირო - არ შექმნა**

Glue Coding არის Vibe Coding-ის საბოლოო ევოლუცია.

*"საუკეთესო კოდი არის ის, რომელიც არ არსებობს. მეორე საუკეთესო არის წებო კოდი."*`},{id:"advanced-prompting",title:"პროფესიონალური Prompting სტრატეგიები",isFree:!1,content:`# 🎯 პროფესიონალური Prompting სტრატეგიები

> როგორ ავაიძულოთ AI-ს შექმნას ზუსტად ის, რაც გვინდა

---

## 📋 პრომპტის სტრუქტურა

### 1. კონტექსტი (Context)
მიაწოდეთ AI-ს ფონური ინფორმაცია:

\`\`\`
"ვაშენებ Next.js 14 აპლიკაციას Supabase-ით და TailwindCSS-ით.
გამოვიყენებ App Router და Server Components."
\`\`\`

### 2. როლი (Role)
განსაზღვრეთ AI-ს როლი:

\`\`\`
"შენ ხარ Senior Full-Stack დეველოპერი 10+ წლის გამოცდილებით.
სპეციალიზირებული ხარ React და TypeScript-ში."
\`\`\`

### 3. დავალება (Task)
მკაფიოდ ჩამოაყალიბეთ რაც გსურთ:

\`\`\`
"შექმენი reusable Button კომპონენტი შემდეგი ვარიანტებით:
- primary, secondary, ghost
- small, medium, large
- loading state
- disabled state"
\`\`\`

### 4. შეზღუდვები (Constraints)
განსაზღვრეთ რაც არ უნდა გააკეთოს:

\`\`\`
"არ გამოიყენო inline styles
არ დაამატო ახალი dependencies
გამოიყენე მხოლოდ TailwindCSS
დაიცავი არსებული naming conventions"
\`\`\`

### 5. მაგალითები (Examples)
მიაწოდეთ კონკრეტული მაგალითები:

\`\`\`
"მსგავსი არსებული კომპონენტი:
@components/ui/Input.tsx

გამოიყენე იგივე პატერნი და სტილი."
\`\`\`

---

## 🎨 Few-Shot Prompting

მიეცით AI-ს მაგალითები სასურველი გამოსავლის:

\`\`\`
User: "შექმენი ფუნქცია რომელიც ფორმატირებს თარიღს"
AI: [კოდი]

User: "ახლა დაამატე timezone support"
AI: [გაუმჯობესებული კოდი]

User: "ახლა შექმენი ფუნქცია რომელიც ფორმატირებს ფასს"
AI: [იგივე პატერნით]
\`\`\`

---

## 🔄 Chain-of-Thought Prompting

აიძულეთ AI-ს ეტაპობრივად იფიქროს:

\`\`\`
"ჯერ გააანალიზე რა კომპონენტები გვჭირდება.
შემდეგ განსაზღვრე მონაცემთა სტრუქტურა.
მერე შექმენი UI კომპონენტები.
ბოლოს დააკავშირე ყველაფერი.

თითოეულ ეტაპზე ახსენი რატომ აირჩიე ეს მიდგომა."
\`\`\`

---

## 🎯 Zero-Shot vs Few-Shot

### Zero-Shot (პირდაპირი ინსტრუქცია)
\`\`\`
"შექმენი authentication middleware Next.js-ისთვის"
\`\`\`

### Few-Shot (მაგალითებით)
\`\`\`
"შექმენი authentication middleware Next.js-ისთვის.

მაგალითი არსებული middleware:
@middleware/logger.ts

გამოიყენე იგივე პატერნი."
\`\`\`

---

## 🔍 Iterative Refinement

### პირველი პრომპტი
\`\`\`
"შექმენი user profile გვერდი"
\`\`\`

### გაუმჯობესება 1
\`\`\`
"დაამატე avatar upload ფუნქციონალი"
\`\`\`

### გაუმჯობესება 2
\`\`\`
"დაამატე image cropping modal"
\`\`\`

### გაუმჯობესება 3
\`\`\`
"დაამატე loading states და error handling"
\`\`\`

---

## 💡 Pro Tips

### 1. იყავით სპეციფიკური
❌ "გააუმჯობესე დიზაინი"
✅ "შეცვალე primary ღილაკის ფერი #7c3aed-ზე და დაამატე hover:scale-105 ეფექტი"

### 2. მიუთითეთ ფაილები
❌ "გამოიყენე არსებული სტილი"
✅ "გამოიყენე @components/ui/Button.tsx-ის სტილი"

### 3. დაყავით დიდი დავალებები
❌ "შექმენი სრული e-commerce პლატფორმა"
✅ "ჯერ შექმენი products catalog კომპონენტი"

### 4. გამოიყენეთ Negative Prompts
\`\`\`
"არ გამოიყენო any type
არ დაამატო console.log
არ შექმნა inline styles
არ დაარღვიო DRY პრინციპი"
\`\`\`

---

## 🎭 Role-Based Prompting

### Security Expert
\`\`\`
"შენ ხარ Security Expert. გადაამოწმე ეს კოდი:
- SQL Injection
- XSS vulnerabilities
- Authentication issues
- Data exposure"
\`\`\`

### Performance Expert
\`\`\`
"შენ ხარ Performance Expert. ოპტიმიზაცია გაუკეთე:
- Bundle size
- Render performance
- Database queries
- Caching strategy"
\`\`\`

### Code Reviewer
\`\`\`
"შენ ხარ Senior Code Reviewer. შეამოწმე:
- Code quality
- Best practices
- Naming conventions
- Error handling"
\`\`\`

---

## 🚀 Template-ები

### API Endpoint შექმნა
\`\`\`
როლი: Senior Backend Developer
კონტექსტი: Next.js 14 App Router, Supabase
დავალება: შექმენი POST /api/users endpoint
შეზღუდვები:
- გამოიყენე Server Actions
- დაამატე Zod validation
- დაამატე error handling
- დააბრუნე typed response
\`\`\`

### React კომპონენტი
\`\`\`
როლი: Senior Frontend Developer
კონტექსტი: React 18, TypeScript, TailwindCSS
დავალება: შექმენი Modal კომპონენტი
მოთხოვნები:
- Accessibility (ARIA)
- Keyboard navigation
- Animation (framer-motion)
- Portal rendering
მაგალითი: @components/Dialog.tsx
\`\`\`

---

## 🎯 დასკვნა

კარგი პრომპტი = კარგი კოდი

დაუთმეთ დრო პრომპტის შედგენას და დაზოგავთ საათებს debugging-ზე!`},{id:"real-world-examples",title:"რეალური პროექტების მაგალითები",isFree:!1,content:`# 🏗️ რეალური პროექტების მაგალითები

> როგორ ავაშენოთ production-ready აპლიკაციები Vibe Coding-ით

---

## 📱 პროექტი 1: SaaS Dashboard

### მიზანი
Analytics dashboard subscription-based SaaS-ისთვის

### Tech Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui
- **Backend**: Supabase (Auth + DB)
- **Charts**: Recharts
- **Payments**: Stripe

### ეტაპები

#### 1. პროექტის ინიციალიზაცია (5 წთ)
\`\`\`bash
npx create-next-app@latest saas-dashboard --typescript --tailwind --app
cd saas-dashboard
npx shadcn-ui@latest init
\`\`\`

#### 2. Authentication Setup (15 წთ)
**პრომპტი Claude-ს**:
\`\`\`
"შექმენი Supabase authentication setup:
1. Login page with email/password
2. Signup page with email verification
3. Protected routes middleware
4. User session management

გამოიყენე @supabase/ssr და Next.js 14 App Router.
დაამატე error handling და loading states."
\`\`\`

#### 3. Dashboard Layout (20 წთ)
\`\`\`
"შექმენი dashboard layout:
- Sidebar navigation
- Top header with user menu
- Main content area
- Responsive design (mobile drawer)

გამოიყენე shadcn/ui კომპონენტები.
მაგალითი: https://ui.shadcn.com/examples/dashboard"
\`\`\`

#### 4. Analytics Components (30 წთ)
\`\`\`
"შექმენი analytics კომპონენტები:
1. Stats cards (Revenue, Users, Growth)
2. Line chart (Monthly revenue)
3. Bar chart (User acquisition)
4. Table (Recent transactions)

გამოიყენე Recharts ბიბლიოთეკა.
დაამატე loading skeletons."
\`\`\`

#### 5. Subscription Management (45 წთ)
\`\`\`
"დააინტეგრირე Stripe:
1. Pricing page with plans
2. Checkout session creation
3. Webhook handling
4. Subscription status check
5. Cancel/upgrade flows

გამოიყენე @stripe/stripe-js.
დაამატე error handling."
\`\`\`

### სრული დრო: **~2 საათი**

---

## 🛒 პროექტი 2: E-Commerce Store

### მიზანი
სრული ფუნქციური online მაღაზია

### Tech Stack
- **Frontend**: Next.js 14, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase
- **Payments**: Stripe
- **Images**: Cloudinary

### ეტაპები

#### 1. Products Catalog (30 წთ)
\`\`\`
"შექმენი products catalog:
- Grid layout (responsive)
- Product card component
- Filters (category, price, rating)
- Search functionality
- Pagination

მონაცემები Supabase-დან."
\`\`\`

#### 2. Product Details (25 წთ)
\`\`\`
"შექმენი product details page:
- Image gallery with zoom
- Product info (title, price, description)
- Variants selector (size, color)
- Add to cart button
- Related products

გამოიყენე dynamic routes [slug]."
\`\`\`

#### 3. Shopping Cart (40 წთ)
\`\`\`
"შექმენი shopping cart:
- Cart sidebar/drawer
- Add/remove/update items
- Quantity controls
- Price calculation
- Persist in localStorage
- Cart badge in header"
\`\`\`

#### 4. Checkout Flow (60 წთ)
\`\`\`
"შექმენი checkout process:
1. Shipping information form
2. Payment method selection
3. Order summary
4. Stripe payment integration
5. Order confirmation page
6. Email notification

დაამატე form validation (Zod)."
\`\`\`

#### 5. Admin Panel (90 წთ)
\`\`\`
"შექმენი admin panel:
- Products CRUD
- Orders management
- Inventory tracking
- Analytics dashboard
- Image upload (Cloudinary)

დაამატე role-based access control."
\`\`\`

### სრული დრო: **~4 საათი**

---

## 📝 პროექტი 3: Blog Platform

### მიზანი
Modern blog platform MDX support-ით

### Tech Stack
- **Framework**: Next.js 14
- **Content**: MDX, Contentlayer
- **Styling**: TailwindCSS
- **Comments**: Giscus
- **Analytics**: Vercel Analytics

### ეტაპები

#### 1. MDX Setup (20 წთ)
\`\`\`
"დააკონფიგურირე Contentlayer:
- MDX files in /content/posts
- Frontmatter schema (title, date, tags)
- Auto-generated slugs
- Reading time calculation
- Syntax highlighting (shiki)"
\`\`\`

#### 2. Blog Homepage (25 წთ)
\`\`\`
"შექმენი blog homepage:
- Hero section
- Featured posts (3 cards)
- All posts grid
- Search bar
- Tags filter
- Newsletter signup"
\`\`\`

#### 3. Post Page (30 წთ)
\`\`\`
"შექმენი blog post page:
- MDX content rendering
- Table of contents
- Author info
- Share buttons
- Related posts
- Comments (Giscus)
- Reading progress bar"
\`\`\`

#### 4. Advanced Features (45 წთ)
\`\`\`
"დაამატე:
- Full-text search (Algolia/Fuse.js)
- RSS feed generation
- Sitemap
- SEO optimization
- Open Graph images
- Dark mode toggle"
\`\`\`

### სრული დრო: **~2 საათი**

---

## 💡 საერთო რჩევები

### 1. დაიწყეთ MVP-თი
პირველ დღეს შექმენით ძირითადი ფუნქციონალი, მერე დაამატეთ დანარჩენი.

### 2. გამოიყენეთ არსებული UI ბიბლიოთეკები
- shadcn/ui
- Headless UI
- Radix UI
- DaisyUI

### 3. არ გამოიგონოთ ბორბალი
გამოიყენეთ დადასტურებული ბიბლიოთეკები:
- Authentication: NextAuth.js, Supabase Auth
- Forms: React Hook Form + Zod
- State: Zustand, Jotai
- Data fetching: TanStack Query

### 4. Deploy ადრე და ხშირად
- Vercel (Next.js)
- Netlify (Static sites)
- Railway (Full-stack)

---

## 🎯 დასკვნა

Vibe Coding-ით შეგიძლიათ production-ready აპლიკაციის შექმნა **საათებში**, არა კვირებში!

გასაღები: **სწორი პრომპტები + სწორი ინსტრუმენტები + სწორი სტრატეგია**`},{id:"language-elements",title:"ენის ელემენტები",isFree:!1,content:`# 12 "ენის ელემენტი", რომელიც უნდა დაეუფლოთ კოდის 100%-ით გასაგებად

---

## I. გამოასწორეთ ერთი მცდარი შეხედულება

❌ მითი: კოდის ვერ გაგება = სინტაქსის არცოდნა

✅ სიმართლე: კოდის ვერ გაგება = **ერთ-ერთი მოდელის დონის არცოდნა**

---

## II. 8 დონის დაუფლება

### 🧠 L1: ძირითადი კონტროლის სინტაქსი
ცვლადები, if/else, for/while, ფუნქცია/return

### 🧠 L2: მონაცემთა და მეხსიერების მოდელი
Value vs Reference, Stack vs Heap, Copy vs Shared

### 🧠 L3: ტიპების სისტემა
სტატიკური/დინამიური, Generics, Null/Option

### 🧠 L4: შესრულების მოდელი
სინქრონული vs ასინქრონული, Event Loop

### 🧠 L5: შეცდომების დამუშავება
Exception vs დაბრუნებული მნიშვნელობა, RAII, defer/finally

### 🧠 L6: მეტა-სინტაქსი
მაკროები, დეკორატორები, ანოტაციები, რეფლექსია

### 🧠 L7: ენის პარადიგმა
OOP, FP, პროცედურული, დეკლარატიული

### 🧠 L8: დომენის სინტაქსი
SQL, Regex, Shell, DSL

---

## VII. 12 დონის ცხრილი

| დონე | სახელი | განსაზღვრავს... |
|:---|:---|:---|
| L1 | კონტროლის სინტაქსი | დაწერო კოდი რომელიც ეშვება |
| L2 | მეხსიერების მოდელი | არ დაწერო ფარული bug-ები |
| L3 | ტიპების სისტემა | არ დაეყრდნო კომენტარებს |
| L4 | შესრულების მოდელი | არ ჩაიჭრა async-ში |
| L5 | შეცდომის მოდელი | არ დაკარგო რესურსი |
| L6 | მეტა-სინტაქსი | გაიგო "კოდი რომელიც კოდს არ ჰგავს" |
| L7 | პარადიგმა | გაიგო სხვადასხვა სტილი |
| L8 | დომენი | გაიგო რეალური პროექტი |
| L9 | დროის მოდელი | აკონტროლო წარმადობა |
| L10 | რესურსების მოდელი | დაწერო მაღალი წარმადობის სისტემა |
| L11 | ფარული კონტრაქტი | დაწერო კოდი Production-ისთვის |
| L12 | დიზაინის განზრახვა | გახდე არქიტექტორი |`},{id:"pitfalls",title:"ხარვეზების შეჯამება",isFree:!1,content:`# 🕳️ ხარვეზების შეჯამება

> Vibe Coding პროცესში გავრცელებული პრობლემები და გადაწყვეტილებები

---

## 🤖 AI დიალოგთან დაკავშირებული

| პრობლემა | მიზეზი | გამოსავალი |
|:---|:---|:---|
| AI გენერირებული კოდი არ ეშვება | არასაკმარისი კონტექსტი | მიაწოდეთ სრული შეცდომის ინფორმაცია |
| AI იმეორებს ერთი და იმავე ცვლილებას | ჩაიციკლა | შეცვალეთ აღწერის კუთხე |
| AI ჰალუცინაცია | მოდელის ცოდნა მოძველებულია | მიაწოდეთ ოფიციალური დოკუმენტაცია |
| კოდი აირია | არ აქვს გეგმა | ჯერ გეგმა, მერე კოდი |
| AI-ს დაავიწყდა წინა საუბარი | კონტექსტი დაიკარგა | გამოიყენეთ memory bank |

---

## 🐍 Python ვირტუალური გარემო

\`\`\`bash
# შექმნა
python -m venv .venv

# გააქტიურება (Windows)
.venv\\Scripts\\activate

# გააქტიურება (macOS/Linux)
source .venv/bin/activate

# დამოკიდებულებების დაყენება
pip install -r requirements.txt
\`\`\`

---

## 📦 Node.js გარემო

| პრობლემა | გამოსავალი |
|:---|:---|
| node ვერსია არასწორია | გამოიყენეთ nvm: \`nvm install 18\` |
| npm install შეცდომა | შეცვალეთ registry, წაშალეთ node_modules |
| გლობალური პაკეტი ვერ მოიძებნა | დაამატეთ PATH-ში |`},{id:"strict-constraints",title:"მკაცრი წინაპირობები",isFree:!1,content:`# მკაცრი წინაპირობები

> თქვენი თავისუფალი კომბინაციისთვის

---

## ზოგადი განვითარების შეზღუდვები

1. აკრძალულია მხოლოდ ლოკალური პრობლემების გადამჭრელი „პატჩების" გამოყენება
2. აკრძალულია ზედმეტი შუალედური მდგომარეობების შემოღება
3. აკრძალულია არქიტექტურის უგულებელყოფა
4. აკრძალულია კომენტარების გამოტოვება
5. აკრძალულია SOLID და DRY პრინციპების დარღვევა
6. აკრძალულია გამოუყენებელი კოდის დატოვება
7. აკრძალულია ფარული დამოკიდებულებების შექმნა
8. აკრძალულია გამონაკლისების „ჩაყლაპვა"
9. აკრძალულია ბუნდოვანი სახელების გამოყენება
10. აკრძალულია ინტერფეისის ქცევის ვარაუდი

---

## Glue Development შეზღუდვები

1. აკრძალულია დაბალი დონის ლოგიკის თვითნებური იმპლემენტაცია
2. გამოიყენეთ არსებული production-grade ბიბლიოთეკები
3. აკრძალულია დამოკიდებულების ბიბლიოთეკის კოპირება
4. აკრძალულია ბიბლიოთეკის ფუნქციური შეკვეცა
5. მიმდინარე პროექტს ევალება მხოლოდ ორკესტრირება
6. აკრძალულია ალგორითმების განმეორებითი იმპლემენტაცია`},{id:"meta-methodology",title:"მეტა-მეთოდოლოგია",isFree:!1,content:`# რეკურსიული თვითოპტიმიზირებადი სისტემები

## აბსტრაქტი

ჩვენ ვიკვლევთ რეკურსიული თვითოპტიმიზირებადი გენერაციული სისტემების კლასს, რომლის მიზანია სტაბილური გენერაციული შესაძლებლობების აგება.

---

## ძირითადი როლები

**α-Prompt (გენერატორი)**: "დედა" პრომპტი სხვა პრომპტების **გენერირებისთვის**

**Ω-Prompt (ოპტიმიზატორი)**: "დედა" პრომპტი სხვა პრომპტების **ოპტიმიზაციისთვის**

---

## რეკურსიული სასიცოცხლო ციკლი

### 1. შექმნა (Bootstrap)
გამოიყენეთ AI α-Prompt-ის და Ω-Prompt-ის საწყისი ვერსიების შესაქმნელად.

### 2. თვითანალიზი და ევოლუცია
გამოიყენეთ Ω-Prompt (v1) α-Prompt (v1)-ის ოპტიმიზაციისთვის.

### 3. შექმნა (Generation)
გამოიყენეთ ევოლუციური α-Prompt (v2) სამიზნე პრომპტების შესაქმნელად.

### 4. ციკლი და ნახტომი
დაუბრუნეთ ახლად გენერირებული პროდუქტები სისტემას.

---

## საბოლოო მიზანი

ამ უწყვეტი **რეკურსიული ოპტიმიზაციის ციკლის** საშუალებით, სისტემა აღწევს **თვითგადალახვას** ყოველ იტერაციაზე.`},{id:"programming-way",title:"პროგრამირების გზა",isFree:!1,content:`# 🧭 პროგრამირების გზა

> შეწყვიტე წყაროს ძიება, გამოიყენე მასწავლებელი ათმაგად.

ეს არის პროგრამირების არსის, აბსტრაქციის და ფილოსოფიის მონახაზი.

---

## 1. პროგრამის ონტოლოგია

- პროგრამა = მონაცემები + ფუნქცია
- შეყვანა → დამუშავება → გამოყვანა
- **პროგრამა არის სტრუქტურირებული აზროვნება**

---

## 2. სამი ბირთვი

### მონაცემები
- მონაცემთა სტრუქტურა = აზროვნების სტრუქტურა
- თუ მონაცემები ნათელია, პროგრამა ბუნებრივია

### ფუნქცია
- ლოგიკა უნდა იყოს გარდაქმნა და არა ოპერაცია

### აბსტრაქცია
- ზედმეტის მოცილება, ჭეშმარიტების შენარჩუნება

---

## დიზაინის პრინციპები

- **მაღალი შეჭიდულობა**: დაკავშირებული ახლოს
- **დაბალი გადაბმა**: რაც ნაკლებია დამოკიდებულება, მით გრძელია სიცოცხლე

---

## ციტატები

- მონაცემები ფაქტებია, ფუნქცია განზრახვაა
- ინტერფეისი კონტრაქტია, იმპლემენტაცია დეტალია
- კომპოზიცია აღემატება გაფართოებას
- არ გააკვირვო, უმაღლესი დიზაინია
- სიმარტივე საბოლოო სირთულეა

---

**პროგრამირების გზა არ გასწავლით კოდის წერას, ის გასწავლით როგორ გაიგოთ სამყარო**`},{id:"code-organization",title:"კოდის ორგანიზება",isFree:!1,content:`# კოდის ორგანიზება

> კოდის სტრუქტურა არის თქვენი გონების სტრუქტურა.

## 1. ფუნქციური შეჭიდულობა

ფაილები დააჯგუფეთ **რას აკეთებენ** მიხედვით:

- ❌ ცუდი: \`controllers\`, \`models\`, \`views\`
- ✅ კარგი: \`users\`, \`payments\`, \`orders\`

## 2. სიახლოვე (Locality)

ის, რაც ერთად იცვლება, უნდა იყოს ერთად.

## 3. მკაფიო საზღვრები

თითოეულ მოდულს უნდა ჰქონდეს მკაფიო \`public API\`.

## 4. ფაილების დასახელება

- იყავით კონკრეტული: \`utils.ts\` ❌ → \`date_formatter.ts\` ✅
- გამოიყენეთ ინგლისური ენა
- Kebab-case ან snake_case`},{id:"code-review",title:"კოდის განხილვა (Code Review)",isFree:!1,content:`# კოდის განხილვა (Code Review)

> კოდის განხილვა არ არის კრიტიკა, ეს არის ცოდნის გაზიარება და ხარისხის დაცვა.

## რას ვეძებთ?

1. **სისწორე**: აკეთებს თუ არა კოდი იმას, რაც უნდა?
2. **კითხვისადმი კომფორტი**: გასაგებია თუ არა?
3. **უსაფრთხოება**: SQL Injection, XSS?
4. **წარმადობა**: არაეფექტური ციკლები?
5. **ტესტები**: არის თუ არა დაფარული?

## როგორ განვიხილოთ?

- იყავით პატივისცემით განწყობილი
- დასვით კითხვები და არა ბრძანებები
- ფოკუსირდით კოდზე და არა პიროვნებაზე`},{id:"system-prompts",title:"სისტემური პრომპტების პრინციპები",isFree:!1,content:`# სისტემური პრომპტების პრინციპები

> კარგი პრომპტი არის კარგი პროგრამა.

## ძირითადი სტრუქტურა

1. **როლის განსაზღვრა**: "შენ ხარ გამოცდილი Python დეველოპერი..."
2. **კონტექსტი**: "ჩვენ ვმუშაობთ Django პროექტზე..."
3. **დავალება**: "შენი მიზანია დაწერო ფუნქცია..."
4. **შეზღუდვები**: "არ გამოიყენო გარე ბიბლიოთეკები..."
5. **ფორმატი**: "პასუხი მოგვწერე Markdown-ში"

## Few-Shot Prompting

მიეცით AI-ს მაგალითები:

\`\`\`
User: გადათარგმნე ინგლისურად: "გამარჯობა"
AI: Hello
User: გადათარგმნე ინგლისურად: "ნახვამდის"
AI: Goodbye
\`\`\``},{id:"architecture-template",title:"პროექტის არქიტექტურის შაბლონი",isFree:!1,content:`# პროექტის არქიტექტურის შაბლონი

> სტანდარტული სტრუქტურა ამცირებს ქაოსს.

## Python (ზოგადი)

\`\`\`
project_root/
├── .venv/              # ვირტუალური გარემო
├── src/                # წყარო კოდი
│   ├── __init__.py
│   ├── main.py
│   └── modules/
├── tests/              # ტესტები
├── docs/               # დოკუმენტაცია
├── requirements.txt
├── .gitignore
├── README.md
└── Makefile
\`\`\`

## Frontend (React/Vue)

\`\`\`
src/
├── components/         # ვიზუალური კომპონენტები
├── features/           # ბიზნეს ლოგიკა
├── hooks/              # Custom Hooks
├── utils/              # დამხმარე ფუნქციები
├── styles/             # CSS/Sass
└── types/              # TypeScript ტიპები
\`\`\`

**მთავარი პრინციპი**: შეინარჩუნეთ სიმარტივე.`}]},{id:"start",title:"დაწყება",icon:"\uD83D\uDE80",articles:[{id:"network-config",title:"ქსელის კონფიგურაცია",isFree:!0,content:`# ქსელის კონფიგურაცია

> "იარაღის მომზადებამდე, დარწმუნდით რომ ბრძოლის ველზე ხართ"

გლობალურ ცოდნასთან და AI სერვისებთან სტაბილური წვდომისთვის, აუცილებელია გამართული ქსელური გარემო.

## 🛠️ რეკომენდებული გადაწყვეტა

გამოიყენეთ **FlClash** ან **Clash Verge Rev**.

## ✅ საკვანძო ნაბიჯები

1. **Subscription-ის შეძენა**
2. **კლიენტის დაყენება**: გადმოწერეთ FlClash
3. **იმპორტი**: დაამატეთ Subscription URL
4. **TUN Mode**: აუცილებელია!
5. **შემოწმება**: \`curl google.com\``},{id:"environment-setup",title:"გარემოს აწყობა",isFree:!0,content:`# გარემოს აწყობა

> "კარგი გარემო = ნახევარი საქმე"

## Windows მომხმარებლებისთვის

აუცილებლად გამოიყენეთ **WSL2 (Windows Subsystem for Linux)**.

## macOS მომხმარებლებისთვის

გამოიყენეთ **Homebrew**.

## 📦 ძირითადი ინსტრუმენტები

1. **Git**: ვერსიების კონტროლი
2. **Node.js (LTS)**: გამოიყენეთ nvm ან fnm
3. **Python**: გამოიყენეთ pyenv
4. **საბაზისო CLI**: curl, wget, zip

**შემოწმება:**
\`\`\`bash
node -v
python --version
git --version
\`\`\``},{id:"ide-config",title:"IDE კონფიგურაცია",isFree:!1,content:`# IDE კონფიგურაცია

> "ოსტატის სახელოსნო"

## 🖱️ Cursor (რეკომენდებული)

Cursor არის VS Code-ის ფორკი, ჩაშენებული AI-თ.

1. გადმოწერეთ cursor.com-დან
2. \`Ctrl+K\` - კოდის სწრაფი გენერაცია
3. \`Ctrl+L\` - ჩატი

## 🧩 აუცილებელი ექსთენშენები

- **ESLint / Prettier**: კოდის სისუფთავე
- **GitLens**: ისტორიის ნახვა
- **Code Spell Checker**: ტაიპოების თავიდან აცილება
- **Material Icon Theme**: ლამაზი აიკონები`}]},{id:"methodology",title:"მეთოდოლოგია",icon:"\uD83C\uDFA8",articles:[{id:"canvas-whiteboard",title:"Canvas დაფა დრაივი",isFree:!0,content:`# 🚀 Canvas დაფა დრაივი

## ტექსტიდან გრაფიკამდე: პროგრამირების თანამშრომლობის ახალი პარადიგმა

### 💡 ძირითადი აღმოჩენა

ტრადიციული პროცესი:
\`\`\`
კოდის წერა → სიტყვიერი კომუნიკაცია → ქაოსი
\`\`\`

**ახალი მეთოდი**:
\`\`\`
კოდი ⇄ Canvas დაფა ⇄ AI ⇄ ადამიანი
\`\`\`

---

### 🎯 რას წყვეტს ეს მეთოდი?

| ტკივილი | გადაწყვეტა |
|:---|:---|
| AI ვერ ხედავს სტრუქტურას | AI პირდაპირ კითხულობს დაფის JSON-ს |
| არ ახსოვს დამოკიდებულებები | კავშირები ნათელია დაფაზე |
| გუნდური კომუნიკაცია | მიუთითეთ დაფაზე |

---

### 🌟 ინოვაცია

**Canvas დაფა = ერთადერთი ჭეშმარიტების წყარო**

კოდი მხოლოდ მისი სერიალიზებული ფორმაა.`},{id:"canvas-advanced",title:"Canvas Whiteboard Development",isFree:!0,content:`# 🚀 Canvas დაფით მართული დეველოპმენტი

> ტექსტიდან გრაფიკამდე: კოლაბორაციის ახალი პარადიგმა.

## სამუშაო პროცესი (Workflow)

### ნაბიჯი 1: დაფის ავტომატური განახლება
თუ წერთ PaymentService-ს, AI ავტომატურად ხედავს კავშირებს.

### ნაბიჯი 2: ერთობლივი რედაქტირება
თქვენ ხაზავთ ისარს UserService-დან PaymentService-კენ.

### ნაბიჯი 3: დაფა როგორც ცენტრი
- **Refactoring**: გადააადგილე ბლოკი
- **Code Review**: შეამოწმე ვიზუალურად

## 🛠️ ინსტრუმენტები

- **Obsidian Canvas**: უფასო და ღია
- **Claude / GPT-4**: Canvas JSON-ის წაკითხვა`},{id:"ssh-mobile",title:"SSH წვდომა მობილურიდან (FRP)",isFree:!1,content:`# 📱 მობილურიდან SSH წვდომა (FRP)

> როგორ დაუკავშირდეთ თქვენს სახლის კომპიუტერს ნებისმიერი წერტილიდან.

## 📌 რა დაგჭირდებათ?

1. **AWS EC2** (ან ნებისმიერი VPS)
2. **Windows PC** OpenSSH Server-ით
3. **FRP (Fast Reverse Proxy)**
4. **Termius**: მობილური SSH კლიენტი

## 🛠️ არქიტექტურა

\`\`\`
[მობილური] --(SSH)--> [AWS EC2 (FRP Server)] --(FRP Tunnel)--> [სახლის PC]
\`\`\`

## 🚀 ნაბიჯი 1: AWS EC2 (FRP Server)

1. გადმოწერეთ frp_linux_amd64
2. კონფიგურაცია frps.ini
3. გაუშვით: ./frps -c frps.ini

## 🖥️ ნაბიჯი 2: Windows PC (FRP Client)

1. გადმოწერეთ frp_windows_amd64
2. კონფიგურაცია frpc.ini
3. გაუშვით: frpc.exe -c frpc.ini

## 📱 ნაბიჯი 3: Termius (მობილური)

1. დააყენეთ Termius
2. დაამატეთ SSH connection
3. Host: AWS EC2 IP
4. Port: 6000

ახლა შეგიძლიათ SSH წვდომა სახლის PC-ზე ნებისმიერი ადგილიდან!`}]},{id:"beginners-guide",title:"\uD83C\uDF93 დამწყებთა სრული გზამკვლევი",icon:"\uD83C\uDF93",articles:[{id:"first-7-days",title:"პირველი 7 დღე Vibe Coding-ში",isFree:!0,content:`# პირველი 7 დღე Vibe Coding-ში

> დეტალური roadmap დამწყებთათვის - ნაბიჯ-ნაბიჯ

## 📅 დღე 1: დაწყება

### დილა (2 საათი)
**9:00-10:00** - ინსტრუმენტის არჩევა
- გადმოწერეთ Cursor (რეკომენდებული)
- ან ChatGPT Plus
- ან Claude Pro

**10:00-11:00** - პირველი კონფიგურაცია
- დააყენეთ IDE
- შექმენით account
- გაეცანით interface-ს

### საღამო (2 საათი)
**19:00-21:00** - პირველი კოდი
- "Hello World" HTML გვერდი
- პირველი prompt: "შექმენი HTML გვერდი სათაურით Hello World"
- გაუშვით browser-ში

**შედეგი**: მუშა HTML გვერდი ✅

---

## 📅 დღე 2-3: ძირითადი კონცეფციები

### დღე 2: Calculator აპლიკაცია

**Prompt:**
"შექმენი კალკულატორი HTML/CSS/JavaScript-ით:
- 4 ძირითადი ოპერაცია (+, -, *, /)
- თანამედროვე დიზაინი
- responsive"

**რას ისწავლით:**
- HTML სტრუქტურა
- CSS styling
- JavaScript events
- როგორ ვუთხრათ AI-ს რა გვინდა

### დღე 3: გაუმჯობესება

**Prompt:**
"დაამატე კალკულატორს:
- ისტორია (ბოლო 5 გამოთვლა)
- keyboard support
- dark mode toggle"

**რას ისწავლით:**
- როგორ გავაუმჯობესოთ არსებული კოდი
- ახალი ფუნქციების დამატება
- UI/UX გაუმჯობესება

---

## 📅 დღე 4-5: პირველი რეალური პროექტი

### დღე 4: To-Do აპლიკაცია

**Prompt:**
"შექმენი To-Do აპლიკაცია:
- დავალების დამატება/წაშლა
- checkbox დასრულებისთვის
- Local Storage შენახვა
- ფილტრები: All, Active, Completed"

**დრო**: 3-4 საათი

### დღე 5: დიზაინი და ანიმაციები

**Prompt:**
"გააუმჯობესე To-Do აპლიკაცია:
- Tailwind CSS styling
- smooth animations
- drag & drop
- priority levels (high, medium, low)"

**რას ისწავლით:**
- CSS frameworks
- Animations
- Advanced interactions

---

## 📅 დღე 6-7: პორტფოლიო პროექტი

### დღე 6: პორტფოლიო საიტი

**Prompt:**
"შექმენი პორტფოლიო ვებსაიტი:
- Hero section ჩემი ფოტოთი
- About section
- Projects gallery (3 პროექტი)
- Contact form
- Responsive design
- Modern animations"

**დრო**: 4-5 საათი

### დღე 7: Deployment

**Prompt:**
"დაეხმარე deployment-ში:
- GitHub repository შექმნა
- Vercel-ზე deployment
- Custom domain დაკავშირება"

**შედეგი**: ცოცხალი საიტი ინტერნეტში! 🚀

---

## 📊 რას მიაღწიეთ 7 დღეში?

✅ **4 მუშა პროექტი:**
1. Hello World
2. Calculator
3. To-Do App
4. Portfolio Website

✅ **ტექნიკური უნარები:**
- HTML/CSS/JavaScript basics
- Responsive design
- Local Storage
- Git & GitHub
- Deployment

✅ **Vibe Coding უნარები:**
- Prompt writing
- Iterative development
- Debugging with AI
- Code improvement

---

## 🎯 შემდეგი ნაბიჯები

**კვირა 2:**
- React basics
- API integration
- Database (Firebase)

**კვირა 3:**
- Full-stack app
- Authentication
- Real project

**თვე 2:**
- Advanced patterns
- Performance
- Production deployment

---

## 💡 რჩევები წარმატებისთვის

1. **ყოველდღე 2+ საათი** - კონსისტენტურობა მთავარია
2. **ყოველთვის ტესტირება** - არ ენდოთ AI-ს ბრმად
3. **შეცდომები ნორმალურია** - ისწავლეთ მათგან
4. **დოკუმენტირება** - წერეთ რას აკეთებთ
5. **Community** - შეუერთდით ფორუმებს

**გაიხსენეთ**: 7 დღის შემდეგ უკვე შეგიძლიათ შექმნათ რეალური აპლიკაციები! 🎉`},{id:"common-mistakes",title:"20 ყველაზე გავრცელებული შეცდომა",isFree:!0,content:`# 20 ყველაზე გავრცელებული შეცდომა Vibe Coding-ში

> და როგორ ავიცილოთ თავიდან

---

## ❌ შეცდომა #1: ბუნდოვანი Prompt-ები

**ცუდი:**
"გააკეთე საიტი"

**კარგი:**
"შექმენი landing page React-ით, Tailwind CSS-ით, hero section, features, pricing, footer"

**რატომ:** AI-ს სჭირდება კონკრეტული ინსტრუქციები

---

## ❌ შეცდომა #2: კონტექსტის არმიცემა

**ცუდი:**
"დაამატე ღილაკი"

**კარგი:**
"დაამატე ღილაკი UserCard კომპონენტში, რომელიც იღებს onClick prop-ს და აჩვენებს 'View Profile' ტექსტს"

**რატომ:** AI უნდა იცოდეს სად და რა

---

## ❌ შეცდომა #3: AI-ს ბრმად ნდობა

**პრობლემა:**
- AI შეიძლება შეცდეს
- შეიძლება დაწეროს არაუსაფრთხო კოდი
- შეიძლება გამოიყენოს deprecated ბიბლიოთეკები

**გადაწყვეტა:**
✅ ყოველთვის ამოწმებთ კოდს
✅ ტესტირება
✅ Security review

---

## ❌ შეცდომა #4: დიდი ცვლილებები ერთბაშად

**ცუდი:**
"შექმენი სრული e-commerce საიტი ყველა ფუნქციით"

**კარგი:**
1. "შექმენი product listing"
2. "დაამატე shopping cart"
3. "დაამატე checkout"
4. "დაამატე payment"

**რატომ:** მცირე ნაბიჯები = ნაკლები შეცდომა

---

## ❌ შეცდომა #5: არ იკითხავს როცა არ ესმის

**პრობლემა:**
AI დაწერს კოდს, თქვენ არ გესმით, მაგრამ იყენებთ

**გადაწყვეტა:**
"ახსენი ეს კოდი ხაზ-ხაზ, რა აკეთებს თითოეული ნაწილი?"

---

## ❌ შეცდომა #6: Environment Variables-ის იგნორირება

**ცუდი:**
\`\`\`javascript
const API_KEY = "sk-1234567890abcdef"
\`\`\`

**კარგი:**
\`\`\`javascript
const API_KEY = process.env.NEXT_PUBLIC_API_KEY
\`\`\`

**რატომ:** უსაფრთხოება!

---

## ❌ შეცდომა #7: Error Handling-ის დავიწყება

**ცუდი:**
\`\`\`javascript
const data = await fetch(url)
\`\`\`

**კარგი:**
\`\`\`javascript
try {
  const data = await fetch(url)
} catch (error) {
  console.error('Error:', error)
}
\`\`\`

---

## ❌ შეცდომა #8: არ იყენებს Git

**პრობლემა:**
- კოდის დაკარგვა
- ვერსიების არევა
- ვერ დაბრუნდები წინა ვერსიაზე

**გადაწყვეტა:**
✅ Git init
✅ Regular commits
✅ GitHub backup

---

## ❌ შეცდომა #9: Mobile Responsive-ის დავიწყება

**პრობლემა:**
საიტი კარგად გამოიყურება desktop-ზე, ცუდად mobile-ზე

**გადაწყვეტა:**
"გააკეთე responsive ყველა device-ზე"

---

## ❌ შეცდომა #10: არ ტესტირებს სხვადასხვა Browser-ში

**პრობლემა:**
მუშაობს Chrome-ში, არ მუშაობს Safari-ში

**გადაწყვეტა:**
✅ Chrome
✅ Firefox
✅ Safari
✅ Edge

---

## ❌ შეცდომა #11: Performance-ის იგნორირება

**პრობლემა:**
- ნელი ჩატვირთვა
- დიდი bundle size
- არაოპტიმიზირებული სურათები

**გადაწყვეტა:**
"ოპტიმიზაცია გაუკეთე performance-ისთვის"

---

## ❌ შეცდომა #12: არ კითხულობს Error Messages

**პრობლემა:**
Error-ი გამოდის, იგნორირებთ

**გადაწყვეტა:**
წაიკითხეთ error, copy-paste AI-ში: "რა არის ეს error და როგორ გავასწორო?"

---

## ❌ შეცდომა #13: Accessibility-ის დავიწყება

**პრობლემა:**
საიტი არ არის accessible შეზღუდული შესაძლებლობების მქონე ადამიანებისთვის

**გადაწყვეტა:**
"დაამატე accessibility features: alt text, ARIA labels, keyboard navigation"

---

## ❌ შეცდომა #14: არ იყენებს TypeScript

**პრობლემა:**
JavaScript-ში ბევრი runtime error

**გადაწყვეტა:**
"გადააკეთე TypeScript-ზე"

---

## ❌ შეცდომა #15: Copy-Paste ყოველთვის

**პრობლემა:**
არ სწავლობთ, მხოლოდ copy-paste

**გადაწყვეტა:**
✅ წაიკითხეთ კოდი
✅ გაიგეთ რას აკეთებს
✅ შეეცადეთ თავად დაწეროთ

---

## ❌ შეცდომა #16: არ იყენებს Linter/Formatter

**პრობლემა:**
არეული, არაკონსისტენტური კოდი

**გადაწყვეტა:**
✅ ESLint
✅ Prettier
✅ Auto-format on save

---

## ❌ შეცდომა #17: Hardcoded Values

**ცუდი:**
\`\`\`javascript
if (user.role === "admin")
\`\`\`

**კარგი:**
\`\`\`javascript
const ROLES = { ADMIN: "admin", USER: "user" }
if (user.role === ROLES.ADMIN)
\`\`\`

---

## ❌ შეცდომა #18: არ წერს Comments

**პრობლემა:**
1 თვის შემდეგ არ გახსოვთ რას აკეთებს კოდი

**გადაწყვეტა:**
\`\`\`javascript
// Calculate total price with discount
const total = price * (1 - discount)
\`\`\`

---

## ❌ შეცდომა #19: არ იყენებს Version Control

**პრობლემა:**
ყველაფერი local-ზე, backup არ არის

**გადაწყვეტა:**
✅ GitHub
✅ Daily commits
✅ Meaningful commit messages

---

## ❌ შეცდომა #20: იმედგაცრუება სწრაფად

**პრობლემა:**
"ვერ გამოვა, Vibe Coding არ მუშაობს"

**რეალობა:**
- პირველი 10 პროექტი რთულია
- შემდეგ ხდება ადვილი
- პრაქტიკა, პრაქტიკა, პრაქტიკა

**გადაწყვეტა:**
✅ არ დანებდეთ
✅ ისწავლეთ შეცდომებიდან
✅ თანდათან გაუმჯობესდებით

---

## 🎯 Checklist თითოეული პროექტისთვის

✅ კონკრეტული prompt-ები
✅ კონტექსტის მიცემა
✅ კოდის შემოწმება
✅ Error handling
✅ Git commits
✅ Responsive design
✅ Browser testing
✅ Performance check
✅ Accessibility
✅ Security review

**გაიხსენეთ**: შეცდომები ნორმალურია, მთავარია ისწავლოთ მათგან! 💪`},{id:"cheat-sheet",title:"Vibe Coding Cheat Sheet - ყველაფერი ერთ გვერდზე",isFree:!1,content:`# Vibe Coding Cheat Sheet

> ყველა მთავარი რამ ერთ ადგილას

## ⌨️ Keyboard Shortcuts

### Cursor
- \`Cmd/Ctrl + K\` - AI Chat
- \`Cmd/Ctrl + L\` - Composer Mode
- \`Tab\` - Accept suggestion
- \`Cmd/Ctrl + I\` - Inline edit
- \`Cmd/Ctrl + Shift + P\` - Command palette

### VS Code + Copilot
- \`Alt + ]\` - Next suggestion
- \`Alt + [\` - Previous suggestion
- \`Ctrl + Enter\` - Show all suggestions

---

## 💡 Prompt Templates

### შექმნა
"შექმენი [ტიპი] [ტექნოლოგია]-ით რომელიც [ფუნქცია]"

**მაგალითი:**
"შექმენი React კომპონენტი TypeScript-ით რომელიც აჩვენებს user card-ს"

### გაუმჯობესება
"გააუმჯობესე [ფაილი/კომპონენტი] და დაამატე [ფუნქცია]"

### Debugging
"რა არის პრობლემა ამ კოდში და როგორ გავასწორო?"

### Refactoring
"refactor გაუკეთე ამ კოდს: [მიზეზი]"

### ტესტირება
"დაწერე unit tests [ფუნქცია/კომპონენტი]-სთვის"

---

## 🎯 Best Practices

### DO ✅
- კონკრეტული prompt-ები
- კონტექსტის მიცემა
- მცირე ცვლილებები
- კოდის შემოწმება
- Git commits

### DON'T ❌
- ბუნდოვანი prompt-ები
- დიდი ცვლილებები ერთბაშად
- ბრმად ნდობა AI-ს
- კოდის არგაგება
- Security იგნორირება

---

## 🔧 Common Commands

### Git
\`\`\`bash
git init
git add .
git commit -m "message"
git push origin main
\`\`\`

### npm
\`\`\`bash
npm install
npm run dev
npm run build
npm run start
\`\`\`

### Deployment
\`\`\`bash
vercel deploy
netlify deploy
\`\`\`

---

## 🐛 Debugging

### Error Types
1. **Syntax Error** - წერტილები, მძიმეები
2. **Runtime Error** - undefined, null
3. **Logic Error** - არასწორი ლოგიკა

### Debug Steps
1. წაიკითხე error message
2. console.log() დამატება
3. Browser DevTools
4. AI-ს კითხვა

---

## 📦 Essential Packages

### React
\`\`\`bash
npm i react react-dom
npm i -D @types/react
\`\`\`

### Styling
\`\`\`bash
npm i tailwindcss
npm i styled-components
\`\`\`

### Utils
\`\`\`bash
npm i axios
npm i date-fns
npm i lodash
\`\`\`

---

## 🎨 UI Components Prompt

"შექმენი [კომპონენტი] რომელსაც აქვს:
- Props: [სია]
- State: [სია]
- Styling: Tailwind CSS
- Responsive: mobile-first
- Accessibility: ARIA labels"

---

## 🔐 Security Checklist

✅ Environment variables
✅ Input validation
✅ SQL injection prevention
✅ XSS protection
✅ HTTPS only
✅ Authentication
✅ Authorization

---

## 📊 Performance

### Optimization
- Image optimization
- Code splitting
- Lazy loading
- Caching
- Minification

### Tools
- Lighthouse
- Chrome DevTools
- React Profiler

---

## 🚀 Deployment

### Vercel
\`\`\`bash
vercel login
vercel
\`\`\`

### Netlify
\`\`\`bash
netlify login
netlify deploy
\`\`\`

---

**დაბეჭდეთ და ჰქონდეთ ხელთ! 📄**`}]},{id:"glossary",title:"ტერმინების განმარტება",icon:"\uD83D\uDCD6",articles:[{id:"vibe-coding-glossary",title:"Vibe Coding ტერმინების სრული ლექსიკონი",isFree:!1,content:`# Vibe Coding ტერმინების სრული ლექსიკონი

> ყველა ტერმინი რაც უნდა იცოდეთ AI პროგრამირებაში

## 🎯 ძირითადი ტერმინები

### Vibe Coding
AI-ასისტირებული პროგრამირების მეთოდი, სადაც დეველოპერი აღწერს სასურველ ფუნქციონალს ბუნებრივ ენაზე, ხოლო AI გენერირებს კოდს.

### Prompt
ინსტრუქცია ან მოთხოვნა რომელსაც აძლევთ AI-ს. მაგალითი: "შექმენი ფუნქცია რომელიც დაალაგებს მასივს".

### Context Window
ტექსტის მაქსიმალური რაოდენობა რომელსაც AI შეუძლია "დაიმახსოვროს" ერთდროულად. GPT-4: 128K tokens, Claude: 200K tokens.

### Token
ტექსტის მცირე ნაწილი (დაახლოებით 4 სიმბოლო). გამოიყენება AI მოდელების შეზღუდვების გასაზომად.

### LLM (Large Language Model)
დიდი ენობრივი მოდელი - AI სისტემა რომელიც ვარჯიშდება უზარმაზარ ტექსტურ მონაცემებზე. მაგალითები: GPT-4, Claude, Gemini.

---

## 🛠️ ინსტრუმენტები

### Cursor
VS Code-ზე დაფუძნებული IDE AI ინტეგრაციით. ყველაზე პოპულარული Vibe Coding ინსტრუმენტი.

### GitHub Copilot
Microsoft-ის AI კოდის ასისტენტი რომელიც მუშაობს ყველა IDE-ში.

### Claude
Anthropic-ის AI მოდელი, განსაკუთრებით ძლიერი კოდირებაში.

### ChatGPT
OpenAI-ის AI ჩატბოტი, გამოიყენება კოდის გენერაციისთვის.

---

## 💡 Prompt Engineering ტერმინები

### Zero-shot Prompting
AI-სთვის დავალების მიცემა ყოველგვარი მაგალითის გარეშე.

### Few-shot Prompting
AI-სთვის რამდენიმე მაგალითის მიწოდება სანამ ძირითად დავალებას მიაწვდით.

### Chain-of-Thought
AI-ს სთხოვთ ნაბიჯ-ნაბიჯ ახსნას თავისი აზროვნების პროცესი.

### System Prompt
საწყისი ინსტრუქცია რომელიც განსაზღვრავს AI-ს ქცევას მთელი სესიის განმავლობაში.

---

## 🔧 ტექნიკური ტერმინები

### Hallucination
როდესაც AI გამოგონილ ან არასწორ ინფორმაციას აწარმოებს როგორც ფაქტს.

### Temperature
პარამეტრი რომელიც აკონტროლებს AI-ს კრეატიულობას. 0 = პროგნოზირებადი, 1 = კრეატიული.

### Fine-tuning
AI მოდელის დამატებითი ტრენინგი სპეციფიკურ მონაცემებზე.

### RAG (Retrieval-Augmented Generation)
ტექნიკა სადაც AI იყენებს გარე მონაცემებს პასუხების გასაუმჯობესებლად.

---

## 📊 შეფასების ტერმინები

### Accuracy
სიზუსტე - რამდენად სწორია AI-ს პასუხები.

### Latency
დაყოვნება - დრო რომელიც სჭირდება AI-ს პასუხის გენერაციას.

### Throughput
გამტარუნარიანობა - რამდენ მოთხოვნას ამუშავებს AI წამში.

---

**სრული ლექსიკონი 100+ ტერმინით ხელმისაწვდომია პრემიუმ წევრებისთვის!**`},{id:"ai-history",title:"AI პროგრამირების ისტორია",isFree:!1,content:`# AI პროგრამირების ისტორია

> როგორ მივიდა კაცობრიობა Vibe Coding-მდე

## 📅 Timeline

### 1950s - დასაწყისი
- Alan Turing: "Can machines think?"
- პირველი AI კონცეფციები

### 1960s-1980s - ადრეული ექსპერიმენტები
- ELIZA (1966) - პირველი chatbot
- Expert Systems - წესებზე დაფუძნებული AI

### 1990s-2000s - Machine Learning
- Neural Networks აღორძინება
- Google Search (1998)

### 2010s - Deep Learning რევოლუცია
- ImageNet (2012) - breakthrough
- AlphaGo (2016) - AI ამარცხებს ჩემპიონს

### 2020 - GPT-3
- OpenAI-ს მოდელი რომელმაც შეცვალა ყველაფერი
- პირველად კოდის ხარისხიანი გენერაცია

### 2021 - GitHub Copilot
- პირველი mainstream AI კოდის ასისტენტი
- მილიონობით დეველოპერი იწყებს გამოყენებას

### 2022 - ChatGPT
- 100M მომხმარებელი 2 თვეში
- AI ხდება mainstream

### 2023 - GPT-4 & Claude
- მულტიმოდალური მოდელები
- კოდის ხარისხი მკვეთრად იზრდება

### 2024 - AI Agents
- Cursor, Windsurf, Devin
- ავტონომიური კოდირება

### 2025 - Vibe Coding Era
- Andrej Karpathy ქმნის ტერმინს
- Collins Word of the Year
- 25% Y Combinator startup-ების კოდი AI-გენერირებული

---

## 🎯 მომავალი

### 2026-2030 პროგნოზები
- AI-ით დაწერილი კოდი 50%+
- ახალი პროფესიები: Prompt Engineer, AI Architect
- სრულად ავტონომიური AI დეველოპერები

**დეტალური ისტორია და ანალიზი პრემიუმ ვერსიაში!**`}]},{id:"tools-setup",title:"\uD83D\uDEE0️ ინსტრუმენტები და დაყენება",icon:"\uD83D\uDEE0️",articles:[{id:"cursor-setup",title:"Cursor - სრული დაყენების გზამკვლევი",isFree:!1,content:`# Cursor - სრული დაყენების გზამკვლევი

> ყველაზე პოპულარული Vibe Coding ინსტრუმენტის დაყენება ნულიდან

## 📥 ინსტალაცია

### Windows
1. გადმოწერეთ cursor.sh
2. გაუშვით installer
3. აირჩიეთ installation path
4. დაელოდეთ დაყენებას

### macOS
1. გადმოწერეთ .dmg ფაილი
2. გადაიტანეთ Applications-ში
3. პირველი გაშვება: Right-click → Open

### Linux
1. გადმოწერეთ .AppImage
2. chmod +x cursor.AppImage
3. გაუშვით

---

## ⚙️ პირველადი კონფიგურაცია

### 1. AI Model არჩევა

**Settings → Models:**
- GPT-4: ყველაზე ძლიერი, ნელი
- GPT-3.5: სწრაფი, კარგი ბალანსი
- Claude: შესანიშნავი კოდისთვის

**რჩევა**: დაიწყეთ GPT-4-ით

### 2. Keyboard Shortcuts

ძირითადი:
- Cmd/Ctrl + K: AI Chat
- Cmd/Ctrl + L: Composer Mode
- Tab: Accept suggestion

### 3. Extensions

რეკომენდებული:
- Prettier - კოდის ფორმატირება
- ESLint - ერორების დეტექცია
- GitLens - Git ინტეგრაცია

---

## 🎯 ფუნქციები

### Tab Completion
ავტომატური კოდის დასრულება

### Composer Mode
მთელი ფაილების რედაქტირება

### @-mentions
ფაილების კონტექსტის დამატება

---

**სრული გზამკვლევი ყველა ფუნქციით პრემიუმ ვერსიაში!**`},{id:"cursor-vs-copilot",title:"Cursor vs GitHub Copilot - დეტალური შედარება",isFree:!1,content:`# Cursor vs GitHub Copilot

> რომელი აირჩიოთ 2026 წელს?

## 📊 სწრაფი შედარება

| ფუნქცია | Cursor | Copilot |
|---------|--------|---------|
| ფასი | $20/თვე | $10/თვე |
| AI მოდელი | GPT-4, Claude | GPT-4 |
| IDE | Cursor only | ყველა IDE |
| Chat | ✅ | ✅ |
| Composer | ✅ | ❌ |
| @-mentions | ✅ | Limited |

---

## 🎯 Cursor უპირატესობები

1. **Composer Mode** - მთელი პროექტის რედაქტირება
2. **@-mentions** - ფაილების კონტექსტი
3. **Multiple Models** - GPT-4 + Claude
4. **Better Context** - უკეთესი გაგება პროექტის

---

## 🎯 Copilot უპირატესობები

1. **იაფია** - $10 vs $20
2. **ყველა IDE** - VS Code, JetBrains, Vim
3. **GitHub ინტეგრაცია** - native
4. **Stable** - მეტი გამოცდილება

---

## 💡 ვის რა უნდა აირჩიოს?

**Cursor თუ:**
- გჭირდება ძლიერი AI
- მუშაობ კომპლექსურ პროექტებზე
- გინდა Composer Mode

**Copilot თუ:**
- იყენებ JetBrains/Vim
- გჭირდება იაფი ვარიანტი
- საკმარისია ბაზისური ფუნქციები

---

**დეტალური შედარება და რეკომენდაციები პრემიუმ ვერსიაში!**`},{id:"vscode-extensions",title:"20 საუკეთესო VS Code Extension Vibe Coding-ისთვის",isFree:!1,content:`# 20 საუკეთესო VS Code Extension

> გააძლიერე შენი Vibe Coding გამოცდილება

## 🤖 AI Extensions

### 1. GitHub Copilot
ყველაზე პოპულარული AI ასისტენტი

### 2. Tabnine
AI კოდის დასრულება

### 3. Codeium
უფასო AI ასისტენტი

---

## 🎨 Code Quality

### 4. Prettier
კოდის ავტომატური ფორმატირება

### 5. ESLint
JavaScript/TypeScript linting

### 6. SonarLint
კოდის ხარისხის ანალიზი

---

## 🔧 Productivity

### 7. GitLens
Git supercharged

### 8. Live Share
რეალურ დროში კოლაბორაცია

### 9. Todo Tree
TODO კომენტარების ტრეკინგი

---

## 🌈 UI/UX

### 10. Material Icon Theme
ლამაზი აიქონები

### 11. One Dark Pro
პოპულარული თემა

### 12. Bracket Pair Colorizer
ფრჩხილების ფერები

---

**სრული სია 20 extension-ით პრემიუმ ვერსიაში!**`}]},{id:"advanced-prompts",title:"\uD83C\uDFAF Advanced Prompt Engineering",icon:"\uD83C\uDFAF",articles:[{id:"advanced-prompt-patterns",title:"Advanced Prompt Patterns - Master Level",isFree:!1,content:`# Advanced Prompt Patterns

> პროფესიონალური ტექნიკები რთული პრობლემების გადასაჭრელად

## 🧠 Chain-of-Thought (CoT)

### რა არის?
AI-ს სთხოვთ ნაბიჯ-ნაბიჯ ფიქრი პასუხის გაცემამდე

### როდის გამოიყენოთ?
- რთული ლოგიკური პრობლემები
- მათემატიკური გამოთვლები
- მრავალნაბიჯიანი ალგორითმები

### Prompt Template:
"გადაწყვიტე ეს პრობლემა ნაბიჯ-ნაბიჯ:
1. გააანალიზე რა გვაქვს
2. დაგეგმე გადაწყვეტა
3. დაწერე კოდი
4. ახსენი რატომ მუშაობს"

---

## 🌳 Tree-of-Thought (ToT)

### რა არის?
AI იკვლევს მრავალ შესაძლო გადაწყვეტას პარალელურად

### Prompt:
"მომეცი 3 განსხვავებული მიდგომა ამ პრობლემის გადასაჭრელად:
- მიდგომა A: [აღწერა]
- მიდგომა B: [აღწერა]  
- მიდგომა C: [აღწერა]

შეადარე და აირჩიე საუკეთესო"

---

## 🔄 Self-Consistency

### რა არის?
იგივე prompt-ს უგზავნით რამდენჯერმე და ვადარებთ პასუხებს

### როდის გამოიყენოთ?
- კრიტიკული კოდი
- უსაფრთხოების საკითხები
- რთული არქიტექტურული გადაწყვეტილებები

### Prompt:
"გადაწყვიტე ეს პრობლემა 3 განსხვავებული გზით და შეადარე შედეგები"

---

## 🎭 Role-Playing

### რა არის?
AI-ს აძლევთ კონკრეტულ როლს

### მაგალითები:

**Senior Developer:**
"მოიქეცი როგორც Senior React Developer 10 წლიანი გამოცდილებით. განიხილე ეს კოდი და მომეცი feedback."

**Security Expert:**
"მოიქეცი როგორც Security Auditor. შეამოწმე ეს კოდი vulnerabilities-ზე."

**Code Reviewer:**
"მოიქეცი როგორც Tech Lead. გააკეთე code review და მომეცი constructive feedback."

---

## 📝 Few-Shot Learning

### რა არის?
მაგალითების მიწოდება prompt-ში

### Template:
"შექმენი ფუნქცია მსგავსი ამ მაგალითების:

მაგალითი 1:
Input: [x]
Output: [y]

მაგალითი 2:
Input: [x]
Output: [y]

ახლა შექმენი: [შენი დავალება]"

---

## 🔍 ReAct Pattern

### რა არის?
Reasoning + Acting - ფიქრი და მოქმედება ციკლში

### Prompt:
"გადაწყვიტე ეს პრობლემა ReAct მეთოდით:

Thought: რა უნდა გავაკეთო?
Action: კონკრეტული ნაბიჯი
Observation: რა მოხდა?
Thought: შემდეგი ნაბიჯი?
Action: ...

გააგრძელე სანამ არ გადაწყდება"

---

## 🎯 Constraint-Based Prompting

### რა არის?
კონკრეტული შეზღუდვების დაწესება

### Prompt:
"შექმენი React კომპონენტი შემდეგი შეზღუდვებით:
- მაქსიმუმ 50 ხაზი კოდი
- არ გამოიყენო external libraries
- TypeScript strict mode
- 100% test coverage
- Performance: < 16ms render time"

---

## 🔄 Iterative Refinement

### რა არის?
თანდათანობითი გაუმჯობესება

### Process:
1. "შექმენი basic version"
2. "დაამატე error handling"
3. "ოპტიმიზაცია გაუკეთე performance-ისთვის"
4. "დაამატე tests"
5. "დაამატე documentation"

---

## 🎨 Meta-Prompting

### რა არის?
AI-ს სთხოვთ შექმნას prompt

### Prompt:
"დაწერე optimal prompt რომელიც დაეხმარება დეველოპერს შექმნას secure authentication system. Prompt-ში უნდა იყოს:
- კონტექსტი
- მოთხოვნები
- შეზღუდვები
- მაგალითები"

---

## 💡 Socratic Method

### რა არის?
AI დაგისვამთ კითხვებს რომ თავად იფიქროთ

### Prompt:
"არ მომცე პირდაპირ პასუხი. დამისვი კითხვები რომ თავად გავიგო როგორ გადავჭრა ეს პრობლემა."

---

## 🔧 Debugging Pattern

### Advanced Debugging Prompt:
"Debug ეს კოდი შემდეგი სტრუქტურით:

1. Error Analysis:
   - რა error-ია?
   - სად ხდება?
   - რატომ ხდება?

2. Root Cause:
   - რა არის ძირითადი მიზეზი?
   - რა გამოიწვია?

3. Solutions:
   - გადაწყვეტა 1 (სწრაფი fix)
   - გადაწყვეტა 2 (proper fix)
   - გადაწყვეტა 3 (long-term solution)

4. Prevention:
   - როგორ ავიცილოთ მომავალში?"

---

## 📊 Comparison Pattern

### Prompt:
"შეადარე ეს 3 მიდგომა:

Approach A: [აღწერა]
Approach B: [აღწერა]
Approach C: [აღწერა]

შედარების კრიტერიუმები:
- Performance
- Maintainability
- Scalability
- Security
- Developer Experience

რეკომენდაცია: [რომელი და რატომ]"

---

## 🎯 Context Injection

### რა არის?
მაქსიმალური კონტექსტის მიწოდება

### Template:
"კონტექსტი:
- პროექტი: [სახელი]
- Stack: [ტექნოლოგიები]
- Team size: [რაოდენობა]
- Timeline: [დრო]
- Constraints: [შეზღუდვები]

დავალება: [რა უნდა გაკეთდეს]

მოსალოდნელი შედეგი: [რა უნდა მივიღოთ]"

---

## 💪 Combination Patterns

### Ultimate Prompt:
"მოიქეცი როგორც Senior Architect (Role-Playing)

გადაწყვიტე ეს პრობლემა ნაბიჯ-ნაბიჯ (Chain-of-Thought)

მომეცი 3 მიდგომა (Tree-of-Thought)

შეადარე მათ (Comparison)

აირჩიე საუკეთესო და ახსენი რატომ (Reasoning)

დაწერე კოდი შეზღუდვებით (Constraint-Based)

გააკეთე self-review (Self-Consistency)"

---

**ეს პატერნები გადააქცევს თქვენ Prompt Engineering Master-ად! 🚀**`},{id:"debugging-with-ai",title:"Debugging with AI - სრული გზამკვლევი",isFree:!1,content:`# Debugging with AI

> როგორ ვიპოვოთ და გავასწოროთ bugs AI-ის დახმარებით

## 🐛 ძირითადი პრინციპები

### 1. კონტექსტის მიწოდება
AI-ს სჭირდება:
- Error message (სრული)
- შესაბამისი კოდი
- რა მოელოდით vs რა მოხდა
- Environment details

---

## 🔍 Error Analysis Prompt

### Template:
"გამოჩნდა შემდეგი error:

Error Message:
[სრული error message]

Code:
[შესაბამისი კოდი]

Expected Behavior:
[რა უნდა მოხდეს]

Actual Behavior:
[რა ხდება]

Environment:
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/etc]
- Framework: [React/Vue/etc]
- Version: [ვერსია]

გააანალიზე და მომეცი:
1. რა არის პრობლემა
2. რატომ ხდება
3. როგორ გავასწორო
4. როგორ ავიცილო მომავალში"

---

## 🎯 Systematic Debugging

### ნაბიჯი 1: Error Reproduction
"როგორ შემიძლია consistently reproduce ეს error?"

### ნაბიჯი 2: Isolation
"დამეხმარე isolate გავაკეთო პრობლემა:
- რომელ ხაზზე ხდება?
- რომელი ფუნქცია იწვევს?
- რომელი input იწვევს?"

### ნაბიჯი 3: Root Cause
"რა არის root cause ამ error-ის?"

### ნაბიჯი 4: Solution
"მომეცი 3 გადაწყვეტა:
- Quick fix (დროებითი)
- Proper fix (სწორი)
- Best practice (იდეალური)"

---

## 🔧 Common Error Types

### Syntax Errors
**Prompt:**
"ეს კოდი აძლევს syntax error. სად არის შეცდომა და როგორ გავასწორო?"

### Runtime Errors
**Prompt:**
"კოდი compile-დება მაგრამ runtime-ზე error-ს აძლევს. რა არის პრობლემა?"

### Logic Errors
**Prompt:**
"კოდი მუშაობს მაგრამ არასწორ შედეგს აძლევს. სად არის ლოგიკური შეცდომა?"

### Performance Issues
**Prompt:**
"კოდი ნელა მუშაობს. გააანალიზე performance და მომეცი optimization რჩევები."

---

## 🎨 Visual Debugging

### Browser DevTools
**Prompt:**
"როგორ გამოვიყენო Chrome DevTools ამ პრობლემის debug-ისთვის? მომეცი step-by-step გზამკვლევი."

### React DevTools
**Prompt:**
"React კომპონენტი არასწორად render-დება. როგორ debug გავაკეთო React DevTools-ით?"

---

## 🔍 Advanced Debugging

### Memory Leaks
**Prompt:**
"ეს აპლიკაცია memory leak-ს იწვევს. როგორ ვიპოვო და გავასწორო?"

### Race Conditions
**Prompt:**
"ეჭვი მაქვს race condition-ზე async კოდში. როგორ debug გავაკეთო?"

### State Management Issues
**Prompt:**
"Redux state არასწორად update-დება. დამეხმარე debug-ში."

---

## 📊 Debugging Strategies

### Binary Search Debugging
**Prompt:**
"დიდი codebase-ია და არ ვიცი სად არის bug. როგორ გამოვიყენო binary search method?"

### Rubber Duck Debugging
**Prompt:**
"ახსენი ეს კოდი ხაზ-ხაზ და დამეხმარე ვიპოვო პრობლემა."

### Print Debugging
**Prompt:**
"სად დავამატო console.log statements რომ გავიგო რა ხდება?"

---

## 🎯 Prevention Strategies

### Code Review Prompt
**Prompt:**
"გააკეთე code review და მომეცი feedback:
- Potential bugs
- Edge cases
- Error handling
- Best practices"

### Testing Prompt
**Prompt:**
"დაწერე tests რომ catch გააკეთოს ასეთი bugs მომავალში."

---

## 💡 Real Examples

### Example 1: Undefined Error
**Problem:** "Cannot read property 'name' of undefined"

**Prompt:**
"მაქვს error: Cannot read property 'name' of undefined
კოდი: user.profile.name
როგორ გავასწორო safely?"

**Solution:** Optional chaining: user?.profile?.name

### Example 2: Infinite Loop
**Problem:** Browser freezes

**Prompt:**
"Browser freeze-დება. ეჭვი მაქვს infinite loop-ზე. როგორ ვიპოვო?"

### Example 3: API Error
**Problem:** API request fails

**Prompt:**
"API request 500 error-ს აბრუნებს. როგორ debug გავაკეთო?"

---

## 🔧 Tools & Techniques

### Logging
**Best Practice:**
- console.log() - basic
- console.error() - errors
- console.table() - arrays/objects
- console.trace() - call stack

### Breakpoints
**Prompt:**
"როგორ გამოვიყენო breakpoints debugging-ისთვის?"

### Source Maps
**Prompt:**
"production-ზე error-ია. როგორ debug გავაკეთო minified კოდში?"

---

## 📝 Debugging Checklist

✅ Error message წაკითხული?
✅ Stack trace გაანალიზებული?
✅ Input data შემოწმებული?
✅ Environment variables სწორია?
✅ Dependencies updated?
✅ Browser console checked?
✅ Network tab checked?
✅ Tests written?

---

**გახსოვდეთ: debugging უნარი = programming უნარი! 💪**`}]},{id:"prompt-engineering",title:"\uD83D\uDCA1 Prompt Engineering",icon:"\uD83D\uDCA1",articles:[{id:"perfect-prompt",title:"იდეალური Prompt-ის ანატომია",isFree:!1,content:`# იდეალური Prompt-ის ანატომია

> როგორ დავწეროთ prompt რომელიც მუშაობს

## 🎯 Prompt-ის სტრუქტურა

### 1. კონტექსტი
"მე ვქმნი React აპლიკაციას სადაც..."

### 2. დავალება
"შექმენი კომპონენტი რომელიც..."

### 3. მოთხოვნები
"გამოიყენე TypeScript, Tailwind CSS"

### 4. მაგალითი (არჩევითი)
"მსგავსი როგორც..."

---

## ✅ კარგი Prompt

"შექმენი React კომპონენტი სახელად UserCard რომელიც:
- იღებს props: name, email, avatar
- აჩვენებს მომხმარებლის ინფორმაციას card-ში
- გამოიყენე TypeScript და Tailwind CSS
- დაამატე hover ეფექტი"

---

## ❌ ცუდი Prompt

"გააკეთე user card"

---

**50+ prompt შაბლონი პრემიუმ ვერსიაში!**`},{id:"prompt-templates",title:"50 გამზადებული Prompt შაბლონი",isFree:!1,content:`# 50 გამზადებული Prompt შაბლონი

> Copy-Paste და გამოიყენე

## 🎨 UI კომპონენტები

### 1. Button კომპონენტი
"შექმენი React button კომპონენტი TypeScript-ით რომელსაც აქვს variants: primary, secondary, outline. გამოიყენე Tailwind CSS."

### 2. Modal
"შექმენი modal კომპონენტი რომელიც იხსნება და იხურება ანიმაციით. დაამატე backdrop click-ზე დახურვა."

---

## 🔧 ფუნქციონალი

### 3. API Integration
"შექმენი fetch ფუნქცია რომელიც იღებს მონაცემებს API-დან, ამუშავებს errors და აბრუნებს typed response."

### 4. Form Validation
"შექმენი form validation ლოგიკა email, password და username ველებისთვის. დაამატე real-time validation."

---

## 🎯 ალგორითმები

### 5. Sorting
"დაწერე ფუნქცია რომელიც დაალაგებს objects-ის მასივს მრავალი property-ს მიხედვით."

---

**სრული კოლექცია 50 შაბლონით პრემიუმ ვერსიაში!**`}]},{id:"ethics",title:"ეთიკა და უსაფრთხოება",icon:"⚖️",articles:[{id:"ethics-copyright",title:"ეთიკა და საავტორო უფლებები Vibe Coding-ში",isFree:!1,content:`# ეთიკა და საავტორო უფლებები

> იურიდიული და ეთიკური საკითხები AI პროგრამირებაში

## ⚖️ საავტორო უფლებები

### ვის ეკუთვნის AI-ს მიერ გენერირებული კოდი?

**კანონი 2025 წლის მდგომარეობით:**
- 🇺🇸 USA: არ არის ნათელი პასუხი
- 🇪🇺 EU: მუშავდება რეგულაციები
- 🇬🇧 UK: განიხილება პარლამენტში

**საერთო კონსენსუსი:**
- თუ AI გამოიყენა როგორც ინსტრუმენტი → **თქვენი**
- თუ AI სრულად დაწერა → **გაურკვეველი**

---

## 🎓 AI-ს ტრენინგი და მონაცემები

### საიდან სწავლობს AI?

1. **GitHub Public Repositories**
   - მილიონობით open-source პროექტი
   - MIT, Apache ლიცენზიები

2. **Stack Overflow**
   - CC BY-SA ლიცენზია
   - მილიონობით კოდის snippet

3. **დოკუმენტაციები**
   - ოფიციალური docs
   - ტუტორიალები

### ეთიკური საკითხები:

❓ **კითხვა**: AI იყენებს ჩემს კოდს ტრენინგისთვის?
✅ **პასუხი**: თუ public repository-ა - დიახ, სავარაუდოდ

❓ **კითხვა**: შემიძლია აკრძალვა?
✅ **პასუხი**: GitHub settings → opt-out from AI training

---

## 🔒 კონფიდენციალურობა

### რა არ უნდა გააზიაროთ AI-სთან:

❌ API Keys
❌ პაროლები
❌ პირადი მონაცემები
❌ კომპანიის საიდუმლო კოდი
❌ მომხმარებლების ინფორმაცია

### უსაფრთხო გამოყენება:

✅ გამოიყენეთ placeholder-ები
✅ წაშალეთ sensitive data
✅ გამოიყენეთ local AI models კონფიდენციალურისთვის

---

## 💼 სამუშაო ეთიკა

### უნდა გითხრათ დამსაქმებელს?

**დიახ, თუ:**
- კომპანიას აქვს AI policy
- იყენებთ კომპანიის კოდს
- პროდუქციულ კოდში იყენებთ

**არა, თუ:**
- პერსონალური პროექტია
- სწავლობთ
- დამსაქმებელს არ აქვს პოლიტიკა

---

## 🎯 საუკეთესო პრაქტიკები

1. **გამჭვირვალობა** - აღიარეთ AI-ს გამოყენება
2. **შემოწმება** - ყოველთვის ამოწმებთ გენერირებულ კოდს
3. **პასუხისმგებლობა** - თქვენ პასუხობთ კოდზე, არა AI
4. **ლიცენზიები** - დაიცავით open-source ლიცენზიები

**სრული იურიდიული გზამკვლევი პრემიუმ ვერსიაში!**`}]},{id:"practical-cases",title:"\uD83D\uDE80 პრაქტიკული კეისები",icon:"\uD83D\uDE80",articles:[{id:"saas-in-week",title:"SaaS აპლიკაცია 1 კვირაში - სრული გზამკვლევი",isFree:!1,content:`# SaaS აპლიკაცია 1 კვირაში

> სრული პროექტი ნულიდან პროდუქციამდე

## 🎯 რას ვაშენებთ?

**Task Management SaaS:**
- User authentication
- Task CRUD operations
- Team collaboration
- Subscription payments (Stripe)
- Email notifications
- Analytics dashboard

---

## 📅 დღე 1: დაგეგმვა და Setup

### დილა: არქიტექტურა
**Prompt:**
"დაეხმარე SaaS აპლიკაციის არქიტექტურის დაგეგმვაში:
- Frontend: Next.js 14 + TypeScript
- Backend: Next.js API Routes
- Database: PostgreSQL (Supabase)
- Auth: NextAuth.js
- Payments: Stripe
- Email: Resend"

### საღამო: პროექტის შექმნა
**Prompt:**
"შექმენი Next.js 14 პროექტი:
- TypeScript
- Tailwind CSS
- App Router
- ESLint + Prettier"

---

## 📅 დღე 2: Authentication

### Prompt:
"დაამატე authentication NextAuth.js-ით:
- Email/Password login
- Google OAuth
- Protected routes
- Session management
- User profile page"

**დრო:** 4-6 საათი

---

## 📅 დღე 3: Database & CRUD

### Prompt:
"შექმენი Supabase database schema:
- Users table
- Tasks table (title, description, status, priority, user_id)
- Teams table
- Team_members table

დაწერე API routes:
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/[id]
- DELETE /api/tasks/[id]"

**დრო:** 5-7 საათი

---

## 📅 დღე 4: UI Components

### Prompt:
"შექმენი UI კომპონენტები:
- TaskCard - task-ის ჩვენება
- TaskForm - ახალი task-ის შექმნა
- TaskList - ყველა task-ის სია
- FilterBar - ფილტრაცია status/priority-ით
- SearchBar - ძებნა

გამოიყენე shadcn/ui კომპონენტები და Tailwind CSS"

**დრო:** 6-8 საათი

---

## 📅 დღე 5: Stripe Integration

### Prompt:
"დაამატე Stripe subscription:
- 3 გეგმა: Free ($0), Pro ($19/თვე), Team ($49/თვე)
- Pricing page
- Checkout flow
- Webhook handling
- Subscription status check
- Feature gating"

**დრო:** 5-7 საათი

---

## 📅 დღე 6: Email & Notifications

### Prompt:
"დაამატე email notifications Resend-ით:
- Welcome email
- Task assigned notification
- Daily digest
- Payment confirmation
- Email templates with React Email"

**დრო:** 3-4 საათი

---

## 📅 დღე 7: Polish & Deploy

### დილა: გაუმჯობესება
**Prompt:**
"დაამატე:
- Loading states
- Error handling
- Toast notifications
- Analytics (Vercel Analytics)
- SEO optimization
- Dark mode"

### საღამო: Deployment
**Prompt:**
"დაეხმარე deployment-ში:
- Vercel deployment
- Environment variables setup
- Custom domain
- SSL certificate"

---

## 🎨 დიზაინის რჩევები

### Landing Page Prompt:
"შექმენი landing page:
- Hero section with CTA
- Features section (6 features)
- Pricing table
- Testimonials
- FAQ section
- Footer with links

თანამედროვე, მინიმალისტური დიზაინი"

---

## 🔐 Security Checklist

✅ Environment variables
✅ CSRF protection
✅ Rate limiting
✅ Input validation
✅ SQL injection prevention
✅ XSS protection
✅ Secure session handling

---

## 💰 Pricing Strategy

### Free Plan
- 10 tasks
- 1 user
- Basic features

### Pro Plan ($19/თვე)
- Unlimited tasks
- 1 user
- Advanced features
- Priority support

### Team Plan ($49/თვე)
- Unlimited tasks
- 5 users
- Team collaboration
- Admin dashboard
- API access

---

## 📊 რას მიაღწიეთ?

✅ **სრულფუნქციური SaaS:**
- Authentication ✅
- Database ✅
- CRUD operations ✅
- Payments ✅
- Email ✅
- Deployment ✅

✅ **ტექნიკური სტეკი:**
- Next.js 14
- TypeScript
- Supabase
- Stripe
- Resend

✅ **ბიზნეს მზადყოფნა:**
- Pricing plans
- Payment processing
- User management
- Analytics

---

## 🚀 შემდეგი ნაბიჯები

**კვირა 2:**
- Team features
- Real-time updates
- Mobile app (React Native)

**თვე 2:**
- Marketing automation
- Advanced analytics
- Integrations (Slack, Discord)

---

**გილოცავთ! თქვენ შექმენით რეალური SaaS აპლიკაცია 7 დღეში! 🎉**`},{id:"webapp-1hour",title:"ვებ-აპლიკაცია 1 საათში - სრული გზამკვლევი",isFree:!1,content:`# ვებ-აპლიკაცია 1 საათში

> To-Do აპლიკაცია ნულიდან - ნაბიჯ-ნაბიჯ

## 🎯 რას შევქმნით?

**To-Do Manager:**
- დავალების დამატება/წაშლა
- მონიშვნა როგორც დასრულებული
- Local Storage შენახვა
- თანამედროვე UI

---

## ⏱️ Timeline

**0-10 წუთი**: პროექტის სტრუქტურა
**10-30 წუთი**: ძირითადი ფუნქციონალი
**30-45 წუთი**: UI და სტილები
**45-60 წუთი**: ტესტირება და გაუმჯობესება

---

## 📝 ნაბიჯი 1: Prompt

"შექმენი React To-Do აპლიკაცია TypeScript-ით:
- useState hooks
- Local Storage persistence
- Tailwind CSS styling
- Add, Delete, Toggle complete
- Filter: All, Active, Completed"

---

## 🎨 ნაბიჯი 2: UI გაუმჯობესება

"დაამატე:
- Smooth animations
- Hover effects
- Empty state message
- Task counter"

---

## ✅ ნაბიჯი 3: ტესტირება

1. დაამატე 5 დავალება
2. მონიშნე 2 როგორც დასრულებული
3. გადატვირთე გვერდი - უნდა შენახულიყოს
4. წაშალე დავალება

---

**სრული კოდი და ვიდეო ტუტორიალი პრემიუმ ვერსიაში!**`},{id:"telegram-bot",title:"Telegram ბოტის შექმნა AI-ით",isFree:!1,content:`# Telegram ბოტის შექმნა

> AI ჩატბოტი Telegram-ისთვის

## 🤖 რას შევქმნით?

**AI Assistant Bot:**
- პასუხობს კითხვებზე
- ინახავს კონტექსტს
- მრავალენოვანი
- ადმინ პანელი

---

## 📋 საჭირო რესურსები

1. Telegram Bot Token (BotFather)
2. OpenAI API Key
3. Node.js
4. Vercel (hosting)

---

## 💻 Prompt

"შექმენი Telegram bot Node.js-ით:
- telegraf ბიბლიოთეკა
- OpenAI GPT-4 ინტეგრაცია
- Context memory per user
- Commands: /start, /help, /clear
- Error handling"

---

## 🚀 დეპლოიმენტი

1. GitHub repository
2. Vercel დაკავშირება
3. Environment variables
4. Deploy!

---

**სრული კოდი და deployment გზამკვლევი პრემიუმ ვერსიაში!**`},{id:"chrome-extension",title:"Chrome Extension-ის შექმნა",isFree:!1,content:`# Chrome Extension შექმნა

> პროდუქტიულობის ინსტრუმენტი

## 🎯 რას შევქმნით?

**Tab Manager:**
- ყველა ღია tab-ის სია
- ჯგუფების შექმნა
- სწრაფი ძებნა
- Keyboard shortcuts

---

## 📁 სტრუქტურა

- manifest.json
- popup.html
- popup.js
- background.js
- styles.css

---

## 💡 Prompt

"შექმენი Chrome extension:
- Manifest V3
- Popup UI tab-ების სიით
- Search functionality
- Save/Load tab groups
- Dark mode support"

---

## 🧪 ტესტირება

1. chrome://extensions
2. Load unpacked
3. აირჩიე folder
4. ტესტირება

---

**სრული პროექტი და გამოქვეყნების გზამკვლევი პრემიუმ ვერსიაში!**`}]},{id:"advanced-topics",title:"\uD83C\uDF93 პროდვინუტი თემები",icon:"\uD83C\uDF93",articles:[{id:"architecture-patterns",title:"არქიტექტურული პატერნები Vibe Coding-ით",isFree:!1,content:`# არქიტექტურული პატერნები

> როგორ შევქმნათ მასშტაბირებადი აპლიკაციები AI-ით

## 🏗️ MVC Pattern

### Model-View-Controller

**Prompt:**
"შექმენი MVC სტრუქტურა Express.js-ით:
- Models: User, Post
- Views: EJS templates
- Controllers: business logic
- Routes: API endpoints"

---

## 🔄 MVVM Pattern

### Model-View-ViewModel

**გამოყენება:** React, Vue

**Prompt:**
"შექმენი React აპლიკაცია MVVM პატერნით:
- Models: data types
- ViewModels: custom hooks
- Views: components
- State management: Context API"

---

## 🎯 Clean Architecture

**ფენები:**
1. Domain Layer
2. Application Layer
3. Infrastructure Layer
4. Presentation Layer

---

**დეტალური გზამკვლევი ყველა პატერნზე პრემიუმ ვერსიაში!**`},{id:"performance-optimization",title:"პერფორმანსის ოპტიმიზაცია AI-ით",isFree:!1,content:`# პერფორმანსის ოპტიმიზაცია

> როგორ გავაუმჯობესოთ კოდის სიჩქარე

## ⚡ React ოპტიმიზაცია

### 1. Memoization

**Prompt:**
"ოპტიმიზაცია გაუკეთე ამ კომპონენტს:
- React.memo
- useMemo
- useCallback
- გამოიყენე სწორად dependencies"

---

### 2. Code Splitting

**Prompt:**
"დაამატე lazy loading:
- React.lazy
- Suspense
- Route-based splitting
- Component-based splitting"

---

## 🗄️ Database ოპტიმიზაცია

### Indexing

**Prompt:**
"შექმენი MongoDB indexes:
- Compound indexes
- Text search index
- გააანალიზე query performance"

---

## 📊 Profiling

**ინსტრუმენტები:**
- Chrome DevTools
- React Profiler
- Lighthouse

---

**სრული ოპტიმიზაციის გზამკვლევი პრემიუმ ვერსიაში!**`},{id:"security-best-practices",title:"უსაფრთხოება და Best Practices",isFree:!1,content:`# უსაფრთხოება AI პროგრამირებაში

> როგორ დავიცვათ აპლიკაცია

## 🔒 Authentication

### JWT Implementation

**Prompt:**
"შექმენი secure authentication:
- JWT tokens
- Refresh tokens
- Password hashing (bcrypt)
- Rate limiting
- CORS configuration"

---

## 🛡️ Input Validation

### XSS Prevention

**Prompt:**
"დაამატე input validation:
- Sanitize user input
- Escape HTML
- Content Security Policy
- Validate on backend"

---

## 🔐 SQL Injection Prevention

**Prompt:**
"გადააკეთე ეს query უსაფრთხოდ:
- Prepared statements
- Parameterized queries
- ORM usage
- Input validation"

---

## 📝 Security Checklist

✅ HTTPS only
✅ Environment variables
✅ Input validation
✅ Authentication
✅ Authorization
✅ Rate limiting
✅ Error handling
✅ Logging

---

**სრული security audit გზამკვლევი პრემიუმ ვერსიაში!**`},{id:"cicd-deployment",title:"CI/CD და Deployment AI-ით",isFree:!1,content:`# CI/CD და Deployment

> ავტომატიზაცია განვითარებიდან პროდუქციამდე

## 🔄 GitHub Actions

### Workflow Setup

**Prompt:**
"შექმენი GitHub Actions workflow:
- Run tests on push
- Build application
- Deploy to Vercel
- Notify on Slack
- Environment: staging, production"

---

## 🐳 Docker

### Containerization

**Prompt:**
"შექმენი Dockerfile:
- Node.js base image
- Multi-stage build
- Optimize layers
- docker-compose.yml"

---

## ☁️ Cloud Deployment

### Vercel

**Prompt:**
"დააკონფიგურე Vercel deployment:
- Environment variables
- Custom domain
- Preview deployments
- Analytics"

---

## 📊 Monitoring

**ინსტრუმენტები:**
- Sentry (errors)
- Google Analytics
- Vercel Analytics
- Custom logging

---

**სრული DevOps გზამკვლევი პრემიუმ ვერსიაში!**`},{id:"monetization-guide",title:"Vibe Coding უნარების მონეტიზაცია",isFree:!1,content:`# უნარების მონეტიზაცია

> როგორ ვიშოვოთ ფული Vibe Coding-ით

## 💼 Freelancing

### პლატფორმები

1. **Upwork** - $30-100/საათი
2. **Fiverr** - პროექტებზე დაფუძნებული
3. **Toptal** - premium კლიენტები

### სერვისები რომლებიც შეგიძლიათ შესთავაზოთ:
- Landing page ($200-500)
- Web app MVP ($1000-3000)
- Chrome extension ($300-800)
- Automation scripts ($100-500)

---

## 🚀 SaaS პროდუქტები

### იდეები

1. **AI Tools Directory** - $29/თვე
2. **Template Marketplace** - $19-99 per template
3. **Automation Service** - $49/თვე

### სწრაფი MVP:
- 1 დღე: იდეა + დიზაინი
- 2-3 დღე: განვითარება AI-ით
- 1 დღე: deployment + marketing

---

## 📚 Courses & Content

### პლატფორმები

- **Udemy** - $10-200 per course
- **Gumroad** - digital products
- **YouTube** - ad revenue + sponsorships

### კონტენტის იდეები:
- "Vibe Coding for Beginners"
- "Build 10 Projects in 10 Days"
- "AI Prompt Templates Pack"

---

## 💡 Consulting

### სერვისები

- **AI Integration** - $100-200/საათი
- **Code Review** - $50-100/საათი
- **Team Training** - $500-1000/დღე

---

## 📊 რეალური მაგალითები

### კეისი 1: ფრილანსერი გიორგი
- 3 თვე Vibe Coding
- $2000/თვე Upwork-დან
- 10-15 საათი/კვირა

### კეისი 2: SaaS Founder ნინო
- შექმნა AI tools directory
- $500 MRR პირველ თვეში
- $2000 MRR 6 თვეში

---

**სრული მონეტიზაციის სტრატეგია პრემიუმ ვერსიაში!**`}]}]}},71854:(e,t,r)=>{"use strict";r.d(t,{default:()=>o});var a=r(11185),s=r.n(a);let i=process.env.MONGODB_URI;if(!i)throw Error("Please define the MONGODB_URI environment variable inside .env.local");let n=global.mongoose||{conn:null,promise:null};global.mongoose||(global.mongoose=n);let o=async function(){if(n.conn)return n.conn;n.promise||(n.promise=s().connect(i,{bufferCommands:!1}).then(e=>e));try{n.conn=await n.promise}catch(e){throw n.promise=null,e}return n.conn}},33838:(e,t,r)=>{"use strict";r.d(t,{default:()=>p});var a=r(11185),s=r.n(a);let i=new a.Schema({fire:{type:Number,default:0},love:{type:Number,default:0},mindblown:{type:Number,default:0},applause:{type:Number,default:0},insightful:{type:Number,default:0}},{_id:!1}),n=new a.Schema({metaTitle:{type:String,maxlength:60},metaDescription:{type:String,maxlength:160},keywords:{type:String},canonicalUrl:{type:String},focusKeyword:{type:String},seoScore:{type:Number,min:0,max:100},ogImage:{type:String}},{_id:!1}),o=new a.Schema({name:{type:String,required:!0},avatar:{type:String},role:{type:String}},{_id:!1}),l=new a.Schema({icon:{type:String},title:{type:String},content:{type:String,required:!0},type:{type:String,enum:["intro","section","sarcasm","warning","tip","fact","opinion","cta","hashtags","prompt","author-comment"],default:"section"}},{_id:!1}),d=new a.Schema({horizontal:{type:String},vertical:{type:String}},{_id:!1}),c=new a.Schema({src:{type:String,required:!0},alt:{type:String},caption:{type:String}},{_id:!1}),m=new a.Schema({url:{type:String,required:!0},platform:{type:String,enum:["youtube","vimeo"],required:!0},videoId:{type:String},thumbnailUrl:{type:String}},{_id:!1}),u=new a.Schema({slug:{type:String,required:[!0,"Slug is required"],unique:!0,trim:!0},title:{type:String,required:[!0,"Title is required"],trim:!0},excerpt:{type:String,required:[!0,"Excerpt is required"],trim:!0},content:{type:String,default:""},rawContent:{type:String,default:""},coverImage:{type:String},coverImages:{type:d},gallery:{type:[c],default:[]},sections:{type:[l],default:[]},category:{type:String,required:[!0,"Category is required"],index:!0},tags:{type:[String],default:[]},author:{type:o,required:!0},publishedAt:{type:Date,default:Date.now},readingTime:{type:Number,default:5},views:{type:Number,default:0},comments:{type:Number,default:0},shares:{type:Number,default:0},reactions:{type:i,default:()=>({fire:0,love:0,mindblown:0,applause:0,insightful:0})},featured:{type:Boolean,default:!1},trending:{type:Boolean,default:!1},status:{type:String,enum:["draft","published","scheduled","archived"],default:"draft",index:!0},scheduledFor:{type:Date},order:{type:Number,default:0},seo:{type:n,default:()=>({})},videos:{type:[m],default:[]},relatedPosts:{type:[String],default:[]},numericId:{type:String,unique:!0,sparse:!0,index:!0}},{timestamps:!0});u.index({title:"text",excerpt:"text",content:"text",rawContent:"text",numericId:"text"});let p=s().models.Post||s().model("Post",u)},73881:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});var a=r(66621);let s=e=>[{type:"image/x-icon",sizes:"16x16",url:(0,a.fillMetadataSegment)(".",e.params,"favicon.ico")+""}]},5023:()=>{}};