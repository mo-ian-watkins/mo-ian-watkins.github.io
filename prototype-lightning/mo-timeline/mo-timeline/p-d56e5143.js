const e="mo-timeline";let t,n,l=!1,o=!1,s=!1,i=!1,r=0,c=!1;const a="undefined"!=typeof window?window:{},f=a.CSS,u=a.document||{head:{}},d={t:0,l:"",jmp:e=>e(),raf:e=>requestAnimationFrame(e),ael:(e,t,n,l)=>e.addEventListener(t,n,l),rel:(e,t,n,l)=>e.removeEventListener(t,n,l),ce:(e,t)=>new CustomEvent(e,t)},p=e=>Promise.resolve(e),m=(()=>{try{return new CSSStyleSheet,!0}catch(e){}return!1})(),$=(e,t,n)=>{n&&n.map(([n,l,o])=>{const s=e,i=b(t,o),r=y(n);d.ael(s,l,i,r),(t.o=t.o||[]).push(()=>d.rel(s,l,i,r))})},b=(e,t)=>n=>{256&e.t?e.s[t](n):(e.i=e.i||[]).push([t,n])},y=e=>0!=(2&e),h=new WeakMap,w=e=>"sc-"+e.u,g={},v=e=>"object"==(e=typeof e)||"function"===e,j="undefined"!=typeof Deno,O=!(j||"undefined"==typeof global||"function"!=typeof require||!global.process||"string"!=typeof __filename||global.origin&&"string"==typeof global.origin),k=(j&&Deno,O?process:j&&Deno,O?process:j&&Deno,(e,t,...n)=>{let l=null,o=null,s=!1,i=!1,r=[];const c=t=>{for(let n=0;n<t.length;n++)l=t[n],Array.isArray(l)?c(l):null!=l&&"boolean"!=typeof l&&((s="function"!=typeof e&&!v(l))&&(l+=""),s&&i?r[r.length-1].p+=l:r.push(s?M(null,l):l),i=s)};if(c(n),t){t.name&&(o=t.name);{const e=t.className||t.class;e&&(t.class="object"!=typeof e?e:Object.keys(e).filter(t=>e[t]).join(" "))}}const a=M(e,null);return a.m=t,r.length>0&&(a.$=r),a.h=o,a}),M=(e,t)=>({t:0,g:e,p:t,v:null,$:null,m:null,h:null}),S={},_=(e,t,n,l,o,s)=>{if(n!==l){let r=ae(e,t),c=t.toLowerCase();if("class"===t){const t=e.classList,o=C(n),s=C(l);t.remove(...o.filter(e=>e&&!s.includes(e))),t.add(...s.filter(e=>e&&!o.includes(e)))}else if("style"===t){for(const t in n)l&&null!=l[t]||(t.includes("-")?e.style.removeProperty(t):e.style[t]="");for(const t in l)n&&l[t]===n[t]||(t.includes("-")?e.style.setProperty(t,l[t]):e.style[t]=l[t])}else if("ref"===t)l&&l(e);else if(r||"o"!==t[0]||"n"!==t[1]){const c=v(l);if((r||c&&null!==l)&&!o)try{if(e.tagName.includes("-"))e[t]=l;else{let o=null==l?"":l;"list"===t?r=!1:null!=n&&e[t]==o||(e[t]=o)}}catch(i){}null==l||!1===l?!1===l&&""!==e.getAttribute(t)||e.removeAttribute(t):(!r||4&s||o)&&!c&&e.setAttribute(t,l=!0===l?"":l)}else t="-"===t[2]?t.slice(3):ae(a,c)?c.slice(2):c[2]+t.slice(3),n&&d.rel(e,t,n,!1),l&&d.ael(e,t,l,!1)}},D=/\s/,C=e=>e?e.split(D):[],R=(e,t,n,l)=>{const o=11===t.v.nodeType&&t.v.host?t.v.host:t.v,s=e&&e.m||g,i=t.m||g;for(l in s)l in i||_(o,l,s[l],void 0,n,t.t);for(l in i)_(o,l,s[l],i[l],n,t.t)},P=(e,o,r)=>{let c,a,f,d=o.$[r],p=0;if(l||(s=!0,"slot"===d.g&&(d.t|=d.$?2:1)),null!==d.p)c=d.v=u.createTextNode(d.p);else if(1&d.t)c=d.v=u.createTextNode("");else{if(i||(i="svg"===d.g),c=d.v=u.createElementNS(i?"http://www.w3.org/2000/svg":"http://www.w3.org/1999/xhtml",2&d.t?"slot-fb":d.g),i&&"foreignObject"===d.g&&(i=!1),R(null,d,i),d.$)for(p=0;p<d.$.length;++p)a=P(e,d,p),a&&c.appendChild(a);"svg"===d.g?i=!1:"foreignObject"===c.tagName&&(i=!0)}return c["s-hn"]=n,3&d.t&&(c["s-sr"]=!0,c["s-cr"]=t,c["s-sn"]=d.h||"",f=e&&e.$&&e.$[r],f&&f.g===d.g&&e.v&&T(e.v,!1)),c},T=(e,t)=>{d.t|=1;const l=e.childNodes;for(let o=l.length-1;o>=0;o--){const e=l[o];e["s-hn"]!==n&&e["s-ol"]&&(N(e).insertBefore(e,E(e)),e["s-ol"].remove(),e["s-ol"]=void 0,s=!0),t&&T(e,t)}d.t&=-2},x=(e,t,n,l,o,s)=>{let i,r=e["s-cr"]&&e["s-cr"].parentNode||e;for(;o<=s;++o)l[o]&&(i=P(null,n,o),i&&(l[o].v=i,r.insertBefore(i,E(t))))},L=(e,t,n,l,s)=>{for(;t<=n;++t)(l=e[t])&&(s=l.v,V(l),o=!0,s["s-ol"]?s["s-ol"].remove():T(s,!0),s.remove())},U=(e,t)=>e.g===t.g&&("slot"!==e.g||e.h===t.h),E=e=>e&&e["s-ol"]||e,N=e=>(e["s-ol"]?e["s-ol"]:e).parentNode,W=(e,t)=>{const n=t.v=e.v,l=e.$,o=t.$,s=t.g,r=t.p;let c;null===r?(i="svg"===s||"foreignObject"!==s&&i,"slot"===s||R(e,t,i),null!==l&&null!==o?((e,t,n,l)=>{let o,s=0,i=0,r=t.length-1,c=t[0],a=t[r],f=l.length-1,u=l[0],d=l[f];for(;s<=r&&i<=f;)null==c?c=t[++s]:null==a?a=t[--r]:null==u?u=l[++i]:null==d?d=l[--f]:U(c,u)?(W(c,u),c=t[++s],u=l[++i]):U(a,d)?(W(a,d),a=t[--r],d=l[--f]):U(c,d)?("slot"!==c.g&&"slot"!==d.g||T(c.v.parentNode,!1),W(c,d),e.insertBefore(c.v,a.v.nextSibling),c=t[++s],d=l[--f]):U(a,u)?("slot"!==c.g&&"slot"!==d.g||T(a.v.parentNode,!1),W(a,u),e.insertBefore(a.v,c.v),a=t[--r],u=l[++i]):(o=P(t&&t[i],n,i),u=l[++i],o&&N(c.v).insertBefore(o,E(c.v)));s>r?x(e,null==l[f+1]?null:l[f+1].v,n,l,i,f):i>f&&L(t,s,r)})(n,l,t,o):null!==o?(null!==e.p&&(n.textContent=""),x(n,null,t,o,0,o.length-1)):null!==l&&L(l,0,l.length-1),i&&"svg"===s&&(i=!1)):(c=n["s-cr"])?c.parentNode.textContent=r:e.p!==r&&(n.data=r)},q=e=>{let t,n,l,o,s,i,r=e.childNodes;for(n=0,l=r.length;n<l;n++)if(t=r[n],1===t.nodeType){if(t["s-sr"])for(s=t["s-sn"],t.hidden=!1,o=0;o<l;o++)if(r[o]["s-hn"]!==t["s-hn"])if(i=r[o].nodeType,""!==s){if(1===i&&s===r[o].getAttribute("slot")){t.hidden=!0;break}}else if(1===i||3===i&&""!==r[o].textContent.trim()){t.hidden=!0;break}q(t)}},A=[],F=e=>{let t,n,l,s,i,r,c=0,a=e.childNodes,f=a.length;for(;c<f;c++){if(t=a[c],t["s-sr"]&&(n=t["s-cr"]))for(l=n.parentNode.childNodes,s=t["s-sn"],r=l.length-1;r>=0;r--)n=l[r],n["s-cn"]||n["s-nr"]||n["s-hn"]===t["s-hn"]||(H(n,s)?(i=A.find(e=>e.j===n),o=!0,n["s-sn"]=n["s-sn"]||s,i?i.O=t:A.push({O:t,j:n}),n["s-sr"]&&A.map(e=>{H(e.j,n["s-sn"])&&(i=A.find(e=>e.j===n),i&&!e.O&&(e.O=i.O))})):A.some(e=>e.j===n)||A.push({j:n}));1===t.nodeType&&F(t)}},H=(e,t)=>1===e.nodeType?null===e.getAttribute("slot")&&""===t||e.getAttribute("slot")===t:e["s-sn"]===t||""===t,V=e=>{e.m&&e.m.ref&&e.m.ref(null),e.$&&e.$.map(V)},z=e=>ie(e).k,B=(e,t,n)=>{const l=z(e);return{emit:e=>G(l,t,{bubbles:!!(4&n),composed:!!(2&n),cancelable:!!(1&n),detail:e})}},G=(e,t,n)=>{const l=d.ce(t,n);return e.dispatchEvent(l),l},I=(e,t)=>{t&&!e.M&&t["s-p"]&&t["s-p"].push(new Promise(t=>e.M=t))},J=(e,t)=>{if(e.t|=16,!(4&e.t))return I(e,e.S),ve(()=>K(e,t));e.t|=512},K=(e,t)=>{const n=e.s;let l;return t&&(e.t|=256,e.i&&(e.i.map(([e,t])=>ee(n,e,t)),e.i=null),l=ee(n,"componentWillLoad")),te(l,()=>Q(e,n,t))},Q=(e,i,r)=>{const c=e.k,a=c["s-rc"];r&&(e=>{const t=e._;((e,t)=>{let n=w(t),l=pe.get(n);if(e=11===e.nodeType?e:u,l)if("string"==typeof l){let t,o=h.get(e=e.head||e);o||h.set(e,o=new Set),o.has(n)||(t=u.createElement("style"),t.innerHTML=l,e.insertBefore(t,e.querySelector("link")),o&&o.add(n))}else e.adoptedStyleSheets.includes(l)||(e.adoptedStyleSheets=[...e.adoptedStyleSheets,l])})(e.k.getRootNode(),t)})(e);((e,i)=>{const r=e.k,c=e._,a=e.D||M(null,null),f=(e=>e&&e.g===S)(i)?i:k(null,null,i);if(n=r.tagName,f.g=null,f.t|=4,e.D=f,f.v=a.v=r,t=r["s-cr"],l=0!=(1&c.t),o=!1,W(a,f),d.t|=1,s){let e,t,n,l,o,s;F(f.v);let i=0;for(;i<A.length;i++)e=A[i],t=e.j,t["s-ol"]||(n=u.createTextNode(""),n["s-nr"]=t,t.parentNode.insertBefore(t["s-ol"]=n,t));for(i=0;i<A.length;i++)if(e=A[i],t=e.j,e.O){for(l=e.O.parentNode,o=e.O.nextSibling,n=t["s-ol"];n=n.previousSibling;)if(s=n["s-nr"],s&&s["s-sn"]===t["s-sn"]&&l===s.parentNode&&(s=s.nextSibling,!s||!s["s-nr"])){o=s;break}(!o&&l!==t.parentNode||t.nextSibling!==o)&&t!==o&&(!t["s-hn"]&&t["s-ol"]&&(t["s-hn"]=t["s-ol"].parentNode.nodeName),l.insertBefore(t,o))}else 1===t.nodeType&&(t.hidden=!0)}o&&q(f.v),d.t&=-2,A.length=0})(e,X(e,i)),a&&(a.map(e=>e()),c["s-rc"]=void 0);{const t=c["s-p"],n=()=>Y(e);0===t.length?n():(Promise.all(t).then(n),e.t|=4,t.length=0)}},X=(e,t)=>{try{t=t.render(),e.t&=-17,e.t|=2}catch(n){fe(n)}return t},Y=e=>{const t=e.k,n=e.s,l=e.S;ee(n,"componentDidRender"),64&e.t?ee(n,"componentDidUpdate"):(e.t|=64,ne(t),ee(n,"componentDidLoad"),e.C(t),l||Z()),e.R(t),e.M&&(e.M(),e.M=void 0),512&e.t&&ge(()=>J(e,!1)),e.t&=-517},Z=()=>{ne(u.documentElement),d.t|=2,ge(()=>G(a,"appload",{detail:{namespace:"mo-timeline"}}))},ee=(e,t,n)=>{if(e&&e[t])try{return e[t](n)}catch(l){fe(l)}},te=(e,t)=>e&&e.then?e.then(t):t(),ne=e=>e.classList.add("hydrated"),le=(e,t,n)=>{if(t.P){e.watchers&&(t.T=e.watchers);const l=Object.entries(t.P),o=e.prototype;if(l.map(([e,[l]])=>{31&l||2&n&&32&l?Object.defineProperty(o,e,{get(){return((e,t)=>ie(this).L.get(t))(0,e)},set(n){((e,t,n,l)=>{const o=ie(e),s=o.L.get(t),i=o.t,r=o.s;if(n=((e,t)=>null==e||v(e)?e:4&t?"false"!==e&&(""===e||!!e):2&t?parseFloat(e):1&t?e+"":e)(n,l.P[t][0]),!(8&i&&void 0!==s||n===s)&&(o.L.set(t,n),r)){if(l.T&&128&i){const e=l.T[t];e&&e.map(e=>{try{r[e](n,s,t)}catch(l){fe(l)}})}2==(18&i)&&J(o,!1)}})(this,e,n,t)},configurable:!0,enumerable:!0}):1&n&&64&l&&Object.defineProperty(o,e,{value(...t){const n=ie(this);return n.U.then(()=>n.s[e](...t))}})}),1&n){const t=new Map;o.attributeChangedCallback=function(e,n,l){d.jmp(()=>{const n=t.get(e);this[n]=(null!==l||"boolean"!=typeof this[n])&&l})},e.observedAttributes=l.filter(([e,t])=>15&t[0]).map(([e,n])=>{const l=n[1]||e;return t.set(l,e),l})}}return e},oe=(e,t={})=>{const n=[],l=t.exclude||[],o=a.customElements,s=u.head,i=s.querySelector("meta[charset]"),r=u.createElement("style"),c=[];let f,p=!0;Object.assign(d,t),d.l=new URL(t.resourcesUrl||"./",u.baseURI).href,t.syncQueue&&(d.t|=4),e.map(e=>e[1].map(t=>{const s={t:t[0],u:t[1],P:t[2],N:t[3]};s.P=t[2],s.N=t[3],s.T={};const i=s.u,r=class extends HTMLElement{constructor(e){super(e),ce(e=this,s)}connectedCallback(){f&&(clearTimeout(f),f=null),p?c.push(this):d.jmp(()=>(e=>{if(0==(1&d.t)){const t=ie(e),n=t._,l=()=>{};if(1&t.t)$(e,t,n.N);else{t.t|=1,12&n.t&&(e=>{const t=e["s-cr"]=u.createComment("");t["s-cn"]=!0,e.insertBefore(t,e.firstChild)})(e);{let n=e;for(;n=n.parentNode||n.host;)if(n["s-p"]){I(t,t.S=n);break}}n.P&&Object.entries(n.P).map(([t,[n]])=>{if(31&n&&e.hasOwnProperty(t)){const n=e[t];delete e[t],e[t]=n}}),ge(()=>(async(e,t,n,l,o)=>{if(0==(32&t.t)){{if(t.t|=32,(o=de(n)).then){const e=()=>{};o=await o,e()}o.isProxied||(n.T=o.watchers,le(o,n,2),o.isProxied=!0);const e=()=>{};t.t|=8;try{new o(t)}catch(r){fe(r)}t.t&=-9,t.t|=128,e()}if(o.style){let e=o.style;const t=w(n);if(!pe.has(t)){const l=()=>{};((e,t,n)=>{let l=pe.get(e);m&&n?(l=l||new CSSStyleSheet,l.replace(t)):l=t,pe.set(e,l)})(t,e,!!(1&n.t)),l()}}}const s=t.S,i=()=>J(t,!0);s&&s["s-rc"]?s["s-rc"].push(i):i()})(0,t,n))}l()}})(this))}disconnectedCallback(){d.jmp(()=>(()=>{if(0==(1&d.t)){const e=ie(this);e.o&&(e.o.map(e=>e()),e.o=void 0)}})())}forceUpdate(){(()=>{{const e=ie(this);e.k.isConnected&&2==(18&e.t)&&J(e,!1)}})()}componentOnReady(){return ie(this).W}};s.q=e[0],l.includes(i)||o.get(i)||(n.push(i),o.define(i,le(r,s,1)))})),r.innerHTML=n+"{visibility:hidden}.hydrated{visibility:inherit}",r.setAttribute("data-styles",""),s.insertBefore(r,i?i.nextSibling:s.firstChild),p=!1,c.length?c.map(e=>e.connectedCallback()):d.jmp(()=>f=setTimeout(Z,30))},se=new WeakMap,ie=e=>se.get(e),re=(e,t)=>se.set(t.s=e,t),ce=(e,t)=>{const n={t:0,k:e,_:t,L:new Map};return n.U=new Promise(e=>n.R=e),n.W=new Promise(e=>n.C=e),e["s-p"]=[],e["s-rc"]=[],$(e,n,t.N),se.set(e,n)},ae=(e,t)=>t in e,fe=e=>console.error(e),ue=new Map,de=e=>{const t=e.u.replace(/-/g,"_"),n=e.q,l=ue.get(n);return l?l[t]:__sc_import_mo_timeline(`./${n}.entry.js`).then(e=>(ue.set(n,e),e[t]),fe)},pe=new Map,me=[],$e=[],be=[],ye=(e,t)=>n=>{e.push(n),c||(c=!0,t&&4&d.t?ge(we):d.raf(we))},he=(e,t)=>{let n=0,l=0;for(;n<e.length&&(l=performance.now())<t;)try{e[n++](l)}catch(o){fe(o)}n===e.length?e.length=0:0!==n&&e.splice(0,n)},we=()=>{r++,(e=>{for(let n=0;n<e.length;n++)try{e[n](performance.now())}catch(t){fe(t)}e.length=0})(me);{const e=2==(6&d.t)?performance.now()+14*Math.ceil(.1*r):1/0;he($e,e),he(be,e),$e.length>0&&(be.push(...$e),$e.length=0),(c=me.length+$e.length+be.length>0)?d.raf(we):r=0}},ge=e=>p().then(e),ve=ye($e,!0);export{f as C,e as N,p as a,oe as b,B as c,u as d,z as g,k as h,d as p,re as r,a as w}