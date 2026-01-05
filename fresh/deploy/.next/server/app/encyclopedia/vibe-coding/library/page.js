(()=>{var e={};e.id=8673,e.ids=[8673],e.modules={11185:e=>{"use strict";e.exports=require("mongoose")},47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},49411:e=>{"use strict";e.exports=require("node:path")},97742:e=>{"use strict";e.exports=require("node:process")},41041:e=>{"use strict";e.exports=require("node:url")},71017:e=>{"use strict";e.exports=require("path")},57310:e=>{"use strict";e.exports=require("url")},33226:(e,t,n)=>{"use strict";n.r(t),n.d(t,{GlobalError:()=>a.a,__next_app__:()=>d,originalPathname:()=>p,pages:()=>u,routeModule:()=>f,tree:()=>c}),n(7293),n(55774),n(7629),n(11930),n(12523);var r=n(23191),i=n(88716),o=n(37922),a=n.n(o),l=n(95231),s={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(s[e]=()=>l[e]);n.d(t,s);let c=["",{children:["encyclopedia",{children:["vibe-coding",{children:["library",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(n.bind(n,7293)),"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\encyclopedia\\vibe-coding\\library\\page.tsx"]}]},{}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(n.bind(n,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:"/manifest.webmanifest"}}]},{layout:[()=>Promise.resolve().then(n.bind(n,55774)),"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\layout.tsx"],error:[()=>Promise.resolve().then(n.bind(n,7629)),"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\error.tsx"],loading:[()=>Promise.resolve().then(n.bind(n,11930)),"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\loading.tsx"],"not-found":[()=>Promise.resolve().then(n.bind(n,12523)),"C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\not-found.tsx"],metadata:{icon:[async e=>(await Promise.resolve().then(n.bind(n,73881))).default(e)],apple:[],openGraph:[],twitter:[],manifest:"/manifest.webmanifest"}}],u=["C:\\Users\\User\\Desktop\\GITHUB\\andrewaltair\\fresh\\src\\app\\encyclopedia\\vibe-coding\\library\\page.tsx"],p="/encyclopedia/vibe-coding/library/page",d={require:n,loadChunk:()=>Promise.resolve()},f=new r.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/encyclopedia/vibe-coding/library/page",pathname:"/encyclopedia/vibe-coding/library",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},25583:(e,t,n)=>{Promise.resolve().then(n.bind(n,55706))},71771:e=>{"use strict";var t=Object.prototype.hasOwnProperty,n=Object.prototype.toString,r=Object.defineProperty,i=Object.getOwnPropertyDescriptor,o=function(e){return"function"==typeof Array.isArray?Array.isArray(e):"[object Array]"===n.call(e)},a=function(e){if(!e||"[object Object]"!==n.call(e))return!1;var r,i=t.call(e,"constructor"),o=e.constructor&&e.constructor.prototype&&t.call(e.constructor.prototype,"isPrototypeOf");if(e.constructor&&!i&&!o)return!1;for(r in e);return void 0===r||t.call(e,r)},l=function(e,t){r&&"__proto__"===t.name?r(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},s=function(e,n){if("__proto__"===n){if(!t.call(e,n))return;if(i)return i(e,n).value}return e[n]};e.exports=function e(){var t,n,r,i,c,u,p=arguments[0],d=1,f=arguments.length,m=!1;for("boolean"==typeof p&&(m=p,p=arguments[1]||{},d=2),(null==p||"object"!=typeof p&&"function"!=typeof p)&&(p={});d<f;++d)if(t=arguments[d],null!=t)for(n in t)r=s(p,n),p!==(i=s(t,n))&&(m&&i&&(a(i)||(c=o(i)))?(c?(c=!1,u=r&&o(r)?r:[]):u=r&&a(r)?r:{},l(p,{name:n,newValue:e(m,u,i)})):void 0!==i&&l(p,{name:n,newValue:i}));return p}},54201:e=>{"use strict";var t=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,n=/\n/g,r=/^\s*/,i=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,a=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,l=/^[;\s]*/,s=/^\s+|\s+$/g;function c(e){return e?e.replace(s,""):""}e.exports=function(e,s){if("string"!=typeof e)throw TypeError("First argument must be a string");if(!e)return[];s=s||{};var u=1,p=1;function d(e){var t=e.match(n);t&&(u+=t.length);var r=e.lastIndexOf("\n");p=~r?e.length-r:p+e.length}function f(){var e={line:u,column:p};return function(t){return t.position=new m(e),g(r),t}}function m(e){this.start=e,this.end={line:u,column:p},this.source=s.source}function h(t){var n=Error(s.source+":"+u+":"+p+": "+t);if(n.reason=t,n.filename=s.source,n.line=u,n.column=p,n.source=e,s.silent);else throw n}function g(t){var n=t.exec(e);if(n){var r=n[0];return d(r),e=e.slice(r.length),n}}function y(e){var t;for(e=e||[];t=b();)!1!==t&&e.push(t);return e}function b(){var t=f();if("/"==e.charAt(0)&&"*"==e.charAt(1)){for(var n=2;""!=e.charAt(n)&&("*"!=e.charAt(n)||"/"!=e.charAt(n+1));)++n;if(n+=2,""===e.charAt(n-1))return h("End of comment missing");var r=e.slice(2,n-2);return p+=2,d(r),e=e.slice(n),p+=2,t({type:"comment",comment:r})}}return m.prototype.content=e,g(r),function(){var e,n=[];for(y(n);e=function(){var e=f(),n=g(i);if(n){if(b(),!g(o))return h("property missing ':'");var r=g(a),s=e({type:"declaration",property:c(n[0].replace(t,"")),value:r?c(r[0].replace(t,"")):""});return g(l),s}}();)!1!==e&&(n.push(e),y(n));return n}()}},27855:function(e,t,n){"use strict";var r=(this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(n(56773)),i=n(8787);function o(e,t){var n={};return e&&"string"==typeof e&&(0,r.default)(e,function(e,r){e&&r&&(n[(0,i.camelCase)(e,t)]=r)}),n}o.default=o,e.exports=o},8787:(e,t)=>{"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.camelCase=void 0;var n=/^--[a-zA-Z0-9_-]+$/,r=/-([a-z])/g,i=/^[^-]+$/,o=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,l=function(e,t){return t.toUpperCase()},s=function(e,t){return"".concat(t,"-")};t.camelCase=function(e,t){var c;return(void 0===t&&(t={}),!(c=e)||i.test(c)||n.test(c))?e:(e=e.toLowerCase(),(e=t.reactCompat?e.replace(a,s):e.replace(o,s)).replace(r,l))}},56773:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t){let n=null;if(!e||"string"!=typeof e)return n;let r=(0,i.default)(e),o="function"==typeof t;return r.forEach(e=>{if("declaration"!==e.type)return;let{property:r,value:i}=e;o?t(r,i,e):i&&((n=n||{})[r]=i)}),n};let i=r(n(54201))},55706:(e,t,n)=>{"use strict";n.d(t,{default:()=>n6});var r={};n.r(r),n.d(r,{boolean:()=>H,booleanish:()=>q,commaOrSpaceSeparated:()=>Z,commaSeparated:()=>B,number:()=>O,overloadedBoolean:()=>z,spaceSeparated:()=>U});var i={};n.r(i),n.d(i,{attentionMarkers:()=>t$,contentInitial:()=>tB,disable:()=>tY,document:()=>tU,flow:()=>tG,flowInitial:()=>tZ,insideSpan:()=>tK,string:()=>t_,text:()=>tW});var o=n(10326),a=n(77626),l=n.n(a),s=n(35047),c=n(90434),u=n(17577),p=n(55795),d=n(9086),f=n(4821),m=n(94712),h=n(13153);let g=new Map([["bold",u.createElement(u.Fragment,null,u.createElement("path",{d:"M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"}))],["duotone",u.createElement(u.Fragment,null,u.createElement("path",{d:"M176,128,96,208V48Z",opacity:"0.2"}),u.createElement("path",{d:"M181.66,122.34l-80-80A8,8,0,0,0,88,48V208a8,8,0,0,0,13.66,5.66l80-80A8,8,0,0,0,181.66,122.34ZM104,188.69V67.31L164.69,128Z"}))],["fill",u.createElement(u.Fragment,null,u.createElement("path",{d:"M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"}))],["light",u.createElement(u.Fragment,null,u.createElement("path",{d:"M180.24,132.24l-80,80a6,6,0,0,1-8.48-8.48L167.51,128,91.76,52.24a6,6,0,0,1,8.48-8.48l80,80A6,6,0,0,1,180.24,132.24Z"}))],["regular",u.createElement(u.Fragment,null,u.createElement("path",{d:"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"}))],["thin",u.createElement(u.Fragment,null,u.createElement("path",{d:"M178.83,130.83l-80,80a4,4,0,0,1-5.66-5.66L170.34,128,93.17,50.83a4,4,0,0,1,5.66-5.66l80,80A4,4,0,0,1,178.83,130.83Z"}))]]),y=u.forwardRef((e,t)=>u.createElement(h.Z,{ref:t,...e,weights:g}));y.displayName="CaretRightIcon";var b=n(69039);let x=new Map([["bold",u.createElement(u.Fragment,null,u.createElement("path",{d:"M228,128a12,12,0,0,1-12,12H40a12,12,0,0,1,0-24H216A12,12,0,0,1,228,128ZM40,76H216a12,12,0,0,0,0-24H40a12,12,0,0,0,0,24ZM216,180H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z"}))],["duotone",u.createElement(u.Fragment,null,u.createElement("path",{d:"M216,64V192H40V64Z",opacity:"0.2"}),u.createElement("path",{d:"M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"}))],["fill",u.createElement(u.Fragment,null,u.createElement("path",{d:"M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM192,184H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Zm0-48H64a8,8,0,0,1,0-16H192a8,8,0,0,1,0,16Z"}))],["light",u.createElement(u.Fragment,null,u.createElement("path",{d:"M222,128a6,6,0,0,1-6,6H40a6,6,0,0,1,0-12H216A6,6,0,0,1,222,128ZM40,70H216a6,6,0,0,0,0-12H40a6,6,0,0,0,0,12ZM216,186H40a6,6,0,0,0,0,12H216a6,6,0,0,0,0-12Z"}))],["regular",u.createElement(u.Fragment,null,u.createElement("path",{d:"M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"}))],["thin",u.createElement(u.Fragment,null,u.createElement("path",{d:"M220,128a4,4,0,0,1-4,4H40a4,4,0,0,1,0-8H216A4,4,0,0,1,220,128ZM40,68H216a4,4,0,0,0,0-8H40a4,4,0,0,0,0,8ZM216,188H40a4,4,0,0,0,0,8H216a4,4,0,0,0,0-8Z"}))]]),v=u.forwardRef((e,t)=>u.createElement(h.Z,{ref:t,...e,weights:x}));v.displayName="ListIcon";var k=n(95448);let w=new Map([["bold",u.createElement(u.Fragment,null,u.createElement("path",{d:"M232.49,215.51,185,168a92.12,92.12,0,1,0-17,17l47.53,47.54a12,12,0,0,0,17-17ZM44,112a68,68,0,1,1,68,68A68.07,68.07,0,0,1,44,112Z"}))],["duotone",u.createElement(u.Fragment,null,u.createElement("path",{d:"M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z",opacity:"0.2"}),u.createElement("path",{d:"M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"}))],["fill",u.createElement(u.Fragment,null,u.createElement("path",{d:"M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"}))],["light",u.createElement(u.Fragment,null,u.createElement("path",{d:"M228.24,219.76l-51.38-51.38a86.15,86.15,0,1,0-8.48,8.48l51.38,51.38a6,6,0,0,0,8.48-8.48ZM38,112a74,74,0,1,1,74,74A74.09,74.09,0,0,1,38,112Z"}))],["regular",u.createElement(u.Fragment,null,u.createElement("path",{d:"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"}))],["thin",u.createElement(u.Fragment,null,u.createElement("path",{d:"M226.83,221.17l-52.7-52.7a84.1,84.1,0,1,0-5.66,5.66l52.7,52.7a4,4,0,0,0,5.66-5.66ZM36,112a76,76,0,1,1,76,76A76.08,76.08,0,0,1,36,112Z"}))]]),S=u.forwardRef((e,t)=>u.createElement(h.Z,{ref:t,...e,weights:w}));S.displayName="MagnifyingGlassIcon";let A=new Map([["bold",u.createElement(u.Fragment,null,u.createElement("path",{d:"M208,76H100V56a28,28,0,0,1,28-28c13.51,0,25.65,9.62,28.24,22.39a12,12,0,1,0,23.52-4.78C174.87,21.5,153.1,4,128,4A52.06,52.06,0,0,0,76,56V76H48A20,20,0,0,0,28,96V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V96A20,20,0,0,0,208,76Zm-4,128H52V100H204Zm-92-52a16,16,0,1,1,16,16A16,16,0,0,1,112,152Z"}))],["duotone",u.createElement(u.Fragment,null,u.createElement("path",{d:"M216,96V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H208A8,8,0,0,1,216,96Z",opacity:"0.2"}),u.createElement("path",{d:"M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"}))],["fill",u.createElement(u.Fragment,null,u.createElement("path",{d:"M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Z"}))],["light",u.createElement(u.Fragment,null,u.createElement("path",{d:"M208,82H94V56a34,34,0,0,1,34-34c16.3,0,31,11.69,34.12,27.19a6,6,0,0,0,11.76-2.38C169.55,25.48,150.26,10,128,10A46.06,46.06,0,0,0,82,56V82H48A14,14,0,0,0,34,96V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V96A14,14,0,0,0,208,82Zm2,126a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V96a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Zm-72-56a10,10,0,1,1-10-10A10,10,0,0,1,138,152Z"}))],["regular",u.createElement(u.Fragment,null,u.createElement("path",{d:"M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"}))],["thin",u.createElement(u.Fragment,null,u.createElement("path",{d:"M208,84H92V56a36,36,0,0,1,36-36c17.24,0,32.75,12.38,36.08,28.8a4,4,0,1,0,7.84-1.6C167.78,26.81,149.31,12,128,12A44.05,44.05,0,0,0,84,56V84H48A12,12,0,0,0,36,96V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V96A12,12,0,0,0,208,84Zm4,124a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V96a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-76-56a8,8,0,1,1-8-8A8,8,0,0,1,136,152Z"}))]]),C=u.forwardRef((e,t)=>u.createElement(h.Z,{ref:t,...e,weights:A}));C.displayName="LockOpenIcon";var E=n(31117);let I=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,P=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,T={};function L(e,t){return((t||T).jsx?P:I).test(e)}let D=/[ \t\n\f\r]/g;function M(e){return""===e.replace(D,"")}class V{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}}function N(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new V(n,r,t)}function R(e){return e.toLowerCase()}V.prototype.normal={},V.prototype.property={},V.prototype.space=void 0;class F{constructor(e,t){this.attribute=t,this.property=e}}F.prototype.attribute="",F.prototype.booleanish=!1,F.prototype.boolean=!1,F.prototype.commaOrSpaceSeparated=!1,F.prototype.commaSeparated=!1,F.prototype.defined=!1,F.prototype.mustUseProperty=!1,F.prototype.number=!1,F.prototype.overloadedBoolean=!1,F.prototype.property="",F.prototype.spaceSeparated=!1,F.prototype.space=void 0;let j=0,H=G(),q=G(),z=G(),O=G(),U=G(),B=G(),Z=G();function G(){return 2**++j}let _=Object.keys(r);class W extends F{constructor(e,t,n,i){let o=-1;if(super(e,t),function(e,t,n){n&&(e[t]=n)}(this,"space",i),"number"==typeof n)for(;++o<_.length;){let e=_[o];(function(e,t,n){n&&(e[t]=n)})(this,_[o],(n&r[e])===r[e])}}}function K(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let o=new W(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(o.mustUseProperty=!0),t[r]=o,n[R(r)]=r,n[R(o.attribute)]=r}return new V(t,n,e.space)}W.prototype.defined=!0;let $=K({properties:{ariaActiveDescendant:null,ariaAtomic:q,ariaAutoComplete:null,ariaBusy:q,ariaChecked:q,ariaColCount:O,ariaColIndex:O,ariaColSpan:O,ariaControls:U,ariaCurrent:null,ariaDescribedBy:U,ariaDetails:null,ariaDisabled:q,ariaDropEffect:U,ariaErrorMessage:null,ariaExpanded:q,ariaFlowTo:U,ariaGrabbed:q,ariaHasPopup:null,ariaHidden:q,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:U,ariaLevel:O,ariaLive:null,ariaModal:q,ariaMultiLine:q,ariaMultiSelectable:q,ariaOrientation:null,ariaOwns:U,ariaPlaceholder:null,ariaPosInSet:O,ariaPressed:q,ariaReadOnly:q,ariaRelevant:null,ariaRequired:q,ariaRoleDescription:U,ariaRowCount:O,ariaRowIndex:O,ariaRowSpan:O,ariaSelected:q,ariaSetSize:O,ariaSort:null,ariaValueMax:O,ariaValueMin:O,ariaValueNow:O,ariaValueText:null,role:null},transform:(e,t)=>"role"===t?t:"aria-"+t.slice(4).toLowerCase()});function Y(e,t){return t in e?e[t]:t}function J(e,t){return Y(e,t.toLowerCase())}let X=K({attributes:{acceptcharset:"accept-charset",classname:"class",htmlfor:"for",httpequiv:"http-equiv"},mustUseProperty:["checked","multiple","muted","selected"],properties:{abbr:null,accept:B,acceptCharset:U,accessKey:U,action:null,allow:null,allowFullScreen:H,allowPaymentRequest:H,allowUserMedia:H,alt:null,as:null,async:H,autoCapitalize:null,autoComplete:U,autoFocus:H,autoPlay:H,blocking:U,capture:null,charSet:null,checked:H,cite:null,className:U,cols:O,colSpan:null,content:null,contentEditable:q,controls:H,controlsList:U,coords:O|B,crossOrigin:null,data:null,dateTime:null,decoding:null,default:H,defer:H,dir:null,dirName:null,disabled:H,download:z,draggable:q,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:H,formTarget:null,headers:U,height:O,hidden:z,high:O,href:null,hrefLang:null,htmlFor:U,httpEquiv:U,id:null,imageSizes:null,imageSrcSet:null,inert:H,inputMode:null,integrity:null,is:null,isMap:H,itemId:null,itemProp:U,itemRef:U,itemScope:H,itemType:U,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:H,low:O,manifest:null,max:null,maxLength:O,media:null,method:null,min:null,minLength:O,multiple:H,muted:H,name:null,nonce:null,noModule:H,noValidate:H,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:H,optimum:O,pattern:null,ping:U,placeholder:null,playsInline:H,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:H,referrerPolicy:null,rel:U,required:H,reversed:H,rows:O,rowSpan:O,sandbox:U,scope:null,scoped:H,seamless:H,selected:H,shadowRootClonable:H,shadowRootDelegatesFocus:H,shadowRootMode:null,shape:null,size:O,sizes:null,slot:null,span:O,spellCheck:q,src:null,srcDoc:null,srcLang:null,srcSet:null,start:O,step:null,style:null,tabIndex:O,target:null,title:null,translate:null,type:null,typeMustMatch:H,useMap:null,value:q,width:O,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:U,axis:null,background:null,bgColor:null,border:O,borderColor:null,bottomMargin:O,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:H,declare:H,event:null,face:null,frame:null,frameBorder:null,hSpace:O,leftMargin:O,link:null,longDesc:null,lowSrc:null,marginHeight:O,marginWidth:O,noResize:H,noHref:H,noShade:H,noWrap:H,object:null,profile:null,prompt:null,rev:null,rightMargin:O,rules:null,scheme:null,scrolling:q,standby:null,summary:null,text:null,topMargin:O,valueType:null,version:null,vAlign:null,vLink:null,vSpace:O,allowTransparency:null,autoCorrect:null,autoSave:null,disablePictureInPicture:H,disableRemotePlayback:H,prefix:null,property:null,results:O,security:null,unselectable:null},space:"html",transform:J}),Q=K({attributes:{accentHeight:"accent-height",alignmentBaseline:"alignment-baseline",arabicForm:"arabic-form",baselineShift:"baseline-shift",capHeight:"cap-height",className:"class",clipPath:"clip-path",clipRule:"clip-rule",colorInterpolation:"color-interpolation",colorInterpolationFilters:"color-interpolation-filters",colorProfile:"color-profile",colorRendering:"color-rendering",crossOrigin:"crossorigin",dataType:"datatype",dominantBaseline:"dominant-baseline",enableBackground:"enable-background",fillOpacity:"fill-opacity",fillRule:"fill-rule",floodColor:"flood-color",floodOpacity:"flood-opacity",fontFamily:"font-family",fontSize:"font-size",fontSizeAdjust:"font-size-adjust",fontStretch:"font-stretch",fontStyle:"font-style",fontVariant:"font-variant",fontWeight:"font-weight",glyphName:"glyph-name",glyphOrientationHorizontal:"glyph-orientation-horizontal",glyphOrientationVertical:"glyph-orientation-vertical",hrefLang:"hreflang",horizAdvX:"horiz-adv-x",horizOriginX:"horiz-origin-x",horizOriginY:"horiz-origin-y",imageRendering:"image-rendering",letterSpacing:"letter-spacing",lightingColor:"lighting-color",markerEnd:"marker-end",markerMid:"marker-mid",markerStart:"marker-start",navDown:"nav-down",navDownLeft:"nav-down-left",navDownRight:"nav-down-right",navLeft:"nav-left",navNext:"nav-next",navPrev:"nav-prev",navRight:"nav-right",navUp:"nav-up",navUpLeft:"nav-up-left",navUpRight:"nav-up-right",onAbort:"onabort",onActivate:"onactivate",onAfterPrint:"onafterprint",onBeforePrint:"onbeforeprint",onBegin:"onbegin",onCancel:"oncancel",onCanPlay:"oncanplay",onCanPlayThrough:"oncanplaythrough",onChange:"onchange",onClick:"onclick",onClose:"onclose",onCopy:"oncopy",onCueChange:"oncuechange",onCut:"oncut",onDblClick:"ondblclick",onDrag:"ondrag",onDragEnd:"ondragend",onDragEnter:"ondragenter",onDragExit:"ondragexit",onDragLeave:"ondragleave",onDragOver:"ondragover",onDragStart:"ondragstart",onDrop:"ondrop",onDurationChange:"ondurationchange",onEmptied:"onemptied",onEnd:"onend",onEnded:"onended",onError:"onerror",onFocus:"onfocus",onFocusIn:"onfocusin",onFocusOut:"onfocusout",onHashChange:"onhashchange",onInput:"oninput",onInvalid:"oninvalid",onKeyDown:"onkeydown",onKeyPress:"onkeypress",onKeyUp:"onkeyup",onLoad:"onload",onLoadedData:"onloadeddata",onLoadedMetadata:"onloadedmetadata",onLoadStart:"onloadstart",onMessage:"onmessage",onMouseDown:"onmousedown",onMouseEnter:"onmouseenter",onMouseLeave:"onmouseleave",onMouseMove:"onmousemove",onMouseOut:"onmouseout",onMouseOver:"onmouseover",onMouseUp:"onmouseup",onMouseWheel:"onmousewheel",onOffline:"onoffline",onOnline:"ononline",onPageHide:"onpagehide",onPageShow:"onpageshow",onPaste:"onpaste",onPause:"onpause",onPlay:"onplay",onPlaying:"onplaying",onPopState:"onpopstate",onProgress:"onprogress",onRateChange:"onratechange",onRepeat:"onrepeat",onReset:"onreset",onResize:"onresize",onScroll:"onscroll",onSeeked:"onseeked",onSeeking:"onseeking",onSelect:"onselect",onShow:"onshow",onStalled:"onstalled",onStorage:"onstorage",onSubmit:"onsubmit",onSuspend:"onsuspend",onTimeUpdate:"ontimeupdate",onToggle:"ontoggle",onUnload:"onunload",onVolumeChange:"onvolumechange",onWaiting:"onwaiting",onZoom:"onzoom",overlinePosition:"overline-position",overlineThickness:"overline-thickness",paintOrder:"paint-order",panose1:"panose-1",pointerEvents:"pointer-events",referrerPolicy:"referrerpolicy",renderingIntent:"rendering-intent",shapeRendering:"shape-rendering",stopColor:"stop-color",stopOpacity:"stop-opacity",strikethroughPosition:"strikethrough-position",strikethroughThickness:"strikethrough-thickness",strokeDashArray:"stroke-dasharray",strokeDashOffset:"stroke-dashoffset",strokeLineCap:"stroke-linecap",strokeLineJoin:"stroke-linejoin",strokeMiterLimit:"stroke-miterlimit",strokeOpacity:"stroke-opacity",strokeWidth:"stroke-width",tabIndex:"tabindex",textAnchor:"text-anchor",textDecoration:"text-decoration",textRendering:"text-rendering",transformOrigin:"transform-origin",typeOf:"typeof",underlinePosition:"underline-position",underlineThickness:"underline-thickness",unicodeBidi:"unicode-bidi",unicodeRange:"unicode-range",unitsPerEm:"units-per-em",vAlphabetic:"v-alphabetic",vHanging:"v-hanging",vIdeographic:"v-ideographic",vMathematical:"v-mathematical",vectorEffect:"vector-effect",vertAdvY:"vert-adv-y",vertOriginX:"vert-origin-x",vertOriginY:"vert-origin-y",wordSpacing:"word-spacing",writingMode:"writing-mode",xHeight:"x-height",playbackOrder:"playbackorder",timelineBegin:"timelinebegin"},properties:{about:Z,accentHeight:O,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:O,amplitude:O,arabicForm:null,ascent:O,attributeName:null,attributeType:null,azimuth:O,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:O,by:null,calcMode:null,capHeight:O,className:U,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:O,diffuseConstant:O,direction:null,display:null,dur:null,divisor:O,dominantBaseline:null,download:H,dx:null,dy:null,edgeMode:null,editable:null,elevation:O,enableBackground:null,end:null,event:null,exponent:O,externalResourcesRequired:null,fill:null,fillOpacity:O,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:B,g2:B,glyphName:B,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:O,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:O,horizOriginX:O,horizOriginY:O,id:null,ideographic:O,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:O,k:O,k1:O,k2:O,k3:O,k4:O,kernelMatrix:Z,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:O,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:O,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:O,overlineThickness:O,paintOrder:null,panose1:null,path:null,pathLength:O,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:U,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:O,pointsAtY:O,pointsAtZ:O,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Z,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Z,rev:Z,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Z,requiredFeatures:Z,requiredFonts:Z,requiredFormats:Z,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:O,specularExponent:O,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:O,strikethroughThickness:O,string:null,stroke:null,strokeDashArray:Z,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:O,strokeOpacity:O,strokeWidth:null,style:null,surfaceScale:O,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Z,tabIndex:O,tableValues:null,target:null,targetX:O,targetY:O,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Z,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:O,underlineThickness:O,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:O,values:null,vAlphabetic:O,vMathematical:O,vectorEffect:null,vHanging:O,vIdeographic:O,version:null,vertAdvY:O,vertOriginX:O,vertOriginY:O,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:O,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:"svg",transform:Y}),ee=K({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:"xlink",transform:(e,t)=>"xlink:"+t.slice(5).toLowerCase()}),et=K({attributes:{xmlnsxlink:"xmlns:xlink"},properties:{xmlnsXLink:null,xmlns:null},space:"xmlns",transform:J}),en=K({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:"xml",transform:(e,t)=>"xml:"+t.slice(3).toLowerCase()}),er=N([$,X,ee,et,en],"html"),ei=N([$,Q,ee,et,en],"svg"),eo=/[A-Z]/g,ea=/-[a-z]/g,el=/^data[-\w.:]+$/i;function es(e){return"-"+e.toLowerCase()}function ec(e){return e.charAt(1).toUpperCase()}let eu={classId:"classID",dataType:"datatype",itemId:"itemID",strokeDashArray:"strokeDasharray",strokeDashOffset:"strokeDashoffset",strokeLineCap:"strokeLinecap",strokeLineJoin:"strokeLinejoin",strokeMiterLimit:"strokeMiterlimit",typeOf:"typeof",xLinkActuate:"xlinkActuate",xLinkArcRole:"xlinkArcrole",xLinkHref:"xlinkHref",xLinkRole:"xlinkRole",xLinkShow:"xlinkShow",xLinkTitle:"xlinkTitle",xLinkType:"xlinkType",xmlnsXLink:"xmlnsXlink"};var ep=n(27855);let ed=em("end"),ef=em("start");function em(e){return function(t){let n=t&&t.position&&t.position[e]||{};if("number"==typeof n.line&&n.line>0&&"number"==typeof n.column&&n.column>0)return{line:n.line,column:n.column,offset:"number"==typeof n.offset&&n.offset>-1?n.offset:void 0}}}function eh(e){return e&&"object"==typeof e?"position"in e||"type"in e?ey(e.position):"start"in e||"end"in e?ey(e):"line"in e||"column"in e?eg(e):"":""}function eg(e){return eb(e&&e.line)+":"+eb(e&&e.column)}function ey(e){return eg(e&&e.start)+"-"+eg(e&&e.end)}function eb(e){return e&&"number"==typeof e?e:1}class ex extends Error{constructor(e,t,n){super(),"string"==typeof t&&(n=t,t=void 0);let r="",i={},o=!1;if(t&&(i="line"in t&&"column"in t?{place:t}:"start"in t&&"end"in t?{place:t}:"type"in t?{ancestors:[t],place:t.position}:{...t}),"string"==typeof e?r=e:!i.cause&&e&&(o=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&"string"==typeof n){let e=n.indexOf(":");-1===e?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let a=i.place&&"start"in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=a?a.column:void 0,this.fatal=void 0,this.file="",this.message=r,this.line=a?a.line:void 0,this.name=eh(i.place)||"1:1",this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=o&&i.cause&&"string"==typeof i.cause.stack?i.cause.stack:"",this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}}ex.prototype.file="",ex.prototype.name="",ex.prototype.reason="",ex.prototype.message="",ex.prototype.stack="",ex.prototype.column=void 0,ex.prototype.line=void 0,ex.prototype.ancestors=void 0,ex.prototype.cause=void 0,ex.prototype.fatal=void 0,ex.prototype.place=void 0,ex.prototype.ruleId=void 0,ex.prototype.source=void 0;let ev={}.hasOwnProperty,ek=new Map,ew=/[A-Z]/g,eS=new Set(["table","tbody","thead","tfoot","tr"]),eA=new Set(["td","th"]),eC="https://github.com/syntax-tree/hast-util-to-jsx-runtime";function eE(e,t,n){return"element"===t.type?function(e,t,n){let r=e.schema,i=r;"svg"===t.tagName.toLowerCase()&&"html"===r.space&&(i=ei,e.schema=i),e.ancestors.push(t);let o=eL(e,t.tagName,!1),a=function(e,t){let n,r;let i={};for(r in t.properties)if("children"!==r&&ev.call(t.properties,r)){let o=function(e,t,n){let r=function(e,t){let n=R(t),r=t,i=F;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&"data"===n.slice(0,4)&&el.test(t)){if("-"===t.charAt(4)){let e=t.slice(5).replace(ea,ec);r="data"+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!ea.test(e)){let n=e.replace(eo,es);"-"!==n.charAt(0)&&(n="-"+n),t="data"+n}}i=W}return new i(r,t)}(e.schema,t);if(!(null==n||"number"==typeof n&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?function(e,t){let n={};return(""===e[e.length-1]?[...e,""]:e).join((n.padRight?" ":"")+","+(!1===n.padLeft?"":" ")).trim()}(n):n.join(" ").trim()),"style"===r.property){let t="object"==typeof n?n:function(e,t){try{return ep(t,{reactCompat:!0})}catch(n){if(e.ignoreInvalidStyle)return{};let t=new ex("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:"style",source:"hast-util-to-jsx-runtime"});throw t.file=e.filePath||void 0,t.url=eC+"#cannot-parse-style-attribute",t}}(e,String(n));return"css"===e.stylePropertyNameCase&&(t=function(e){let t;let n={};for(t in e)ev.call(e,t)&&(n[function(e){let t=e.replace(ew,eM);return"ms-"===t.slice(0,3)&&(t="-"+t),t}(t)]=e[t]);return n}(t)),["style",t]}return["react"===e.elementAttributeNameCase&&r.space?eu[r.property]||r.property:r.attribute,n]}}(e,r,t.properties[r]);if(o){let[r,a]=o;e.tableCellAlignToStyle&&"align"===r&&"string"==typeof a&&eA.has(t.tagName)?n=a:i[r]=a}}return n&&((i.style||(i.style={}))["css"===e.stylePropertyNameCase?"text-align":"textAlign"]=n),i}(e,t),l=eT(e,t);return eS.has(t.tagName)&&(l=l.filter(function(e){return"string"!=typeof e||!("object"==typeof e?"text"===e.type&&M(e.value):M(e))})),eI(e,a,o,t),eP(a,l),e.ancestors.pop(),e.schema=r,e.create(t,o,a,n)}(e,t,n):"mdxFlowExpression"===t.type||"mdxTextExpression"===t.type?function(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}eD(e,t.position)}(e,t):"mdxJsxFlowElement"===t.type||"mdxJsxTextElement"===t.type?function(e,t,n){let r=e.schema,i=r;"svg"===t.name&&"html"===r.space&&(i=ei,e.schema=i),e.ancestors.push(t);let o=null===t.name?e.Fragment:eL(e,t.name,!0),a=function(e,t){let n={};for(let r of t.attributes)if("mdxJsxExpressionAttribute"===r.type){if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let o=i.properties[0];o.type,Object.assign(n,e.evaluater.evaluateExpression(o.argument))}else eD(e,t.position)}else{let i;let o=r.name;if(r.value&&"object"==typeof r.value){if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,i=e.evaluater.evaluateExpression(t.expression)}else eD(e,t.position)}else i=null===r.value||r.value;n[o]=i}return n}(e,t),l=eT(e,t);return eI(e,a,o,t),eP(a,l),e.ancestors.pop(),e.schema=r,e.create(t,o,a,n)}(e,t,n):"mdxjsEsm"===t.type?function(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);eD(e,t.position)}(e,t):"root"===t.type?function(e,t,n){let r={};return eP(r,eT(e,t)),e.create(t,e.Fragment,r,n)}(e,t,n):"text"===t.type?t.value:void 0}function eI(e,t,n,r){"string"!=typeof n&&n!==e.Fragment&&e.passNode&&(t.node=r)}function eP(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function eT(e,t){let n=[],r=-1,i=e.passKeys?new Map:ek;for(;++r<t.children.length;){let o;let a=t.children[r];if(e.passKeys){let e="element"===a.type?a.tagName:"mdxJsxFlowElement"===a.type||"mdxJsxTextElement"===a.type?a.name:void 0;if(e){let t=i.get(e)||0;o=e+"-"+t,i.set(e,t+1)}}let l=eE(e,a,o);void 0!==l&&n.push(l)}return n}function eL(e,t,n){let r;if(n){if(t.includes(".")){let e;let n=t.split("."),i=-1;for(;++i<n.length;){let t=L(n[i])?{type:"Identifier",name:n[i]}:{type:"Literal",value:n[i]};e=e?{type:"MemberExpression",object:e,property:t,computed:!!(i&&"Literal"===t.type),optional:!1}:t}r=e}else r=L(t)&&!/^[a-z]/.test(t)?{type:"Identifier",name:t}:{type:"Literal",value:t}}else r={type:"Literal",value:t};if("Literal"===r.type){let t=r.value;return ev.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);eD(e)}function eD(e,t){let n=new ex("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:"mdx-estree",source:"hast-util-to-jsx-runtime"});throw n.file=e.filePath||void 0,n.url=eC+"#cannot-handle-mdx-estrees-without-createevaluater",n}function eM(e){return"-"+e.toLowerCase()}let eV={action:["form"],cite:["blockquote","del","ins","q"],data:["object"],formAction:["button","input"],href:["a","area","base","link"],icon:["menuitem"],itemId:null,manifest:["html"],ping:["a","area"],poster:["video"],src:["audio","embed","iframe","img","input","script","source","track","video"]},eN={};function eR(e,t,n){if(e&&"object"==typeof e){if("value"in e)return"html"!==e.type||n?e.value:"";if(t&&"alt"in e&&e.alt)return e.alt;if("children"in e)return eF(e.children,t,n)}return Array.isArray(e)?eF(e,t,n):""}function eF(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=eR(e[i],t,n);return r.join("")}function ej(e,t,n,r){let i;let o=e.length,a=0;if(t=t<0?-t>o?0:o+t:t>o?o:t,n=n>0?n:0,r.length<1e4)(i=Array.from(r)).unshift(t,n),e.splice(...i);else for(n&&e.splice(t,n);a<r.length;)(i=r.slice(a,a+1e4)).unshift(t,0),e.splice(...i),a+=1e4,t+=1e4}function eH(e,t){return e.length>0?(ej(e,e.length,0,t),e):t}class eq{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=null==t?Number.POSITIVE_INFINITY:t;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){this.setCursor(Math.trunc(e));let r=this.right.splice(this.right.length-(t||0),Number.POSITIVE_INFINITY);return n&&ez(this.left,n),r.reverse()}pop(){return this.setCursor(Number.POSITIVE_INFINITY),this.left.pop()}push(e){this.setCursor(Number.POSITIVE_INFINITY),this.left.push(e)}pushMany(e){this.setCursor(Number.POSITIVE_INFINITY),ez(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),ez(this.right,e.reverse())}setCursor(e){if(e!==this.left.length&&(!(e>this.left.length)||0!==this.right.length)&&(!(e<0)||0!==this.left.length)){if(e<this.left.length){let t=this.left.splice(e,Number.POSITIVE_INFINITY);ez(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,Number.POSITIVE_INFINITY);ez(this.left,t.reverse())}}}}function ez(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function eO(e){let t,n,r,i,o,a,l;let s={},c=-1,u=new eq(e);for(;++c<u.length;){for(;(c in s);)c=s[c];if(t=u.get(c),c&&"chunkFlow"===t[1].type&&"listItemPrefix"===u.get(c-1)[1].type&&((r=0)<(a=t[1]._tokenizer.events).length&&"lineEndingBlank"===a[r][1].type&&(r+=2),r<a.length&&"content"===a[r][1].type))for(;++r<a.length&&"content"!==a[r][1].type;)"chunkText"===a[r][1].type&&(a[r][1]._isInFirstContentOfListItem=!0,r++);if("enter"===t[0])t[1].contentType&&(Object.assign(s,function(e,t){let n,r;let i=e.get(t)[1],o=e.get(t)[2],a=t-1,l=[],s=i._tokenizer;!s&&(s=o.parser[i.contentType](i.start),i._contentTypeTextTrailing&&(s._contentTypeTextTrailing=!0));let c=s.events,u=[],p={},d=-1,f=i,m=0,h=0,g=[0];for(;f;){for(;e.get(++a)[1]!==f;);l.push(a),!f._tokenizer&&(n=o.sliceStream(f),f.next||n.push(null),r&&s.defineSkip(f.start),f._isInFirstContentOfListItem&&(s._gfmTasklistFirstContentOfListItem=!0),s.write(n),f._isInFirstContentOfListItem&&(s._gfmTasklistFirstContentOfListItem=void 0)),r=f,f=f.next}for(f=i;++d<c.length;)"exit"===c[d][0]&&"enter"===c[d-1][0]&&c[d][1].type===c[d-1][1].type&&c[d][1].start.line!==c[d][1].end.line&&(h=d+1,g.push(h),f._tokenizer=void 0,f.previous=void 0,f=f.next);for(s.events=[],f?(f._tokenizer=void 0,f.previous=void 0):g.pop(),d=g.length;d--;){let t=c.slice(g[d],g[d+1]),n=l.pop();u.push([n,n+t.length-1]),e.splice(n,2,t)}for(u.reverse(),d=-1;++d<u.length;)p[m+u[d][0]]=m+u[d][1],m+=u[d][1]-u[d][0]-1;return p}(u,c)),c=s[c],l=!0);else if(t[1]._container){for(r=c,n=void 0;r--;)if("lineEnding"===(i=u.get(r))[1].type||"lineEndingBlank"===i[1].type)"enter"===i[0]&&(n&&(u.get(n)[1].type="lineEndingBlank"),i[1].type="lineEnding",n=r);else if("linePrefix"===i[1].type||"listItemIndent"===i[1].type);else break;n&&(t[1].end={...u.get(n)[1].start},(o=u.slice(n,c)).unshift(t),u.splice(n,c-n+1,o))}}return ej(e,0,Number.POSITIVE_INFINITY,u.slice(0)),!l}let eU={}.hasOwnProperty,eB=e1(/[A-Za-z]/),eZ=e1(/[\dA-Za-z]/),eG=e1(/[#-'*+\--9=?A-Z^-~]/);function e_(e){return null!==e&&(e<32||127===e)}let eW=e1(/\d/),eK=e1(/[\dA-Fa-f]/),e$=e1(/[!-/:-@[-`{-~]/);function eY(e){return null!==e&&e<-2}function eJ(e){return null!==e&&(e<0||32===e)}function eX(e){return -2===e||-1===e||32===e}let eQ=e1(/\p{P}|\p{S}/u),e0=e1(/\s/);function e1(e){return function(t){return null!==t&&t>-1&&e.test(String.fromCharCode(t))}}function e2(e,t,n,r){let i=r?r-1:Number.POSITIVE_INFINITY,o=0;return function(r){return eX(r)?(e.enter(n),function r(a){return eX(a)&&o++<i?(e.consume(a),r):(e.exit(n),t(a))}(r)):t(r)}}let e8={tokenize:function(e){let t;let n=e.attempt(this.parser.constructs.contentInitial,function(t){if(null===t){e.consume(t);return}return e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),e2(e,n,"linePrefix")},function(n){return e.enter("paragraph"),function n(r){let i=e.enter("chunkText",{contentType:"text",previous:t});return t&&(t.next=i),t=i,function t(r){if(null===r){e.exit("chunkText"),e.exit("paragraph"),e.consume(r);return}return eY(r)?(e.consume(r),e.exit("chunkText"),n):(e.consume(r),t)}(r)}(n)});return n}},e6={tokenize:function(e){let t,n,r;let i=this,o=[],a=0;return l;function l(t){if(a<o.length){let n=o[a];return i.containerState=n[1],e.attempt(n[0].continuation,s,c)(t)}return c(t)}function s(e){if(a++,i.containerState._closeFlow){let n;i.containerState._closeFlow=void 0,t&&y();let r=i.events.length,o=r;for(;o--;)if("exit"===i.events[o][0]&&"chunkFlow"===i.events[o][1].type){n=i.events[o][1].end;break}g(a);let l=r;for(;l<i.events.length;)i.events[l][1].end={...n},l++;return ej(i.events,o+1,0,i.events.slice(r)),i.events.length=l,c(e)}return l(e)}function c(n){if(a===o.length){if(!t)return d(n);if(t.currentConstruct&&t.currentConstruct.concrete)return m(n);i.interrupt=!!(t.currentConstruct&&!t._gfmTableDynamicInterruptHack)}return i.containerState={},e.check(e4,u,p)(n)}function u(e){return t&&y(),g(a),d(e)}function p(e){return i.parser.lazy[i.now().line]=a!==o.length,r=i.now().offset,m(e)}function d(t){return i.containerState={},e.attempt(e4,f,m)(t)}function f(e){return a++,o.push([i.currentConstruct,i.containerState]),d(e)}function m(r){if(null===r){t&&y(),g(0),e.consume(r);return}return t=t||i.parser.flow(i.now()),e.enter("chunkFlow",{_tokenizer:t,contentType:"flow",previous:n}),function t(n){if(null===n){h(e.exit("chunkFlow"),!0),g(0),e.consume(n);return}return eY(n)?(e.consume(n),h(e.exit("chunkFlow")),a=0,i.interrupt=void 0,l):(e.consume(n),t)}(r)}function h(e,o){let l=i.sliceStream(e);if(o&&l.push(null),e.previous=n,n&&(n.next=e),n=e,t.defineSkip(e.start),t.write(l),i.parser.lazy[e.start.line]){let e,n,o=t.events.length;for(;o--;)if(t.events[o][1].start.offset<r&&(!t.events[o][1].end||t.events[o][1].end.offset>r))return;let l=i.events.length,s=l;for(;s--;)if("exit"===i.events[s][0]&&"chunkFlow"===i.events[s][1].type){if(e){n=i.events[s][1].end;break}e=!0}for(g(a),o=l;o<i.events.length;)i.events[o][1].end={...n},o++;ej(i.events,s+1,0,i.events.slice(l)),i.events.length=o}}function g(t){let n=o.length;for(;n-- >t;){let t=o[n];i.containerState=t[1],t[0].exit.call(i,e)}o.length=t}function y(){t.write([null]),n=void 0,t=void 0,i.containerState._closeFlow=void 0}}},e4={tokenize:function(e,t,n){return e2(e,e.attempt(this.parser.constructs.document,t,n),"linePrefix",this.parser.constructs.disable.null.includes("codeIndented")?void 0:4)}},e3={partial:!0,tokenize:function(e,t,n){return function(t){return eX(t)?e2(e,r,"linePrefix")(t):r(t)};function r(e){return null===e||eY(e)?t(e):n(e)}}},e5={resolve:function(e){return eO(e),e},tokenize:function(e,t){let n;return function(t){return e.enter("content"),n=e.enter("chunkContent",{contentType:"content"}),r(t)};function r(t){return null===t?i(t):eY(t)?e.check(e7,o,i)(t):(e.consume(t),r)}function i(n){return e.exit("chunkContent"),e.exit("content"),t(n)}function o(t){return e.consume(t),e.exit("chunkContent"),n.next=e.enter("chunkContent",{contentType:"content",previous:n}),n=n.next,r}}},e7={partial:!0,tokenize:function(e,t,n){let r=this;return function(t){return e.exit("chunkContent"),e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),e2(e,i,"linePrefix")};function i(i){if(null===i||eY(i))return n(i);let o=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes("codeIndented")&&o&&"linePrefix"===o[1].type&&o[2].sliceSerialize(o[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}},e9={tokenize:function(e){let t=this,n=e.attempt(e3,function(r){if(null===r){e.consume(r);return}return e.enter("lineEndingBlank"),e.consume(r),e.exit("lineEndingBlank"),t.currentConstruct=void 0,n},e.attempt(this.parser.constructs.flowInitial,r,e2(e,e.attempt(this.parser.constructs.flow,r,e.attempt(e5,r)),"linePrefix")));return n;function r(r){if(null===r){e.consume(r);return}return e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),t.currentConstruct=void 0,n}}},te={resolveAll:ti()},tt=tr("string"),tn=tr("text");function tr(e){return{resolveAll:ti("text"===e?to:void 0),tokenize:function(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,o,a);return o;function o(e){return s(e)?i(e):a(e)}function a(e){if(null===e){t.consume(e);return}return t.enter("data"),t.consume(e),l}function l(e){return s(e)?(t.exit("data"),i(e)):(t.consume(e),l)}function s(e){if(null===e)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}}function ti(e){return function(t,n){let r,i=-1;for(;++i<=t.length;)void 0===r?t[i]&&"data"===t[i][1].type&&(r=i,i++):t[i]&&"data"===t[i][1].type||(i!==r+2&&(t[r][1].end=t[i-1][1].end,t.splice(r+2,i-r-2),i=r+2),r=void 0);return e?e(t,n):t}}function to(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||"lineEnding"===e[n][1].type)&&"data"===e[n-1][1].type){let r;let i=e[n-1][1],o=t.sliceStream(i),a=o.length,l=-1,s=0;for(;a--;){let e=o[a];if("string"==typeof e){for(l=e.length;32===e.charCodeAt(l-1);)s++,l--;if(l)break;l=-1}else if(-2===e)r=!0,s++;else if(-1===e);else{a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(s=0),s){let o={type:n===e.length||r||s<2?"lineSuffix":"hardBreakTrailing",start:{_bufferIndex:a?l:i.start._bufferIndex+l,_index:i.start._index+a,line:i.end.line,column:i.end.column-s,offset:i.end.offset-s},end:{...i.end}};i.end={...o.start},i.start.offset===i.end.offset?Object.assign(i,o):(e.splice(n,0,["enter",o,t],["exit",o,t]),n+=2)}n++}return e}let ta={name:"thematicBreak",tokenize:function(e,t,n){let r,i=0;return function(o){return e.enter("thematicBreak"),r=o,function o(a){return a===r?(e.enter("thematicBreakSequence"),function t(n){return n===r?(e.consume(n),i++,t):(e.exit("thematicBreakSequence"),eX(n)?e2(e,o,"whitespace")(n):o(n))}(a)):i>=3&&(null===a||eY(a))?(e.exit("thematicBreak"),t(a)):n(a)}(o)}}},tl={continuation:{tokenize:function(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(e3,function(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,e2(e,t,"listItemIndent",r.containerState.size+1)(n)},function(n){return r.containerState.furtherBlankLines||!eX(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,i(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(tc,t,i)(n))});function i(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,e2(e,e.attempt(tl,t,n),"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(i)}}},exit:function(e){e.exit(this.containerState.type)},name:"list",tokenize:function(e,t,n){let r=this,i=r.events[r.events.length-1],o=i&&"linePrefix"===i[1].type?i[2].sliceSerialize(i[1],!0).length:0,a=0;return function(t){let i=r.containerState.type||(42===t||43===t||45===t?"listUnordered":"listOrdered");if("listUnordered"===i?!r.containerState.marker||t===r.containerState.marker:eW(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),"listUnordered"===i)return e.enter("listItemPrefix"),42===t||45===t?e.check(ta,n,l)(t):l(t);if(!r.interrupt||49===t)return e.enter("listItemPrefix"),e.enter("listItemValue"),function t(i){return eW(i)&&++a<10?(e.consume(i),t):(!r.interrupt||a<2)&&(r.containerState.marker?i===r.containerState.marker:41===i||46===i)?(e.exit("listItemValue"),l(i)):n(i)}(t)}return n(t)};function l(t){return e.enter("listItemMarker"),e.consume(t),e.exit("listItemMarker"),r.containerState.marker=r.containerState.marker||t,e.check(e3,r.interrupt?n:s,e.attempt(ts,u,c))}function s(e){return r.containerState.initialBlankLine=!0,o++,u(e)}function c(t){return eX(t)?(e.enter("listItemPrefixWhitespace"),e.consume(t),e.exit("listItemPrefixWhitespace"),u):n(t)}function u(n){return r.containerState.size=o+r.sliceSerialize(e.exit("listItemPrefix"),!0).length,t(n)}}},ts={partial:!0,tokenize:function(e,t,n){let r=this;return e2(e,function(e){let i=r.events[r.events.length-1];return!eX(e)&&i&&"listItemPrefixWhitespace"===i[1].type?t(e):n(e)},"listItemPrefixWhitespace",r.parser.constructs.disable.null.includes("codeIndented")?void 0:5)}},tc={partial:!0,tokenize:function(e,t,n){let r=this;return e2(e,function(e){let i=r.events[r.events.length-1];return i&&"listItemIndent"===i[1].type&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)},"listItemIndent",r.containerState.size+1)}},tu={continuation:{tokenize:function(e,t,n){let r=this;return function(t){return eX(t)?e2(e,i,"linePrefix",r.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(t):i(t)};function i(r){return e.attempt(tu,t,n)(r)}}},exit:function(e){e.exit("blockQuote")},name:"blockQuote",tokenize:function(e,t,n){let r=this;return function(t){if(62===t){let n=r.containerState;return n.open||(e.enter("blockQuote",{_container:!0}),n.open=!0),e.enter("blockQuotePrefix"),e.enter("blockQuoteMarker"),e.consume(t),e.exit("blockQuoteMarker"),i}return n(t)};function i(n){return eX(n)?(e.enter("blockQuotePrefixWhitespace"),e.consume(n),e.exit("blockQuotePrefixWhitespace"),e.exit("blockQuotePrefix"),t):(e.exit("blockQuotePrefix"),t(n))}}};function tp(e,t,n,r,i,o,a,l,s){let c=s||Number.POSITIVE_INFINITY,u=0;return function(t){return 60===t?(e.enter(r),e.enter(i),e.enter(o),e.consume(t),e.exit(o),p):null===t||32===t||41===t||e_(t)?n(t):(e.enter(r),e.enter(a),e.enter(l),e.enter("chunkString",{contentType:"string"}),m(t))};function p(n){return 62===n?(e.enter(o),e.consume(n),e.exit(o),e.exit(i),e.exit(r),t):(e.enter(l),e.enter("chunkString",{contentType:"string"}),d(n))}function d(t){return 62===t?(e.exit("chunkString"),e.exit(l),p(t)):null===t||60===t||eY(t)?n(t):(e.consume(t),92===t?f:d)}function f(t){return 60===t||62===t||92===t?(e.consume(t),d):d(t)}function m(i){return!u&&(null===i||41===i||eJ(i))?(e.exit("chunkString"),e.exit(l),e.exit(a),e.exit(r),t(i)):u<c&&40===i?(e.consume(i),u++,m):41===i?(e.consume(i),u--,m):null===i||32===i||40===i||e_(i)?n(i):(e.consume(i),92===i?h:m)}function h(t){return 40===t||41===t||92===t?(e.consume(t),m):m(t)}}function td(e,t,n,r,i,o){let a;let l=this,s=0;return function(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(o),c};function c(p){return s>999||null===p||91===p||93===p&&!a||94===p&&!s&&"_hiddenFootnoteSupport"in l.parser.constructs?n(p):93===p?(e.exit(o),e.enter(i),e.consume(p),e.exit(i),e.exit(r),t):eY(p)?(e.enter("lineEnding"),e.consume(p),e.exit("lineEnding"),c):(e.enter("chunkString",{contentType:"string"}),u(p))}function u(t){return null===t||91===t||93===t||eY(t)||s++>999?(e.exit("chunkString"),c(t)):(e.consume(t),a||(a=!eX(t)),92===t?p:u)}function p(t){return 91===t||92===t||93===t?(e.consume(t),s++,u):u(t)}}function tf(e,t,n,r,i,o){let a;return function(t){return 34===t||39===t||40===t?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),a=40===t?41:t,l):n(t)};function l(n){return n===a?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(o),s(n))}function s(t){return t===a?(e.exit(o),l(a)):null===t?n(t):eY(t)?(e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),e2(e,s,"linePrefix")):(e.enter("chunkString",{contentType:"string"}),c(t))}function c(t){return t===a||null===t||eY(t)?(e.exit("chunkString"),s(t)):(e.consume(t),92===t?u:c)}function u(t){return t===a||92===t?(e.consume(t),c):c(t)}}function tm(e,t){let n;return function r(i){return eY(i)?(e.enter("lineEnding"),e.consume(i),e.exit("lineEnding"),n=!0,r):eX(i)?e2(e,r,n?"linePrefix":"lineSuffix")(i):t(i)}}function th(e){return e.replace(/[\t\n\r ]+/g," ").replace(/^ | $/g,"").toLowerCase().toUpperCase()}let tg={partial:!0,tokenize:function(e,t,n){return function(t){return eJ(t)?tm(e,r)(t):n(t)};function r(t){return tf(e,i,n,"definitionTitle","definitionTitleMarker","definitionTitleString")(t)}function i(t){return eX(t)?e2(e,o,"whitespace")(t):o(t)}function o(e){return null===e||eY(e)?t(e):n(e)}}},ty={name:"codeIndented",tokenize:function(e,t,n){let r=this;return function(t){return e.enter("codeIndented"),e2(e,i,"linePrefix",5)(t)};function i(t){let i=r.events[r.events.length-1];return i&&"linePrefix"===i[1].type&&i[2].sliceSerialize(i[1],!0).length>=4?function t(n){return null===n?o(n):eY(n)?e.attempt(tb,t,o)(n):(e.enter("codeFlowValue"),function n(r){return null===r||eY(r)?(e.exit("codeFlowValue"),t(r)):(e.consume(r),n)}(n))}(t):n(t)}function o(n){return e.exit("codeIndented"),t(n)}}},tb={partial:!0,tokenize:function(e,t,n){let r=this;return i;function i(t){return r.parser.lazy[r.now().line]?n(t):eY(t)?(e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),i):e2(e,o,"linePrefix",5)(t)}function o(e){let o=r.events[r.events.length-1];return o&&"linePrefix"===o[1].type&&o[2].sliceSerialize(o[1],!0).length>=4?t(e):eY(e)?i(e):n(e)}}},tx={name:"setextUnderline",resolveTo:function(e,t){let n,r,i,o=e.length;for(;o--;)if("enter"===e[o][0]){if("content"===e[o][1].type){n=o;break}"paragraph"===e[o][1].type&&(r=o)}else"content"===e[o][1].type&&e.splice(o,1),i||"definition"!==e[o][1].type||(i=o);let a={type:"setextHeading",start:{...e[n][1].start},end:{...e[e.length-1][1].end}};return e[r][1].type="setextHeadingText",i?(e.splice(r,0,["enter",a,t]),e.splice(i+1,0,["exit",e[n][1],t]),e[n][1].end={...e[i][1].end}):e[n][1]=a,e.push(["exit",a,t]),e},tokenize:function(e,t,n){let r;let i=this;return function(t){let a,l=i.events.length;for(;l--;)if("lineEnding"!==i.events[l][1].type&&"linePrefix"!==i.events[l][1].type&&"content"!==i.events[l][1].type){a="paragraph"===i.events[l][1].type;break}return!i.parser.lazy[i.now().line]&&(i.interrupt||a)?(e.enter("setextHeadingLine"),r=t,e.enter("setextHeadingLineSequence"),function t(n){return n===r?(e.consume(n),t):(e.exit("setextHeadingLineSequence"),eX(n)?e2(e,o,"lineSuffix")(n):o(n))}(t)):n(t)};function o(r){return null===r||eY(r)?(e.exit("setextHeadingLine"),t(r)):n(r)}}},tv=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","search","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],tk=["pre","script","style","textarea"],tw={partial:!0,tokenize:function(e,t,n){return function(r){return e.enter("lineEnding"),e.consume(r),e.exit("lineEnding"),e.attempt(e3,t,n)}}},tS={partial:!0,tokenize:function(e,t,n){let r=this;return function(t){return eY(t)?(e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),i):n(t)};function i(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}},tA={partial:!0,tokenize:function(e,t,n){let r=this;return function(t){return null===t?n(t):(e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),i)};function i(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}},tC={concrete:!0,name:"codeFenced",tokenize:function(e,t,n){let r;let i=this,o={partial:!0,tokenize:function(e,t,n){let o=0;return function(t){return e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),a};function a(t){return e.enter("codeFencedFence"),eX(t)?e2(e,s,"linePrefix",i.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(t):s(t)}function s(t){return t===r?(e.enter("codeFencedFenceSequence"),function t(i){return i===r?(o++,e.consume(i),t):o>=l?(e.exit("codeFencedFenceSequence"),eX(i)?e2(e,c,"whitespace")(i):c(i)):n(i)}(t)):n(t)}function c(r){return null===r||eY(r)?(e.exit("codeFencedFence"),t(r)):n(r)}}},a=0,l=0;return function(t){return function(t){let o=i.events[i.events.length-1];return a=o&&"linePrefix"===o[1].type?o[2].sliceSerialize(o[1],!0).length:0,r=t,e.enter("codeFenced"),e.enter("codeFencedFence"),e.enter("codeFencedFenceSequence"),function t(i){return i===r?(l++,e.consume(i),t):l<3?n(i):(e.exit("codeFencedFenceSequence"),eX(i)?e2(e,s,"whitespace")(i):s(i))}(t)}(t)};function s(o){return null===o||eY(o)?(e.exit("codeFencedFence"),i.interrupt?t(o):e.check(tA,u,m)(o)):(e.enter("codeFencedFenceInfo"),e.enter("chunkString",{contentType:"string"}),function t(i){return null===i||eY(i)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),s(i)):eX(i)?(e.exit("chunkString"),e.exit("codeFencedFenceInfo"),e2(e,c,"whitespace")(i)):96===i&&i===r?n(i):(e.consume(i),t)}(o))}function c(t){return null===t||eY(t)?s(t):(e.enter("codeFencedFenceMeta"),e.enter("chunkString",{contentType:"string"}),function t(i){return null===i||eY(i)?(e.exit("chunkString"),e.exit("codeFencedFenceMeta"),s(i)):96===i&&i===r?n(i):(e.consume(i),t)}(t))}function u(t){return e.attempt(o,m,p)(t)}function p(t){return e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),d}function d(t){return a>0&&eX(t)?e2(e,f,"linePrefix",a+1)(t):f(t)}function f(t){return null===t||eY(t)?e.check(tA,u,m)(t):(e.enter("codeFlowValue"),function t(n){return null===n||eY(n)?(e.exit("codeFlowValue"),f(n)):(e.consume(n),t)}(t))}function m(n){return e.exit("codeFenced"),t(n)}}},tE={AElig:"\xc6",AMP:"&",Aacute:"\xc1",Abreve:"Ă",Acirc:"\xc2",Acy:"А",Afr:"\uD835\uDD04",Agrave:"\xc0",Alpha:"Α",Amacr:"Ā",And:"⩓",Aogon:"Ą",Aopf:"\uD835\uDD38",ApplyFunction:"⁡",Aring:"\xc5",Ascr:"\uD835\uDC9C",Assign:"≔",Atilde:"\xc3",Auml:"\xc4",Backslash:"∖",Barv:"⫧",Barwed:"⌆",Bcy:"Б",Because:"∵",Bernoullis:"ℬ",Beta:"Β",Bfr:"\uD835\uDD05",Bopf:"\uD835\uDD39",Breve:"˘",Bscr:"ℬ",Bumpeq:"≎",CHcy:"Ч",COPY:"\xa9",Cacute:"Ć",Cap:"⋒",CapitalDifferentialD:"ⅅ",Cayleys:"ℭ",Ccaron:"Č",Ccedil:"\xc7",Ccirc:"Ĉ",Cconint:"∰",Cdot:"Ċ",Cedilla:"\xb8",CenterDot:"\xb7",Cfr:"ℭ",Chi:"Χ",CircleDot:"⊙",CircleMinus:"⊖",CirclePlus:"⊕",CircleTimes:"⊗",ClockwiseContourIntegral:"∲",CloseCurlyDoubleQuote:"”",CloseCurlyQuote:"’",Colon:"∷",Colone:"⩴",Congruent:"≡",Conint:"∯",ContourIntegral:"∮",Copf:"ℂ",Coproduct:"∐",CounterClockwiseContourIntegral:"∳",Cross:"⨯",Cscr:"\uD835\uDC9E",Cup:"⋓",CupCap:"≍",DD:"ⅅ",DDotrahd:"⤑",DJcy:"Ђ",DScy:"Ѕ",DZcy:"Џ",Dagger:"‡",Darr:"↡",Dashv:"⫤",Dcaron:"Ď",Dcy:"Д",Del:"∇",Delta:"Δ",Dfr:"\uD835\uDD07",DiacriticalAcute:"\xb4",DiacriticalDot:"˙",DiacriticalDoubleAcute:"˝",DiacriticalGrave:"`",DiacriticalTilde:"˜",Diamond:"⋄",DifferentialD:"ⅆ",Dopf:"\uD835\uDD3B",Dot:"\xa8",DotDot:"⃜",DotEqual:"≐",DoubleContourIntegral:"∯",DoubleDot:"\xa8",DoubleDownArrow:"⇓",DoubleLeftArrow:"⇐",DoubleLeftRightArrow:"⇔",DoubleLeftTee:"⫤",DoubleLongLeftArrow:"⟸",DoubleLongLeftRightArrow:"⟺",DoubleLongRightArrow:"⟹",DoubleRightArrow:"⇒",DoubleRightTee:"⊨",DoubleUpArrow:"⇑",DoubleUpDownArrow:"⇕",DoubleVerticalBar:"∥",DownArrow:"↓",DownArrowBar:"⤓",DownArrowUpArrow:"⇵",DownBreve:"̑",DownLeftRightVector:"⥐",DownLeftTeeVector:"⥞",DownLeftVector:"↽",DownLeftVectorBar:"⥖",DownRightTeeVector:"⥟",DownRightVector:"⇁",DownRightVectorBar:"⥗",DownTee:"⊤",DownTeeArrow:"↧",Downarrow:"⇓",Dscr:"\uD835\uDC9F",Dstrok:"Đ",ENG:"Ŋ",ETH:"\xd0",Eacute:"\xc9",Ecaron:"Ě",Ecirc:"\xca",Ecy:"Э",Edot:"Ė",Efr:"\uD835\uDD08",Egrave:"\xc8",Element:"∈",Emacr:"Ē",EmptySmallSquare:"◻",EmptyVerySmallSquare:"▫",Eogon:"Ę",Eopf:"\uD835\uDD3C",Epsilon:"Ε",Equal:"⩵",EqualTilde:"≂",Equilibrium:"⇌",Escr:"ℰ",Esim:"⩳",Eta:"Η",Euml:"\xcb",Exists:"∃",ExponentialE:"ⅇ",Fcy:"Ф",Ffr:"\uD835\uDD09",FilledSmallSquare:"◼",FilledVerySmallSquare:"▪",Fopf:"\uD835\uDD3D",ForAll:"∀",Fouriertrf:"ℱ",Fscr:"ℱ",GJcy:"Ѓ",GT:">",Gamma:"Γ",Gammad:"Ϝ",Gbreve:"Ğ",Gcedil:"Ģ",Gcirc:"Ĝ",Gcy:"Г",Gdot:"Ġ",Gfr:"\uD835\uDD0A",Gg:"⋙",Gopf:"\uD835\uDD3E",GreaterEqual:"≥",GreaterEqualLess:"⋛",GreaterFullEqual:"≧",GreaterGreater:"⪢",GreaterLess:"≷",GreaterSlantEqual:"⩾",GreaterTilde:"≳",Gscr:"\uD835\uDCA2",Gt:"≫",HARDcy:"Ъ",Hacek:"ˇ",Hat:"^",Hcirc:"Ĥ",Hfr:"ℌ",HilbertSpace:"ℋ",Hopf:"ℍ",HorizontalLine:"─",Hscr:"ℋ",Hstrok:"Ħ",HumpDownHump:"≎",HumpEqual:"≏",IEcy:"Е",IJlig:"Ĳ",IOcy:"Ё",Iacute:"\xcd",Icirc:"\xce",Icy:"И",Idot:"İ",Ifr:"ℑ",Igrave:"\xcc",Im:"ℑ",Imacr:"Ī",ImaginaryI:"ⅈ",Implies:"⇒",Int:"∬",Integral:"∫",Intersection:"⋂",InvisibleComma:"⁣",InvisibleTimes:"⁢",Iogon:"Į",Iopf:"\uD835\uDD40",Iota:"Ι",Iscr:"ℐ",Itilde:"Ĩ",Iukcy:"І",Iuml:"\xcf",Jcirc:"Ĵ",Jcy:"Й",Jfr:"\uD835\uDD0D",Jopf:"\uD835\uDD41",Jscr:"\uD835\uDCA5",Jsercy:"Ј",Jukcy:"Є",KHcy:"Х",KJcy:"Ќ",Kappa:"Κ",Kcedil:"Ķ",Kcy:"К",Kfr:"\uD835\uDD0E",Kopf:"\uD835\uDD42",Kscr:"\uD835\uDCA6",LJcy:"Љ",LT:"<",Lacute:"Ĺ",Lambda:"Λ",Lang:"⟪",Laplacetrf:"ℒ",Larr:"↞",Lcaron:"Ľ",Lcedil:"Ļ",Lcy:"Л",LeftAngleBracket:"⟨",LeftArrow:"←",LeftArrowBar:"⇤",LeftArrowRightArrow:"⇆",LeftCeiling:"⌈",LeftDoubleBracket:"⟦",LeftDownTeeVector:"⥡",LeftDownVector:"⇃",LeftDownVectorBar:"⥙",LeftFloor:"⌊",LeftRightArrow:"↔",LeftRightVector:"⥎",LeftTee:"⊣",LeftTeeArrow:"↤",LeftTeeVector:"⥚",LeftTriangle:"⊲",LeftTriangleBar:"⧏",LeftTriangleEqual:"⊴",LeftUpDownVector:"⥑",LeftUpTeeVector:"⥠",LeftUpVector:"↿",LeftUpVectorBar:"⥘",LeftVector:"↼",LeftVectorBar:"⥒",Leftarrow:"⇐",Leftrightarrow:"⇔",LessEqualGreater:"⋚",LessFullEqual:"≦",LessGreater:"≶",LessLess:"⪡",LessSlantEqual:"⩽",LessTilde:"≲",Lfr:"\uD835\uDD0F",Ll:"⋘",Lleftarrow:"⇚",Lmidot:"Ŀ",LongLeftArrow:"⟵",LongLeftRightArrow:"⟷",LongRightArrow:"⟶",Longleftarrow:"⟸",Longleftrightarrow:"⟺",Longrightarrow:"⟹",Lopf:"\uD835\uDD43",LowerLeftArrow:"↙",LowerRightArrow:"↘",Lscr:"ℒ",Lsh:"↰",Lstrok:"Ł",Lt:"≪",Map:"⤅",Mcy:"М",MediumSpace:" ",Mellintrf:"ℳ",Mfr:"\uD835\uDD10",MinusPlus:"∓",Mopf:"\uD835\uDD44",Mscr:"ℳ",Mu:"Μ",NJcy:"Њ",Nacute:"Ń",Ncaron:"Ň",Ncedil:"Ņ",Ncy:"Н",NegativeMediumSpace:"​",NegativeThickSpace:"​",NegativeThinSpace:"​",NegativeVeryThinSpace:"​",NestedGreaterGreater:"≫",NestedLessLess:"≪",NewLine:"\n",Nfr:"\uD835\uDD11",NoBreak:"⁠",NonBreakingSpace:"\xa0",Nopf:"ℕ",Not:"⫬",NotCongruent:"≢",NotCupCap:"≭",NotDoubleVerticalBar:"∦",NotElement:"∉",NotEqual:"≠",NotEqualTilde:"≂̸",NotExists:"∄",NotGreater:"≯",NotGreaterEqual:"≱",NotGreaterFullEqual:"≧̸",NotGreaterGreater:"≫̸",NotGreaterLess:"≹",NotGreaterSlantEqual:"⩾̸",NotGreaterTilde:"≵",NotHumpDownHump:"≎̸",NotHumpEqual:"≏̸",NotLeftTriangle:"⋪",NotLeftTriangleBar:"⧏̸",NotLeftTriangleEqual:"⋬",NotLess:"≮",NotLessEqual:"≰",NotLessGreater:"≸",NotLessLess:"≪̸",NotLessSlantEqual:"⩽̸",NotLessTilde:"≴",NotNestedGreaterGreater:"⪢̸",NotNestedLessLess:"⪡̸",NotPrecedes:"⊀",NotPrecedesEqual:"⪯̸",NotPrecedesSlantEqual:"⋠",NotReverseElement:"∌",NotRightTriangle:"⋫",NotRightTriangleBar:"⧐̸",NotRightTriangleEqual:"⋭",NotSquareSubset:"⊏̸",NotSquareSubsetEqual:"⋢",NotSquareSuperset:"⊐̸",NotSquareSupersetEqual:"⋣",NotSubset:"⊂⃒",NotSubsetEqual:"⊈",NotSucceeds:"⊁",NotSucceedsEqual:"⪰̸",NotSucceedsSlantEqual:"⋡",NotSucceedsTilde:"≿̸",NotSuperset:"⊃⃒",NotSupersetEqual:"⊉",NotTilde:"≁",NotTildeEqual:"≄",NotTildeFullEqual:"≇",NotTildeTilde:"≉",NotVerticalBar:"∤",Nscr:"\uD835\uDCA9",Ntilde:"\xd1",Nu:"Ν",OElig:"Œ",Oacute:"\xd3",Ocirc:"\xd4",Ocy:"О",Odblac:"Ő",Ofr:"\uD835\uDD12",Ograve:"\xd2",Omacr:"Ō",Omega:"Ω",Omicron:"Ο",Oopf:"\uD835\uDD46",OpenCurlyDoubleQuote:"“",OpenCurlyQuote:"‘",Or:"⩔",Oscr:"\uD835\uDCAA",Oslash:"\xd8",Otilde:"\xd5",Otimes:"⨷",Ouml:"\xd6",OverBar:"‾",OverBrace:"⏞",OverBracket:"⎴",OverParenthesis:"⏜",PartialD:"∂",Pcy:"П",Pfr:"\uD835\uDD13",Phi:"Φ",Pi:"Π",PlusMinus:"\xb1",Poincareplane:"ℌ",Popf:"ℙ",Pr:"⪻",Precedes:"≺",PrecedesEqual:"⪯",PrecedesSlantEqual:"≼",PrecedesTilde:"≾",Prime:"″",Product:"∏",Proportion:"∷",Proportional:"∝",Pscr:"\uD835\uDCAB",Psi:"Ψ",QUOT:'"',Qfr:"\uD835\uDD14",Qopf:"ℚ",Qscr:"\uD835\uDCAC",RBarr:"⤐",REG:"\xae",Racute:"Ŕ",Rang:"⟫",Rarr:"↠",Rarrtl:"⤖",Rcaron:"Ř",Rcedil:"Ŗ",Rcy:"Р",Re:"ℜ",ReverseElement:"∋",ReverseEquilibrium:"⇋",ReverseUpEquilibrium:"⥯",Rfr:"ℜ",Rho:"Ρ",RightAngleBracket:"⟩",RightArrow:"→",RightArrowBar:"⇥",RightArrowLeftArrow:"⇄",RightCeiling:"⌉",RightDoubleBracket:"⟧",RightDownTeeVector:"⥝",RightDownVector:"⇂",RightDownVectorBar:"⥕",RightFloor:"⌋",RightTee:"⊢",RightTeeArrow:"↦",RightTeeVector:"⥛",RightTriangle:"⊳",RightTriangleBar:"⧐",RightTriangleEqual:"⊵",RightUpDownVector:"⥏",RightUpTeeVector:"⥜",RightUpVector:"↾",RightUpVectorBar:"⥔",RightVector:"⇀",RightVectorBar:"⥓",Rightarrow:"⇒",Ropf:"ℝ",RoundImplies:"⥰",Rrightarrow:"⇛",Rscr:"ℛ",Rsh:"↱",RuleDelayed:"⧴",SHCHcy:"Щ",SHcy:"Ш",SOFTcy:"Ь",Sacute:"Ś",Sc:"⪼",Scaron:"Š",Scedil:"Ş",Scirc:"Ŝ",Scy:"С",Sfr:"\uD835\uDD16",ShortDownArrow:"↓",ShortLeftArrow:"←",ShortRightArrow:"→",ShortUpArrow:"↑",Sigma:"Σ",SmallCircle:"∘",Sopf:"\uD835\uDD4A",Sqrt:"√",Square:"□",SquareIntersection:"⊓",SquareSubset:"⊏",SquareSubsetEqual:"⊑",SquareSuperset:"⊐",SquareSupersetEqual:"⊒",SquareUnion:"⊔",Sscr:"\uD835\uDCAE",Star:"⋆",Sub:"⋐",Subset:"⋐",SubsetEqual:"⊆",Succeeds:"≻",SucceedsEqual:"⪰",SucceedsSlantEqual:"≽",SucceedsTilde:"≿",SuchThat:"∋",Sum:"∑",Sup:"⋑",Superset:"⊃",SupersetEqual:"⊇",Supset:"⋑",THORN:"\xde",TRADE:"™",TSHcy:"Ћ",TScy:"Ц",Tab:"	",Tau:"Τ",Tcaron:"Ť",Tcedil:"Ţ",Tcy:"Т",Tfr:"\uD835\uDD17",Therefore:"∴",Theta:"Θ",ThickSpace:"  ",ThinSpace:" ",Tilde:"∼",TildeEqual:"≃",TildeFullEqual:"≅",TildeTilde:"≈",Topf:"\uD835\uDD4B",TripleDot:"⃛",Tscr:"\uD835\uDCAF",Tstrok:"Ŧ",Uacute:"\xda",Uarr:"↟",Uarrocir:"⥉",Ubrcy:"Ў",Ubreve:"Ŭ",Ucirc:"\xdb",Ucy:"У",Udblac:"Ű",Ufr:"\uD835\uDD18",Ugrave:"\xd9",Umacr:"Ū",UnderBar:"_",UnderBrace:"⏟",UnderBracket:"⎵",UnderParenthesis:"⏝",Union:"⋃",UnionPlus:"⊎",Uogon:"Ų",Uopf:"\uD835\uDD4C",UpArrow:"↑",UpArrowBar:"⤒",UpArrowDownArrow:"⇅",UpDownArrow:"↕",UpEquilibrium:"⥮",UpTee:"⊥",UpTeeArrow:"↥",Uparrow:"⇑",Updownarrow:"⇕",UpperLeftArrow:"↖",UpperRightArrow:"↗",Upsi:"ϒ",Upsilon:"Υ",Uring:"Ů",Uscr:"\uD835\uDCB0",Utilde:"Ũ",Uuml:"\xdc",VDash:"⊫",Vbar:"⫫",Vcy:"В",Vdash:"⊩",Vdashl:"⫦",Vee:"⋁",Verbar:"‖",Vert:"‖",VerticalBar:"∣",VerticalLine:"|",VerticalSeparator:"❘",VerticalTilde:"≀",VeryThinSpace:" ",Vfr:"\uD835\uDD19",Vopf:"\uD835\uDD4D",Vscr:"\uD835\uDCB1",Vvdash:"⊪",Wcirc:"Ŵ",Wedge:"⋀",Wfr:"\uD835\uDD1A",Wopf:"\uD835\uDD4E",Wscr:"\uD835\uDCB2",Xfr:"\uD835\uDD1B",Xi:"Ξ",Xopf:"\uD835\uDD4F",Xscr:"\uD835\uDCB3",YAcy:"Я",YIcy:"Ї",YUcy:"Ю",Yacute:"\xdd",Ycirc:"Ŷ",Ycy:"Ы",Yfr:"\uD835\uDD1C",Yopf:"\uD835\uDD50",Yscr:"\uD835\uDCB4",Yuml:"Ÿ",ZHcy:"Ж",Zacute:"Ź",Zcaron:"Ž",Zcy:"З",Zdot:"Ż",ZeroWidthSpace:"​",Zeta:"Ζ",Zfr:"ℨ",Zopf:"ℤ",Zscr:"\uD835\uDCB5",aacute:"\xe1",abreve:"ă",ac:"∾",acE:"∾̳",acd:"∿",acirc:"\xe2",acute:"\xb4",acy:"а",aelig:"\xe6",af:"⁡",afr:"\uD835\uDD1E",agrave:"\xe0",alefsym:"ℵ",aleph:"ℵ",alpha:"α",amacr:"ā",amalg:"⨿",amp:"&",and:"∧",andand:"⩕",andd:"⩜",andslope:"⩘",andv:"⩚",ang:"∠",ange:"⦤",angle:"∠",angmsd:"∡",angmsdaa:"⦨",angmsdab:"⦩",angmsdac:"⦪",angmsdad:"⦫",angmsdae:"⦬",angmsdaf:"⦭",angmsdag:"⦮",angmsdah:"⦯",angrt:"∟",angrtvb:"⊾",angrtvbd:"⦝",angsph:"∢",angst:"\xc5",angzarr:"⍼",aogon:"ą",aopf:"\uD835\uDD52",ap:"≈",apE:"⩰",apacir:"⩯",ape:"≊",apid:"≋",apos:"'",approx:"≈",approxeq:"≊",aring:"\xe5",ascr:"\uD835\uDCB6",ast:"*",asymp:"≈",asympeq:"≍",atilde:"\xe3",auml:"\xe4",awconint:"∳",awint:"⨑",bNot:"⫭",backcong:"≌",backepsilon:"϶",backprime:"‵",backsim:"∽",backsimeq:"⋍",barvee:"⊽",barwed:"⌅",barwedge:"⌅",bbrk:"⎵",bbrktbrk:"⎶",bcong:"≌",bcy:"б",bdquo:"„",becaus:"∵",because:"∵",bemptyv:"⦰",bepsi:"϶",bernou:"ℬ",beta:"β",beth:"ℶ",between:"≬",bfr:"\uD835\uDD1F",bigcap:"⋂",bigcirc:"◯",bigcup:"⋃",bigodot:"⨀",bigoplus:"⨁",bigotimes:"⨂",bigsqcup:"⨆",bigstar:"★",bigtriangledown:"▽",bigtriangleup:"△",biguplus:"⨄",bigvee:"⋁",bigwedge:"⋀",bkarow:"⤍",blacklozenge:"⧫",blacksquare:"▪",blacktriangle:"▴",blacktriangledown:"▾",blacktriangleleft:"◂",blacktriangleright:"▸",blank:"␣",blk12:"▒",blk14:"░",blk34:"▓",block:"█",bne:"=⃥",bnequiv:"≡⃥",bnot:"⌐",bopf:"\uD835\uDD53",bot:"⊥",bottom:"⊥",bowtie:"⋈",boxDL:"╗",boxDR:"╔",boxDl:"╖",boxDr:"╓",boxH:"═",boxHD:"╦",boxHU:"╩",boxHd:"╤",boxHu:"╧",boxUL:"╝",boxUR:"╚",boxUl:"╜",boxUr:"╙",boxV:"║",boxVH:"╬",boxVL:"╣",boxVR:"╠",boxVh:"╫",boxVl:"╢",boxVr:"╟",boxbox:"⧉",boxdL:"╕",boxdR:"╒",boxdl:"┐",boxdr:"┌",boxh:"─",boxhD:"╥",boxhU:"╨",boxhd:"┬",boxhu:"┴",boxminus:"⊟",boxplus:"⊞",boxtimes:"⊠",boxuL:"╛",boxuR:"╘",boxul:"┘",boxur:"└",boxv:"│",boxvH:"╪",boxvL:"╡",boxvR:"╞",boxvh:"┼",boxvl:"┤",boxvr:"├",bprime:"‵",breve:"˘",brvbar:"\xa6",bscr:"\uD835\uDCB7",bsemi:"⁏",bsim:"∽",bsime:"⋍",bsol:"\\",bsolb:"⧅",bsolhsub:"⟈",bull:"•",bullet:"•",bump:"≎",bumpE:"⪮",bumpe:"≏",bumpeq:"≏",cacute:"ć",cap:"∩",capand:"⩄",capbrcup:"⩉",capcap:"⩋",capcup:"⩇",capdot:"⩀",caps:"∩︀",caret:"⁁",caron:"ˇ",ccaps:"⩍",ccaron:"č",ccedil:"\xe7",ccirc:"ĉ",ccups:"⩌",ccupssm:"⩐",cdot:"ċ",cedil:"\xb8",cemptyv:"⦲",cent:"\xa2",centerdot:"\xb7",cfr:"\uD835\uDD20",chcy:"ч",check:"✓",checkmark:"✓",chi:"χ",cir:"○",cirE:"⧃",circ:"ˆ",circeq:"≗",circlearrowleft:"↺",circlearrowright:"↻",circledR:"\xae",circledS:"Ⓢ",circledast:"⊛",circledcirc:"⊚",circleddash:"⊝",cire:"≗",cirfnint:"⨐",cirmid:"⫯",cirscir:"⧂",clubs:"♣",clubsuit:"♣",colon:":",colone:"≔",coloneq:"≔",comma:",",commat:"@",comp:"∁",compfn:"∘",complement:"∁",complexes:"ℂ",cong:"≅",congdot:"⩭",conint:"∮",copf:"\uD835\uDD54",coprod:"∐",copy:"\xa9",copysr:"℗",crarr:"↵",cross:"✗",cscr:"\uD835\uDCB8",csub:"⫏",csube:"⫑",csup:"⫐",csupe:"⫒",ctdot:"⋯",cudarrl:"⤸",cudarrr:"⤵",cuepr:"⋞",cuesc:"⋟",cularr:"↶",cularrp:"⤽",cup:"∪",cupbrcap:"⩈",cupcap:"⩆",cupcup:"⩊",cupdot:"⊍",cupor:"⩅",cups:"∪︀",curarr:"↷",curarrm:"⤼",curlyeqprec:"⋞",curlyeqsucc:"⋟",curlyvee:"⋎",curlywedge:"⋏",curren:"\xa4",curvearrowleft:"↶",curvearrowright:"↷",cuvee:"⋎",cuwed:"⋏",cwconint:"∲",cwint:"∱",cylcty:"⌭",dArr:"⇓",dHar:"⥥",dagger:"†",daleth:"ℸ",darr:"↓",dash:"‐",dashv:"⊣",dbkarow:"⤏",dblac:"˝",dcaron:"ď",dcy:"д",dd:"ⅆ",ddagger:"‡",ddarr:"⇊",ddotseq:"⩷",deg:"\xb0",delta:"δ",demptyv:"⦱",dfisht:"⥿",dfr:"\uD835\uDD21",dharl:"⇃",dharr:"⇂",diam:"⋄",diamond:"⋄",diamondsuit:"♦",diams:"♦",die:"\xa8",digamma:"ϝ",disin:"⋲",div:"\xf7",divide:"\xf7",divideontimes:"⋇",divonx:"⋇",djcy:"ђ",dlcorn:"⌞",dlcrop:"⌍",dollar:"$",dopf:"\uD835\uDD55",dot:"˙",doteq:"≐",doteqdot:"≑",dotminus:"∸",dotplus:"∔",dotsquare:"⊡",doublebarwedge:"⌆",downarrow:"↓",downdownarrows:"⇊",downharpoonleft:"⇃",downharpoonright:"⇂",drbkarow:"⤐",drcorn:"⌟",drcrop:"⌌",dscr:"\uD835\uDCB9",dscy:"ѕ",dsol:"⧶",dstrok:"đ",dtdot:"⋱",dtri:"▿",dtrif:"▾",duarr:"⇵",duhar:"⥯",dwangle:"⦦",dzcy:"џ",dzigrarr:"⟿",eDDot:"⩷",eDot:"≑",eacute:"\xe9",easter:"⩮",ecaron:"ě",ecir:"≖",ecirc:"\xea",ecolon:"≕",ecy:"э",edot:"ė",ee:"ⅇ",efDot:"≒",efr:"\uD835\uDD22",eg:"⪚",egrave:"\xe8",egs:"⪖",egsdot:"⪘",el:"⪙",elinters:"⏧",ell:"ℓ",els:"⪕",elsdot:"⪗",emacr:"ē",empty:"∅",emptyset:"∅",emptyv:"∅",emsp13:" ",emsp14:" ",emsp:" ",eng:"ŋ",ensp:" ",eogon:"ę",eopf:"\uD835\uDD56",epar:"⋕",eparsl:"⧣",eplus:"⩱",epsi:"ε",epsilon:"ε",epsiv:"ϵ",eqcirc:"≖",eqcolon:"≕",eqsim:"≂",eqslantgtr:"⪖",eqslantless:"⪕",equals:"=",equest:"≟",equiv:"≡",equivDD:"⩸",eqvparsl:"⧥",erDot:"≓",erarr:"⥱",escr:"ℯ",esdot:"≐",esim:"≂",eta:"η",eth:"\xf0",euml:"\xeb",euro:"€",excl:"!",exist:"∃",expectation:"ℰ",exponentiale:"ⅇ",fallingdotseq:"≒",fcy:"ф",female:"♀",ffilig:"ﬃ",fflig:"ﬀ",ffllig:"ﬄ",ffr:"\uD835\uDD23",filig:"ﬁ",fjlig:"fj",flat:"♭",fllig:"ﬂ",fltns:"▱",fnof:"ƒ",fopf:"\uD835\uDD57",forall:"∀",fork:"⋔",forkv:"⫙",fpartint:"⨍",frac12:"\xbd",frac13:"⅓",frac14:"\xbc",frac15:"⅕",frac16:"⅙",frac18:"⅛",frac23:"⅔",frac25:"⅖",frac34:"\xbe",frac35:"⅗",frac38:"⅜",frac45:"⅘",frac56:"⅚",frac58:"⅝",frac78:"⅞",frasl:"⁄",frown:"⌢",fscr:"\uD835\uDCBB",gE:"≧",gEl:"⪌",gacute:"ǵ",gamma:"γ",gammad:"ϝ",gap:"⪆",gbreve:"ğ",gcirc:"ĝ",gcy:"г",gdot:"ġ",ge:"≥",gel:"⋛",geq:"≥",geqq:"≧",geqslant:"⩾",ges:"⩾",gescc:"⪩",gesdot:"⪀",gesdoto:"⪂",gesdotol:"⪄",gesl:"⋛︀",gesles:"⪔",gfr:"\uD835\uDD24",gg:"≫",ggg:"⋙",gimel:"ℷ",gjcy:"ѓ",gl:"≷",glE:"⪒",gla:"⪥",glj:"⪤",gnE:"≩",gnap:"⪊",gnapprox:"⪊",gne:"⪈",gneq:"⪈",gneqq:"≩",gnsim:"⋧",gopf:"\uD835\uDD58",grave:"`",gscr:"ℊ",gsim:"≳",gsime:"⪎",gsiml:"⪐",gt:">",gtcc:"⪧",gtcir:"⩺",gtdot:"⋗",gtlPar:"⦕",gtquest:"⩼",gtrapprox:"⪆",gtrarr:"⥸",gtrdot:"⋗",gtreqless:"⋛",gtreqqless:"⪌",gtrless:"≷",gtrsim:"≳",gvertneqq:"≩︀",gvnE:"≩︀",hArr:"⇔",hairsp:" ",half:"\xbd",hamilt:"ℋ",hardcy:"ъ",harr:"↔",harrcir:"⥈",harrw:"↭",hbar:"ℏ",hcirc:"ĥ",hearts:"♥",heartsuit:"♥",hellip:"…",hercon:"⊹",hfr:"\uD835\uDD25",hksearow:"⤥",hkswarow:"⤦",hoarr:"⇿",homtht:"∻",hookleftarrow:"↩",hookrightarrow:"↪",hopf:"\uD835\uDD59",horbar:"―",hscr:"\uD835\uDCBD",hslash:"ℏ",hstrok:"ħ",hybull:"⁃",hyphen:"‐",iacute:"\xed",ic:"⁣",icirc:"\xee",icy:"и",iecy:"е",iexcl:"\xa1",iff:"⇔",ifr:"\uD835\uDD26",igrave:"\xec",ii:"ⅈ",iiiint:"⨌",iiint:"∭",iinfin:"⧜",iiota:"℩",ijlig:"ĳ",imacr:"ī",image:"ℑ",imagline:"ℐ",imagpart:"ℑ",imath:"ı",imof:"⊷",imped:"Ƶ",in:"∈",incare:"℅",infin:"∞",infintie:"⧝",inodot:"ı",int:"∫",intcal:"⊺",integers:"ℤ",intercal:"⊺",intlarhk:"⨗",intprod:"⨼",iocy:"ё",iogon:"į",iopf:"\uD835\uDD5A",iota:"ι",iprod:"⨼",iquest:"\xbf",iscr:"\uD835\uDCBE",isin:"∈",isinE:"⋹",isindot:"⋵",isins:"⋴",isinsv:"⋳",isinv:"∈",it:"⁢",itilde:"ĩ",iukcy:"і",iuml:"\xef",jcirc:"ĵ",jcy:"й",jfr:"\uD835\uDD27",jmath:"ȷ",jopf:"\uD835\uDD5B",jscr:"\uD835\uDCBF",jsercy:"ј",jukcy:"є",kappa:"κ",kappav:"ϰ",kcedil:"ķ",kcy:"к",kfr:"\uD835\uDD28",kgreen:"ĸ",khcy:"х",kjcy:"ќ",kopf:"\uD835\uDD5C",kscr:"\uD835\uDCC0",lAarr:"⇚",lArr:"⇐",lAtail:"⤛",lBarr:"⤎",lE:"≦",lEg:"⪋",lHar:"⥢",lacute:"ĺ",laemptyv:"⦴",lagran:"ℒ",lambda:"λ",lang:"⟨",langd:"⦑",langle:"⟨",lap:"⪅",laquo:"\xab",larr:"←",larrb:"⇤",larrbfs:"⤟",larrfs:"⤝",larrhk:"↩",larrlp:"↫",larrpl:"⤹",larrsim:"⥳",larrtl:"↢",lat:"⪫",latail:"⤙",late:"⪭",lates:"⪭︀",lbarr:"⤌",lbbrk:"❲",lbrace:"{",lbrack:"[",lbrke:"⦋",lbrksld:"⦏",lbrkslu:"⦍",lcaron:"ľ",lcedil:"ļ",lceil:"⌈",lcub:"{",lcy:"л",ldca:"⤶",ldquo:"“",ldquor:"„",ldrdhar:"⥧",ldrushar:"⥋",ldsh:"↲",le:"≤",leftarrow:"←",leftarrowtail:"↢",leftharpoondown:"↽",leftharpoonup:"↼",leftleftarrows:"⇇",leftrightarrow:"↔",leftrightarrows:"⇆",leftrightharpoons:"⇋",leftrightsquigarrow:"↭",leftthreetimes:"⋋",leg:"⋚",leq:"≤",leqq:"≦",leqslant:"⩽",les:"⩽",lescc:"⪨",lesdot:"⩿",lesdoto:"⪁",lesdotor:"⪃",lesg:"⋚︀",lesges:"⪓",lessapprox:"⪅",lessdot:"⋖",lesseqgtr:"⋚",lesseqqgtr:"⪋",lessgtr:"≶",lesssim:"≲",lfisht:"⥼",lfloor:"⌊",lfr:"\uD835\uDD29",lg:"≶",lgE:"⪑",lhard:"↽",lharu:"↼",lharul:"⥪",lhblk:"▄",ljcy:"љ",ll:"≪",llarr:"⇇",llcorner:"⌞",llhard:"⥫",lltri:"◺",lmidot:"ŀ",lmoust:"⎰",lmoustache:"⎰",lnE:"≨",lnap:"⪉",lnapprox:"⪉",lne:"⪇",lneq:"⪇",lneqq:"≨",lnsim:"⋦",loang:"⟬",loarr:"⇽",lobrk:"⟦",longleftarrow:"⟵",longleftrightarrow:"⟷",longmapsto:"⟼",longrightarrow:"⟶",looparrowleft:"↫",looparrowright:"↬",lopar:"⦅",lopf:"\uD835\uDD5D",loplus:"⨭",lotimes:"⨴",lowast:"∗",lowbar:"_",loz:"◊",lozenge:"◊",lozf:"⧫",lpar:"(",lparlt:"⦓",lrarr:"⇆",lrcorner:"⌟",lrhar:"⇋",lrhard:"⥭",lrm:"‎",lrtri:"⊿",lsaquo:"‹",lscr:"\uD835\uDCC1",lsh:"↰",lsim:"≲",lsime:"⪍",lsimg:"⪏",lsqb:"[",lsquo:"‘",lsquor:"‚",lstrok:"ł",lt:"<",ltcc:"⪦",ltcir:"⩹",ltdot:"⋖",lthree:"⋋",ltimes:"⋉",ltlarr:"⥶",ltquest:"⩻",ltrPar:"⦖",ltri:"◃",ltrie:"⊴",ltrif:"◂",lurdshar:"⥊",luruhar:"⥦",lvertneqq:"≨︀",lvnE:"≨︀",mDDot:"∺",macr:"\xaf",male:"♂",malt:"✠",maltese:"✠",map:"↦",mapsto:"↦",mapstodown:"↧",mapstoleft:"↤",mapstoup:"↥",marker:"▮",mcomma:"⨩",mcy:"м",mdash:"—",measuredangle:"∡",mfr:"\uD835\uDD2A",mho:"℧",micro:"\xb5",mid:"∣",midast:"*",midcir:"⫰",middot:"\xb7",minus:"−",minusb:"⊟",minusd:"∸",minusdu:"⨪",mlcp:"⫛",mldr:"…",mnplus:"∓",models:"⊧",mopf:"\uD835\uDD5E",mp:"∓",mscr:"\uD835\uDCC2",mstpos:"∾",mu:"μ",multimap:"⊸",mumap:"⊸",nGg:"⋙̸",nGt:"≫⃒",nGtv:"≫̸",nLeftarrow:"⇍",nLeftrightarrow:"⇎",nLl:"⋘̸",nLt:"≪⃒",nLtv:"≪̸",nRightarrow:"⇏",nVDash:"⊯",nVdash:"⊮",nabla:"∇",nacute:"ń",nang:"∠⃒",nap:"≉",napE:"⩰̸",napid:"≋̸",napos:"ŉ",napprox:"≉",natur:"♮",natural:"♮",naturals:"ℕ",nbsp:"\xa0",nbump:"≎̸",nbumpe:"≏̸",ncap:"⩃",ncaron:"ň",ncedil:"ņ",ncong:"≇",ncongdot:"⩭̸",ncup:"⩂",ncy:"н",ndash:"–",ne:"≠",neArr:"⇗",nearhk:"⤤",nearr:"↗",nearrow:"↗",nedot:"≐̸",nequiv:"≢",nesear:"⤨",nesim:"≂̸",nexist:"∄",nexists:"∄",nfr:"\uD835\uDD2B",ngE:"≧̸",nge:"≱",ngeq:"≱",ngeqq:"≧̸",ngeqslant:"⩾̸",nges:"⩾̸",ngsim:"≵",ngt:"≯",ngtr:"≯",nhArr:"⇎",nharr:"↮",nhpar:"⫲",ni:"∋",nis:"⋼",nisd:"⋺",niv:"∋",njcy:"њ",nlArr:"⇍",nlE:"≦̸",nlarr:"↚",nldr:"‥",nle:"≰",nleftarrow:"↚",nleftrightarrow:"↮",nleq:"≰",nleqq:"≦̸",nleqslant:"⩽̸",nles:"⩽̸",nless:"≮",nlsim:"≴",nlt:"≮",nltri:"⋪",nltrie:"⋬",nmid:"∤",nopf:"\uD835\uDD5F",not:"\xac",notin:"∉",notinE:"⋹̸",notindot:"⋵̸",notinva:"∉",notinvb:"⋷",notinvc:"⋶",notni:"∌",notniva:"∌",notnivb:"⋾",notnivc:"⋽",npar:"∦",nparallel:"∦",nparsl:"⫽⃥",npart:"∂̸",npolint:"⨔",npr:"⊀",nprcue:"⋠",npre:"⪯̸",nprec:"⊀",npreceq:"⪯̸",nrArr:"⇏",nrarr:"↛",nrarrc:"⤳̸",nrarrw:"↝̸",nrightarrow:"↛",nrtri:"⋫",nrtrie:"⋭",nsc:"⊁",nsccue:"⋡",nsce:"⪰̸",nscr:"\uD835\uDCC3",nshortmid:"∤",nshortparallel:"∦",nsim:"≁",nsime:"≄",nsimeq:"≄",nsmid:"∤",nspar:"∦",nsqsube:"⋢",nsqsupe:"⋣",nsub:"⊄",nsubE:"⫅̸",nsube:"⊈",nsubset:"⊂⃒",nsubseteq:"⊈",nsubseteqq:"⫅̸",nsucc:"⊁",nsucceq:"⪰̸",nsup:"⊅",nsupE:"⫆̸",nsupe:"⊉",nsupset:"⊃⃒",nsupseteq:"⊉",nsupseteqq:"⫆̸",ntgl:"≹",ntilde:"\xf1",ntlg:"≸",ntriangleleft:"⋪",ntrianglelefteq:"⋬",ntriangleright:"⋫",ntrianglerighteq:"⋭",nu:"ν",num:"#",numero:"№",numsp:" ",nvDash:"⊭",nvHarr:"⤄",nvap:"≍⃒",nvdash:"⊬",nvge:"≥⃒",nvgt:">⃒",nvinfin:"⧞",nvlArr:"⤂",nvle:"≤⃒",nvlt:"<⃒",nvltrie:"⊴⃒",nvrArr:"⤃",nvrtrie:"⊵⃒",nvsim:"∼⃒",nwArr:"⇖",nwarhk:"⤣",nwarr:"↖",nwarrow:"↖",nwnear:"⤧",oS:"Ⓢ",oacute:"\xf3",oast:"⊛",ocir:"⊚",ocirc:"\xf4",ocy:"о",odash:"⊝",odblac:"ő",odiv:"⨸",odot:"⊙",odsold:"⦼",oelig:"œ",ofcir:"⦿",ofr:"\uD835\uDD2C",ogon:"˛",ograve:"\xf2",ogt:"⧁",ohbar:"⦵",ohm:"Ω",oint:"∮",olarr:"↺",olcir:"⦾",olcross:"⦻",oline:"‾",olt:"⧀",omacr:"ō",omega:"ω",omicron:"ο",omid:"⦶",ominus:"⊖",oopf:"\uD835\uDD60",opar:"⦷",operp:"⦹",oplus:"⊕",or:"∨",orarr:"↻",ord:"⩝",order:"ℴ",orderof:"ℴ",ordf:"\xaa",ordm:"\xba",origof:"⊶",oror:"⩖",orslope:"⩗",orv:"⩛",oscr:"ℴ",oslash:"\xf8",osol:"⊘",otilde:"\xf5",otimes:"⊗",otimesas:"⨶",ouml:"\xf6",ovbar:"⌽",par:"∥",para:"\xb6",parallel:"∥",parsim:"⫳",parsl:"⫽",part:"∂",pcy:"п",percnt:"%",period:".",permil:"‰",perp:"⊥",pertenk:"‱",pfr:"\uD835\uDD2D",phi:"φ",phiv:"ϕ",phmmat:"ℳ",phone:"☎",pi:"π",pitchfork:"⋔",piv:"ϖ",planck:"ℏ",planckh:"ℎ",plankv:"ℏ",plus:"+",plusacir:"⨣",plusb:"⊞",pluscir:"⨢",plusdo:"∔",plusdu:"⨥",pluse:"⩲",plusmn:"\xb1",plussim:"⨦",plustwo:"⨧",pm:"\xb1",pointint:"⨕",popf:"\uD835\uDD61",pound:"\xa3",pr:"≺",prE:"⪳",prap:"⪷",prcue:"≼",pre:"⪯",prec:"≺",precapprox:"⪷",preccurlyeq:"≼",preceq:"⪯",precnapprox:"⪹",precneqq:"⪵",precnsim:"⋨",precsim:"≾",prime:"′",primes:"ℙ",prnE:"⪵",prnap:"⪹",prnsim:"⋨",prod:"∏",profalar:"⌮",profline:"⌒",profsurf:"⌓",prop:"∝",propto:"∝",prsim:"≾",prurel:"⊰",pscr:"\uD835\uDCC5",psi:"ψ",puncsp:" ",qfr:"\uD835\uDD2E",qint:"⨌",qopf:"\uD835\uDD62",qprime:"⁗",qscr:"\uD835\uDCC6",quaternions:"ℍ",quatint:"⨖",quest:"?",questeq:"≟",quot:'"',rAarr:"⇛",rArr:"⇒",rAtail:"⤜",rBarr:"⤏",rHar:"⥤",race:"∽̱",racute:"ŕ",radic:"√",raemptyv:"⦳",rang:"⟩",rangd:"⦒",range:"⦥",rangle:"⟩",raquo:"\xbb",rarr:"→",rarrap:"⥵",rarrb:"⇥",rarrbfs:"⤠",rarrc:"⤳",rarrfs:"⤞",rarrhk:"↪",rarrlp:"↬",rarrpl:"⥅",rarrsim:"⥴",rarrtl:"↣",rarrw:"↝",ratail:"⤚",ratio:"∶",rationals:"ℚ",rbarr:"⤍",rbbrk:"❳",rbrace:"}",rbrack:"]",rbrke:"⦌",rbrksld:"⦎",rbrkslu:"⦐",rcaron:"ř",rcedil:"ŗ",rceil:"⌉",rcub:"}",rcy:"р",rdca:"⤷",rdldhar:"⥩",rdquo:"”",rdquor:"”",rdsh:"↳",real:"ℜ",realine:"ℛ",realpart:"ℜ",reals:"ℝ",rect:"▭",reg:"\xae",rfisht:"⥽",rfloor:"⌋",rfr:"\uD835\uDD2F",rhard:"⇁",rharu:"⇀",rharul:"⥬",rho:"ρ",rhov:"ϱ",rightarrow:"→",rightarrowtail:"↣",rightharpoondown:"⇁",rightharpoonup:"⇀",rightleftarrows:"⇄",rightleftharpoons:"⇌",rightrightarrows:"⇉",rightsquigarrow:"↝",rightthreetimes:"⋌",ring:"˚",risingdotseq:"≓",rlarr:"⇄",rlhar:"⇌",rlm:"‏",rmoust:"⎱",rmoustache:"⎱",rnmid:"⫮",roang:"⟭",roarr:"⇾",robrk:"⟧",ropar:"⦆",ropf:"\uD835\uDD63",roplus:"⨮",rotimes:"⨵",rpar:")",rpargt:"⦔",rppolint:"⨒",rrarr:"⇉",rsaquo:"›",rscr:"\uD835\uDCC7",rsh:"↱",rsqb:"]",rsquo:"’",rsquor:"’",rthree:"⋌",rtimes:"⋊",rtri:"▹",rtrie:"⊵",rtrif:"▸",rtriltri:"⧎",ruluhar:"⥨",rx:"℞",sacute:"ś",sbquo:"‚",sc:"≻",scE:"⪴",scap:"⪸",scaron:"š",sccue:"≽",sce:"⪰",scedil:"ş",scirc:"ŝ",scnE:"⪶",scnap:"⪺",scnsim:"⋩",scpolint:"⨓",scsim:"≿",scy:"с",sdot:"⋅",sdotb:"⊡",sdote:"⩦",seArr:"⇘",searhk:"⤥",searr:"↘",searrow:"↘",sect:"\xa7",semi:";",seswar:"⤩",setminus:"∖",setmn:"∖",sext:"✶",sfr:"\uD835\uDD30",sfrown:"⌢",sharp:"♯",shchcy:"щ",shcy:"ш",shortmid:"∣",shortparallel:"∥",shy:"\xad",sigma:"σ",sigmaf:"ς",sigmav:"ς",sim:"∼",simdot:"⩪",sime:"≃",simeq:"≃",simg:"⪞",simgE:"⪠",siml:"⪝",simlE:"⪟",simne:"≆",simplus:"⨤",simrarr:"⥲",slarr:"←",smallsetminus:"∖",smashp:"⨳",smeparsl:"⧤",smid:"∣",smile:"⌣",smt:"⪪",smte:"⪬",smtes:"⪬︀",softcy:"ь",sol:"/",solb:"⧄",solbar:"⌿",sopf:"\uD835\uDD64",spades:"♠",spadesuit:"♠",spar:"∥",sqcap:"⊓",sqcaps:"⊓︀",sqcup:"⊔",sqcups:"⊔︀",sqsub:"⊏",sqsube:"⊑",sqsubset:"⊏",sqsubseteq:"⊑",sqsup:"⊐",sqsupe:"⊒",sqsupset:"⊐",sqsupseteq:"⊒",squ:"□",square:"□",squarf:"▪",squf:"▪",srarr:"→",sscr:"\uD835\uDCC8",ssetmn:"∖",ssmile:"⌣",sstarf:"⋆",star:"☆",starf:"★",straightepsilon:"ϵ",straightphi:"ϕ",strns:"\xaf",sub:"⊂",subE:"⫅",subdot:"⪽",sube:"⊆",subedot:"⫃",submult:"⫁",subnE:"⫋",subne:"⊊",subplus:"⪿",subrarr:"⥹",subset:"⊂",subseteq:"⊆",subseteqq:"⫅",subsetneq:"⊊",subsetneqq:"⫋",subsim:"⫇",subsub:"⫕",subsup:"⫓",succ:"≻",succapprox:"⪸",succcurlyeq:"≽",succeq:"⪰",succnapprox:"⪺",succneqq:"⪶",succnsim:"⋩",succsim:"≿",sum:"∑",sung:"♪",sup1:"\xb9",sup2:"\xb2",sup3:"\xb3",sup:"⊃",supE:"⫆",supdot:"⪾",supdsub:"⫘",supe:"⊇",supedot:"⫄",suphsol:"⟉",suphsub:"⫗",suplarr:"⥻",supmult:"⫂",supnE:"⫌",supne:"⊋",supplus:"⫀",supset:"⊃",supseteq:"⊇",supseteqq:"⫆",supsetneq:"⊋",supsetneqq:"⫌",supsim:"⫈",supsub:"⫔",supsup:"⫖",swArr:"⇙",swarhk:"⤦",swarr:"↙",swarrow:"↙",swnwar:"⤪",szlig:"\xdf",target:"⌖",tau:"τ",tbrk:"⎴",tcaron:"ť",tcedil:"ţ",tcy:"т",tdot:"⃛",telrec:"⌕",tfr:"\uD835\uDD31",there4:"∴",therefore:"∴",theta:"θ",thetasym:"ϑ",thetav:"ϑ",thickapprox:"≈",thicksim:"∼",thinsp:" ",thkap:"≈",thksim:"∼",thorn:"\xfe",tilde:"˜",times:"\xd7",timesb:"⊠",timesbar:"⨱",timesd:"⨰",tint:"∭",toea:"⤨",top:"⊤",topbot:"⌶",topcir:"⫱",topf:"\uD835\uDD65",topfork:"⫚",tosa:"⤩",tprime:"‴",trade:"™",triangle:"▵",triangledown:"▿",triangleleft:"◃",trianglelefteq:"⊴",triangleq:"≜",triangleright:"▹",trianglerighteq:"⊵",tridot:"◬",trie:"≜",triminus:"⨺",triplus:"⨹",trisb:"⧍",tritime:"⨻",trpezium:"⏢",tscr:"\uD835\uDCC9",tscy:"ц",tshcy:"ћ",tstrok:"ŧ",twixt:"≬",twoheadleftarrow:"↞",twoheadrightarrow:"↠",uArr:"⇑",uHar:"⥣",uacute:"\xfa",uarr:"↑",ubrcy:"ў",ubreve:"ŭ",ucirc:"\xfb",ucy:"у",udarr:"⇅",udblac:"ű",udhar:"⥮",ufisht:"⥾",ufr:"\uD835\uDD32",ugrave:"\xf9",uharl:"↿",uharr:"↾",uhblk:"▀",ulcorn:"⌜",ulcorner:"⌜",ulcrop:"⌏",ultri:"◸",umacr:"ū",uml:"\xa8",uogon:"ų",uopf:"\uD835\uDD66",uparrow:"↑",updownarrow:"↕",upharpoonleft:"↿",upharpoonright:"↾",uplus:"⊎",upsi:"υ",upsih:"ϒ",upsilon:"υ",upuparrows:"⇈",urcorn:"⌝",urcorner:"⌝",urcrop:"⌎",uring:"ů",urtri:"◹",uscr:"\uD835\uDCCA",utdot:"⋰",utilde:"ũ",utri:"▵",utrif:"▴",uuarr:"⇈",uuml:"\xfc",uwangle:"⦧",vArr:"⇕",vBar:"⫨",vBarv:"⫩",vDash:"⊨",vangrt:"⦜",varepsilon:"ϵ",varkappa:"ϰ",varnothing:"∅",varphi:"ϕ",varpi:"ϖ",varpropto:"∝",varr:"↕",varrho:"ϱ",varsigma:"ς",varsubsetneq:"⊊︀",varsubsetneqq:"⫋︀",varsupsetneq:"⊋︀",varsupsetneqq:"⫌︀",vartheta:"ϑ",vartriangleleft:"⊲",vartriangleright:"⊳",vcy:"в",vdash:"⊢",vee:"∨",veebar:"⊻",veeeq:"≚",vellip:"⋮",verbar:"|",vert:"|",vfr:"\uD835\uDD33",vltri:"⊲",vnsub:"⊂⃒",vnsup:"⊃⃒",vopf:"\uD835\uDD67",vprop:"∝",vrtri:"⊳",vscr:"\uD835\uDCCB",vsubnE:"⫋︀",vsubne:"⊊︀",vsupnE:"⫌︀",vsupne:"⊋︀",vzigzag:"⦚",wcirc:"ŵ",wedbar:"⩟",wedge:"∧",wedgeq:"≙",weierp:"℘",wfr:"\uD835\uDD34",wopf:"\uD835\uDD68",wp:"℘",wr:"≀",wreath:"≀",wscr:"\uD835\uDCCC",xcap:"⋂",xcirc:"◯",xcup:"⋃",xdtri:"▽",xfr:"\uD835\uDD35",xhArr:"⟺",xharr:"⟷",xi:"ξ",xlArr:"⟸",xlarr:"⟵",xmap:"⟼",xnis:"⋻",xodot:"⨀",xopf:"\uD835\uDD69",xoplus:"⨁",xotime:"⨂",xrArr:"⟹",xrarr:"⟶",xscr:"\uD835\uDCCD",xsqcup:"⨆",xuplus:"⨄",xutri:"△",xvee:"⋁",xwedge:"⋀",yacute:"\xfd",yacy:"я",ycirc:"ŷ",ycy:"ы",yen:"\xa5",yfr:"\uD835\uDD36",yicy:"ї",yopf:"\uD835\uDD6A",yscr:"\uD835\uDCCE",yucy:"ю",yuml:"\xff",zacute:"ź",zcaron:"ž",zcy:"з",zdot:"ż",zeetrf:"ℨ",zeta:"ζ",zfr:"\uD835\uDD37",zhcy:"ж",zigrarr:"⇝",zopf:"\uD835\uDD6B",zscr:"\uD835\uDCCF",zwj:"‍",zwnj:"‌"},tI={}.hasOwnProperty;function tP(e){return!!tI.call(tE,e)&&tE[e]}let tT={name:"characterReference",tokenize:function(e,t,n){let r,i;let o=this,a=0;return function(t){return e.enter("characterReference"),e.enter("characterReferenceMarker"),e.consume(t),e.exit("characterReferenceMarker"),l};function l(t){return 35===t?(e.enter("characterReferenceMarkerNumeric"),e.consume(t),e.exit("characterReferenceMarkerNumeric"),s):(e.enter("characterReferenceValue"),r=31,i=eZ,c(t))}function s(t){return 88===t||120===t?(e.enter("characterReferenceMarkerHexadecimal"),e.consume(t),e.exit("characterReferenceMarkerHexadecimal"),e.enter("characterReferenceValue"),r=6,i=eK,c):(e.enter("characterReferenceValue"),r=7,i=eW,c(t))}function c(l){if(59===l&&a){let r=e.exit("characterReferenceValue");return i!==eZ||tP(o.sliceSerialize(r))?(e.enter("characterReferenceMarker"),e.consume(l),e.exit("characterReferenceMarker"),e.exit("characterReference"),t):n(l)}return i(l)&&a++<r?(e.consume(l),c):n(l)}}},tL={name:"characterEscape",tokenize:function(e,t,n){return function(t){return e.enter("characterEscape"),e.enter("escapeMarker"),e.consume(t),e.exit("escapeMarker"),r};function r(r){return e$(r)?(e.enter("characterEscapeValue"),e.consume(r),e.exit("characterEscapeValue"),e.exit("characterEscape"),t):n(r)}}},tD={name:"lineEnding",tokenize:function(e,t){return function(n){return e.enter("lineEnding"),e.consume(n),e.exit("lineEnding"),e2(e,t,"linePrefix")}}};function tM(e,t,n){let r=[],i=-1;for(;++i<e.length;){let o=e[i].resolveAll;o&&!r.includes(o)&&(t=o(t,n),r.push(o))}return t}let tV={name:"labelEnd",resolveAll:function(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),"labelImage"===r.type||"labelLink"===r.type||"labelEnd"===r.type){let e="labelImage"===r.type?4:2;r.type="data",t+=e}}return e.length!==n.length&&ej(e,0,e.length,n),e},resolveTo:function(e,t){let n,r,i,o,a=e.length,l=0;for(;a--;)if(n=e[a][1],r){if("link"===n.type||"labelLink"===n.type&&n._inactive)break;"enter"===e[a][0]&&"labelLink"===n.type&&(n._inactive=!0)}else if(i){if("enter"===e[a][0]&&("labelImage"===n.type||"labelLink"===n.type)&&!n._balanced&&(r=a,"labelLink"!==n.type)){l=2;break}}else"labelEnd"===n.type&&(i=a);let s={type:"labelLink"===e[r][1].type?"link":"image",start:{...e[r][1].start},end:{...e[e.length-1][1].end}},c={type:"label",start:{...e[r][1].start},end:{...e[i][1].end}},u={type:"labelText",start:{...e[r+l+2][1].end},end:{...e[i-2][1].start}};return o=eH(o=[["enter",s,t],["enter",c,t]],e.slice(r+1,r+l+3)),o=eH(o,[["enter",u,t]]),o=eH(o,tM(t.parser.constructs.insideSpan.null,e.slice(r+l+4,i-3),t)),o=eH(o,[["exit",u,t],e[i-2],e[i-1],["exit",c,t]]),o=eH(o,e.slice(i+1)),o=eH(o,[["exit",s,t]]),ej(e,r,e.length,o),e},tokenize:function(e,t,n){let r,i;let o=this,a=o.events.length;for(;a--;)if(("labelImage"===o.events[a][1].type||"labelLink"===o.events[a][1].type)&&!o.events[a][1]._balanced){r=o.events[a][1];break}return function(t){return r?r._inactive?u(t):(i=o.parser.defined.includes(th(o.sliceSerialize({start:r.end,end:o.now()}))),e.enter("labelEnd"),e.enter("labelMarker"),e.consume(t),e.exit("labelMarker"),e.exit("labelEnd"),l):n(t)};function l(t){return 40===t?e.attempt(tN,c,i?c:u)(t):91===t?e.attempt(tR,c,i?s:u)(t):i?c(t):u(t)}function s(t){return e.attempt(tF,c,u)(t)}function c(e){return t(e)}function u(e){return r._balanced=!0,n(e)}}},tN={tokenize:function(e,t,n){return function(t){return e.enter("resource"),e.enter("resourceMarker"),e.consume(t),e.exit("resourceMarker"),r};function r(t){return eJ(t)?tm(e,i)(t):i(t)}function i(t){return 41===t?c(t):tp(e,o,a,"resourceDestination","resourceDestinationLiteral","resourceDestinationLiteralMarker","resourceDestinationRaw","resourceDestinationString",32)(t)}function o(t){return eJ(t)?tm(e,l)(t):c(t)}function a(e){return n(e)}function l(t){return 34===t||39===t||40===t?tf(e,s,n,"resourceTitle","resourceTitleMarker","resourceTitleString")(t):c(t)}function s(t){return eJ(t)?tm(e,c)(t):c(t)}function c(r){return 41===r?(e.enter("resourceMarker"),e.consume(r),e.exit("resourceMarker"),e.exit("resource"),t):n(r)}}},tR={tokenize:function(e,t,n){let r=this;return function(t){return td.call(r,e,i,o,"reference","referenceMarker","referenceString")(t)};function i(e){return r.parser.defined.includes(th(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}},tF={tokenize:function(e,t,n){return function(t){return e.enter("reference"),e.enter("referenceMarker"),e.consume(t),e.exit("referenceMarker"),r};function r(r){return 93===r?(e.enter("referenceMarker"),e.consume(r),e.exit("referenceMarker"),e.exit("reference"),t):n(r)}}},tj={name:"labelStartImage",resolveAll:tV.resolveAll,tokenize:function(e,t,n){let r=this;return function(t){return e.enter("labelImage"),e.enter("labelImageMarker"),e.consume(t),e.exit("labelImageMarker"),i};function i(t){return 91===t?(e.enter("labelMarker"),e.consume(t),e.exit("labelMarker"),e.exit("labelImage"),o):n(t)}function o(e){return 94===e&&"_hiddenFootnoteSupport"in r.parser.constructs?n(e):t(e)}}};function tH(e){return null===e||eJ(e)||e0(e)?1:eQ(e)?2:void 0}let tq={name:"attention",resolveAll:function(e,t){let n,r,i,o,a,l,s,c,u=-1;for(;++u<e.length;)if("enter"===e[u][0]&&"attentionSequence"===e[u][1].type&&e[u][1]._close){for(n=u;n--;)if("exit"===e[n][0]&&"attentionSequence"===e[n][1].type&&e[n][1]._open&&t.sliceSerialize(e[n][1]).charCodeAt(0)===t.sliceSerialize(e[u][1]).charCodeAt(0)){if((e[n][1]._close||e[u][1]._open)&&(e[u][1].end.offset-e[u][1].start.offset)%3&&!((e[n][1].end.offset-e[n][1].start.offset+e[u][1].end.offset-e[u][1].start.offset)%3))continue;l=e[n][1].end.offset-e[n][1].start.offset>1&&e[u][1].end.offset-e[u][1].start.offset>1?2:1;let p={...e[n][1].end},d={...e[u][1].start};tz(p,-l),tz(d,l),o={type:l>1?"strongSequence":"emphasisSequence",start:p,end:{...e[n][1].end}},a={type:l>1?"strongSequence":"emphasisSequence",start:{...e[u][1].start},end:d},i={type:l>1?"strongText":"emphasisText",start:{...e[n][1].end},end:{...e[u][1].start}},r={type:l>1?"strong":"emphasis",start:{...o.start},end:{...a.end}},e[n][1].end={...o.start},e[u][1].start={...a.end},s=[],e[n][1].end.offset-e[n][1].start.offset&&(s=eH(s,[["enter",e[n][1],t],["exit",e[n][1],t]])),s=eH(s,[["enter",r,t],["enter",o,t],["exit",o,t],["enter",i,t]]),s=eH(s,tM(t.parser.constructs.insideSpan.null,e.slice(n+1,u),t)),s=eH(s,[["exit",i,t],["enter",a,t],["exit",a,t],["exit",r,t]]),e[u][1].end.offset-e[u][1].start.offset?(c=2,s=eH(s,[["enter",e[u][1],t],["exit",e[u][1],t]])):c=0,ej(e,n-1,u-n+3,s),u=n+s.length-c-2;break}}for(u=-1;++u<e.length;)"attentionSequence"===e[u][1].type&&(e[u][1].type="data");return e},tokenize:function(e,t){let n;let r=this.parser.constructs.attentionMarkers.null,i=this.previous,o=tH(i);return function(a){return n=a,e.enter("attentionSequence"),function a(l){if(l===n)return e.consume(l),a;let s=e.exit("attentionSequence"),c=tH(l),u=!c||2===c&&o||r.includes(l),p=!o||2===o&&c||r.includes(i);return s._open=!!(42===n?u:u&&(o||!p)),s._close=!!(42===n?p:p&&(c||!u)),t(l)}(a)}}};function tz(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}let tO={name:"labelStartLink",resolveAll:tV.resolveAll,tokenize:function(e,t,n){let r=this;return function(t){return e.enter("labelLink"),e.enter("labelMarker"),e.consume(t),e.exit("labelMarker"),e.exit("labelLink"),i};function i(e){return 94===e&&"_hiddenFootnoteSupport"in r.parser.constructs?n(e):t(e)}}},tU={42:tl,43:tl,45:tl,48:tl,49:tl,50:tl,51:tl,52:tl,53:tl,54:tl,55:tl,56:tl,57:tl,62:tu},tB={91:{name:"definition",tokenize:function(e,t,n){let r;let i=this;return function(t){return e.enter("definition"),td.call(i,e,o,n,"definitionLabel","definitionLabelMarker","definitionLabelString")(t)};function o(t){return(r=th(i.sliceSerialize(i.events[i.events.length-1][1]).slice(1,-1)),58===t)?(e.enter("definitionMarker"),e.consume(t),e.exit("definitionMarker"),a):n(t)}function a(t){return eJ(t)?tm(e,l)(t):l(t)}function l(t){return tp(e,s,n,"definitionDestination","definitionDestinationLiteral","definitionDestinationLiteralMarker","definitionDestinationRaw","definitionDestinationString")(t)}function s(t){return e.attempt(tg,c,c)(t)}function c(t){return eX(t)?e2(e,u,"whitespace")(t):u(t)}function u(o){return null===o||eY(o)?(e.exit("definition"),i.parser.defined.push(r),t(o)):n(o)}}}},tZ={[-2]:ty,[-1]:ty,32:ty},tG={35:{name:"headingAtx",resolve:function(e,t){let n,r,i=e.length-2,o=3;return"whitespace"===e[3][1].type&&(o+=2),i-2>o&&"whitespace"===e[i][1].type&&(i-=2),"atxHeadingSequence"===e[i][1].type&&(o===i-1||i-4>o&&"whitespace"===e[i-2][1].type)&&(i-=o+1===i?2:4),i>o&&(n={type:"atxHeadingText",start:e[o][1].start,end:e[i][1].end},r={type:"chunkText",start:e[o][1].start,end:e[i][1].end,contentType:"text"},ej(e,o,i-o+1,[["enter",n,t],["enter",r,t],["exit",r,t],["exit",n,t]])),e},tokenize:function(e,t,n){let r=0;return function(i){return e.enter("atxHeading"),e.enter("atxHeadingSequence"),function i(o){return 35===o&&r++<6?(e.consume(o),i):null===o||eJ(o)?(e.exit("atxHeadingSequence"),function n(r){return 35===r?(e.enter("atxHeadingSequence"),function t(r){return 35===r?(e.consume(r),t):(e.exit("atxHeadingSequence"),n(r))}(r)):null===r||eY(r)?(e.exit("atxHeading"),t(r)):eX(r)?e2(e,n,"whitespace")(r):(e.enter("atxHeadingText"),function t(r){return null===r||35===r||eJ(r)?(e.exit("atxHeadingText"),n(r)):(e.consume(r),t)}(r))}(o)):n(o)}(i)}}},42:ta,45:[tx,ta],60:{concrete:!0,name:"htmlFlow",resolveTo:function(e){let t=e.length;for(;t--&&("enter"!==e[t][0]||"htmlFlow"!==e[t][1].type););return t>1&&"linePrefix"===e[t-2][1].type&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e},tokenize:function(e,t,n){let r,i,o,a,l;let s=this;return function(t){return e.enter("htmlFlow"),e.enter("htmlFlowData"),e.consume(t),c};function c(a){return 33===a?(e.consume(a),u):47===a?(e.consume(a),i=!0,f):63===a?(e.consume(a),r=3,s.interrupt?t:M):eB(a)?(e.consume(a),o=String.fromCharCode(a),m):n(a)}function u(i){return 45===i?(e.consume(i),r=2,p):91===i?(e.consume(i),r=5,a=0,d):eB(i)?(e.consume(i),r=4,s.interrupt?t:M):n(i)}function p(r){return 45===r?(e.consume(r),s.interrupt?t:M):n(r)}function d(r){let i="CDATA[";return r===i.charCodeAt(a++)?(e.consume(r),a===i.length)?s.interrupt?t:A:d:n(r)}function f(t){return eB(t)?(e.consume(t),o=String.fromCharCode(t),m):n(t)}function m(a){if(null===a||47===a||62===a||eJ(a)){let l=47===a,c=o.toLowerCase();return!l&&!i&&tk.includes(c)?(r=1,s.interrupt?t(a):A(a)):tv.includes(o.toLowerCase())?(r=6,l)?(e.consume(a),h):s.interrupt?t(a):A(a):(r=7,s.interrupt&&!s.parser.lazy[s.now().line]?n(a):i?function t(n){return eX(n)?(e.consume(n),t):w(n)}(a):g(a))}return 45===a||eZ(a)?(e.consume(a),o+=String.fromCharCode(a),m):n(a)}function h(r){return 62===r?(e.consume(r),s.interrupt?t:A):n(r)}function g(t){return 47===t?(e.consume(t),w):58===t||95===t||eB(t)?(e.consume(t),y):eX(t)?(e.consume(t),g):w(t)}function y(t){return 45===t||46===t||58===t||95===t||eZ(t)?(e.consume(t),y):b(t)}function b(t){return 61===t?(e.consume(t),x):eX(t)?(e.consume(t),b):g(t)}function x(t){return null===t||60===t||61===t||62===t||96===t?n(t):34===t||39===t?(e.consume(t),l=t,v):eX(t)?(e.consume(t),x):function t(n){return null===n||34===n||39===n||47===n||60===n||61===n||62===n||96===n||eJ(n)?b(n):(e.consume(n),t)}(t)}function v(t){return t===l?(e.consume(t),l=null,k):null===t||eY(t)?n(t):(e.consume(t),v)}function k(e){return 47===e||62===e||eX(e)?g(e):n(e)}function w(t){return 62===t?(e.consume(t),S):n(t)}function S(t){return null===t||eY(t)?A(t):eX(t)?(e.consume(t),S):n(t)}function A(t){return 45===t&&2===r?(e.consume(t),P):60===t&&1===r?(e.consume(t),T):62===t&&4===r?(e.consume(t),V):63===t&&3===r?(e.consume(t),M):93===t&&5===r?(e.consume(t),D):eY(t)&&(6===r||7===r)?(e.exit("htmlFlowData"),e.check(tw,N,C)(t)):null===t||eY(t)?(e.exit("htmlFlowData"),C(t)):(e.consume(t),A)}function C(t){return e.check(tS,E,N)(t)}function E(t){return e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),I}function I(t){return null===t||eY(t)?C(t):(e.enter("htmlFlowData"),A(t))}function P(t){return 45===t?(e.consume(t),M):A(t)}function T(t){return 47===t?(e.consume(t),o="",L):A(t)}function L(t){if(62===t){let n=o.toLowerCase();return tk.includes(n)?(e.consume(t),V):A(t)}return eB(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),L):A(t)}function D(t){return 93===t?(e.consume(t),M):A(t)}function M(t){return 62===t?(e.consume(t),V):45===t&&2===r?(e.consume(t),M):A(t)}function V(t){return null===t||eY(t)?(e.exit("htmlFlowData"),N(t)):(e.consume(t),V)}function N(n){return e.exit("htmlFlow"),t(n)}}},61:tx,95:ta,96:tC,126:tC},t_={38:tT,92:tL},tW={[-5]:tD,[-4]:tD,[-3]:tD,33:tj,38:tT,42:tq,60:[{name:"autolink",tokenize:function(e,t,n){let r=0;return function(t){return e.enter("autolink"),e.enter("autolinkMarker"),e.consume(t),e.exit("autolinkMarker"),e.enter("autolinkProtocol"),i};function i(t){return eB(t)?(e.consume(t),o):64===t?n(t):l(t)}function o(t){return 43===t||45===t||46===t||eZ(t)?(r=1,function t(n){return 58===n?(e.consume(n),r=0,a):(43===n||45===n||46===n||eZ(n))&&r++<32?(e.consume(n),t):(r=0,l(n))}(t)):l(t)}function a(r){return 62===r?(e.exit("autolinkProtocol"),e.enter("autolinkMarker"),e.consume(r),e.exit("autolinkMarker"),e.exit("autolink"),t):null===r||32===r||60===r||e_(r)?n(r):(e.consume(r),a)}function l(t){return 64===t?(e.consume(t),s):eG(t)?(e.consume(t),l):n(t)}function s(i){return eZ(i)?function i(o){return 46===o?(e.consume(o),r=0,s):62===o?(e.exit("autolinkProtocol").type="autolinkEmail",e.enter("autolinkMarker"),e.consume(o),e.exit("autolinkMarker"),e.exit("autolink"),t):function t(o){if((45===o||eZ(o))&&r++<63){let n=45===o?t:i;return e.consume(o),n}return n(o)}(o)}(i):n(i)}}},{name:"htmlText",tokenize:function(e,t,n){let r,i,o;let a=this;return function(t){return e.enter("htmlText"),e.enter("htmlTextData"),e.consume(t),l};function l(t){return 33===t?(e.consume(t),s):47===t?(e.consume(t),v):63===t?(e.consume(t),b):eB(t)?(e.consume(t),w):n(t)}function s(t){return 45===t?(e.consume(t),c):91===t?(e.consume(t),i=0,f):eB(t)?(e.consume(t),y):n(t)}function c(t){return 45===t?(e.consume(t),d):n(t)}function u(t){return null===t?n(t):45===t?(e.consume(t),p):eY(t)?(o=u,L(t)):(e.consume(t),u)}function p(t){return 45===t?(e.consume(t),d):u(t)}function d(e){return 62===e?T(e):45===e?p(e):u(e)}function f(t){let r="CDATA[";return t===r.charCodeAt(i++)?(e.consume(t),i===r.length?m:f):n(t)}function m(t){return null===t?n(t):93===t?(e.consume(t),h):eY(t)?(o=m,L(t)):(e.consume(t),m)}function h(t){return 93===t?(e.consume(t),g):m(t)}function g(t){return 62===t?T(t):93===t?(e.consume(t),g):m(t)}function y(t){return null===t||62===t?T(t):eY(t)?(o=y,L(t)):(e.consume(t),y)}function b(t){return null===t?n(t):63===t?(e.consume(t),x):eY(t)?(o=b,L(t)):(e.consume(t),b)}function x(e){return 62===e?T(e):b(e)}function v(t){return eB(t)?(e.consume(t),k):n(t)}function k(t){return 45===t||eZ(t)?(e.consume(t),k):function t(n){return eY(n)?(o=t,L(n)):eX(n)?(e.consume(n),t):T(n)}(t)}function w(t){return 45===t||eZ(t)?(e.consume(t),w):47===t||62===t||eJ(t)?S(t):n(t)}function S(t){return 47===t?(e.consume(t),T):58===t||95===t||eB(t)?(e.consume(t),A):eY(t)?(o=S,L(t)):eX(t)?(e.consume(t),S):T(t)}function A(t){return 45===t||46===t||58===t||95===t||eZ(t)?(e.consume(t),A):function t(n){return 61===n?(e.consume(n),C):eY(n)?(o=t,L(n)):eX(n)?(e.consume(n),t):S(n)}(t)}function C(t){return null===t||60===t||61===t||62===t||96===t?n(t):34===t||39===t?(e.consume(t),r=t,E):eY(t)?(o=C,L(t)):eX(t)?(e.consume(t),C):(e.consume(t),I)}function E(t){return t===r?(e.consume(t),r=void 0,P):null===t?n(t):eY(t)?(o=E,L(t)):(e.consume(t),E)}function I(t){return null===t||34===t||39===t||60===t||61===t||96===t?n(t):47===t||62===t||eJ(t)?S(t):(e.consume(t),I)}function P(e){return 47===e||62===e||eJ(e)?S(e):n(e)}function T(r){return 62===r?(e.consume(r),e.exit("htmlTextData"),e.exit("htmlText"),t):n(r)}function L(t){return e.exit("htmlTextData"),e.enter("lineEnding"),e.consume(t),e.exit("lineEnding"),D}function D(t){return eX(t)?e2(e,M,"linePrefix",a.parser.constructs.disable.null.includes("codeIndented")?void 0:4)(t):M(t)}function M(t){return e.enter("htmlTextData"),o(t)}}}],91:tO,92:[{name:"hardBreakEscape",tokenize:function(e,t,n){return function(t){return e.enter("hardBreakEscape"),e.consume(t),r};function r(r){return eY(r)?(e.exit("hardBreakEscape"),t(r)):n(r)}}},tL],93:tV,95:tq,96:{name:"codeText",previous:function(e){return 96!==e||"characterEscape"===this.events[this.events.length-1][1].type},resolve:function(e){let t,n,r=e.length-4,i=3;if(("lineEnding"===e[3][1].type||"space"===e[i][1].type)&&("lineEnding"===e[r][1].type||"space"===e[r][1].type)){for(t=i;++t<r;)if("codeTextData"===e[t][1].type){e[i][1].type="codeTextPadding",e[r][1].type="codeTextPadding",i+=2,r-=2;break}}for(t=i-1,r++;++t<=r;)void 0===n?t!==r&&"lineEnding"!==e[t][1].type&&(n=t):(t===r||"lineEnding"===e[t][1].type)&&(e[n][1].type="codeTextData",t!==n+2&&(e[n][1].end=e[t-1][1].end,e.splice(n+2,t-n-2),r-=t-n-2,t=n+2),n=void 0);return e},tokenize:function(e,t,n){let r,i,o=0;return function(t){return e.enter("codeText"),e.enter("codeTextSequence"),function t(n){return 96===n?(e.consume(n),o++,t):(e.exit("codeTextSequence"),a(n))}(t)};function a(s){return null===s?n(s):32===s?(e.enter("space"),e.consume(s),e.exit("space"),a):96===s?(i=e.enter("codeTextSequence"),r=0,function n(a){return 96===a?(e.consume(a),r++,n):r===o?(e.exit("codeTextSequence"),e.exit("codeText"),t(a)):(i.type="codeTextData",l(a))}(s)):eY(s)?(e.enter("lineEnding"),e.consume(s),e.exit("lineEnding"),a):(e.enter("codeTextData"),l(s))}function l(t){return null===t||32===t||96===t||eY(t)?(e.exit("codeTextData"),a(t)):(e.consume(t),l)}}}},tK={null:[tq,te]},t$={null:[42,95]},tY={null:[]},tJ=/[\0\t\n\r]/g;function tX(e,t){let n=Number.parseInt(e,t);return n<9||11===n||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(65535&n)==65535||(65535&n)==65534||n>1114111?"�":String.fromCodePoint(n)}let tQ=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function t0(e,t,n){if(t)return t;if(35===n.charCodeAt(0)){let e=n.charCodeAt(1),t=120===e||88===e;return tX(n.slice(t?2:1),t?16:10)}return tP(n)||e}let t1={}.hasOwnProperty;function t2(e){return{line:e.line,column:e.column,offset:e.offset}}function t8(e,t){if(e)throw Error("Cannot close `"+e.type+"` ("+eh({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+eh({start:t.start,end:t.end})+") is open");throw Error("Cannot close document, a token (`"+t.type+"`, "+eh({start:t.start,end:t.end})+") is still open")}function t6(e){let t=this;t.parser=function(n){var r,o;let a,l,s,c;return"string"!=typeof(r={...t.data("settings"),...e,extensions:t.data("micromarkExtensions")||[],mdastExtensions:t.data("fromMarkdownExtensions")||[]})&&(o=r,r=void 0),(function(e){let t={transforms:[],canContainEols:["emphasis","fragment","heading","paragraph","strong"],enter:{autolink:r(y),autolinkProtocol:c,autolinkEmail:c,atxHeading:r(m),blockQuote:r(function(){return{type:"blockquote",children:[]}}),characterEscape:c,characterReference:c,codeFenced:r(f),codeFencedFenceInfo:i,codeFencedFenceMeta:i,codeIndented:r(f,i),codeText:r(function(){return{type:"inlineCode",value:""}},i),codeTextData:c,data:c,codeFlowValue:c,definition:r(function(){return{type:"definition",identifier:"",label:null,title:null,url:""}}),definitionDestinationString:i,definitionLabelString:i,definitionTitleString:i,emphasis:r(function(){return{type:"emphasis",children:[]}}),hardBreakEscape:r(h),hardBreakTrailing:r(h),htmlFlow:r(g,i),htmlFlowData:c,htmlText:r(g,i),htmlTextData:c,image:r(function(){return{type:"image",title:null,url:"",alt:null}}),label:i,link:r(y),listItem:r(function(e){return{type:"listItem",spread:e._spread,checked:null,children:[]}}),listItemValue:function(e){this.data.expectingFirstListItemValue&&(this.stack[this.stack.length-2].start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0)},listOrdered:r(b,function(){this.data.expectingFirstListItemValue=!0}),listUnordered:r(b),paragraph:r(function(){return{type:"paragraph",children:[]}}),reference:function(){this.data.referenceType="collapsed"},referenceString:i,resourceDestinationString:i,resourceTitleString:i,setextHeading:r(m),strong:r(function(){return{type:"strong",children:[]}}),thematicBreak:r(function(){return{type:"thematicBreak"}})},exit:{atxHeading:a(),atxHeadingSequence:function(e){let t=this.stack[this.stack.length-1];if(!t.depth){let n=this.sliceSerialize(e).length;t.depth=n}},autolink:a(),autolinkEmail:function(e){u.call(this,e),this.stack[this.stack.length-1].url="mailto:"+this.sliceSerialize(e)},autolinkProtocol:function(e){u.call(this,e),this.stack[this.stack.length-1].url=this.sliceSerialize(e)},blockQuote:a(),characterEscapeValue:u,characterReferenceMarkerHexadecimal:d,characterReferenceMarkerNumeric:d,characterReferenceValue:function(e){let t;let n=this.sliceSerialize(e),r=this.data.characterReferenceType;r?(t=tX(n,"characterReferenceMarkerNumeric"===r?10:16),this.data.characterReferenceType=void 0):t=tP(n);let i=this.stack[this.stack.length-1];i.value+=t},characterReference:function(e){this.stack.pop().position.end=t2(e.end)},codeFenced:a(function(){let e=this.resume();this.stack[this.stack.length-1].value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,""),this.data.flowCodeInside=void 0}),codeFencedFence:function(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)},codeFencedFenceInfo:function(){let e=this.resume();this.stack[this.stack.length-1].lang=e},codeFencedFenceMeta:function(){let e=this.resume();this.stack[this.stack.length-1].meta=e},codeFlowValue:u,codeIndented:a(function(){let e=this.resume();this.stack[this.stack.length-1].value=e.replace(/(\r?\n|\r)$/g,"")}),codeText:a(function(){let e=this.resume();this.stack[this.stack.length-1].value=e}),codeTextData:u,data:u,definition:a(),definitionDestinationString:function(){let e=this.resume();this.stack[this.stack.length-1].url=e},definitionLabelString:function(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=th(this.sliceSerialize(e)).toLowerCase()},definitionTitleString:function(){let e=this.resume();this.stack[this.stack.length-1].title=e},emphasis:a(),hardBreakEscape:a(p),hardBreakTrailing:a(p),htmlFlow:a(function(){let e=this.resume();this.stack[this.stack.length-1].value=e}),htmlFlowData:u,htmlText:a(function(){let e=this.resume();this.stack[this.stack.length-1].value=e}),htmlTextData:u,image:a(function(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||"shortcut";e.type+="Reference",e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}),label:function(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];if(this.data.inReference=!0,"link"===n.type){let t=e.children;n.children=t}else n.alt=t},labelText:function(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=t.replace(tQ,t0),n.identifier=th(t).toLowerCase()},lineEnding:function(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){n.children[n.children.length-1].position.end=t2(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(c.call(this,e),u.call(this,e))},link:a(function(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||"shortcut";e.type+="Reference",e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}),listItem:a(),listOrdered:a(),listUnordered:a(),paragraph:a(),referenceString:function(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=th(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType="full"},resourceDestinationString:function(){let e=this.resume();this.stack[this.stack.length-1].url=e},resourceTitleString:function(){let e=this.resume();this.stack[this.stack.length-1].title=e},resource:function(){this.data.inReference=void 0},setextHeading:a(function(){this.data.setextHeadingSlurpLineEnding=void 0}),setextHeadingLineSequence:function(e){this.stack[this.stack.length-1].depth=61===this.sliceSerialize(e).codePointAt(0)?1:2},setextHeadingText:function(){this.data.setextHeadingSlurpLineEnding=!0},strong:a(),thematicBreak:a()}};(function e(t,n){let r=-1;for(;++r<n.length;){let i=n[r];Array.isArray(i)?e(t,i):function(e,t){let n;for(n in t)if(t1.call(t,n))switch(n){case"canContainEols":{let r=t[n];r&&e[n].push(...r);break}case"transforms":{let r=t[n];r&&e[n].push(...r);break}case"enter":case"exit":{let r=t[n];r&&Object.assign(e[n],r)}}}(t,i)}})(t,(e||{}).mdastExtensions||[]);let n={};return function(e){let r={type:"root",children:[]},a={stack:[r],tokenStack:[],config:t,enter:o,exit:l,buffer:i,resume:s,data:n},c=[],u=-1;for(;++u<e.length;)("listOrdered"===e[u][1].type||"listUnordered"===e[u][1].type)&&("enter"===e[u][0]?c.push(u):u=function(e,t,n){let r,i,o,a,l=t-1,s=-1,c=!1;for(;++l<=n;){let t=e[l];switch(t[1].type){case"listUnordered":case"listOrdered":case"blockQuote":"enter"===t[0]?s++:s--,a=void 0;break;case"lineEndingBlank":"enter"===t[0]&&(!r||a||s||o||(o=l),a=void 0);break;case"linePrefix":case"listItemValue":case"listItemMarker":case"listItemPrefix":case"listItemPrefixWhitespace":break;default:a=void 0}if(!s&&"enter"===t[0]&&"listItemPrefix"===t[1].type||-1===s&&"exit"===t[0]&&("listUnordered"===t[1].type||"listOrdered"===t[1].type)){if(r){let a=l;for(i=void 0;a--;){let t=e[a];if("lineEnding"===t[1].type||"lineEndingBlank"===t[1].type){if("exit"===t[0])continue;i&&(e[i][1].type="lineEndingBlank",c=!0),t[1].type="lineEnding",i=a}else if("linePrefix"===t[1].type||"blockQuotePrefix"===t[1].type||"blockQuotePrefixWhitespace"===t[1].type||"blockQuoteMarker"===t[1].type||"listItemIndent"===t[1].type);else break}o&&(!i||o<i)&&(r._spread=!0),r.end=Object.assign({},i?e[i][1].start:t[1].end),e.splice(i||l,0,["exit",r,t[2]]),l++,n++}if("listItemPrefix"===t[1].type){let i={type:"listItem",_spread:!1,start:Object.assign({},t[1].start),end:void 0};r=i,e.splice(l,0,["enter",i,t[2]]),l++,n++,o=void 0,a=!0}}}return e[t][1]._spread=c,n}(e,c.pop(),u));for(u=-1;++u<e.length;){let n=t[e[u][0]];t1.call(n,e[u][1].type)&&n[e[u][1].type].call(Object.assign({sliceSerialize:e[u][2].sliceSerialize},a),e[u][1])}if(a.tokenStack.length>0){let e=a.tokenStack[a.tokenStack.length-1];(e[1]||t8).call(a,void 0,e[0])}for(r.position={start:t2(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:t2(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},u=-1;++u<t.transforms.length;)r=t.transforms[u](r)||r;return r};function r(e,t){return function(n){o.call(this,e(n),n),t&&t.call(this,n)}}function i(){this.stack.push({type:"fragment",children:[]})}function o(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:t2(t.start),end:void 0}}function a(e){return function(t){e&&e.call(this,t),l.call(this,t)}}function l(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(r)r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||t8).call(this,e,r[0]));else throw Error("Cannot close `"+e.type+"` ("+eh({start:e.start,end:e.end})+"): it’s not open");n.position.end=t2(e.end)}function s(){return eR(this.stack.pop(),"boolean"!=typeof eN.includeImageAlt||eN.includeImageAlt,"boolean"!=typeof eN.includeHtml||eN.includeHtml)}function c(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];n&&"text"===n.type||((n={type:"text",value:""}).position={start:t2(e.start),end:void 0},t.push(n)),this.stack.push(n)}function u(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=t2(e.end)}function p(){this.data.atHardBreak=!0}function d(e){this.data.characterReferenceType=e.type}function f(){return{type:"code",lang:null,meta:null,value:""}}function m(){return{type:"heading",depth:0,children:[]}}function h(){return{type:"break"}}function g(){return{type:"html",value:""}}function y(){return{type:"link",title:null,url:"",children:[]}}function b(e){return{type:"list",ordered:"listOrdered"===e.type,start:null,spread:e._spread,children:[]}}})(o)(function(e){for(;!eO(e););return e}((function(e){let t={constructs:function(e){let t={},n=-1;for(;++n<e.length;)(function(e,t){let n;for(n in t){let r;let i=(eU.call(e,n)?e[n]:void 0)||(e[n]={}),o=t[n];if(o)for(r in o){eU.call(i,r)||(i[r]=[]);let e=o[r];(function(e,t){let n=-1,r=[];for(;++n<t.length;)("after"===t[n].add?e:r).push(t[n]);ej(e,0,0,r)})(i[r],Array.isArray(e)?e:e?[e]:[])}}})(t,e[n]);return t}([i,...(e||{}).extensions||[]]),content:n(e8),defined:[],document:n(e6),flow:n(e9),lazy:{},string:n(tt),text:n(tn)};return t;function n(e){return function(n){return function(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},o=[],a=[],l=[],s={attempt:m(function(e,t){h(e,t.from)}),check:m(f),consume:function(e){eY(e)?(r.line++,r.column=1,r.offset+=-3===e?2:1,g()):-1!==e&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===a[r._index].length&&(r._bufferIndex=-1,r._index++)),c.previous=e},enter:function(e,t){let n=t||{};return n.type=e,n.start=d(),c.events.push(["enter",n,c]),l.push(n),n},exit:function(e){let t=l.pop();return t.end=d(),c.events.push(["exit",t,c]),t},interrupt:m(f,{interrupt:!0})},c={code:null,containerState:{},defineSkip:function(e){i[e.line]=e.column,g()},events:[],now:d,parser:e,previous:null,sliceSerialize:function(e,t){return function(e,t){let n,r=-1,i=[];for(;++r<e.length;){let o;let a=e[r];if("string"==typeof a)o=a;else switch(a){case -5:o="\r";break;case -4:o="\n";break;case -3:o="\r\n";break;case -2:o=t?" ":"	";break;case -1:if(!t&&n)continue;o=" ";break;default:o=String.fromCharCode(a)}n=-2===a,i.push(o)}return i.join("")}(p(e),t)},sliceStream:p,write:function(e){return(a=eH(a,e),function(){let e;for(;r._index<a.length;){let n=a[r._index];if("string"==typeof n)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<n.length;){var t;t=n.charCodeAt(r._bufferIndex),u=u(t)}else u=u(n)}}(),null!==a[a.length-1])?[]:(h(t,0),c.events=tM(o,c.events,c),c.events)}},u=t.tokenize.call(c,s);return t.resolveAll&&o.push(t),c;function p(e){return function(e,t){let n;let r=t.start._index,i=t.start._bufferIndex,o=t.end._index,a=t.end._bufferIndex;if(r===o)n=[e[r].slice(i,a)];else{if(n=e.slice(r,o),i>-1){let e=n[0];"string"==typeof e?n[0]=e.slice(i):n.shift()}a>0&&n.push(e[o].slice(0,a))}return n}(a,e)}function d(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:o}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:o}}function f(e,t){t.restore()}function m(e,t){return function(n,i,o){let a,u,p,f;return Array.isArray(n)?m(n):"tokenize"in n?m([n]):function(e){let t=null!==e&&n[e],r=null!==e&&n.null;return m([...Array.isArray(t)?t:t?[t]:[],...Array.isArray(r)?r:r?[r]:[]])(e)};function m(e){return(a=e,u=0,0===e.length)?o:h(e[u])}function h(e){return function(n){return(f=function(){let e=d(),t=c.previous,n=c.currentConstruct,i=c.events.length,o=Array.from(l);return{from:i,restore:function(){r=e,c.previous=t,c.currentConstruct=n,c.events.length=i,l=o,g()}}}(),p=e,e.partial||(c.currentConstruct=e),e.name&&c.parser.constructs.disable.null.includes(e.name))?b(n):e.tokenize.call(t?Object.assign(Object.create(c),t):c,s,y,b)(n)}}function y(t){return e(p,f),i}function b(e){return(f.restore(),++u<a.length)?h(a[u]):o}}}function h(e,t){e.resolveAll&&!o.includes(e)&&o.push(e),e.resolve&&ej(c.events,t,c.events.length-t,e.resolve(c.events.slice(t),c)),e.resolveTo&&(c.events=e.resolveTo(c.events,c))}function g(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}(t,e,n)}}})(o).document().write((l=1,s="",c=!0,function(e,t,n){let r,i,o,u,p;let d=[];for(e=s+("string"==typeof e?e.toString():new TextDecoder(t||void 0).decode(e)),o=0,s="",c&&(65279===e.charCodeAt(0)&&o++,c=void 0);o<e.length;){if(tJ.lastIndex=o,u=(r=tJ.exec(e))&&void 0!==r.index?r.index:e.length,p=e.charCodeAt(u),!r){s=e.slice(o);break}if(10===p&&o===u&&a)d.push(-3),a=void 0;else switch(a&&(d.push(-5),a=void 0),o<u&&(d.push(e.slice(o,u)),l+=u-o),p){case 0:d.push(65533),l++;break;case 9:for(i=4*Math.ceil(l/4),d.push(-2);l++<i;)d.push(-1);break;case 10:d.push(-4),l=1;break;default:a=!0,l=1}o=u+1}return n&&(a&&d.push(-5),s&&d.push(s),d.push(null)),d})(n,r,!0))))}}let t4="object"==typeof self?self:globalThis,t3=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[o,a]=t[i];switch(o){case 0:case -1:return n(a,i);case 1:{let e=n([],i);for(let t of a)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of a)e[r(t)]=r(n);return e}case 3:return n(new Date(a),i);case 4:{let{source:e,flags:t}=a;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of a)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of a)e.add(r(t));return e}case 7:{let{name:e,message:t}=a;return n(new t4[e](t),i)}case 8:return n(BigInt(a),i);case"BigInt":return n(Object(BigInt(a)),i);case"ArrayBuffer":return n(new Uint8Array(a).buffer,a);case"DataView":{let{buffer:e}=new Uint8Array(a);return n(new DataView(e),a)}}return n(new t4[o](a),i)};return r},t5=e=>t3(new Map,e)(0),{toString:t7}={},{keys:t9}=Object,ne=e=>{let t=typeof e;if("object"!==t||!e)return[0,t];let n=t7.call(e).slice(8,-1);switch(n){case"Array":return[1,""];case"Object":return[2,""];case"Date":return[3,""];case"RegExp":return[4,""];case"Map":return[5,""];case"Set":return[6,""];case"DataView":return[1,n]}return n.includes("Array")?[1,n]:n.includes("Error")?[7,n]:[2,n]},nt=([e,t])=>0===e&&("function"===t||"symbol"===t),nn=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},o=r=>{if(n.has(r))return n.get(r);let[a,l]=ne(r);switch(a){case 0:{let t=r;switch(l){case"bigint":a=8,t=r.toString();break;case"function":case"symbol":if(e)throw TypeError("unable to serialize "+l);t=null;break;case"undefined":return i([-1],r)}return i([a,t],r)}case 1:{if(l){let e=r;return"DataView"===l?e=new Uint8Array(r.buffer):"ArrayBuffer"===l&&(e=new Uint8Array(r)),i([l,[...e]],r)}let e=[],t=i([a,e],r);for(let t of r)e.push(o(t));return t}case 2:{if(l)switch(l){case"BigInt":return i([l,r.toString()],r);case"Boolean":case"Number":case"String":return i([l,r.valueOf()],r)}if(t&&"toJSON"in r)return o(r.toJSON());let n=[],s=i([a,n],r);for(let t of t9(r))(e||!nt(ne(r[t])))&&n.push([o(t),o(r[t])]);return s}case 3:return i([a,r.toISOString()],r);case 4:{let{source:e,flags:t}=r;return i([a,{source:e,flags:t}],r)}case 5:{let t=[],n=i([a,t],r);for(let[n,i]of r)(e||!(nt(ne(n))||nt(ne(i))))&&t.push([o(n),o(i)]);return n}case 6:{let t=[],n=i([a,t],r);for(let n of r)(e||!nt(ne(n)))&&t.push(o(n));return n}}let{message:s}=r;return i([a,{name:l,message:s}],r)};return o},nr=(e,{json:t,lossy:n}={})=>{let r=[];return nn(!(t||n),!!t,new Map,r)(e),r},ni="function"==typeof structuredClone?(e,t)=>t&&("json"in t||"lossy"in t)?t5(nr(e,t)):structuredClone(e):(e,t)=>t5(nr(e,t));function no(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let o=e.charCodeAt(n),a="";if(37===o&&eZ(e.charCodeAt(n+1))&&eZ(e.charCodeAt(n+2)))i=2;else if(o<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(o))||(a=String.fromCharCode(o));else if(o>55295&&o<57344){let t=e.charCodeAt(n+1);o<56320&&t>56319&&t<57344?(a=String.fromCharCode(o,t),i=1):a="�"}else a=String.fromCharCode(o);a&&(t.push(e.slice(r,n),encodeURIComponent(a)),r=n+i+1,a=""),i&&(n+=i,i=0)}return t.join("")+e.slice(r)}function na(e,t){let n=[{type:"text",value:"↩"}];return t>1&&n.push({type:"element",tagName:"sup",properties:{},children:[{type:"text",value:String(t)}]}),n}function nl(e,t){return"Back to reference "+(e+1)+(t>1?"-"+t:"")}let ns=function(e){if(null==e)return nu;if("function"==typeof e)return nc(e);if("object"==typeof e)return Array.isArray(e)?function(e){let t=[],n=-1;for(;++n<e.length;)t[n]=ns(e[n]);return nc(function(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1})}(e):nc(function(t){let n;for(n in e)if(t[n]!==e[n])return!1;return!0});if("string"==typeof e)return nc(function(t){return t&&t.type===e});throw Error("Expected function, string, or object as test")};function nc(e){return function(t,n,r){var i;return!!(null!==(i=t)&&"object"==typeof i&&"type"in i&&e.call(this,t,"number"==typeof n?n:void 0,r||void 0))}}function nu(){return!0}let np=[];function nd(e,t,n,r){let i,o,a;"function"==typeof t&&"function"!=typeof n?(o=void 0,a=t,i=n):(o=t,a=n,i=r),function(e,t,n,r){let i;"function"==typeof t&&"function"!=typeof n?(r=n,n=t):i=t;let o=ns(i),a=r?-1:1;(function e(i,l,s){let c=i&&"object"==typeof i?i:{};if("string"==typeof c.type){let e="string"==typeof c.tagName?c.tagName:"string"==typeof c.name?c.name:void 0;Object.defineProperty(u,"name",{value:"node (\x1b[33m"+i.type+(e?"<"+e+">":"")+"\x1b[39m)"})}return u;function u(){var c;let u,p,d,f=np;if((!t||o(i,l,s[s.length-1]||void 0))&&!1===(f=Array.isArray(c=n(i,s))?c:"number"==typeof c?[!0,c]:null==c?np:[c])[0])return f;if("children"in i&&i.children&&i.children&&"skip"!==f[0])for(p=(r?i.children.length:-1)+a,d=s.concat(i);p>-1&&p<i.children.length;){if(!1===(u=e(i.children[p],p,d)())[0])return u;p="number"==typeof u[1]?u[1]:p+a}return f}})(e,void 0,[])()}(e,o,function(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return a(e,r,n)},i)}function nf(e,t){let n=t.referenceType,r="]";if("collapsed"===n?r+="[]":"full"===n&&(r+="["+(t.label||t.identifier)+"]"),"imageReference"===t.type)return[{type:"text",value:"!["+t.alt+r}];let i=e.all(t),o=i[0];o&&"text"===o.type?o.value="["+o.value:i.unshift({type:"text",value:"["});let a=i[i.length-1];return a&&"text"===a.type?a.value+=r:i.push({type:"text",value:r}),i}function nm(e){let t=e.spread;return null==t?e.children.length>1:t}function nh(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;9===t||32===t;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;9===t||32===t;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):""}let ng={blockquote:function(e,t){let n={type:"element",tagName:"blockquote",properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)},break:function(e,t){let n={type:"element",tagName:"br",properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:"text",value:"\n"}]},code:function(e,t){let n=t.value?t.value+"\n":"",r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=["language-"+i[0]]);let o={type:"element",tagName:"code",properties:r,children:[{type:"text",value:n}]};return t.meta&&(o.data={meta:t.meta}),e.patch(t,o),o={type:"element",tagName:"pre",properties:{},children:[o=e.applyData(t,o)]},e.patch(t,o),o},delete:function(e,t){let n={type:"element",tagName:"del",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)},emphasis:function(e,t){let n={type:"element",tagName:"em",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)},footnoteReference:function(e,t){let n;let r="string"==typeof e.options.clobberPrefix?e.options.clobberPrefix:"user-content-",i=String(t.identifier).toUpperCase(),o=no(i.toLowerCase()),a=e.footnoteOrder.indexOf(i),l=e.footnoteCounts.get(i);void 0===l?(l=0,e.footnoteOrder.push(i),n=e.footnoteOrder.length):n=a+1,l+=1,e.footnoteCounts.set(i,l);let s={type:"element",tagName:"a",properties:{href:"#"+r+"fn-"+o,id:r+"fnref-"+o+(l>1?"-"+l:""),dataFootnoteRef:!0,ariaDescribedBy:["footnote-label"]},children:[{type:"text",value:String(n)}]};e.patch(t,s);let c={type:"element",tagName:"sup",properties:{},children:[s]};return e.patch(t,c),e.applyData(t,c)},heading:function(e,t){let n={type:"element",tagName:"h"+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)},html:function(e,t){if(e.options.allowDangerousHtml){let n={type:"raw",value:t.value};return e.patch(t,n),e.applyData(t,n)}},imageReference:function(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return nf(e,t);let i={src:no(r.url||""),alt:t.alt};null!==r.title&&void 0!==r.title&&(i.title=r.title);let o={type:"element",tagName:"img",properties:i,children:[]};return e.patch(t,o),e.applyData(t,o)},image:function(e,t){let n={src:no(t.url)};null!==t.alt&&void 0!==t.alt&&(n.alt=t.alt),null!==t.title&&void 0!==t.title&&(n.title=t.title);let r={type:"element",tagName:"img",properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)},inlineCode:function(e,t){let n={type:"text",value:t.value.replace(/\r?\n|\r/g," ")};e.patch(t,n);let r={type:"element",tagName:"code",properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)},linkReference:function(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return nf(e,t);let i={href:no(r.url||"")};null!==r.title&&void 0!==r.title&&(i.title=r.title);let o={type:"element",tagName:"a",properties:i,children:e.all(t)};return e.patch(t,o),e.applyData(t,o)},link:function(e,t){let n={href:no(t.url)};null!==t.title&&void 0!==t.title&&(n.title=t.title);let r={type:"element",tagName:"a",properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)},listItem:function(e,t,n){let r=e.all(t),i=n?function(e){let t=!1;if("list"===e.type){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=nm(n[r])}return t}(n):nm(t),o={},a=[];if("boolean"==typeof t.checked){let e;let n=r[0];n&&"element"===n.type&&"p"===n.tagName?e=n:(e={type:"element",tagName:"p",properties:{},children:[]},r.unshift(e)),e.children.length>0&&e.children.unshift({type:"text",value:" "}),e.children.unshift({type:"element",tagName:"input",properties:{type:"checkbox",checked:t.checked,disabled:!0},children:[]}),o.className=["task-list-item"]}let l=-1;for(;++l<r.length;){let e=r[l];(i||0!==l||"element"!==e.type||"p"!==e.tagName)&&a.push({type:"text",value:"\n"}),"element"!==e.type||"p"!==e.tagName||i?a.push(e):a.push(...e.children)}let s=r[r.length-1];s&&(i||"element"!==s.type||"p"!==s.tagName)&&a.push({type:"text",value:"\n"});let c={type:"element",tagName:"li",properties:o,children:a};return e.patch(t,c),e.applyData(t,c)},list:function(e,t){let n={},r=e.all(t),i=-1;for("number"==typeof t.start&&1!==t.start&&(n.start=t.start);++i<r.length;){let e=r[i];if("element"===e.type&&"li"===e.tagName&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes("task-list-item")){n.className=["contains-task-list"];break}}let o={type:"element",tagName:t.ordered?"ol":"ul",properties:n,children:e.wrap(r,!0)};return e.patch(t,o),e.applyData(t,o)},paragraph:function(e,t){let n={type:"element",tagName:"p",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)},root:function(e,t){let n={type:"root",children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)},strong:function(e,t){let n={type:"element",tagName:"strong",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)},table:function(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:"element",tagName:"thead",properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:"element",tagName:"tbody",properties:{},children:e.wrap(n,!0)},o=ef(t.children[1]),a=ed(t.children[t.children.length-1]);o&&a&&(r.position={start:o,end:a}),i.push(r)}let o={type:"element",tagName:"table",properties:{},children:e.wrap(i,!0)};return e.patch(t,o),e.applyData(t,o)},tableCell:function(e,t){let n={type:"element",tagName:"td",properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)},tableRow:function(e,t,n){let r=n?n.children:void 0,i=0===(r?r.indexOf(t):1)?"th":"td",o=n&&"table"===n.type?n.align:void 0,a=o?o.length:t.children.length,l=-1,s=[];for(;++l<a;){let n=t.children[l],r={},a=o?o[l]:void 0;a&&(r.align=a);let c={type:"element",tagName:i,properties:r,children:[]};n&&(c.children=e.all(n),e.patch(n,c),c=e.applyData(n,c)),s.push(c)}let c={type:"element",tagName:"tr",properties:{},children:e.wrap(s,!0)};return e.patch(t,c),e.applyData(t,c)},text:function(e,t){let n={type:"text",value:function(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,o=[];for(;r;)o.push(nh(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return o.push(nh(t.slice(i),i>0,!1)),o.join("")}(String(t.value))};return e.patch(t,n),e.applyData(t,n)},thematicBreak:function(e,t){let n={type:"element",tagName:"hr",properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)},toml:ny,yaml:ny,definition:ny,footnoteDefinition:ny};function ny(){}let nb={}.hasOwnProperty,nx={};function nv(e,t){e.position&&(t.position=function(e){let t=ef(e),n=ed(e);if(t&&n)return{start:t,end:n}}(e))}function nk(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;"string"==typeof t&&("element"===n.type?n.tagName=t:n={type:"element",tagName:t,properties:{},children:"children"in n?n.children:[n]}),"element"===n.type&&i&&Object.assign(n.properties,ni(i)),"children"in n&&n.children&&null!=r&&(n.children=r)}return n}function nw(e,t){let n=[],r=-1;for(t&&n.push({type:"text",value:"\n"});++r<e.length;)r&&n.push({type:"text",value:"\n"}),n.push(e[r]);return t&&e.length>0&&n.push({type:"text",value:"\n"}),n}function nS(e){let t=0,n=e.charCodeAt(t);for(;9===n||32===n;)t++,n=e.charCodeAt(t);return e.slice(t)}function nA(e,t){let n=function(e,t){let n=t||nx,r=new Map,i=new Map,o={all:function(e){let t=[];if("children"in e){let n=e.children,r=-1;for(;++r<n.length;){let i=o.one(n[r],e);if(i){if(r&&"break"===n[r-1].type&&(Array.isArray(i)||"text"!==i.type||(i.value=nS(i.value)),!Array.isArray(i)&&"element"===i.type)){let e=i.children[0];e&&"text"===e.type&&(e.value=nS(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t},applyData:nk,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...ng,...n.handlers},one:function(e,t){let n=e.type,r=o.handlers[n];if(nb.call(o.handlers,n)&&r)return r(o,e,t);if(o.options.passThrough&&o.options.passThrough.includes(n)){if("children"in e){let{children:t,...n}=e,r=ni(n);return r.children=o.all(e),r}return ni(e)}return(o.options.unknownHandler||function(e,t){let n=t.data||{},r="value"in t&&!(nb.call(n,"hProperties")||nb.call(n,"hChildren"))?{type:"text",value:t.value}:{type:"element",tagName:"div",properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)})(o,e,t)},options:n,patch:nv,wrap:nw};return nd(e,function(e){if("definition"===e.type||"footnoteDefinition"===e.type){let t="definition"===e.type?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),o}(e,t),r=n.one(e,void 0),i=function(e){let t="string"==typeof e.options.clobberPrefix?e.options.clobberPrefix:"user-content-",n=e.options.footnoteBackContent||na,r=e.options.footnoteBackLabel||nl,i=e.options.footnoteLabel||"Footnotes",o=e.options.footnoteLabelTagName||"h2",a=e.options.footnoteLabelProperties||{className:["sr-only"]},l=[],s=-1;for(;++s<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[s]);if(!i)continue;let o=e.all(i),a=String(i.identifier).toUpperCase(),c=no(a.toLowerCase()),u=0,p=[],d=e.footnoteCounts.get(a);for(;void 0!==d&&++u<=d;){p.length>0&&p.push({type:"text",value:" "});let e="string"==typeof n?n:n(s,u);"string"==typeof e&&(e={type:"text",value:e}),p.push({type:"element",tagName:"a",properties:{href:"#"+t+"fnref-"+c+(u>1?"-"+u:""),dataFootnoteBackref:"",ariaLabel:"string"==typeof r?r:r(s,u),className:["data-footnote-backref"]},children:Array.isArray(e)?e:[e]})}let f=o[o.length-1];if(f&&"element"===f.type&&"p"===f.tagName){let e=f.children[f.children.length-1];e&&"text"===e.type?e.value+=" ":f.children.push({type:"text",value:" "}),f.children.push(...p)}else o.push(...p);let m={type:"element",tagName:"li",properties:{id:t+"fn-"+c},children:e.wrap(o,!0)};e.patch(i,m),l.push(m)}if(0!==l.length)return{type:"element",tagName:"section",properties:{dataFootnotes:!0,className:["footnotes"]},children:[{type:"element",tagName:o,properties:{...ni(a),id:"footnote-label"},children:[{type:"text",value:i}]},{type:"text",value:"\n"},{type:"element",tagName:"ol",properties:{},children:e.wrap(l,!0)},{type:"text",value:"\n"}]}}(n),o=Array.isArray(r)?{type:"root",children:r}:r||{type:"root",children:[]};return i&&o.children.push({type:"text",value:"\n"},i),o}function nC(e,t){return e&&"run"in e?async function(n,r){let i=nA(n,{file:r,...t});await e.run(i,r)}:function(n,r){return nA(n,{file:r,...e||t})}}function nE(e){if(e)throw e}var nI=n(71771);function nP(e){if("object"!=typeof e||null===e)return!1;let t=Object.getPrototypeOf(e);return(null===t||t===Object.prototype||null===Object.getPrototypeOf(t))&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}var nT=n(49411),nL=n(97742);function nD(e){return!!(null!==e&&"object"==typeof e&&"href"in e&&e.href&&"protocol"in e&&e.protocol&&void 0===e.auth)}var nM=n(41041);let nV=["history","path","basename","stem","extname","dirname"];class nN{constructor(e){let t,n;t=e?nD(e)?{path:e}:"string"==typeof e||function(e){return!!(e&&"object"==typeof e&&"byteLength"in e&&"byteOffset"in e)}(e)?{value:e}:e:{},this.cwd="cwd"in t?"":nL.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let r=-1;for(;++r<nV.length;){let e=nV[r];e in t&&void 0!==t[e]&&null!==t[e]&&(this[e]="history"===e?[...t[e]]:t[e])}for(n in t)nV.includes(n)||(this[n]=t[n])}get basename(){return"string"==typeof this.path?nT.basename(this.path):void 0}set basename(e){nF(e,"basename"),nR(e,"basename"),this.path=nT.join(this.dirname||"",e)}get dirname(){return"string"==typeof this.path?nT.dirname(this.path):void 0}set dirname(e){nj(this.basename,"dirname"),this.path=nT.join(e||"",this.basename)}get extname(){return"string"==typeof this.path?nT.extname(this.path):void 0}set extname(e){if(nR(e,"extname"),nj(this.dirname,"extname"),e){if(46!==e.codePointAt(0))throw Error("`extname` must start with `.`");if(e.includes(".",1))throw Error("`extname` cannot contain multiple dots")}this.path=nT.join(this.dirname,this.stem+(e||""))}get path(){return this.history[this.history.length-1]}set path(e){nD(e)&&(e=(0,nM.fileURLToPath)(e)),nF(e,"path"),this.path!==e&&this.history.push(e)}get stem(){return"string"==typeof this.path?nT.basename(this.path,this.extname):void 0}set stem(e){nF(e,"stem"),nR(e,"stem"),this.path=nT.join(this.dirname||"",e+(this.extname||""))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new ex(e,t,n);return this.path&&(r.name=this.path+":"+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return void 0===this.value?"":"string"==typeof this.value?this.value:new TextDecoder(e||void 0).decode(this.value)}}function nR(e,t){if(e&&e.includes(nT.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+nT.sep+"`")}function nF(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function nj(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}let nH=function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r},nq={}.hasOwnProperty;class nz extends nH{constructor(){super("copy"),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=function(){let e=[],t={run:function(...t){let n=-1,r=t.pop();if("function"!=typeof r)throw TypeError("Expected function as last argument, not "+r);(function i(o,...a){let l=e[++n],s=-1;if(o){r(o);return}for(;++s<t.length;)(null===a[s]||void 0===a[s])&&(a[s]=t[s]);t=a,l?(function(e,t){let n;return function(...t){let o;let a=e.length>t.length;a&&t.push(r);try{o=e.apply(this,t)}catch(e){if(a&&n)throw e;return r(e)}a||(o&&o.then&&"function"==typeof o.then?o.then(i,r):o instanceof Error?r(o):i(o))};function r(e,...i){n||(n=!0,t(e,...i))}function i(e){r(null,e)}})(l,i)(...a):r(null,...a)})(null,...t)},use:function(n){if("function"!=typeof n)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}};return t}()}copy(){let e=new nz,t=-1;for(;++t<this.attachers.length;){let n=this.attachers[t];e.use(...n)}return e.data(nI(!0,{},this.namespace)),e}data(e,t){return"string"==typeof e?2==arguments.length?(nZ("data",this.frozen),this.namespace[e]=t,this):nq.call(this.namespace,e)&&this.namespace[e]||void 0:e?(nZ("data",this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;for(;++this.freezeIndex<this.attachers.length;){let[e,...t]=this.attachers[this.freezeIndex];if(!1===t[0])continue;!0===t[0]&&(t[0]=void 0);let n=e.call(this,...t);"function"==typeof n&&this.transformers.use(n)}return this.frozen=!0,this.freezeIndex=Number.POSITIVE_INFINITY,this}parse(e){this.freeze();let t=nW(e),n=this.parser||this.Parser;return nU("parse",n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),nU("process",this.parser||this.Parser),nB("process",this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let o=nW(e),a=n.parse(o);function l(e,n){e||!n?i(e):r?r(n):t(void 0,n)}n.run(a,o,function(e,t,r){if(e||!t||!r)return l(e);let i=n.stringify(t,r);"string"==typeof i||i&&"object"==typeof i&&"byteLength"in i&&"byteOffset"in i?r.value=i:r.result=i,l(e,r)})}}processSync(e){let t,n=!1;return this.freeze(),nU("processSync",this.parser||this.Parser),nB("processSync",this.compiler||this.Compiler),this.process(e,function(e,r){n=!0,nE(e),t=r}),n_("processSync","process",n),t}run(e,t,n){nG(e),this.freeze();let r=this.transformers;return n||"function"!=typeof t||(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,o){let a=nW(t);r.run(e,a,function(t,r,a){let l=r||e;t?o(t):i?i(l):n(void 0,l,a)})}}runSync(e,t){let n,r=!1;return this.run(e,t,function(e,t){nE(e),n=t,r=!0}),n_("runSync","run",r),n}stringify(e,t){this.freeze();let n=nW(t),r=this.compiler||this.Compiler;return nB("stringify",r),nG(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(nZ("use",this.frozen),null==e);else if("function"==typeof e)a(e,t);else if("object"==typeof e)Array.isArray(e)?o(e):i(e);else throw TypeError("Expected usable value, not `"+e+"`");return this;function i(e){if(!("plugins"in e)&&!("settings"in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=nI(!0,r.settings,e.settings))}function o(e){let t=-1;if(null==e);else if(Array.isArray(e))for(;++t<e.length;)!function(e){if("function"==typeof e)a(e,[]);else if("object"==typeof e){if(Array.isArray(e)){let[t,...n]=e;a(t,n)}else i(e)}else throw TypeError("Expected usable value, not `"+e+"`")}(e[t]);else throw TypeError("Expected a list of plugins, not `"+e+"`")}function a(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(-1===i)n.push([e,...t]);else if(t.length>0){let[r,...o]=t,a=n[i][1];nP(a)&&nP(r)&&(r=nI(!0,a,r)),n[i]=[e,r,...o]}}}}let nO=new nz().freeze();function nU(e,t){if("function"!=typeof t)throw TypeError("Cannot `"+e+"` without `parser`")}function nB(e,t){if("function"!=typeof t)throw TypeError("Cannot `"+e+"` without `compiler`")}function nZ(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function nG(e){if(!nP(e)||"string"!=typeof e.type)throw TypeError("Expected node, got `"+e+"`")}function n_(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function nW(e){return e&&"object"==typeof e&&"message"in e&&"messages"in e?e:new nN(e)}let nK=[],n$={allowDangerousHtml:!0},nY=/^(https?|ircs?|mailto|xmpp)$/i,nJ=[{from:"astPlugins",id:"remove-buggy-html-in-markdown-parser"},{from:"allowDangerousHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"allowNode",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowElement"},{from:"allowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"allowedElements"},{from:"className",id:"remove-classname"},{from:"disallowedTypes",id:"replace-allownode-allowedtypes-and-disallowedtypes",to:"disallowedElements"},{from:"escapeHtml",id:"remove-buggy-html-in-markdown-parser"},{from:"includeElementIndex",id:"#remove-includeelementindex"},{from:"includeNodeIndex",id:"change-includenodeindex-to-includeelementindex"},{from:"linkTarget",id:"remove-linktarget"},{from:"plugins",id:"change-plugins-to-remarkplugins",to:"remarkPlugins"},{from:"rawSourcePos",id:"#remove-rawsourcepos"},{from:"renderers",id:"change-renderers-to-components",to:"components"},{from:"source",id:"change-source-to-children",to:"children"},{from:"sourcePos",id:"#remove-sourcepos"},{from:"transformImageUri",id:"#add-urltransform",to:"urlTransform"},{from:"transformLinkUri",id:"#add-urltransform",to:"urlTransform"}];function nX(e){let t=function(e){let t=e.rehypePlugins||nK,n=e.remarkPlugins||nK,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...n$}:n$;return nO().use(t6).use(n).use(nC,r).use(t)}(e),n=function(e){let t=e.children||"",n=new nN;return"string"==typeof t&&(n.value=t),n}(e);return function(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,l=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||nQ;for(let e of nJ)Object.hasOwn(t,e.from)&&(e.from,e.to&&e.to,e.id);return nd(e,function(e,t,i){if("raw"===e.type&&i&&"number"==typeof t)return l?i.children.splice(t,1):i.children[t]={type:"text",value:e.value},t;if("element"===e.type){let t;for(t in eV)if(Object.hasOwn(eV,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=eV[t];(null===r||r.includes(e.tagName))&&(e.properties[t]=c(String(n||""),t,e))}}if("element"===e.type){let o=n?!n.includes(e.tagName):!!a&&a.includes(e.tagName);if(!o&&r&&"number"==typeof t&&(o=!r(e,t,i)),o&&i&&"number"==typeof t)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}),function(e,t){var n,r,i;let o;if(!t||void 0===t.Fragment)throw TypeError("Expected `Fragment` in options");let a=t.filePath||void 0;if(t.development){if("function"!=typeof t.jsxDEV)throw TypeError("Expected `jsxDEV` in options when `development: true`");n=t.jsxDEV,o=function(e,t,r,i){let o=Array.isArray(r.children),l=ef(e);return n(t,r,i,o,{columnNumber:l?l.column-1:void 0,fileName:a,lineNumber:l?l.line:void 0},void 0)}}else{if("function"!=typeof t.jsx)throw TypeError("Expected `jsx` in production options");if("function"!=typeof t.jsxs)throw TypeError("Expected `jsxs` in production options");r=t.jsx,i=t.jsxs,o=function(e,t,n,o){let a=Array.isArray(n.children)?i:r;return o?a(t,n,o):a(t,n)}}let l={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:o,elementAttributeNameCase:t.elementAttributeNameCase||"react",evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:a,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:!1!==t.passKeys,passNode:t.passNode||!1,schema:"svg"===t.space?ei:er,stylePropertyNameCase:t.stylePropertyNameCase||"dom",tableCellAlignToStyle:!1!==t.tableCellAlignToStyle},s=eE(l,e,void 0);return s&&"string"!=typeof s?s:l.create(e,l.Fragment,{children:s||void 0},void 0)}(e,{Fragment:o.Fragment,components:i,ignoreInvalidStyle:!0,jsx:o.jsx,jsxs:o.jsxs,passKeys:!0,passNode:!0})}(t.runSync(t.parse(n),n),e)}function nQ(e){let t=e.indexOf(":"),n=e.indexOf("?"),r=e.indexOf("#"),i=e.indexOf("/");return -1===t||-1!==i&&t>i||-1!==n&&t>n||-1!==r&&t>r||nY.test(e.slice(0,t))?e:""}let n0={projectTitle:"Vibe Coding",language:"ka",telegramContact:"https://t.me/andr3waltairchannel",categories:[{id:"intro",title:"შესავალი",icon:"\uD83C\uDFAF",articles:[{id:"what-is-vibe-coding",title:"რა არის Vibe Coding?",isFree:!0,content:`# რა არის Vibe Coding?

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

**სრული მონეტიზაციის სტრატეგია პრემიუმ ვერსიაში!**`}]}]};function n1(e){for(let t of n0.categories){let n=t.articles.find(t=>t.id===e);if(n)return n}}let n2=["Andrew Altair","andrewaltair"];function n8({article:e,onNavigate:t,isLocked:n,onUnlock:r}){let{prev:i,next:a}=function(e){let t=[];n0.categories.forEach(e=>{t.push(...e.articles)});let n=t.findIndex(t=>t.id===e);return{prev:n>0?t[n-1]:void 0,next:n<t.length-1?t[n+1]:void 0}}(e.id),s=e.content.split("\n"),c=Math.floor(.15*s.length),u=n?s.slice(0,c).join("\n"):e.content;return(0,o.jsxs)("div",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" w-full",children:[o.jsx(l(),{id:"4652140b849ea4f8",dynamic:[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"],children:`.article-content{color:#374151;font-size:1rem;line-height:1.8;user-select:${n?"none":"text"};-webkit-user-select:${n?"none":"text"};-moz-user-select:${n?"none":"text"};-ms-user-select:${n?"none":"text"}}.article-content h1{font-size:2rem;font-weight:700;color:#111827;margin-top:0;margin-bottom:1.5rem;background:-webkit-linear-gradient(left,#7c3aed,#ec4899);background:-moz-linear-gradient(left,#7c3aed,#ec4899);background:-o-linear-gradient(left,#7c3aed,#ec4899);background:linear-gradient(to right,#7c3aed,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.article-content h2{font-size:1.5rem;font-weight:600;color:#111827;margin-top:2rem;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid rgba(0,0,0,.1)}.article-content h3{font-size:1.25rem;font-weight:600;color:#111827;margin-top:1.5rem;margin-bottom:.75rem}.article-content p{margin-bottom:1rem;color:#4b5563}.article-content code{background:#f3f4f6;padding:.2rem .5rem;-webkit-border-radius:.375rem;-moz-border-radius:.375rem;border-radius:.375rem;font-size:.875rem;font-family:"JetBrains Mono",monospace;color:#7c3aed}.article-content pre{background:#1f2937;padding:1.25rem;-webkit-border-radius:.75rem;-moz-border-radius:.75rem;border-radius:.75rem;overflow-x:auto;margin:1.5rem 0}.article-content pre code{background:transparent;padding:0;color:#e5e7eb}.article-content blockquote{border-left:4px solid#7c3aed;padding:.75rem 1rem;margin:1.5rem 0;background:rgba(124,58,237,.05);-webkit-border-radius:0 .5rem .5rem 0;-moz-border-radius:0 .5rem .5rem 0;border-radius:0 .5rem .5rem 0}.article-content table{width:100%;border-collapse:collapse;margin:1.5rem 0}.article-content th{text-align:left;padding:.75rem;border-bottom:2px solid rgba(0,0,0,.1);color:#7c3aed;font-weight:600}.article-content td{padding:.75rem;border-bottom:1px solid rgba(0,0,0,.1)}`}),(0,o.jsxs)(p.E.article,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},className:"relative",children:[o.jsx("div",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" article-content",children:o.jsx(nX,{children:u})}),n&&(0,o.jsxs)("div",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" relative -mt-24",children:[o.jsx("div",{style:{background:"linear-gradient(to bottom, rgba(250,250,250,0) 0%, rgba(250,250,250,0.8) 40%, rgba(250,250,250,1) 100%)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"},className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" absolute inset-x-0 top-0 h-64 pointer-events-none"}),(0,o.jsxs)("div",{style:{backgroundColor:"#fafafa"},className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" relative z-10 text-center py-16 px-6",children:[o.jsx(f.H,{size:56,className:"mx-auto text-primary mb-4",weight:"duotone"}),o.jsx("h3",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" text-2xl font-bold mb-2",children:"\uD83D\uDD12 კითხვის გაგრძელება"}),o.jsx("p",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" text-muted-foreground mb-6 text-lg",children:"დარჩენილია ექსკლუზიური მასალის 85%"}),o.jsx("button",{onClick:r,className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:scale-105 transition-transform shadow-lg",children:"\uD83D\uDE80 სრული წვდომა"})]})]})]},e.id),!n&&(0,o.jsxs)("div",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" flex justify-between items-center gap-4 mt-12 pt-8 border-t border-border",children:[i?(0,o.jsxs)("button",{onClick:()=>t(i.id),className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm flex-1 max-w-[200px] group",children:[o.jsx(m.W,{size:20,className:"group-hover:-translate-x-1 transition-transform"}),o.jsx("span",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" truncate",children:i.title})]}):o.jsx("div",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])}),a?(0,o.jsxs)("button",{onClick:()=>t(a.id),className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" "+`flex items-center justify-end gap-2 px-4 py-3 rounded-xl transition-colors text-sm flex-1 max-w-[200px] group ${a.isFree?"bg-secondary hover:bg-secondary/80":"bg-primary/10 hover:bg-primary/20 text-primary"}`,children:[o.jsx("span",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])+" truncate",children:a.title}),a.isFree?o.jsx(y,{size:20,className:"group-hover:translate-x-1 transition-transform"}):o.jsx(f.H,{size:20})]}):o.jsx("div",{className:l().dynamic([["4652140b849ea4f8",[n?"none":"text",n?"none":"text",n?"none":"text",n?"none":"text"]]])})]})]})}function n6(){let[e,t]=(0,u.useState)(null),[n,r]=(0,u.useState)(""),i=(0,s.useRouter)(),[a,h]=(0,u.useState)(!0),[g,x]=(0,u.useState)(!1),[w,A]=(0,u.useState)(!1),[I,P]=(0,u.useState)(null),[T,L]=(0,u.useState)(""),[D,M]=(0,u.useState)(""),[V,N]=(0,u.useState)(null),[R,F]=(0,u.useState)([]),j=!!I&&n2.some(e=>e.toLowerCase()===I.toLowerCase()),H=async()=>{if(!T.trim()){M("შეიყვანეთ კოდი");return}try{let e=await fetch(`/api/vibe-codes?code=${T}`),n=await e.json();if(n.success){let e={type:n.type,expiresAt:n.expiresAt,articleId:n.articleId};if(localStorage.setItem("vibe_coding_access",JSON.stringify(e)),N(e),A(!1),L(""),M(""),"single-article"===n.type&&n.articleId){let e=n1(n.articleId);e&&t(e)}}else M(n.error||"არასწორი კოდი")}catch(e){M("დაფიქსირდა შეცდომა. სცადეთ მოგვიანებით.")}},q=n0.categories.map(e=>({...e,articles:e.articles.filter(e=>e.title.toLowerCase().includes(n.toLowerCase()))})).filter(e=>e.articles.length>0);return(0,o.jsxs)("div",{style:{background:"linear-gradient(135deg, #f5f3ff 0%, #faf5ff 25%, #fdf4ff 50%, #f0f9ff 75%, #f5f3ff 100%)"},className:"jsx-7d8ffe5ad8389672 min-h-screen relative",children:[(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 fixed inset-0 overflow-hidden pointer-events-none -z-10",children:[o.jsx("div",{style:{background:"radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 40%, transparent 70%)",animation:"float 20s ease-in-out infinite"},className:"jsx-7d8ffe5ad8389672 absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full blur-3xl opacity-40"}),o.jsx("div",{style:{background:"radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 40%, transparent 70%)",animation:"float 25s ease-in-out infinite reverse"},className:"jsx-7d8ffe5ad8389672 absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full blur-3xl opacity-40"}),o.jsx("div",{style:{background:"radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)",animation:"float 30s ease-in-out infinite"},className:"jsx-7d8ffe5ad8389672 absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full blur-3xl opacity-30"}),o.jsx("div",{style:{backgroundImage:"radial-gradient(circle, #7c3aed 1px, transparent 1px)",backgroundSize:"50px 50px"},className:"jsx-7d8ffe5ad8389672 absolute inset-0 opacity-[0.03]"})]}),o.jsx(l(),{id:"7d8ffe5ad8389672",children:"@-webkit-keyframes float{0%,100%{-webkit-transform:translate(0,0)scale(1);transform:translate(0,0)scale(1)}33%{-webkit-transform:translate(30px,-30px)scale(1.1);transform:translate(30px,-30px)scale(1.1)}66%{-webkit-transform:translate(-20px,20px)scale(.9);transform:translate(-20px,20px)scale(.9)}}@-moz-keyframes float{0%,100%{-moz-transform:translate(0,0)scale(1);transform:translate(0,0)scale(1)}33%{-moz-transform:translate(30px,-30px)scale(1.1);transform:translate(30px,-30px)scale(1.1)}66%{-moz-transform:translate(-20px,20px)scale(.9);transform:translate(-20px,20px)scale(.9)}}@-o-keyframes float{0%,100%{-o-transform:translate(0,0)scale(1);transform:translate(0,0)scale(1)}33%{-o-transform:translate(30px,-30px)scale(1.1);transform:translate(30px,-30px)scale(1.1)}66%{-o-transform:translate(-20px,20px)scale(.9);transform:translate(-20px,20px)scale(.9)}}@keyframes float{0%,100%{-webkit-transform:translate(0,0)scale(1);-moz-transform:translate(0,0)scale(1);-o-transform:translate(0,0)scale(1);transform:translate(0,0)scale(1)}33%{-webkit-transform:translate(30px,-30px)scale(1.1);-moz-transform:translate(30px,-30px)scale(1.1);-o-transform:translate(30px,-30px)scale(1.1);transform:translate(30px,-30px)scale(1.1)}66%{-webkit-transform:translate(-20px,20px)scale(.9);-moz-transform:translate(-20px,20px)scale(.9);-o-transform:translate(-20px,20px)scale(.9);transform:translate(-20px,20px)scale(.9)}}"}),o.jsx("button",{onClick:()=>h(!a),className:"jsx-7d8ffe5ad8389672 fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg",children:a?o.jsx(b.X,{size:24}):o.jsx(v,{size:24})}),o.jsx("button",{onClick:()=>x(!g),style:{left:g?"4px":"304px",transition:"left 0.3s ease-in-out"},className:"jsx-7d8ffe5ad8389672 hidden lg:block fixed left-4 top-4 z-50 p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md hover:bg-gray-50 transition-all",children:g?o.jsx(y,{size:20,weight:"bold"}):o.jsx(m.W,{size:20,weight:"bold"})}),(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 flex w-full",children:[(0,o.jsxs)("aside",{style:{backgroundColor:"rgba(255, 255, 255, 0.95)",backdropFilter:"blur(10px)",borderColor:"rgba(0,0,0,0.1)"},className:`jsx-7d8ffe5ad8389672 
                        fixed lg:fixed top-0 left-0 z-40 h-screen
                        border-r flex flex-col
                        transform transition-all duration-300 ease-in-out
                        ${a?"translate-x-0":"-translate-x-full"}
                        ${g?"lg:w-0 lg:-translate-x-full":"lg:w-80 lg:translate-x-0"}
                        w-80
                    `,children:[(0,o.jsxs)("div",{style:{borderBottom:"1px solid rgba(0,0,0,0.1)"},className:"jsx-7d8ffe5ad8389672 p-6",children:[(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 flex items-center gap-3 mb-4",children:[o.jsx("div",{className:"jsx-7d8ffe5ad8389672 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center",children:o.jsx(k.f,{size:24,className:"text-white",weight:"fill"})}),(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672",children:[o.jsx("h1",{style:{background:"linear-gradient(to right, #7c3aed, #ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"},className:"jsx-7d8ffe5ad8389672 text-xl font-bold",children:"Vibe Coding"}),(0,o.jsxs)("p",{className:"jsx-7d8ffe5ad8389672 text-xs text-gray-500",children:["ბიბლიოთეკა ",j&&o.jsx("span",{className:"jsx-7d8ffe5ad8389672 text-purple-500 font-medium",children:"PRO"})]})]})]}),(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 relative",children:[o.jsx(S,{size:18,className:"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"}),o.jsx("input",{type:"text",placeholder:"ძიება (ან #ID)...",value:n,onChange:e=>r(e.target.value),onKeyDown:e=>{if("Enter"===e.key&&n.startsWith("#")){let e=n.substring(1);i.push(`/encyclopedia/vibe-coding/${e}`)}},style:{backgroundColor:"#f5f5f5",border:"1px solid rgba(0,0,0,0.1)"},className:"jsx-7d8ffe5ad8389672 w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"})]})]}),o.jsx("nav",{className:"jsx-7d8ffe5ad8389672 flex-1 overflow-y-auto p-4",children:q.map(e=>(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 mb-6",children:[(0,o.jsxs)("h2",{className:"jsx-7d8ffe5ad8389672 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-2",children:[o.jsx("span",{className:"jsx-7d8ffe5ad8389672",children:e.icon}),e.title]}),o.jsx("div",{className:"jsx-7d8ffe5ad8389672 space-y-1",children:e.articles.map(e=>(0,o.jsxs)(c.default,{href:`/encyclopedia/vibe-coding/${e.id}`,className:`
                                                w-full text-left px-3 py-2.5 rounded-lg text-sm
                                                flex items-center justify-between gap-2
                                                transition-all duration-200
                                                hover:bg-gray-100 text-gray-700
                                            `,children:[o.jsx("span",{className:"jsx-7d8ffe5ad8389672 truncate",children:e.title}),e.isFree?o.jsx(C,{size:16,className:"text-green-500 shrink-0"}):o.jsx(f.H,{size:16,className:"text-orange-500 shrink-0"})]},e.id))})]},e.id))}),o.jsx("div",{style:{borderTop:"1px solid rgba(0,0,0,0.1)"},className:"jsx-7d8ffe5ad8389672 p-4 space-y-3",children:(0,o.jsxs)("a",{href:n0.telegramContact,target:"_blank",rel:"noopener noreferrer",className:"jsx-7d8ffe5ad8389672 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all",children:[o.jsx(E.h,{size:18,weight:"fill"}),"შეიძინე პრემიუმი"]})})]}),o.jsx("main",{style:{marginLeft:"0"},className:"jsx-7d8ffe5ad8389672 flex-1 min-h-screen transition-all duration-300",children:o.jsx("div",{className:"jsx-7d8ffe5ad8389672 relative p-6 lg:p-12 max-w-4xl mx-auto",children:e?o.jsx(o.Fragment,{children:o.jsx(n8,{article:e,onNavigate:e=>{let n=n1(e);n&&(t(n),h(!1),window.scrollTo({top:0,behavior:"smooth"}))},isLocked:!(j||V&&("full"===V.type?Date.now()<V.expiresAt:"single-article"===V.type&&e.id===V.articleId&&Date.now()<V.expiresAt)),onUnlock:()=>A(!0)})}):o.jsx("div",{className:"jsx-7d8ffe5ad8389672 flex items-center justify-center h-full min-h-[60vh]",children:(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 text-center",children:[o.jsx(k.f,{size:64,className:"mx-auto text-muted-foreground mb-4"}),o.jsx("p",{className:"jsx-7d8ffe5ad8389672 text-muted-foreground",children:"აირჩიეთ სტატია წასაკითხად"})]})})})})]}),o.jsx(d.M,{children:w&&(0,o.jsxs)(p.E.div,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},className:"fixed inset-0 z-50 flex items-center justify-center p-4",onClick:()=>A(!1),children:[o.jsx("div",{className:"jsx-7d8ffe5ad8389672 absolute inset-0 bg-black/70 backdrop-blur-md"}),(0,o.jsxs)(p.E.div,{initial:{scale:.9,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.9,opacity:0},onClick:e=>e.stopPropagation(),className:"relative z-10 max-w-md w-full rounded-2xl overflow-hidden",children:[o.jsx("div",{className:"jsx-7d8ffe5ad8389672 absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-shift"}),(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 relative m-[2px] bg-card rounded-2xl p-8",children:[o.jsx("button",{onClick:()=>{A(!1),L(""),M("")},className:"jsx-7d8ffe5ad8389672 absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors",children:o.jsx(b.X,{size:24,weight:"bold"})}),o.jsx("div",{className:"jsx-7d8ffe5ad8389672 flex justify-center mb-6",children:o.jsx("div",{className:"jsx-7d8ffe5ad8389672 w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center",children:o.jsx(f.H,{size:40,className:"text-primary",weight:"duotone"})})}),o.jsx("h3",{className:"jsx-7d8ffe5ad8389672 text-2xl font-bold text-center mb-3 text-gradient",children:"შეიყვანეთ წვდომის კოდი"}),o.jsx("p",{className:"jsx-7d8ffe5ad8389672 text-muted-foreground text-center mb-6 leading-relaxed",children:"კოდის შეყვანით მიიღებთ წვდომას პრემიუმ მასალებზე"}),(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 space-y-4",children:[o.jsx("input",{type:"text",value:T,onChange:e=>{L(e.target.value.toUpperCase()),M("")},onKeyPress:e=>"Enter"===e.key&&H(),placeholder:"კოდი...",className:"jsx-7d8ffe5ad8389672 w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-center text-lg tracking-widest uppercase"}),o.jsx("button",{onClick:H,className:"jsx-7d8ffe5ad8389672 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-purple-500 text-white font-medium hover:from-primary/90 hover:to-purple-500/90 transition-all hover:scale-[1.02] active:scale-[0.98]",children:"დადასტურება"}),(0,o.jsxs)("div",{className:"jsx-7d8ffe5ad8389672 relative my-6",children:[o.jsx("div",{className:"jsx-7d8ffe5ad8389672 absolute inset-0 flex items-center",children:o.jsx("div",{className:"jsx-7d8ffe5ad8389672 w-full border-t border-border"})}),o.jsx("div",{className:"jsx-7d8ffe5ad8389672 relative flex justify-center text-xs uppercase",children:o.jsx("span",{className:"jsx-7d8ffe5ad8389672 bg-card px-2 text-muted-foreground",children:"ან"})})]}),(0,o.jsxs)("a",{href:n0.telegramContact,target:"_blank",rel:"noopener noreferrer",className:"jsx-7d8ffe5ad8389672 flex items-center justify-center gap-3 w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]",children:[o.jsx(E.h,{size:24,weight:"fill"}),"კოდის მიღება ადმინისტრატორისგან"]})]})]})]})]})}),a&&o.jsx("div",{onClick:()=>h(!1),className:"jsx-7d8ffe5ad8389672 fixed inset-0 bg-black/50 z-30 lg:hidden"})]})}},7293:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>u,metadata:()=>c});var r=n(19510),i=n(68570);let o=(0,i.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\vibe-coding\VibeCodingLibraryV2.tsx`),{__esModule:a,$$typeof:l}=o;o.default;let s=(0,i.createProxy)(String.raw`C:\Users\User\Desktop\GITHUB\andrewaltair\fresh\src\components\vibe-coding\VibeCodingLibraryV2.tsx#default`),c={title:"Vibe Coding სტატიები - AI პროგრამირების ბიბლიოთეკა | Andrew Altair",description:"12+ დეტალური სტატია Vibe Coding-ზე. ისწავლე AI-ასისტირებული პროგრამირება, Cursor, Claude, ChatGPT და მეტი.",keywords:["vibe coding","AI პროგრამირება","cursor","claude","chatgpt","სტატიები"],openGraph:{title:"Vibe Coding სტატიები - AI პროგრამირების ბიბლიოთეკა",description:"12+ დეტალური სტატია Vibe Coding-ზე. ისწავლე AI-ასისტირებული პროგრამირება.",type:"website"}};function u(){return r.jsx(s,{})}},95448:(e,t,n)=>{"use strict";n.d(t,{f:()=>l});var r=n(17577),i=n(13153);let o=new Map([["bold",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,20H72A36,36,0,0,0,36,56V224a12,12,0,0,0,12,12H192a12,12,0,0,0,0-24H60v-4a12,12,0,0,1,12-12H208a12,12,0,0,0,12-12V32A12,12,0,0,0,208,20ZM196,172H72a35.59,35.59,0,0,0-12,2.06V56A12,12,0,0,1,72,44H196Z"}))],["duotone",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,32V192H72a24,24,0,0,0-24,24V56A24,24,0,0,1,72,32Z",opacity:"0.2"}),r.createElement("path",{d:"M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-8,160H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40H200Z"}))],["fill",r.createElement(r.Fragment,null,r.createElement("path",{d:"M216,32V192a8,8,0,0,1-8,8H72a16,16,0,0,0-16,16H192a8,8,0,0,1,0,16H48a8,8,0,0,1-8-8V56A32,32,0,0,1,72,24H208A8,8,0,0,1,216,32Z"}))],["light",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,26H72A30,30,0,0,0,42,56V224a6,6,0,0,0,6,6H192a6,6,0,0,0,0-12H54v-2a18,18,0,0,1,18-18H208a6,6,0,0,0,6-6V32A6,6,0,0,0,208,26Zm-6,160H72a29.87,29.87,0,0,0-18,6V56A18,18,0,0,1,72,38H202Z"}))],["regular",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-8,160H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40H200Z"}))],["thin",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,28H72A28,28,0,0,0,44,56V224a4,4,0,0,0,4,4H192a4,4,0,0,0,0-8H52v-4a20,20,0,0,1,20-20H208a4,4,0,0,0,4-4V32A4,4,0,0,0,208,28Zm-4,160H72a27.94,27.94,0,0,0-20,8.42V56A20,20,0,0,1,72,36H204Z"}))]]),a=r.forwardRef((e,t)=>r.createElement(i.Z,{ref:t,...e,weights:o}));a.displayName="BookIcon";let l=a},94712:(e,t,n)=>{"use strict";n.d(t,{W:()=>l});var r=n(17577),i=n(13153);let o=new Map([["bold",r.createElement(r.Fragment,null,r.createElement("path",{d:"M168.49,199.51a12,12,0,0,1-17,17l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128Z"}))],["duotone",r.createElement(r.Fragment,null,r.createElement("path",{d:"M160,48V208L80,128Z",opacity:"0.2"}),r.createElement("path",{d:"M163.06,40.61a8,8,0,0,0-8.72,1.73l-80,80a8,8,0,0,0,0,11.32l80,80A8,8,0,0,0,168,208V48A8,8,0,0,0,163.06,40.61ZM152,188.69,91.31,128,152,67.31Z"}))],["fill",r.createElement(r.Fragment,null,r.createElement("path",{d:"M168,48V208a8,8,0,0,1-13.66,5.66l-80-80a8,8,0,0,1,0-11.32l80-80A8,8,0,0,1,168,48Z"}))],["light",r.createElement(r.Fragment,null,r.createElement("path",{d:"M164.24,203.76a6,6,0,1,1-8.48,8.48l-80-80a6,6,0,0,1,0-8.48l80-80a6,6,0,0,1,8.48,8.48L88.49,128Z"}))],["regular",r.createElement(r.Fragment,null,r.createElement("path",{d:"M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"}))],["thin",r.createElement(r.Fragment,null,r.createElement("path",{d:"M162.83,205.17a4,4,0,0,1-5.66,5.66l-80-80a4,4,0,0,1,0-5.66l80-80a4,4,0,1,1,5.66,5.66L85.66,128Z"}))]]),a=r.forwardRef((e,t)=>r.createElement(i.Z,{ref:t,...e,weights:o}));a.displayName="CaretLeftIcon";let l=a},4821:(e,t,n)=>{"use strict";n.d(t,{H:()=>l});var r=n(17577),i=n(13153);let o=new Map([["bold",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,76H180V56A52,52,0,0,0,76,56V76H48A20,20,0,0,0,28,96V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V96A20,20,0,0,0,208,76ZM100,56a28,28,0,0,1,56,0V76H100ZM204,204H52V100H204Zm-60-52a16,16,0,1,1-16-16A16,16,0,0,1,144,152Z"}))],["duotone",r.createElement(r.Fragment,null,r.createElement("path",{d:"M216,96V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V96a8,8,0,0,1,8-8H208A8,8,0,0,1,216,96Z",opacity:"0.2"}),r.createElement("path",{d:"M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"}))],["fill",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z"}))],["light",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,82H174V56a46,46,0,0,0-92,0V82H48A14,14,0,0,0,34,96V208a14,14,0,0,0,14,14H208a14,14,0,0,0,14-14V96A14,14,0,0,0,208,82ZM94,56a34,34,0,0,1,68,0V82H94ZM210,208a2,2,0,0,1-2,2H48a2,2,0,0,1-2-2V96a2,2,0,0,1,2-2H208a2,2,0,0,1,2,2Zm-72-56a10,10,0,1,1-10-10A10,10,0,0,1,138,152Z"}))],["regular",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z"}))],["thin",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,84H172V56a44,44,0,0,0-88,0V84H48A12,12,0,0,0,36,96V208a12,12,0,0,0,12,12H208a12,12,0,0,0,12-12V96A12,12,0,0,0,208,84ZM92,56a36,36,0,0,1,72,0V84H92ZM212,208a4,4,0,0,1-4,4H48a4,4,0,0,1-4-4V96a4,4,0,0,1,4-4H208a4,4,0,0,1,4,4Zm-76-56a8,8,0,1,1-8-8A8,8,0,0,1,136,152Z"}))]]),a=r.forwardRef((e,t)=>r.createElement(i.Z,{ref:t,...e,weights:o}));a.displayName="LockIcon";let l=a},31117:(e,t,n)=>{"use strict";n.d(t,{h:()=>l});var r=n(17577),i=n(13153);let o=new Map([["bold",r.createElement(r.Fragment,null,r.createElement("path",{d:"M231.49,23.16a13,13,0,0,0-13.23-2.26L15.6,100.21a18.22,18.22,0,0,0,3.12,34.86L68,144.74V200a20,20,0,0,0,34.4,13.88l22.67-23.51L162.35,223a20,20,0,0,0,32.7-10.54L235.67,35.91A13,13,0,0,0,231.49,23.16ZM139.41,77.52,77.22,122.09l-34.43-6.75ZM92,190.06V161.35l15,13.15Zm81.16,10.52L99.28,135.81,205.59,59.63Z"}))],["duotone",r.createElement(r.Fragment,null,r.createElement("path",{d:"M223.41,32.09,80,134.87,21,123.3A6.23,6.23,0,0,1,20,111.38L222.63,32.07A1,1,0,0,1,223.41,32.09ZM80,200a8,8,0,0,0,13.76,5.56l30.61-31.76L80,134.87Z",opacity:"0.2"}),r.createElement("path",{d:"M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19ZM78.15,126.35l-49.61-9.73,139.2-54.48ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z"}))],["fill",r.createElement(r.Fragment,null,r.createElement("path",{d:"M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19ZM175.53,208,92.85,135.5l119-85.29Z"}))],["light",r.createElement(r.Fragment,null,r.createElement("path",{d:"M227.57,27.7a7,7,0,0,0-7.13-1.22L17.78,105.79a12.23,12.23,0,0,0,2.1,23.39L74,139.81V200a14,14,0,0,0,24.08,9.71l26.64-27.63,41.58,36.45a13.9,13.9,0,0,0,9.2,3.49,14.33,14.33,0,0,0,4.36-.69,13.86,13.86,0,0,0,9.34-10.17L229.82,34.57A7,7,0,0,0,227.57,27.7ZM22.05,117.37h0a.46.46,0,0,1,0-.32.51.51,0,0,1,.15-.08L181.91,54.45l-103.3,74L22.2,117.41Zm67.39,84A2,2,0,0,1,86,200V148.11l29.69,26Zm88.07,7.08a1.93,1.93,0,0,1-1.34,1.44,2,2,0,0,1-2-.4L89.64,135.34,215,45.5Z"}))],["regular",r.createElement(r.Fragment,null,r.createElement("path",{d:"M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z"}))],["thin",r.createElement(r.Fragment,null,r.createElement("path",{d:"M226.27,29.22a5,5,0,0,0-5.1-.87L18.51,107.66a10.22,10.22,0,0,0,1.75,19.56L76,138.16V200a12,12,0,0,0,7.51,11.13A12.1,12.1,0,0,0,88,212a12,12,0,0,0,8.62-3.68l28-29,43,37.71a12,12,0,0,0,7.89,3,12.47,12.47,0,0,0,3.74-.59,11.87,11.87,0,0,0,8-8.72L227.87,34.12A5,5,0,0,0,226.27,29.22ZM20,117.38a2.13,2.13,0,0,1,1.42-2.27L196.07,46.76l-117,83.85L21.81,119.37A2.12,2.12,0,0,1,20,117.38Zm70.87,85.38A4,4,0,0,1,84,200V143.7L118.58,174Zm88.58,6.14a4,4,0,0,1-6.57,2.09L86.43,135.18,218.13,40.8Z"}))]]),a=r.forwardRef((e,t)=>r.createElement(i.Z,{ref:t,...e,weights:o}));a.displayName="TelegramLogoIcon";let l=a},69039:(e,t,n)=>{"use strict";n.d(t,{X:()=>l});var r=n(17577),i=n(13153);let o=new Map([["bold",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"}))],["duotone",r.createElement(r.Fragment,null,r.createElement("path",{d:"M216,56V200a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V56A16,16,0,0,1,56,40H200A16,16,0,0,1,216,56Z",opacity:"0.2"}),r.createElement("path",{d:"M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"}))],["fill",r.createElement(r.Fragment,null,r.createElement("path",{d:"M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM181.66,170.34a8,8,0,0,1-11.32,11.32L128,139.31,85.66,181.66a8,8,0,0,1-11.32-11.32L116.69,128,74.34,85.66A8,8,0,0,1,85.66,74.34L128,116.69l42.34-42.35a8,8,0,0,1,11.32,11.32L139.31,128Z"}))],["light",r.createElement(r.Fragment,null,r.createElement("path",{d:"M204.24,195.76a6,6,0,1,1-8.48,8.48L128,136.49,60.24,204.24a6,6,0,0,1-8.48-8.48L119.51,128,51.76,60.24a6,6,0,0,1,8.48-8.48L128,119.51l67.76-67.75a6,6,0,0,1,8.48,8.48L136.49,128Z"}))],["regular",r.createElement(r.Fragment,null,r.createElement("path",{d:"M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"}))],["thin",r.createElement(r.Fragment,null,r.createElement("path",{d:"M202.83,197.17a4,4,0,0,1-5.66,5.66L128,133.66,58.83,202.83a4,4,0,0,1-5.66-5.66L122.34,128,53.17,58.83a4,4,0,0,1,5.66-5.66L128,122.34l69.17-69.17a4,4,0,1,1,5.66,5.66L133.66,128Z"}))]]),a=r.forwardRef((e,t)=>r.createElement(i.Z,{ref:t,...e,weights:o}));a.displayName="XIcon";let l=a},13153:(e,t,n)=>{"use strict";n.d(t,{Z:()=>o});var r=n(17577);let i=(0,r.createContext)({color:"currentColor",size:"1em",weight:"regular",mirrored:!1}),o=r.forwardRef((e,t)=>{let{alt:n,color:o,size:a,weight:l,mirrored:s,children:c,weights:u,...p}=e,{color:d="currentColor",size:f,weight:m="regular",mirrored:h=!1,...g}=r.useContext(i);return r.createElement("svg",{ref:t,xmlns:"http://www.w3.org/2000/svg",width:null!=a?a:f,height:null!=a?a:f,fill:null!=o?o:d,viewBox:"0 0 256 256",transform:s||h?"scale(-1, 1)":void 0,...g,...p},!!n&&r.createElement("title",null,n),c,u.get(null!=l?l:m))});o.displayName="IconBase"},9086:(e,t,n)=>{"use strict";n.d(t,{M:()=>x});var r=n(10326),i=n(17577),o=n(40339),a=n(74749),l=n(42482),s=n(40295),c=n(69539),u=n(73965);function p(e,t){if("function"==typeof e)return e(t);null!=e&&(e.current=t)}class d extends i.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=t.offsetParent,n=(0,c.R)(e)&&e.offsetWidth||0,r=this.props.sizeRef.current;r.height=t.offsetHeight||0,r.width=t.offsetWidth||0,r.top=t.offsetTop,r.left=t.offsetLeft,r.right=n-r.width-r.left}return null}componentDidUpdate(){}render(){return this.props.children}}function f({children:e,isPresent:t,anchorX:n,root:o}){let a=(0,i.useId)(),l=(0,i.useRef)(null),s=(0,i.useRef)({width:0,height:0,top:0,left:0,right:0}),{nonce:c}=(0,i.useContext)(u._),f=function(...e){return i.useCallback(function(...e){return t=>{let n=!1,r=e.map(e=>{let r=p(e,t);return n||"function"!=typeof r||(n=!0),r});if(n)return()=>{for(let t=0;t<r.length;t++){let n=r[t];"function"==typeof n?n():p(e[t],null)}}}}(...e),e)}(l,e?.ref);return(0,i.useInsertionEffect)(()=>{let{width:e,height:r,top:i,left:u,right:p}=s.current;if(t||!l.current||!e||!r)return;let d="left"===n?`left: ${u}`:`right: ${p}`;l.current.dataset.motionPopId=a;let f=document.createElement("style");c&&(f.nonce=c);let m=o??document.head;return m.appendChild(f),f.sheet&&f.sheet.insertRule(`
          [data-motion-pop-id="${a}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${r}px !important;
            ${d}px !important;
            top: ${i}px !important;
          }
        `),()=>{m.contains(f)&&m.removeChild(f)}},[t]),(0,r.jsx)(d,{isPresent:t,childRef:l,sizeRef:s,children:i.cloneElement(e,{ref:f})})}let m=({children:e,initial:t,isPresent:n,onExitComplete:o,custom:l,presenceAffectsLayout:c,mode:u,anchorX:p,root:d})=>{let m=(0,a.h)(h),g=(0,i.useId)(),y=!0,b=(0,i.useMemo)(()=>(y=!1,{id:g,initial:t,isPresent:n,custom:l,onExitComplete:e=>{for(let t of(m.set(e,!0),m.values()))if(!t)return;o&&o()},register:e=>(m.set(e,!1),()=>m.delete(e))}),[n,m,o]);return c&&y&&(b={...b}),(0,i.useMemo)(()=>{m.forEach((e,t)=>m.set(t,!1))},[n]),i.useEffect(()=>{n||m.size||!o||o()},[n]),"popLayout"===u&&(e=(0,r.jsx)(f,{isPresent:n,anchorX:p,root:d,children:e})),(0,r.jsx)(s.O.Provider,{value:b,children:e})};function h(){return new Map}var g=n(56933);let y=e=>e.key||"";function b(e){let t=[];return i.Children.forEach(e,e=>{(0,i.isValidElement)(e)&&t.push(e)}),t}let x=({children:e,custom:t,initial:n=!0,onExitComplete:s,presenceAffectsLayout:c=!0,mode:u="sync",propagate:p=!1,anchorX:d="left",root:f})=>{let[h,x]=(0,g.oO)(p),v=(0,i.useMemo)(()=>b(e),[e]),k=p&&!h?[]:v.map(y),w=(0,i.useRef)(!0),S=(0,i.useRef)(v),A=(0,a.h)(()=>new Map),[C,E]=(0,i.useState)(v),[I,P]=(0,i.useState)(v);(0,l.L)(()=>{w.current=!1,S.current=v;for(let e=0;e<I.length;e++){let t=y(I[e]);k.includes(t)?A.delete(t):!0!==A.get(t)&&A.set(t,!1)}},[I,k.length,k.join("-")]);let T=[];if(v!==C){let e=[...v];for(let t=0;t<I.length;t++){let n=I[t],r=y(n);k.includes(r)||(e.splice(t,0,n),T.push(n))}return"wait"===u&&T.length&&(e=T),P(b(e)),E(v),null}let{forceRender:L}=(0,i.useContext)(o.p);return(0,r.jsx)(r.Fragment,{children:I.map(e=>{let i=y(e),o=(!p||!!h)&&(v===I||k.includes(i));return(0,r.jsx)(m,{isPresent:o,initial:(!w.current||!!n)&&void 0,custom:t,presenceAffectsLayout:c,mode:u,root:f,onExitComplete:o?void 0:()=>{if(!A.has(i))return;A.set(i,!0);let e=!0;A.forEach(t=>{t||(e=!1)}),e&&(L?.(),P(S.current),p&&x?.(),s&&s())},anchorX:d,children:e},i)})})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var n=e=>t(t.s=e),r=t.X(0,[8948,6051,5795,9287],()=>n(33226));module.exports=r})();