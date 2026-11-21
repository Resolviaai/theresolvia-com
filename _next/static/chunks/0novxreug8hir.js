(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,484553,e=>{"use strict";var t=e.i(894860);let r={name:"circle-question-mark",size:24,node:[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]],aliases:["help-circle","circle-help"]};r.node;let i=(0,t.default)(r);e.s(["default",0,i])},267726,e=>{"use strict";var t=e.i(894860);let r={name:"rotate-ccw",size:24,node:[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]};r.node;let i=(0,t.default)(r);e.s(["RotateCcw",0,i],267726)},867819,e=>{"use strict";var t=e.i(372169),r=e.i(913470),i=e.i(968702);e.s(["PlatformLink",0,function({url:e,platform:a,className:o="",...n}){let s=(0,i.useT)(),l="tiktok"===a?"TikTok":"Instagram";return(0,t.jsx)("a",{href:e,target:"_blank",rel:"noreferrer",...n,onClick:e=>e.stopPropagation(),"aria-label":s("Open on {platform}",{platform:l}),title:s("Open on {platform}",{platform:l}),className:`inline-flex size-[28px] items-center justify-center rounded-[9px] bg-black/50 after:absolute after:-inset-[8px] after:content-[''] backdrop-blur-[6px] transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-1)] ${o}`,children:(0,t.jsx)(r.PlatformIcon,{id:a})})},"platformOf",0,e=>e?/tiktok\.com/i.test(e)?"tiktok":/instagram\.com/i.test(e)?"instagram":null:null])},774779,e=>{"use strict";let t=e=>`${Math.floor(e/60)}:${String(Math.floor(e%60)).padStart(2,"0")}`;e.s(["expectedKeys",0,function(e){let t=[];return(e.contentScript.beats.some(e=>"intrigue"===e.lever||"climax"===e.lever)||e.hookScript.intrigueSpecific)&&t.push("intrigue"),t.push("hook"),e.contentVisual?.visualElements?.length&&t.push("visual"),t.push("setting"),t},"fallbackRows",0,function(e,r,i){let a=[],o=(e.topic?.videoFormat??[]).map(e=>i.formats[e]).filter(Boolean),n=e.topic?.peopleCountRequired?i.people[e.topic.peopleCountRequired]:void 0,s=r?t(r):void 0;if(o.length||s){let t=[];o.length&&t.push(["Format",o.join(" + ")]),n&&t.push(["People on camera",n]),s&&t.push(["Length",s]),e.contentScript.cta&&t.push(["Call to action",e.contentScript.cta,!0]),a.push({key:"format",summary:[o.join(" + "),s].filter(e=>!!e),table:t})}let l=function(e){let t=Number(e.adaptability?.score);if(!t)return null;let r=e.adaptability?.scale===10?t:2*t;return r>=8?"Easy":r>=5?"Average":"Hard"}(e);return l&&a.push({key:"remake",summary:[l]}),a},"mmss",0,t,"nbsp",0,e=>e.replace(/«\s/g,"« ").replace(/\s»/g," »").replace(/\s([:?!;])/g," $1"),"splitTimes",0,function(e){return e.split(/\[(\d+:\d{2})\]/).map((e,t)=>{if(t%2==0)return e;let[r,i]=e.split(":");return 60*Number(r)+Number(i)})}])},202324,e=>{"use strict";var t=e.i(372169);let r="block text-[11.5px] font-bold tracking-[0.16em] text-[#8A93A5] uppercase";e.s(["SHEET_CARD",0,"rounded-[12px] border border-[#2a2a2e] bg-[#1d1d20]","SheetTabs",0,function({tabs:e,value:r,onChange:i,id:a,label:o,trackTab:n,className:s=""}){return(0,t.jsx)("div",{role:"tablist","aria-label":o,className:`flex gap-[24px] border-b border-[#2a2a2e] ${s}`,children:e.map(([e,o])=>(0,t.jsxs)("button",{type:"button",role:"tab",id:`${a}-${e}`,"aria-selected":r===e,"aria-controls":`${a}-panel`,...n(e),onClick:()=>i(e),className:`relative h-[44px] text-[14.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-1)] ${r===e?"text-white":"text-white/55 hover:text-white/85"}`,children:[o,(0,t.jsx)("span",{"aria-hidden":!0,className:`absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--accent-1)] transition-opacity ${r===e?"opacity-100":"opacity-0"}`})]},e))})},"SheetTile",0,function({icon:e,label:i,aside:a,children:o,onClick:n,selected:s=!1,controls:l,...d}){let p=(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"flex items-center gap-[10px]",children:[(0,t.jsx)("span",{className:"flex size-[30px] shrink-0 items-center justify-center rounded-[9px] border border-white/[0.08] bg-[var(--accent-1)]/12 text-[#5EA6FF]",children:e}),(0,t.jsx)("span",{className:`${r} min-w-0 flex-1 truncate`,children:i}),a]}),(0,t.jsx)("div",{className:"flex min-w-0 flex-col gap-[6px] text-[14.5px] leading-[1.45] text-[#C9CFDA]",children:o})]}),c=`flex min-w-0 flex-col gap-[12px] rounded-[14px] border bg-white/[0.03] p-[16px] text-left ${s?"border-[#3B8DFF]/55":"border-white/[0.08]"}`;return n?(0,t.jsx)("button",{type:"button",...d,onClick:n,"aria-expanded":s,"aria-controls":l,className:`${c} transition-colors hover:border-white/[0.18]`,children:p}):(0,t.jsx)("div",{className:c,children:p})},"tileLabel",0,r])},958770,e=>{"use strict";var t=e.i(894860);let r={name:"message-square",size:24,node:[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",key:"18887p"}]]};r.node;let i=(0,t.default)(r);e.s(["MessageSquare",0,i],958770)},435860,e=>{"use strict";var t=e.i(894860);let r={name:"rotate-ccw-clock",size:24,node:[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M12 7v5l4 2",key:"1fdv2h"}]],aliases:["history"]};r.node;let i=(0,t.default)(r);e.s(["History",0,i],435860)},957340,e=>{"use strict";var t=e.i(647096);e.s(["LoaderCircle",()=>t.default])},644759,e=>{"use strict";var t=e.i(894860);let r={name:"hash",size:24,node:[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]]};r.node;let i=(0,t.default)(r);e.s(["Hash",0,i],644759)},149201,e=>{"use strict";var t=e.i(59189);e.s(["chosenTemplate",0,function(e){if(!e.templates||e.montage===t.NO_TEMPLATE)return null;let r=e.montage||e.templates.recommended;return e.templates.options.find(e=>e.id===r)??null},"matchPct",0,e=>Math.round(100*Math.min(1,Math.max(0,e)))])},88441,e=>{"use strict";var t=e.i(730624);e.s(["useOnScreen",0,function(){let e=(0,t.useRef)(null),[r,i]=(0,t.useState)(!1);return(0,t.useEffect)(()=>{let t=e.current;if(!t)return;let r=new IntersectionObserver(([e])=>i(e.isIntersecting),{rootMargin:"120px 0px"});return r.observe(t),()=>r.disconnect()},[]),[e,r]}])},488458,e=>{"use strict";var t=e.i(209165),r=e.i(423699);let i=e=>({..."faithful"===e.mode||"rewrite"===e.mode?{mode:e.mode}:{},...!0===e.noSpeech?{noSpeech:!0}:{}}),a={Hook:"hook",Relance:"relance",Étape:"etape",Preuve:"preuve",Question:"question",Résultat:"resultat",Produit:"produit",CTA:"cta"};async function o(e){let r=await Promise.all((function(e,t=12e3){let r=[],i="",a=e=>{i&&i.length+1+e.length>t&&(r.push(i),i=""),i=i?`${i}
${e}`:e};for(let r of e.split("\n"))if(r.length<=t)a(r);else for(let e=r;e;){let r=e.length<=t?e.length:e.lastIndexOf(" ",t)>0?e.lastIndexOf(" ",t):t;a(e.slice(0,r).trim()),e=e.slice(r).trim()}return i.trim()&&r.push(i),r})(e).map(e=>(0,t.apiSend)("POST","/studio/script/blocks",{text:e}).catch(()=>null)));return r.length&&r.every(e=>e?.blocks?.length)?r.flatMap(e=>e.blocks).map((e,t)=>{let r=0===t?"hook":a[e.role]??"libre";return"hook"===r&&t>0?{role:"libre",nom:"Hook"===e.nom?"Bloc":e.nom,texte:e.texte}:{role:r,nom:e.nom,texte:e.texte}}):e.split(/\n+/).map(e=>e.trim()).filter(Boolean).map((e,t)=>({role:0===t?"hook":"etape",nom:0===t?"Hook":"Étape",texte:e}))}async function n(e,a){let n,s,l=function(e){if(e.blocks?.length)return{blocks:e.blocks,video:e.video??null,projectId:e.projectId??null,...i(e)};let t=e.scriptFeedback&&"object"==typeof e.scriptFeedback?e.scriptFeedback.studio:null;if(!t||1!==t.v||!Array.isArray(t.blocks)||!t.blocks.length)return null;let r=t.blocks.filter(e=>e&&"string"==typeof e.texte&&"string"==typeof e.role);return r.length?{blocks:r,video:t.video&&"string"==typeof t.video.id?t.video:null,projectId:"string"==typeof t.projectId?t.projectId:null,...i(t)}:null}(e),d=l?.video?.id??a.video?.id??e.sourceVideoId??null;if(!d)return null;let p=l?.video??a.video??null;p||(p=await (0,t.apiGet)(`/viral/videos/${d}`).then(e=>{let t;return{id:(t=e.video).id,url:t.url,platform:t.platform,thumbnail:t.thumbnail,creator:t.creator?.username??null,views:t.views??0,title:(t.hook||t.caption||"").slice(0,200)||null}},()=>({id:d,url:"",platform:"tiktok",thumbnail:null,creator:null,views:0,title:null})));let c=e.detailedScript?.trim()??"",x=(n=e=>e.split(/\n+/).map(e=>e.trim()).filter(Boolean).join("\n"),s=e.detailedScript?.trim()??"",!!l&&!!s&&![l.blocks.map(e=>e.texteAvecProduit??e.texte),l.blocks.map(e=>e.texte)].some(e=>n(e.join("\n"))===n(s))),u=l&&!x?l.blocks:await o(c||e.description);return u.length?{type:"video",at:Date.now(),projectId:l?.projectId??(0,r.newProjectId)(),video:p,product:a.product,lang:a.lang,adaptation:{title:e.title,why:e.description,blocks:u,...l&&!x?{...l.mode?{mode:l.mode}:{},...l.noSpeech?{noSpeech:!0}:{}}:{}}}:null}e.s(["arrivalOf",0,n],488458)},380243,e=>{"use strict";var t=e.i(730624),r=e.i(142640),i=e.i(209165),a=e.i(968702),o=e.i(107471),n=e.i(466230),s=e.i(27883),l=e.i(839411),d=e.i(423699),p=e.i(488458);e.i(610168);var c=e.i(767717),x=e.i(330794);let u=x.CREDIT_PRICES.script_video_project,h=x.CREDIT_PRICES.video_lean,f=e=>({id:e.id,url:e.url,platform:e.platform,thumbnail:e.thumbnail,creator:e.creator?.username??null,views:e.views,title:(e.hook||e.caption||"").slice(0,200)||null,median:e.creator?.medianViews??null});e.s(["ADAPT_VIDEO_COST",0,u,"LEAN_COST",0,h,"useAdaptInStudio",0,function(e,x="paywall",h){let b=(0,r.useRouter)(),m=(0,l.useOpenAuth)("adaptInStudio"),{lang:g}=(0,a.useLang)(),{session:v}=(0,o.useSession)(),w=v?.user.id??null,[y,k]=(0,t.useState)(void 0),[z,j]=(0,t.useState)(!1),[S,_]=(0,t.useState)(!1),[N,T]=(0,t.useState)(null),C=(0,t.useRef)(null),A=(0,t.useCallback)(e=>(0,i.apiGet)(`/viral/videos/${e}/adapt`,{},void 0,{quiet:!0}).then(e=>e.idea??null,e=>(0,i.subscriptionRefused)(e)?"paywall":"unknown"),[]);(0,t.useEffect)(()=>{if(T(null),k(void 0),C.current=null,!w)return k(null);let t=!0,r=A(e.id);return C.current={video:e.id,run:r},r.then(e=>t&&k("paywall"===e?"unknown":e)),()=>{t=!1}},[e.id,w,A]);let P=void 0===y||"unknown"===y?!!e.isAdapted:!!y,E=(0,t.useCallback)(async(t=!1)=>{if(!z){if(!w)return(0,c.track)("web_video_sheet","adaptDone",{result:"signIn",need:null,balance:null}),m();T(null),j(!0),_(t);try{if(await (0,s.refreshCredits)().catch(()=>{}),(0,s.creditsRefused)())return(0,c.track)("web_video_sheet","adaptDone",{result:"paywall",need:null,balance:null}),(0,s.openPricing)(x);let r=await (0,n.readAccount)(w,"me",!0).then(e=>e,()=>(0,n.settingsFor)(w).me??null),i=r?.productSheet,a=i?.mode!=="growth"&&i?.name?.trim()||r?.niche||null,o=f(e),l=t?null:C.current?.video===e.id?await C.current.run:"unknown";if(("unknown"===l||"paywall"===l)&&(l=await A(e.id)),"paywall"===l)return(0,c.track)("web_video_sheet","adaptDone",{result:"paywall",need:null,balance:null}),(0,s.openPricing)(x);if(t||k(l),"unknown"===l)return(0,c.track)("web_video_sheet","adaptFailed",{error:"lookupFailed"}),T("failed"),"failed";let m=l;if(m){let e=await (0,p.arrivalOf)(m,{video:o,product:a,lang:g});if(!e)return(0,c.track)("web_video_sheet","adaptFailed",{error:"reopenFailed"}),T("failed"),"failed";return(0,c.track)("web_video_sheet","adaptDone",{result:"reopened",need:null,balance:null}),(0,d.handOff)("video"===e.type?{...e,...h?.()}:e),(0,d.goToStudio)(b)}let v=(0,s.creditBalance)()??("number"==typeof r?.credits?r.credits:null);if(null!==v&&v<u)return(0,c.track)("web_video_sheet","adaptDone",{result:"topUp",need:u-v,balance:v}),(0,s.openCredits)({need:u-v,trigger:"videoSheet"});(0,c.track)("web_video_sheet","adaptDone",{result:"newProject",need:null,balance:v}),(0,d.handOff)({...h?.(),type:"video",at:Date.now(),projectId:(0,d.newProjectId)(),fresh:!0,video:o,product:a,lang:g}),(0,d.goToStudio)(b)}catch{return(0,c.track)("web_video_sheet","adaptFailed",{error:"failed"}),T("failed"),"failed"}finally{j(!1),_(!1)}}},[z,w,m,g,e,A,b,x,h]);return{adapted:P,busy:z,freshBusy:S,notice:N,go:E,signedIn:!!w}},"videoSource",0,f])},434454,e=>{"use strict";var t=e.i(372169),r=e.i(730624),i=e.i(151284),a=e.i(610942),o=e.i(765486),n=e.i(713123),s=e.i(516806),l=e.i(781015),d=e.i(968702);e.i(610168);var p=e.i(767717),c=e.i(867819),x=e.i(774779),u=e.i(699967);let h=e=>Math.round(10*e)/10,f="relative aspect-[9/16] overflow-hidden rounded-[16px] bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_30px_70px_-30px_rgba(0,0,0,0.9)]",b=["pointer-events-none absolute inset-x-0 top-0 h-[80px] bg-gradient-to-b from-black/50 to-transparent","pointer-events-none absolute inset-x-0 bottom-0 h-[90px] bg-gradient-to-t from-black/60 to-transparent"],m="pointer-events-auto grid size-[48px] place-items-center rounded-full border border-white/[0.1] bg-[#1A1F2A]/70 text-white/85 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-[10px] transition-[background-color,color,transform,opacity] duration-150 hover:bg-[#232834]/85 hover:text-white active:scale-[0.96] disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-1)]";e.s(["NeighbourArrows",0,function({prev:e,next:r}){let i=(0,d.useT)();return(0,t.jsxs)("div",{className:"pointer-events-none absolute inset-x-[20px] top-1/2 z-[1] flex -translate-y-1/2 justify-between max-md:hidden",children:[(0,t.jsx)("button",{type:"button",...(0,p.tk)("web_video_sheet","neighbourClicked",{direction:"previous"}),disabled:!e,onClick:()=>e?.(),"aria-label":i("Previous video"),title:i("Previous video"),className:m,children:(0,t.jsx)(a.ChevronLeft,{className:"size-[22px]",strokeWidth:2})}),(0,t.jsx)("button",{type:"button",...(0,p.tk)("web_video_sheet","neighbourClicked",{direction:"next"}),disabled:!r,onClick:()=>r?.(),"aria-label":i("Next video"),title:i("Next video"),className:m,children:(0,t.jsx)(o.ChevronRight,{className:"size-[22px]",strokeWidth:2})})]})},"PLAYER_FRAME",0,f,"PLAYER_SHADES",0,b,"SheetPlayer",0,function({src:e,ask:a,cover:o,videoRef:m,onFailed:g,trackKey:v,original:w}){let y=(0,d.useT)(),[k,z]=(0,r.useState)(!1),[j,S]=(0,r.useState)(!1),[_,N]=(0,r.useState)(!0),[T,C]=(0,r.useState)(0),[A,P]=(0,r.useState)(0),E=(0,r.useRef)(null),M=(0,r.useRef)(!1),R=(0,r.useRef)(null);(0,r.useEffect)(()=>{z(!1),S(!1),C(0),P(0)},[e]);let I=!!e&&!k,D=void 0===e&&!!a;(0,r.useEffect)(()=>{null===e&&(0,p.trackOnce)(`${v}:media`,"web_video_sheet","mediaShown",{status:"coverOnly"})},[e,v]),(0,r.useEffect)(()=>{if(!j)return;let e=0,t=()=>{let r=m.current;r&&!E.current&&C(r.currentTime),e=requestAnimationFrame(t)};return e=requestAnimationFrame(t),()=>cancelAnimationFrame(e)},[j,m]);let O=e=>{let t=R.current.getBoundingClientRect();return Math.max(0,Math.min(A-.05,(e-t.left)/t.width*A))},F=e=>{let t=m.current;t&&A&&(t.currentTime=O(e),C(t.currentTime))};return(0,t.jsx)("div",{className:"relative flex h-full flex-col items-center max-md:bg-black",children:(0,t.jsx)("div",{className:"flex min-h-0 w-full flex-1 items-center justify-center [container-type:size]",children:(0,t.jsxs)("div",{className:`group ${f}`,style:{width:"min(100cqw, calc(100cqh * 9 / 16))"},children:[I?(0,t.jsx)("video",{ref:m,src:e,poster:o??void 0,muted:_,playsInline:!0,loop:!0,preload:"auto",onPlay:()=>S(!0),onPause:e=>{S(!1),C(e.currentTarget.currentTime)},onTimeUpdate:e=>!E.current&&C(e.currentTarget.currentTime),onLoadedMetadata:e=>{(0,p.trackOnce)(`${v}:media`,"web_video_sheet","mediaShown",{status:"playable"}),P(e.currentTarget.duration||0),M.current&&e.currentTarget.play().catch(()=>{}),M.current=!1},onError:()=>{(0,p.trackOnce)(`${v}:media`,"web_video_sheet","mediaShown",{status:"failed"}),z(!0),g()},className:"block size-full object-cover"}):o?(0,t.jsx)(u.CdnCover,{src:o,lazy:!1,className:"block"}):null,void 0===e&&!D&&(0,t.jsx)("span",{className:"absolute inset-0 animate-pulse bg-white/[0.04]"}),b.map(e=>(0,t.jsx)("span",{"aria-hidden":!0,className:e},e)),(I||D)&&(0,t.jsx)("button",{type:"button",...p.tk.manual("web_video_sheet","playToggled"),onClick:()=>{if(D)return(0,p.track)("web_video_sheet","playToggled",{on:!0,via:"video",atSec:0}),M.current=!0,a();let e=m.current;e&&I&&((0,p.track)("web_video_sheet","playToggled",{on:e.paused,via:"video",atSec:h(e.currentTime)}),e.paused?e.play().catch(()=>{}):e.pause())},"aria-label":y(j?"Pause":"Play"),className:"absolute inset-0 z-[1] cursor-pointer rounded-[16px] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[var(--accent-1)]"}),w&&(0,t.jsx)(c.PlatformLink,{url:w.url,platform:w.platform,className:"absolute top-[12px] left-[12px] z-[3]",...(0,p.tk)("web_video_sheet","originalPostClicked",{url:w.url,where:"player"})}),I&&(0,t.jsx)("button",{type:"button",...(0,p.tk)("web_video_sheet","soundToggled",{on:_}),onClick:()=>N(e=>!e),"aria-label":y(_?"Sound off":"Sound"),title:y(_?"Sound off":"Sound"),className:"absolute top-[12px] right-[12px] z-[3] grid size-[32px] place-items-center rounded-[9px] bg-black/50 after:absolute after:-inset-[6px] after:content-[''] backdrop-blur-[6px] transition-colors hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-1)]",children:_?(0,t.jsx)(l.VolumeX,{className:"size-[16px]"}):(0,t.jsx)(s.Volume2,{className:"size-[16px]"})}),(I&&!j||D)&&(0,t.jsx)("span",{"aria-hidden":!0,className:"pointer-events-none absolute top-1/2 left-1/2 z-[2] grid size-[56px] -translate-1/2 place-items-center rounded-full border border-white/25 bg-black/45 backdrop-blur-[8px] transition-transform group-hover:scale-105",children:(0,t.jsx)(n.Play,{className:"ml-[3px] size-[22px] fill-white",strokeWidth:0})}),!I&&void 0!==e&&(0,t.jsxs)("div",{className:"absolute inset-x-[12px] bottom-[12px] z-[3] flex flex-col items-center gap-[8px] text-center",children:[(0,t.jsx)("span",{className:"text-[13px] font-semibold text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]",children:y("Can't play this video here.")}),w&&(0,t.jsxs)("a",{href:w.url,target:"_blank",rel:"noreferrer",...(0,p.tk)("web_video_sheet","originalPostClicked",{url:w.url,where:"player"}),className:"inline-flex h-[34px] items-center gap-[6px] rounded-[10px] bg-black/55 max-md:h-[44px] max-md:px-[16px] px-[12px] text-[13px] font-semibold text-white backdrop-blur-[6px] transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-1)]",children:[y("Open on {platform}",{platform:"tiktok"===w.platform?"TikTok":"Instagram"}),(0,t.jsx)(i.ArrowUpRight,{className:"size-[14px]"})]})]}),I&&A>0&&(0,t.jsxs)("div",{className:"absolute inset-x-[12px] bottom-[10px] z-[3]",children:[(0,t.jsxs)("span",{className:"mb-[6px] block text-[12px] font-semibold text-white/85 tabular-nums [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]",children:[(0,x.mmss)(T)," / ",(0,x.mmss)(A)]}),(0,t.jsx)("div",{ref:R,"data-rail":!0,role:"slider","aria-label":y("Position in the video"),"aria-valuemin":0,"aria-valuemax":Math.round(A),"aria-valuenow":Math.round(T),tabIndex:0,...p.tk.manual("web_video_sheet","playerScrubbed"),onKeyDown:e=>{let t=m.current;if(!t||"ArrowLeft"!==e.key&&"ArrowRight"!==e.key)return;e.preventDefault(),e.stopPropagation();let r=t.currentTime;t.currentTime=Math.max(0,Math.min(A-.05,r+("ArrowRight"===e.key?2:-2))),C(t.currentTime),(0,p.track)("web_video_sheet","playerScrubbed",{fromSec:h(r),toSec:h(t.currentTime)})},onPointerDown:e=>{if(!(e.button>0)){e.preventDefault(),E.current={from:T};try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}F(e.clientX)}},onPointerMove:e=>E.current&&F(e.clientX),onPointerUp:e=>{let t=E.current;E.current=null,t&&(0,p.track)("web_video_sheet","playerScrubbed",{fromSec:h(t.from),toSec:h(O(e.clientX))})},onPointerCancel:()=>E.current=null,className:"group/rail relative flex h-[16px] cursor-pointer max-md:h-[28px] touch-none items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-1)]",children:(0,t.jsx)("span",{className:"relative block h-[3px] w-full overflow-hidden rounded-full bg-white/25 transition-[height] group-hover/rail:h-[5px]",children:(0,t.jsx)("i",{className:"absolute inset-y-0 left-0 block bg-white",style:{width:`${T/A*100}%`}})})})]})]})})})}])},118925,e=>{"use strict";let t=`
.srl{--k:var(--color-canvas);--hl:rgba(255,255,255,.08);--hl2:rgba(255,255,255,.12);--tx:#EDEDEE;--mut:rgba(255,255,255,.6);--dim:rgba(255,255,255,.4);--ok:#34D399;
  container:srl/inline-size;font-variant-numeric:tabular-nums;color:var(--tx)}
.srl .lbl{font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#828282}
.srl [data-copied]{color:var(--ok)!important;border-color:rgba(52,211,153,.45)!important}

/* the buttons: the secondary ones black with a hairline, the primary one the brand's */
.srl .sbtn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 16px;border-radius:11px;background:var(--k);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.82);font-size:13.5px;font-weight:600;white-space:nowrap;transition:background .15s,color .15s,border-color .15s}
.srl .sbtn:hover{color:#fff;border-color:rgba(255,255,255,.24)}
.srl .sbtn svg{width:16px;height:16px;flex:none}
.srl .go{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:40px;padding:0 16px;border-radius:11px;font-size:14px;font-weight:600;color:#fff;white-space:nowrap}
.srl .go svg{width:16px;height:16px;flex:none}

/* the step's frame: the height of the screen, its content scrolls inside, its foot pinned */
.srl.rwrap{height:100%;min-height:0;display:flex;flex-direction:column}
/* the reference's panel, as the Resolviailote panel (same top, same bottom, 16 px radius, #1f2022 edge),
   its edge drawn inside its box (an outline) so the foot reaches the frame's very bottom */
.srl .rframe{position:relative;flex:1 1 0;min-height:0;display:flex;flex-direction:column;outline:1px solid #1f2022;outline-offset:-1px;border-radius:16px;background:var(--k);overflow:hidden;transition:outline-color .2s}
.srl .rscroll{flex:1 1 auto;min-height:0;overflow-x:hidden;overflow-y:auto;padding:28px 28px 32px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent}
.srl .rfoot{flex:none;display:flex;align-items:center;gap:10px;min-height:64px;padding:12px;border-top:1px solid #1f2022;background:var(--k)}
.srl .rfoot .note{color:#828282;font-size:13px;padding-left:8px;white-space:nowrap}

/* the copy's scan, between the Script Studio and the R\xe9alisation */
.scanov{position:fixed;inset:0;z-index:95;background:rgba(14,15,16,.96);display:grid;place-items:center;overflow:hidden;animation:srl-fade .25s ease-out both}
.scanbox{display:grid;grid-template-columns:auto 340px;gap:40px;align-items:center}
.scanpg{position:relative;overflow:hidden;border-radius:14px;outline:1px solid rgba(255,255,255,.14);background:#FBFBF9}
.scanin{position:absolute;left:0;top:0;width:680px;transform-origin:0 0}
.scanpg .beam{position:absolute;left:0;right:0;height:2px;top:0;z-index:3;pointer-events:none;background:rgba(17,18,20,.55);animation:srl-beam 1.8s ease-in-out forwards}
@keyframes srl-beam{from{top:0}to{top:100%}}
.found{display:flex;flex-direction:column;gap:10px;min-height:120px}
.found>div{display:flex;align-items:center;gap:14px;padding:13px 16px;border-radius:13px;background:var(--k);border:1px solid var(--hl2);opacity:0;transform:translateX(-14px);animation:srl-pop .4s cubic-bezier(.2,1,.4,1) forwards}
.found>div svg{flex:none;color:var(--ok)}
.found b{display:block;font-size:15px;font-weight:600;color:var(--tx)}
.found small{display:block;color:var(--mut);font-size:12.5px;line-height:1.4}
@keyframes srl-pop{to{opacity:1;transform:none}}
@keyframes srl-fade{from{opacity:0}}
@media (max-width:760px){
  .scanbox{grid-template-columns:minmax(0,1fr);gap:16px;justify-items:center;padding:0 20px;width:100%}
  .found{gap:8px;width:100%;max-width:420px;min-height:0}
  .found>div{padding:9px 12px}
}

/* 2. R\xe9alisation: the kicker, the title, the chips on the right; the scene bars, a scene's card */
.srl .rhead{display:flex;align-items:flex-end;gap:14px 24px;margin:0 0 24px;flex-wrap:wrap}
.srl .rhead h1{font-family:var(--font-display);font-size:34px;line-height:1.12;letter-spacing:-.8px;margin:10px 0 0;font-weight:600;color:var(--tx)}
.srl .chips{display:flex;gap:8px;margin-left:auto;flex-wrap:wrap}
.srl .chip{display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 12px;border-radius:9px;border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.7);font-size:13px;white-space:nowrap}
.srl .chip.ok{color:var(--ok)}
.srl .n{width:28px;height:28px;border-radius:50%;background:#fff;color:#0e0f10;font-size:13px;font-weight:700;display:grid;place-items:center;flex:none}
.srl .tfr{position:relative;aspect-ratio:9/16;border-radius:11px;overflow:hidden;background:var(--k)}
.srl .tfr img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
.srl .tfr svg{position:absolute;inset:0;width:100%;height:100%}
.srl .tfr .z{position:absolute;border:1.5px solid #fff;border-radius:10px}
.srl .tfr .n{position:absolute;left:10px;top:10px;z-index:2;width:26px;height:26px;font-size:12.5px}
.srl .tfr .pill{position:absolute;z-index:2;font-size:11px;line-height:1;color:#fff;background:rgba(14,15,16,.78);border:1px solid rgba(255,255,255,.14);border-radius:8px;padding:6px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.srl .tfr .src{left:10px;bottom:10px;max-width:calc(100% - 20px)}
.srl .tfr .vtag{right:8px;top:10px;max-width:calc(100% - 50px);font-weight:600}
/* one bar per scene (measured: 5 px, 7.4 → 8 px apart), the current one blue and filling as its take is read */
.srl .sbars{display:flex;gap:8px;margin:-6px 0 0}
.srl .sbars>button{flex:1 1 0;min-width:0;padding:6px 0;cursor:pointer}
.srl .sbars span{position:relative;display:block;height:5px;border-radius:3px;overflow:hidden;background:rgba(255,255,255,.1);transition:background .3s}
.srl .sbars i{position:absolute;inset:0 auto 0 0;border-radius:3px;background:var(--accent-1);transition:width .25s linear}
.srl .sbars [data-bar=done] span{background:rgba(255,255,255,.6)}
.srl .sbars [data-bar=done] i,.srl .sbars [data-bar=todo] i{display:none}
.srl .sbars [data-bar=current] span{background:rgb(var(--accent-1-rgb)/.3)}
.srl .sbars>button:hover span{filter:brightness(1.25)}
.srl .scount{margin:2px 0 20px;font-size:14px;color:rgba(255,255,255,.55)}
/* the scene's card: its visual (192 \xd7 341), 40 px, its text and its take (380 px at most), centred */
.srl .scn{display:grid;grid-template-columns:192px minmax(0,380px);justify-content:center;column-gap:40px;align-items:start;padding:16px 24px;border:1px solid #1f2022;border-radius:16px;background:#131416;animation:srl-rise .45s cubic-bezier(.2,.8,.2,1) both}
.srl .scn.noimg{grid-template-columns:minmax(0,560px)}
.srl .svis{border-radius:14px;background:#0e0f10}
.srl .svis video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.srl .stx{min-width:0;padding-top:8px}
.srl .stx h3{margin:0;font-family:var(--font-display);font-size:20px;line-height:1.25;font-weight:600;letter-spacing:-.3px;color:var(--tx);display:flex;align-items:center;gap:10px}
.srl .stx>p{margin:10px 0 0;color:var(--mut);font-size:15px;line-height:1.45}
.srl .squote{display:flex;gap:14px;margin:12px 0 0;padding:14px 18px 14px 14px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:#17181a;color:rgba(255,255,255,.9);font-size:15.5px;line-height:1.4;font-weight:500}
.srl .squote svg{flex:none;width:18px;height:18px;margin-top:3px;color:rgba(255,255,255,.55)}
.srl .squote span{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
/* the take's drop zone: dashed, the brand blue only while a video is held over it */
.srl .sdrop{margin-top:12px;min-height:165px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:10px;border:1.5px dashed rgba(255,255,255,.2);border-radius:14px;background:#111214;text-align:center;cursor:pointer;transition:border-color .2s,background .2s}
.srl .sdrop:hover,.srl .sdrop[data-over]{border-color:var(--accent-1)}
.srl .sdrop[data-over]{background:rgb(var(--accent-1-rgb)/.06)}
.srl .sdrop>*:not(button){pointer-events:none}
.srl .sdi{width:40px;height:40px;margin-bottom:6px;border-radius:11px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.1);background:#17181a;color:rgba(255,255,255,.85)}
.srl .sdi svg{width:18px;height:18px}
.srl .sdrop b{font-family:var(--font-display);font-size:18px;font-weight:600;color:var(--tx)}
.srl .sdrop small{font-size:13px;color:rgba(255,255,255,.5)}
.srl .sdrop .sbtn{margin-top:8px;height:34px;padding:0 24px}
/* the take in place: its clip, its name, its reading, replace / remove (a video dropped on it replaces it) */
.srl .stake{margin-top:12px;display:flex;align-items:center;gap:14px;padding:10px 12px 10px 10px;border:1px solid rgba(255,255,255,.1);border-radius:14px;background:#111214;transition:border-color .2s,background .2s}
.srl .stake[data-over]{border-color:var(--accent-1);background:rgb(var(--accent-1-rgb)/.06)}
.srl .sth{position:relative;flex:none;width:54px;aspect-ratio:9/16;border-radius:8px;overflow:hidden;background:#0e0f10;border:1px solid rgba(255,255,255,.1)}
.srl .sth video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.srl .stake b{display:block;font-size:14.5px;font-weight:600;color:var(--tx)}
.srl .stake small{display:block;margin-top:2px;font-size:12.5px;color:rgba(255,255,255,.5);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.srl .sst{display:flex;gap:8px;margin-top:8px;font-size:12px;color:rgba(255,255,255,.6)}
.srl .spb{display:block;position:relative;height:2px;margin-top:6px;border-radius:2px;overflow:hidden;background:rgba(255,255,255,.12)}
.srl .spb i{position:absolute;inset:0 auto 0 0;background:#fff;transition:width .2s linear}
.srl .sok{display:inline-flex;align-items:center;gap:4px;margin-top:8px;padding:2px 8px;border-radius:99px;background:rgba(52,211,153,.12);color:var(--ok);font-size:11.5px;font-weight:500}
.srl .sok svg{width:11px;height:11px}
.srl .sacts{display:flex;gap:8px;flex:none}
.srl .sacts .sbtn{width:36px;height:36px;padding:0}
.srl .sacts .sx:hover{color:#ff4d6d;border-color:rgba(255,77,109,.6)}
.srl .skel{border:1px solid var(--hl);border-radius:10px;animation:srl-pulse 1.4s ease-in-out infinite}
@keyframes srl-pulse{50%{opacity:.4}}
@keyframes srl-rise{from{opacity:0;transform:translateY(8px)}}
@container srl (max-width:760px){
  .srl .scn{grid-template-columns:minmax(0,1fr);row-gap:18px;padding:16px}
  .srl .scn .svis{width:min(192px,56%);justify-self:center}
  .srl .stx{padding-top:0}
}
@container srl (max-width:560px){
  .srl .rscroll{padding:20px 16px 24px}
  .srl .tfr .pill{font-size:10px;padding:4px 6px}
  .srl .tfr .vtag{right:6px;top:6px;max-width:calc(100% - 12px)}
  .srl .tfr .n{width:22px;height:22px;font-size:11px;left:6px;top:auto;bottom:30px}
  .srl .tfr .src{left:6px;bottom:6px;max-width:calc(100% - 12px)}
  .srl .rhead{margin-bottom:18px}
  .srl .scn .tfr .n{top:10px;bottom:auto;left:10px}
  .srl .squote{font-size:15px}
  .srl .sdrop{min-height:160px}
  .srl .rhead h1{font-size:26px}
  .srl .chips{margin-left:0}
  .srl .tfr .vtag{white-space:normal;line-height:1.2}
  .srl .rfoot{flex-wrap:wrap}
  .srl .rfoot>.flex-1,.srl .rfoot .note{display:none}
  .srl .rfoot .sbtn{flex:1 1 0}
  .srl .rfoot .go{flex:1 1 100%}
}

/* 3. Rushes: the drop zone, a phone drawn in hairlines behind the call to drop */
.srl .drop{align-items:center;justify-content:center;text-align:center;padding:32px 20px}
/* before the first rush the frame says it takes files: a dashed edge, discreet, the brand's under the pointer and
   while files are held over it (the edge breathing then); the tile lifts a little under the pointer */
.srl .rframe.drop{outline:none;border:1.5px dashed rgba(255,255,255,.22);transition:border-color .2s,background-color .2s}
.srl .rframe.drop[data-drop]:hover,.srl .rframe.drop[data-over]{border-color:var(--accent-1);background-color:rgb(var(--accent-1-rgb)/.03)}
.srl .rframe.drop[data-drop]:hover:not([data-over]) .dropic{transform:translateY(-3px);border-color:rgb(var(--accent-1-rgb)/.5);color:#fff}
@keyframes srl-dash{50%{border-color:rgb(var(--accent-1-rgb)/.5)}}
.srl .rframe.drop[data-over]{animation:srl-dash 1.6s ease-in-out infinite}
/* a drag over the frame (the only moment the step lights up): a light running round its edge, a
   glow from the middle, its four corners closing in. The same on the tiles' frame */
@property --srl-a{syntax:'<angle>';inherits:false;initial-value:0deg}
@keyframes srl-spin{to{--srl-a:360deg}}
@keyframes srl-breathe{50%{opacity:.55}}
.srl .dzl{position:absolute;inset:0;z-index:5;pointer-events:none;border-radius:16px;opacity:0;transition:opacity .22s ease-out}
.srl .dzl[data-on]{opacity:1}
.srl .dz-ring{position:absolute;inset:0;border-radius:16px;padding:1.5px;background:conic-gradient(from var(--srl-a),transparent 0deg,var(--accent-1) 50deg,#9cc9ff 80deg,transparent 140deg,transparent 180deg,var(--accent-2) 230deg,#9cc9ff 260deg,transparent 320deg);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:srl-spin 2.2s linear infinite}
.srl .dz-glow{position:absolute;inset:0;border-radius:16px;background:radial-gradient(55% 50% at 50% 48%,rgb(var(--accent-1-rgb)/.16),transparent 72%);box-shadow:inset 0 0 0 1px rgb(var(--accent-1-rgb)/.25),inset 0 0 90px rgb(var(--accent-1-rgb)/.16);animation:srl-breathe 1.6s ease-in-out infinite}
.srl .dzl>b{position:absolute;width:30px;height:30px;border:0 solid #9cc9ff;filter:drop-shadow(0 0 6px rgb(var(--accent-1-rgb)/.9));transition:inset .35s cubic-bezier(.2,1.3,.4,1)}
.srl .dzl>b:nth-of-type(1){left:34px;top:34px;border-left-width:2px;border-top-width:2px;border-top-left-radius:8px}
.srl .dzl>b:nth-of-type(2){right:34px;top:34px;border-right-width:2px;border-top-width:2px;border-top-right-radius:8px}
.srl .dzl>b:nth-of-type(3){left:34px;bottom:34px;border-left-width:2px;border-bottom-width:2px;border-bottom-left-radius:8px}
.srl .dzl>b:nth-of-type(4){right:34px;bottom:34px;border-right-width:2px;border-bottom-width:2px;border-bottom-right-radius:8px}
.srl .dzl[data-on]>b:nth-of-type(1){left:14px;top:14px}
.srl .dzl[data-on]>b:nth-of-type(2){right:14px;top:14px}
.srl .dzl[data-on]>b:nth-of-type(3){left:14px;bottom:14px}
.srl .dzl[data-on]>b:nth-of-type(4){right:14px;bottom:14px}
.srl .drop *{pointer-events:none}
.srl .drop button{pointer-events:auto}
/* the tile, and the files it becomes during a drag: fanned cards and their count */
.srl .dz-icon{position:relative;width:64px;height:64px}
.srl .drop[data-over] .dropic{transform:scale(.6);opacity:0}
.srl .dz-cards{position:absolute;left:50%;bottom:-6px;width:0;height:0}
.srl .dz-cards>i{position:absolute;left:-23px;bottom:0;width:46px;height:80px;border-radius:10px;display:grid;place-items:center;color:#cfe3ff;background:linear-gradient(160deg,#1d2c4d,#0d1424 70%);border:1px solid rgb(var(--accent-1-rgb)/.65);box-shadow:0 14px 30px rgba(0,0,0,.55),0 0 22px rgb(var(--accent-1-rgb)/.35);opacity:0;transform-origin:50% 120%;transform:translateY(16px) scale(.6);transition:transform .45s cubic-bezier(.2,1.3,.4,1),opacity .25s;transition-delay:calc(var(--i) * 45ms)}
.srl .dz-cards>i svg{width:18px;height:18px}
.srl .drop[data-over] .dz-cards>i{opacity:1;transform:translateX(calc((var(--i) - (var(--n) - 1) / 2) * 18px)) rotate(calc((var(--i) - (var(--n) - 1) / 2) * 11deg)) translateY(calc(var(--bob, 0px)))}
.srl .drop[data-over] .dz-cards{animation:srl-bob 1.4s ease-in-out .45s infinite}
@keyframes srl-bob{50%{transform:translateY(-6px)}}
.srl .dz-cards>em{position:absolute;left:30px;bottom:62px;min-width:26px;height:26px;padding:0 7px;border-radius:13px;display:grid;place-items:center;font-style:normal;font-size:13px;font-weight:700;color:#fff;background:linear-gradient(180deg,var(--accent-1),var(--accent-2));box-shadow:0 0 0 2px var(--k),0 0 16px rgb(var(--accent-1-rgb)/.7);opacity:0;transform:scale(.4);transition:transform .4s cubic-bezier(.2,1.5,.4,1) .15s,opacity .2s .15s}
.srl .drop[data-over] .dz-cards>em{opacity:1;transform:none}
@keyframes srl-title{from{opacity:0;transform:translateY(6px)}}
.srl .dz-title{animation:srl-title .28s cubic-bezier(.2,.9,.3,1) both}
.srl .drop[data-over] .dz-title{color:#fff}
/* let go: a ring spreading from where the files were dropped, the tiles flying in from there */
@keyframes srl-burst{0%{transform:scale(.2);opacity:1}100%{transform:scale(16);opacity:0;border-width:.4px}}
.srl .dz-burst{position:absolute;z-index:6;width:28px;height:28px;margin:-14px 0 0 -14px;border-radius:50%;border:2px solid #9cc9ff;box-shadow:0 0 18px rgb(var(--accent-1-rgb)/.8),inset 0 0 12px rgb(var(--accent-1-rgb)/.6);pointer-events:none;animation:srl-burst .85s cubic-bezier(.2,.7,.3,1) both}
@keyframes srl-fly{0%{opacity:0;transform:translate(var(--fx),var(--fy)) scale(.32) rotate(var(--fr));filter:blur(6px)}55%{opacity:1;filter:blur(0)}80%{transform:scale(1.03)}100%{transform:none}}
.srl .rt-fly{animation:srl-fly .75s cubic-bezier(.2,.9,.3,1) var(--fd,0ms) both}
@keyframes srl-land{0%{box-shadow:0 0 0 1.5px #9cc9ff,0 0 26px rgb(var(--accent-1-rgb)/.7)}100%{box-shadow:0 0 0 0 transparent,0 0 0 transparent}}
.srl .dropc{position:relative;display:flex;flex-direction:column;align-items:center;max-width:460px}
.srl .dropic{width:64px;height:64px;border-radius:18px;background:var(--k);border:1px solid rgba(255,255,255,.12);display:grid;place-items:center;color:rgba(255,255,255,.88);transition:border-color .25s,transform .3s cubic-bezier(.2,1.2,.4,1),opacity .2s}
.srl .drop[data-over] .dropic{border-color:rgba(255,255,255,.4)}
.srl .drop h2{font-family:var(--font-display);font-size:38px;line-height:1.1;font-weight:600;letter-spacing:-1px;margin:28px 0 12px;color:var(--tx)}
.srl .drop p{color:var(--mut);margin:0 0 28px;font-size:15.5px;line-height:1.55}
.srl .drop p .ln{display:block}
.srl .drop .go{height:46px;padding:0 22px;border-radius:12px;font-size:15px}
@container srl (max-width:560px){
  .srl .drop h2{font-size:30px;margin-top:22px}
  .srl .drop p{font-size:14px}
  .srl .dropc{max-width:250px}
  .srl .drop p .ln{display:inline}
  }

/* 3. Rushes, once there is one: the tiles, the options, the montage pinned at the bottom */
.srl .rsec{margin:32px 0 14px;font-family:var(--font-display);font-size:17px;font-weight:600;letter-spacing:-.2px;color:var(--tx)}
.srl .rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;align-content:start}
.srl .ogrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.srl .rfoot [aria-haspopup=listbox]{background:var(--k)!important;box-shadow:none!important;border-color:rgba(255,255,255,.1)!important}
.srl .rfoot [aria-haspopup=listbox][aria-expanded=true]{border-color:rgba(255,255,255,.3)!important}
@keyframes srl-tile{from{opacity:0;transform:translateY(10px)}}
.srl .rt-in{animation:srl-tile .45s cubic-bezier(.2,.9,.3,1) both}
/* a tile that just flew in lights up once (its own class, taken off when it ends: the read flash after it is .rt-done's) */
.srl .rt-land{animation:srl-land 1.1s ease-out var(--ld,0ms) both}
@keyframes srl-done{0%{border-color:rgba(255,255,255,.9)}100%{border-color:rgba(255,255,255,.09)}}
.srl .rt-done{animation:srl-done .9s ease-out both}
/* what was heard rises in over the clip once it is read */
@keyframes srl-said{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.srl .rt-said{animation:srl-said .5s .25s cubic-bezier(.2,.8,.2,1) both}
/* an option Resolviailote just changed: a hairline lit, then gone (no glow) */
@keyframes srl-edited{0%,100%{box-shadow:inset 0 0 0 1px rgba(255,255,255,0)}8%,70%{box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.85)}}
.srl .st-edited{animation-name:srl-edited}
@container srl (max-width:760px){
  .srl .ogrid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@container srl (max-width:560px){
  .srl .rgrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  .srl .rfoot [aria-haspopup=listbox]{flex:1 1 100%;width:100%!important}
}

/* the Montage on a desktop: the rushes take the height left over the options, their tiles sized by
   it, in one row that slides sideways when there are many; the options' pictures shrink on a short
   screen. When DA + options no longer fit (Manau, 13/10 assumed they did), the frame scrolls
   vertically. Too short a screen (under 600 px) already scrolled. */
@media (min-width:1024px) and (min-height:600px){
  .srl.rmont .rscroll{overflow-x:hidden;overflow-y:auto;display:flex;flex-direction:column;padding-top:22px;padding-bottom:22px;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.14) transparent}
  .srl.rmont .rscroll>:not(.rgrid){flex:none}
  .srl.rmont .rhead{margin-bottom:14px}
  .srl.rmont .rgrid{flex:1 1 0;min-height:150px;container-type:size;display:flex;gap:14px;overflow-x:auto;overflow-y:hidden;align-items:flex-start;scrollbar-width:thin}
  .srl.rmont .rgrid>*{flex:none;width:calc((100cqh - 56px) * .8)}
  .srl.rmont .rgrid>[data-add]{height:calc(100cqh - 56px)}
  .srl.rmont .rsec{margin:18px 0 12px}
  .srl.rmont .omedia{height:clamp(56px,calc(100svh - 700px),104px)}
}

/* below the desktop layout (the column isn't the screen's height): the frame takes its content's
   height, the page scrolls, and the foot stays at the bottom of the screen while the frame is on it */
@media (max-width:1023px){
  .srl .rframe{flex:none;min-height:0;overflow:clip}
  .srl .rscroll{overflow:visible}
  .srl .rfoot{position:sticky;bottom:0;z-index:6}
  .srl .drop{min-height:min(640px,calc(100dvh - 150px))}
}

/* the prompter: a phone in the middle, the script rolling up past a reading band (two hairlines) */
.pmodal{position:fixed;inset:0;z-index:85;background:rgba(14,15,16,.97);display:grid;place-items:center;animation:srl-fade .25s ease-out both}
.pmodal .px{position:absolute;right:30px;top:30px;display:flex;gap:10px}
.pmodal .phone{position:relative;width:min(340px,calc(100vw - 40px));height:min(640px,calc(100dvh - 130px));border-radius:40px;border:1px solid rgba(255,255,255,.14);background:var(--color-canvas);overflow:hidden;cursor:pointer}
.pmodal .roll{position:absolute;left:24px;right:24px;top:0;color:#fff;font-size:22px;font-weight:600;line-height:1.6;will-change:transform}
.pmodal .roll p{margin:0 0 1.6em}
.pmodal .roll p .who{display:block;font-size:.5em;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.2em}
.pmodal .band{position:absolute;left:0;right:0;top:44%;height:30px;border-top:1px solid rgba(255,255,255,.3);border-bottom:1px solid rgba(255,255,255,.3);pointer-events:none;z-index:2}
@media (max-width:640px){
  .pmodal .px{right:16px;top:16px}
  .pmodal{padding-top:50px}
}
@media (prefers-reduced-motion:reduce){
  .scanov,.found>div,.srl .scn,.pmodal,.srl .rt-in,.srl .rt-done,.srl .rt-said,.srl .rt-fly,.srl .rt-land{animation-duration:1ms!important;animation-delay:0s!important}
  /* no line running down the page (it would come back as a flash while the scan reads) */
  .scanpg .beam{display:none}
  .srl .skel{animation:none}
  /* a drag still lights the frame, nothing in it moves */
  .srl .dz-ring,.srl .dz-glow,.srl .drop[data-over] .dz-cards,.srl .dz-burst,.srl .dz-title,.srl .rframe.drop[data-over]{animation:none}
  .srl .dz-burst{display:none}
  .srl .dzl,.srl .dzl>b,.srl .dropic,.srl .dz-cards>i,.srl .dz-cards>em{transition:none}
  .srl .dz-ring{background:linear-gradient(135deg,var(--accent-1),#9cc9ff,var(--accent-2))}
}
`;e.s(["REAL_CSS",0,t])},621540,e=>{"use strict";var t=e.i(894860);let r={name:"redo-2",size:24,node:[["path",{d:"m15 14 5-5-5-5",key:"12vg1m"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",key:"6uklza"}]]};r.node;let i=(0,t.default)(r);e.s(["Redo2",0,i],621540)},223510,e=>{"use strict";var t=e.i(894860);let r={name:"file-text",size:24,node:[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]};r.node;let i=(0,t.default)(r);e.s(["FileText",0,i],223510)},648782,303604,e=>{"use strict";var t=e.i(730624),r=e.i(968702),i=e.i(463065);let a={en:["Script Studio","Shooting","Auto-Editing","Editing Studio"],fr:["Script Studio","Tournage","Montage","Editing Studio"],pt:["Script Studio","Gravação","Edição automática","Editing Studio"]},o={en:["Script","Filming","Auto-Editing","Editing Studio"],fr:["Script","Tournage","Montage","Editing Studio"],pt:["Roteiro","Gravação","Edição","Editing Studio"]},n=(e,t)=>e[(0,i.shownStep)(t)-1]??e[0],s=(e,t)=>n(o[e],t);e.s(["stepShortName",0,s,"useStepNames",0,function(){let{lang:e}=(0,r.useLang)();return{name:(0,t.useCallback)(t=>n(a[e],t),[e]),short:(0,t.useCallback)(t=>s(e,t),[e])}}],648782);var l=e.i(107471),d=e.i(890083);let p="gump:rush-thumb2:",c=Promise.resolve(),x=new Map;async function u(t){let r=await (0,l.currentSession)().then(e=>e?.user.id??"anon",()=>"anon"),i=`${r}:${t}`,a=x.get(i);if(a)return a;let o=(async()=>{var a;let o,n=(e=>{try{return localStorage.getItem(p+e)}catch{return null}})(i);if(n)return n;let s=await (0,d.firstRushOf)(r,t).catch(()=>null);if(!s)return null;if("poster"in s)return s.poster;let l=await (a=async()=>{let t=URL.createObjectURL(s.file);try{let[{rushPoster:r,thumbAt:i},{hdrFile:a}]=await Promise.all([e.A(499064),e.A(367838)]);return await r(t,8e3,await a(s.file),i,240)}finally{URL.revokeObjectURL(t)}},c=(o=c.then(a,a)).catch(()=>{}),o).catch(()=>null);return l&&((e,t)=>{try{localStorage.setItem(p+e,t)}catch{}})(i,l),l})();return x.set(i,o),o}e.s(["useProjectThumb",0,function(e,r=!0){let[i,a]=(0,t.useState)(null);return(0,t.useEffect)(()=>{if(!r)return;let t=!0;return u(e).then(e=>t&&a(e)),()=>void(t=!1)},[e,r]),i}],303604)},88002,e=>{"use strict";var t=e.i(372169),r=e.i(958770),i=e.i(980840),a=e.i(68077),o=e.i(131166),n=e.i(730624),s=e.i(968702),l=e.i(59189),d=e.i(149003);e.i(610168);var p=e.i(767717);let c={Today:"today",Yesterday:"yesterday","Last 7 days":"last7Days",Older:"older"};e.s(["History",0,function({onOpen:e}){let{s:x,api:u}=(0,l.useStudio)(),h=(0,s.useT)(),{lang:f}=(0,s.useLang)(),[b,m]=(0,n.useState)(""),g=b.trim().toLowerCase(),v=x.chats.filter(e=>!g||e.title.toLowerCase().includes(g)||e.msgs.some(e=>e.text.toLowerCase().includes(g))),w=v.reduce((e,t)=>{var r;let i,a=(r=t.at,r>=(i=new Date().setHours(0,0,0,0))?"Today":r>=i-864e5?"Yesterday":r>=i-6048e5?"Last 7 days":"Older"),o=e.find(e=>e.label===a);return o?o.chats.push(t):e.push({label:a,chats:[t]}),e},[]);(0,n.useEffect)(()=>{if(!g)return;let e=setTimeout(()=>(0,p.track)("web_gumpilote","conversationSearched",{query:g.slice(0,200),count:v.length}),1200);return()=>clearTimeout(e)},[g]);let y=w.flatMap(e=>e.chats);return(0,t.jsxs)("div",{className:"flex flex-col",children:[(0,t.jsxs)("button",{type:"button",...(0,p.tk)("web_gumpilote","newConversationClicked"),onClick:()=>(u.newChat(),e()),className:"group flex h-[44px] items-center gap-[10px] rounded-[12px] border border-white/[0.08] bg-white/[0.03] px-[12px] text-[15px] font-medium text-white transition-colors hover:border-[var(--accent-1)]",children:[(0,t.jsx)("span",{className:"flex size-[24px] items-center justify-center rounded-full bg-[var(--accent-1)]",children:(0,t.jsx)(i.Plus,{className:"size-[15px] text-white",strokeWidth:2.6})}),h("New conversation")]}),(0,t.jsxs)("label",{className:"mt-[10px] flex h-[40px] items-center gap-[9px] rounded-[11px] border border-white/[0.07] bg-black/20 px-[12px] text-white/45 focus-within:border-white/20 focus-within:text-white/70",children:[(0,t.jsx)(a.Search,{className:"size-[15px] shrink-0",strokeWidth:2}),(0,t.jsx)("input",{value:b,onChange:e=>m(e.target.value),placeholder:h("Search a conversation"),"aria-label":h("Search a conversation"),className:"min-w-0 flex-1 bg-transparent text-[14px] touch:text-[16px] text-white outline-none placeholder:text-white/35"})]}),0===w.length?(0,t.jsxs)("div",{className:"flex flex-col items-center px-[20px] pt-[60px] text-center",ref:e=>void(e&&(0,p.trackOnce)(`history:${g?"noMatch":"none"}`,"web_gumpilote","historyEmptyShown",{reason:g?"noMatch":"none"})),children:[(0,t.jsxs)("span",{className:"relative",children:[(0,t.jsx)("span",{"aria-hidden":!0,className:"absolute -inset-[14px] rounded-full bg-[radial-gradient(closest-side,rgb(var(--accent-1-rgb)/0.25),transparent)]"}),(0,t.jsx)(d.AiMark,{className:"relative size-[40px]"})]}),(0,t.jsx)("p",{className:"mt-[18px] text-[15px] font-medium text-white/85",children:g?h("No conversation found"):h("No conversation yet")}),(0,t.jsx)("p",{className:"mt-[6px] max-w-[260px] text-[13px] leading-[1.5] text-white/45",children:g?h("Try another word."):h("Ask Resolviailote a question: your exchanges will be kept here.")})]}):w.map(i=>(0,t.jsxs)("section",{className:"mt-[18px]",children:[(0,t.jsx)("h4",{className:"mb-[6px] px-[8px] text-[13px] leading-[16px] text-[#828282]",children:h(i.label)}),(0,t.jsx)("ul",{className:"flex flex-col gap-[2px]",children:i.chats.map(a=>{var n,l,d;let b,m,g=a.id===x.chatId,v=a.msgs.filter(e=>e.me).length;return(0,t.jsxs)("li",{className:"group relative",children:[(0,t.jsxs)("button",{type:"button",...(0,p.tk)("web_gumpilote","conversationOpened",{position:y.indexOf(a)+1,group:c[i.label],questionsCount:v}),onClick:()=>(u.openChat(a.id),e()),className:`flex w-full items-start gap-[11px] rounded-[11px] px-[10px] py-[10px] pr-[38px] text-left transition-colors ${g?"bg-[#1f2022]":"hover:bg-[#1f2022]"}`,children:[(0,t.jsx)("span",{className:`mt-[1px] flex size-[28px] shrink-0 items-center justify-center rounded-[8px] border ${g?"border-[var(--accent-1)]/50 bg-[var(--accent-1)]/15 text-[#8EC1FF]":"border-white/[0.08] bg-white/[0.03] text-white/50"}`,children:(0,t.jsx)(r.MessageSquare,{className:"size-[14px]",strokeWidth:2})}),(0,t.jsxs)("span",{className:"min-w-0 flex-1",children:[(0,t.jsxs)("span",{className:"flex items-center gap-[8px]",children:[(0,t.jsx)("b",{className:"min-w-0 flex-1 truncate text-[14px] font-medium text-white/90",children:a.title}),(0,t.jsx)("span",{className:"shrink-0 text-[11.5px] text-white/35 tabular-nums",children:(n=a.at,l=(0,s.intlLocale)(f),b=new Date(n),n>=new Date().setHours(0,0,0,0)?b.toLocaleTimeString(l,{hour:"2-digit",minute:"2-digit"}):b.toLocaleDateString(l,{weekday:"short",day:"numeric",month:"short"}))})]}),(0,t.jsxs)("span",{className:"mt-[2px] flex items-center gap-[6px] text-[12.5px] text-white/45",children:[(0,t.jsx)("span",{className:"min-w-0 flex-1 truncate",children:(d=h("You: "),(m=[...a.msgs].reverse().find(e=>e.text))?(m.me?d:"")+m.text:"")}),g?(0,t.jsx)("span",{className:"shrink-0 rounded-[5px] border border-[var(--accent-1)]/40 bg-[var(--accent-1)]/10 px-[5px] text-[10.5px] leading-[16px] text-[#8EC1FF]",children:h("In progress")}):(0,t.jsx)("span",{className:"shrink-0 tabular-nums",children:v>1?h("{n} questions",{n:v}):h("{n} question",{n:v})})]})]})]}),(0,t.jsx)("button",{type:"button",...(0,p.tk)("web_gumpilote","conversationDeleted",{current:g}),onClick:()=>u.deleteChat(a.id),"aria-label":h("Delete « {title} »",{title:a.title}),title:h("Delete"),className:"absolute top-[10px] right-[6px] flex size-[28px] items-center justify-center rounded-[8px] text-white/40 opacity-0 transition-[opacity,color,background-color] group-hover:opacity-100 hover:bg-white/[0.06] hover:text-[#ff8fa3] focus-visible:opacity-100 [@media(hover:none)]:opacity-100",children:(0,t.jsx)(o.Trash2,{className:"size-[14px]",strokeWidth:2})})]},a.id)})})]},i.label))]})}])}]);