var L=Object.defineProperty;var P=(o,e,t)=>e in o?L(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var l=(o,e,t)=>P(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();const b="アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ日月火水木金土",p=14;class I{constructor(e){l(this,"canvas");l(this,"ctx");l(this,"drops",[]);l(this,"frameCount",0);l(this,"animationId",0);this.canvas=e,this.ctx=e.getContext("2d"),this.resize(),window.addEventListener("resize",()=>this.resize())}get frameSkip(){return window.innerWidth<768?6:3}resize(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight;const e=window.innerWidth<768?p*1.5:p,t=Math.floor(this.canvas.width/e),s=Array.from({length:t},(a,n)=>this.drops[n]??Math.floor(Math.random()*(this.canvas.height/p)));this.drops=s}draw(){const{ctx:e,canvas:t}=this,s=window.innerWidth<768?.08:.055;e.fillStyle=`rgba(0, 0, 0, ${s})`,e.fillRect(0,0,t.width,t.height);const a=window.innerWidth<768?p*1.5:p;e.font=`${p}px monospace`;const n=getComputedStyle(document.documentElement),r=n.getPropertyValue("--c-matrix").trim()||"#00ff41",c=n.getPropertyValue("--c-matrix-head").trim()||"#ccffcc";for(let i=0;i<this.drops.length;i++){const h=b[Math.floor(Math.random()*b.length)],d=i*a,u=this.drops[i]*p,g=Math.random()>.92;e.fillStyle=g?c:r,e.fillText(h,d,u),u>t.height&&Math.random()>.975?this.drops[i]=0:this.drops[i]++}}start(){const e=()=>{this.frameCount++,this.frameCount%this.frameSkip===0&&this.draw(),this.animationId=requestAnimationFrame(e)};this.animationId=requestAnimationFrame(e)}stop(){cancelAnimationFrame(this.animationId)}}class A{constructor(){l(this,"history",[]);l(this,"index",-1)}push(e){const t=e.trim();t&&(this.history[this.history.length-1]!==t&&this.history.push(t),this.index=-1)}navigateUp(){return this.history.length===0?"":(this.index===-1?this.index=this.history.length-1:this.index>0&&this.index--,this.history[this.index])}navigateDown(){return this.index===-1?"":(this.index++,this.index>=this.history.length?(this.index=-1,""):this.history[this.index])}reset(){this.index=-1}}class O{constructor(e){this.registry=e}complete(e){const t=this.suggestions(e);if(t.length!==1)return null;if(e.includes(" ")){const a=e.indexOf(" ");return e.slice(0,a+1)+t[0]}return t[0]}suggestions(e){if(!e.includes(" ")){if(!e.trim())return this.registry.getNames();const i=e.toLowerCase();return this.registry.getNames().filter(h=>h.startsWith(i))}const s=e.indexOf(" "),a=e.slice(0,s).toLowerCase(),n=e.slice(s+1),r=this.registry.get(a);if(!(r!=null&&r.argSuggestions))return[];const c=r.argSuggestions(n);return n?c.filter(i=>i.startsWith(n)):c}}const M=[{text:"    _         _                 _   _               _           _  ",className:"ascii-art desktop-only"},{text:"   / \\   _ __| |_ ___ _ __ ___ | | | |_ __ ___  ___| |__  _   _| | __",className:"ascii-art desktop-only"},{text:"  / _ \\ | '__| __/ _ \\ '_ ` _ \\| |_| | '__/ _ \\/ __| '_ \\| | | | |/ /",className:"ascii-art desktop-only"},{text:" / ___ \\| |  | ||  __/ | | | | |  _  | | |  __/ (__| | | | |_| |   < ",className:"ascii-art desktop-only"},{text:"/_/   \\_\\_|   \\__\\___|_| |_| |_|_| |_|_|  \\___|\\___|_| |_|\\__,_|_|\\_\\",className:"ascii-art desktop-only"},{text:"  ╔══════════════════════════╗",className:"separator mobile-only"},{text:"  ║   ARTEM  HRECHUK        ║",className:"accent mobile-only"},{text:"  ║   Full Stack Developer   ║",className:"welcome-info mobile-only"},{text:"  ╚══════════════════════════╝",className:"separator mobile-only"},{text:""},{text:"  terminal-portfolio v1.0.0",className:"welcome-info"},{text:"  ─────────────────────────────────────────────────────",className:"dim desktop-only"},{text:"  ────────────────────────────",className:"dim mobile-only"},{text:"  Software Engineer & Developer",className:"welcome-info desktop-only"},{text:""},{text:"  Type  help      to see available commands.",className:"accent"},{text:"  Type  neofetch  for system info.",className:"dim"},{text:"  Use   Tab   for autocomplete,  ↑/↓   for history.",className:"dim desktop-only"},{text:"  Tap  TAB ↑ ↓  buttons below to navigate.",className:"dim mobile-only"},{text:""}],E=400,$=12;class D{constructor(e,t,s,a){l(this,"outputEl");l(this,"inputEl");l(this,"displayEl");l(this,"registry");l(this,"history");l(this,"autocomplete");l(this,"ctx");this.outputEl=e,this.inputEl=t,this.displayEl=s,this.registry=a,this.history=new A,this.autocomplete=new O(a),this.ctx={clearOutput:()=>{this.outputEl.innerHTML="",this.showWelcome()}},this.bindEvents(),this.bindMobileToolbar(),this.setupVisualViewport(),this.setupGlitch()}bindEvents(){this.inputEl.addEventListener("keydown",e=>this.handleKeydown(e)),this.inputEl.addEventListener("input",()=>this.syncDisplay()),document.addEventListener("click",()=>this.inputEl.focus()),document.addEventListener("touchend",()=>this.inputEl.focus(),{passive:!0})}bindMobileToolbar(){const e=document.getElementById("mobile-toolbar");e&&e.addEventListener("pointerdown",t=>{const s=t.target.closest("[data-action]");if(s)switch(t.preventDefault(),this.inputEl.focus(),s.dataset.action){case"tab":this.handleTab();break;case"up":this.handleArrowUp();break;case"down":this.handleArrowDown();break;case"ctrlc":this.handleCtrlC();break}})}setupVisualViewport(){const e=window.visualViewport;if(!e)return;const t=()=>{const s=e.height+e.offsetTop;document.documentElement.style.setProperty("--vvh",`${s}px`)};e.addEventListener("resize",t),e.addEventListener("scroll",t),t()}setupGlitch(){const e=()=>{const t=8e3+Math.random()*7e3;setTimeout(()=>{document.querySelectorAll(".ascii-art").forEach(a=>{a.classList.add("glitch-active"),setTimeout(()=>a.classList.remove("glitch-active"),150)}),e()},t)};e()}handleKeydown(e){switch(e.key){case"Enter":e.preventDefault(),this.handleEnter();break;case"ArrowUp":e.preventDefault(),this.handleArrowUp();break;case"ArrowDown":e.preventDefault(),this.handleArrowDown();break;case"Tab":e.preventDefault(),this.handleTab();break;case"l":e.ctrlKey&&(e.preventDefault(),this.ctx.clearOutput());break;case"c":e.ctrlKey&&(e.preventDefault(),this.handleCtrlC());break}}handleEnter(){const e=this.inputEl.value;if(this.setInput(""),this.history.reset(),e.trim()){this.printCommandEcho(e);const[t]=e.trim().toLowerCase().split(/\s+/),s=this.registry.get(t),a=this.registry.execute(e,this.ctx);s!=null&&s.animated?this.printLinesAnimated(a).then(()=>{this.trimOutput(),this.scrollToBottom()}):(this.printLines(a),this.trimOutput()),this.history.push(e)}this.scrollToBottom()}handleArrowUp(){this.setInput(this.history.navigateUp()),this.moveCursorToEnd()}handleArrowDown(){this.setInput(this.history.navigateDown()),this.moveCursorToEnd()}handleTab(){const e=this.inputEl.value,t=this.autocomplete.complete(e);if(t)this.setInput(t);else{const s=this.autocomplete.suggestions(e);s.length>1&&(this.printLines([{text:s.join("    "),className:"tab-hint"},{text:""}]),this.scrollToBottom())}}handleCtrlC(){this.inputEl.value&&(this.printCommandEcho(this.inputEl.value+"^C"),this.setInput(""),this.history.reset())}syncDisplay(){this.displayEl.textContent=this.inputEl.value}setInput(e){this.inputEl.value=e,this.syncDisplay()}moveCursorToEnd(){requestAnimationFrame(()=>{const e=this.inputEl.value.length;this.inputEl.selectionStart=e,this.inputEl.selectionEnd=e})}printCommandEcho(e){const t=document.createElement("p");t.className="output-line command-echo",t.textContent=`visitor@user:~$ ${e}`,this.outputEl.appendChild(t)}printLines(e){for(const t of e){const s=document.createElement("p");if(s.className=`output-line${t.className?` ${t.className}`:""}`,t.href){const a=document.createElement("a");a.href=t.href,a.target="_blank",a.rel="noopener noreferrer",a.textContent=t.text,s.appendChild(a)}else s.textContent=t.text;this.outputEl.appendChild(s)}}async printLinesAnimated(e,t=$){var s,a;for(const n of e){const r=document.createElement("p");if(r.className=`output-line${n.className?` ${n.className}`:""}`,!n.text||n.href!==void 0||((s=n.className)==null?void 0:s.includes("separator"))||((a=n.className)==null?void 0:a.includes("ascii-art"))){if(n.href){const i=document.createElement("a");i.href=n.href,i.target="_blank",i.rel="noopener noreferrer",i.textContent=n.text,r.appendChild(i)}else r.textContent=n.text;this.outputEl.appendChild(r);continue}this.outputEl.appendChild(r);for(let i=0;i<=n.text.length;i++)r.textContent=n.text.slice(0,i),this.scrollToBottom(),i<n.text.length&&await new Promise(h=>setTimeout(h,t))}this.scrollToBottom()}trimOutput(){const e=this.outputEl.querySelectorAll(".output-line");if(e.length<=E)return;const t=e.length-E;for(let s=0;s<t;s++)e[s].remove()}showWelcome(){this.printLinesAnimated(M)}scrollToBottom(){this.outputEl.scrollTop=this.outputEl.scrollHeight}start(){this.showWelcome(),this.focus()}focus(){this.inputEl.focus()}}class R{constructor(){l(this,"commands",new Map)}register(e){this.commands.set(e.name,e)}execute(e,t){const s=e.trim();if(!s)return[];const[a,...n]=s.split(/\s+/),r=this.commands.get(a.toLowerCase());return r?r.execute(n,t):[{text:`command not found: ${a}  —  type 'help' for available commands.`,className:"error"}]}get(e){return this.commands.get(e)}getNames(){return[...this.commands.keys()].sort()}getAll(){return[...this.commands.values()].sort((e,t)=>e.name.localeCompare(t.name))}}function F(o){return{name:"help",description:"Show available commands",manPage:`NAME
    help — list all available commands

SYNOPSIS
    help

DESCRIPTION
    Displays a list of all available commands with their
    short descriptions. Hidden/internal commands are excluded.

SEE ALSO
    man(1)`,execute:(e,t)=>{const s=o.getAll().filter(n=>!n.hidden),a=[{text:"Available commands:",className:"accent"},{text:""}];for(const n of s){const r=n.name.padEnd(12);a.push({text:`  ${r}  ${n.description}`})}return a.push({text:""}),a.push({text:"  Tip: man <command> for detailed help.",className:"dim"}),a.push({text:"Use Tab to autocomplete, ↑/↓ to navigate history.",className:"dim"}),a}}}const j={name:"about",description:"About me",animated:!0,manPage:`NAME
    about — display personal information

SYNOPSIS
    about

DESCRIPTION
    Shows information about Artem Hrechuk including name,
    handle, location, bio, and technical interests.

SEE ALSO
    skills(1), projects(1), links(1)`,execute:(o,e)=>[{text:"╔══════════════════════════════════════════╗",className:"separator"},{text:"║              ABOUT ME                    ║",className:"accent"},{text:"╚══════════════════════════════════════════╝",className:"separator"},{text:""},{text:"  Name       Artem Hrechuk"},{text:"  Handle     Fallowlone"},{text:"  Location   Germany  (originally from Ukraine)"},{text:""},{text:"  Full Stack JS/TS developer with ~9 months commercial",className:"welcome-info"},{text:"  experience. Built the R.Toys e-commerce platform at",className:"welcome-info"},{text:"  Pinta Webware — Next.js, tRPC, Prisma, PostgreSQL,",className:"welcome-info"},{text:"  and React Native in a monorepo architecture.",className:"welcome-info"},{text:""},{text:"  Interests:",className:"accent"},{text:"    · Low-level programming  · CLI tooling"},{text:"    · Encryption & security  · Clean architecture"},{text:""},{text:"  Run  skills / projects / links  for more.",className:"dim"},{text:""}]},x=[{name:"file-encryptor-cli",description:"AES-256-CBC file encryption CLI. Native Node.js crypto — no libraries.",tech:["Node.js","TypeScript","AES-256-CBC"],url:"https://github.com/fallowlone/file-encryptor-cli"}],H={name:"projects",description:"List my projects",manPage:`NAME
    projects — list GitHub projects

SYNOPSIS
    projects

DESCRIPTION
    Displays a formatted list of projects with descriptions,
    tech stacks, and GitHub links.

    Use  open <N>  to open a project URL in a new browser tab.

SEE ALSO
    open(1), links(1)`,execute:(o,e)=>{const t=[{text:"╔══════════════════════════════════════════╗",className:"separator"},{text:"║              PROJECTS                    ║",className:"accent"},{text:"╚══════════════════════════════════════════╝",className:"separator"},{text:""}];return x.forEach((s,a)=>{t.push({text:`  [${a+1}] ${s.name}`,className:"accent"}),t.push({text:`      ${s.description}`}),t.push({text:`      Tech:  ${s.tech.join(" · ")}`,className:"dim"}),t.push({text:`      Link:  ${s.url}  (run: open ${a+1})`,href:s.url}),t.push({text:""})}),t}},U={name:"cv",description:"Download my CV / resume",manPage:`NAME
    cv — download CV / resume

SYNOPSIS
    cv

DESCRIPTION
    Downloads the CV PDF file when available.
    Currently unavailable — check back soon.

SEE ALSO
    about(1), links(1)`,execute:(o,e)=>[{text:""},{text:"  CV is not yet available for download.",className:"error"},{text:"  Check back soon!",className:"dim"},{text:""}]},B=[{label:"GitHub",url:"https://github.com/fallowlone",description:"Fallowlone on GitHub"},{label:"LinkedIn",url:"https://linkedin.com/in/artem-hrechuk",description:"Full Stack Developer · Based in Germany"}],W={name:"links",description:"Social links and contact info",manPage:`NAME
    links — display contact and social links

SYNOPSIS
    links

DESCRIPTION
    Shows GitHub, LinkedIn, and other contact links
    for Artem Hrechuk (Fallowlone).

SEE ALSO
    about(1)`,execute:(o,e)=>{const t=[{text:"╔══════════════════════════════════════════╗",className:"separator"},{text:"║               LINKS                      ║",className:"accent"},{text:"╚══════════════════════════════════════════╝",className:"separator"},{text:""}];return B.forEach(s=>{const a=s.label.padEnd(10);t.push({text:`  ${a}  ${s.description}`,className:"accent"}),t.push({text:`  ${"".padEnd(10)}  ${s.url}`,href:s.url}),t.push({text:""})}),t}},G={name:"clear",description:"Clear the terminal output",manPage:`NAME
    clear — clear the terminal output

SYNOPSIS
    clear

DESCRIPTION
    Clears all output from the terminal screen and shows
    the welcome message again.

    Keyboard shortcut: Ctrl+L

SEE ALSO
    help(1)`,execute:(o,e)=>(e.clearOutput(),[])},y={matrix:{label:"Matrix (green)",primary:"#00ff41",accent:"#00ffaa",dim:"#005500",error:"#ff3333",bgTerminal:"rgba(0,0,0,0.82)",bgPage:"#000000",border:"#002200",separator:"#003300",link:"#ffb000",matrixColor:"#00ff41",matrixHead:"#ccffcc"},amber:{label:"Amber (retro CRT)",primary:"#ffb000",accent:"#ffd060",dim:"#5a3a00",error:"#ff4444",bgTerminal:"rgba(10,5,0,0.88)",bgPage:"#0a0500",border:"#3a2000",separator:"#2a1800",link:"#00ffaa",matrixColor:"#cc8800",matrixHead:"#ffe080"},cyan:{label:"Cyan (hacker blue)",primary:"#00d4ff",accent:"#80eeff",dim:"#004455",error:"#ff4466",bgTerminal:"rgba(0,5,15,0.88)",bgPage:"#00050f",border:"#003344",separator:"#002233",link:"#ffb000",matrixColor:"#00aacc",matrixHead:"#aaf0ff"},white:{label:"White (light)",primary:"#1a1a1a",accent:"#005500",dim:"#888888",error:"#cc0000",bgTerminal:"rgba(245,245,240,0.96)",bgPage:"#f0f0e8",border:"#cccccc",separator:"#aaaaaa",link:"#0055cc",matrixColor:"#00aa00",matrixHead:"#ccffcc"}},N={courier:{label:"Courier New (built-in)",family:"'Courier New', 'Lucida Console', monospace",googleFontsUrl:null},jetbrains:{label:"JetBrains Mono",family:"'JetBrains Mono', monospace",googleFontsUrl:"https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"},fira:{label:"Fira Code",family:"'Fira Code', monospace",googleFontsUrl:"https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap"},ibm:{label:"IBM Plex Mono",family:"'IBM Plex Mono', monospace",googleFontsUrl:"https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap"}},S="terminal-theme",w="terminal-font";class Y{constructor(){l(this,"currentTheme");l(this,"currentFont");this.currentTheme=localStorage.getItem(S)??"matrix",this.currentFont=localStorage.getItem(w)??"courier",this.applyTheme(this.currentTheme),this.applyFont(this.currentFont)}applyTheme(e){const t=y[e];if(!t)return!1;const s=document.documentElement;return s.style.setProperty("--c-primary",t.primary),s.style.setProperty("--c-accent",t.accent),s.style.setProperty("--c-dim",t.dim),s.style.setProperty("--c-error",t.error),s.style.setProperty("--c-bg-terminal",t.bgTerminal),s.style.setProperty("--c-bg-page",t.bgPage),s.style.setProperty("--c-border",t.border),s.style.setProperty("--c-separator",t.separator),s.style.setProperty("--c-link",t.link),s.style.setProperty("--c-matrix",t.matrixColor),s.style.setProperty("--c-matrix-head",t.matrixHead),s.dataset.theme=e,this.currentTheme=e,localStorage.setItem(S,e),!0}getTheme(){return this.currentTheme}applyFont(e){const t=N[e];if(!t)return!1;if(t.googleFontsUrl&&!document.querySelector(`link[href="${t.googleFontsUrl}"]`)){const s=document.createElement("link");s.rel="stylesheet",s.href=t.googleFontsUrl,document.head.appendChild(s)}return document.documentElement.style.setProperty("--font-mono",t.family),this.currentFont=e,localStorage.setItem(w,e),!0}getFont(){return this.currentFont}}function V(o,e){return{name:"theme",description:"Switch colour theme  (usage: theme [name])",manPage:`NAME
    theme — switch colour theme

SYNOPSIS
    theme [name]

DESCRIPTION
    With no arguments, lists all available themes with the
    current theme marked by ▶.
    With a theme name, applies that theme immediately.

    Available themes: matrix, amber, cyan, white
    The selection is saved to localStorage and restored on
    next visit.

EXAMPLES
    theme
    theme amber
    theme cyan

SEE ALSO
    font(1)`,argSuggestions:t=>Object.keys(y).filter(s=>s.startsWith(t)),execute:(t,s)=>{if(t.length===0){const r=[{text:"╔══════════════════════════════════════════╗",className:"separator"},{text:"║              THEMES                      ║",className:"accent"},{text:"╚══════════════════════════════════════════╝",className:"separator"},{text:""}];for(const[c,i]of Object.entries(y)){const h=c===o(),d=h?"▶ ":"  ",u=c.padEnd(10);r.push({text:`${d}${u}  ${i.label}`,className:h?"accent":"output-line"})}return r.push({text:""}),r.push({text:"  Usage:  theme <name>   e.g.  theme amber",className:"dim"}),r.push({text:""}),r}const a=t[0].toLowerCase();return e(a)?[{text:""},{text:`  Theme set to: ${a}`,className:"accent"},{text:"  Preference saved.",className:"dim"},{text:""}]:[{text:""},{text:`  Unknown theme: "${a}"`,className:"error"},{text:"  Run  theme  to see available themes.",className:"dim"},{text:""}]}}}function K(o,e){return{name:"font",description:"Switch terminal font  (usage: font [name])",manPage:`NAME
    font — switch terminal font

SYNOPSIS
    font [name]

DESCRIPTION
    With no arguments, lists all available fonts with the
    current font marked by ▶.
    With a font name, applies that font immediately.
    Google Fonts are loaded lazily on first use.

    Available fonts: courier, jetbrains, fira, ibm
    The selection is saved to localStorage and restored on
    next visit.

EXAMPLES
    font
    font jetbrains
    font fira

SEE ALSO
    theme(1)`,argSuggestions:t=>Object.keys(N).filter(s=>s.startsWith(t)),execute:(t,s)=>{if(t.length===0){const r=[{text:"╔══════════════════════════════════════════╗",className:"separator"},{text:"║               FONTS                      ║",className:"accent"},{text:"╚══════════════════════════════════════════╝",className:"separator"},{text:""}];for(const[c,i]of Object.entries(N)){const h=c===o(),d=h?"▶ ":"  ",u=c.padEnd(12);r.push({text:`${d}${u}  ${i.label}`,className:h?"accent":"output-line"})}return r.push({text:""}),r.push({text:"  Usage:  font <name>   e.g.  font jetbrains",className:"dim"}),r.push({text:""}),r}const a=t[0].toLowerCase();return e(a)?[{text:""},{text:`  Font set to: ${a}`,className:"accent"},{text:"  Preference saved.",className:"dim"},{text:""}]:[{text:""},{text:`  Unknown font: "${a}"`,className:"error"},{text:"  Run  font  to see available fonts.",className:"dim"},{text:""}]}}}const J=[{label:"Frontend  ",skills:"TypeScript · JavaScript · React · Next.js · React Native"},{label:"Backend   ",skills:"Node.js · tRPC · NestJS (learning) · REST · WebSocket"},{label:"Database  ",skills:"PostgreSQL · Prisma · SQL basics"},{label:"Tooling   ",skills:"Git · Vite · ESBuild · Docker (basics) · Linux/CLI"},{label:"Currently ",skills:"NestJS · System Design · German (B1)"}],q={name:"skills",description:"My technical skills by category",manPage:`NAME
    skills — display technical skills

SYNOPSIS
    skills

DESCRIPTION
    Outputs a categorised table of technical skills across
    Frontend, Backend, Database, Tooling, and current learning.

SEE ALSO
    about(1), projects(1)`,execute:(o,e)=>{const t=[{text:"╔══════════════════════════════════════════════════════════╗",className:"separator"},{text:"║                   TECHNICAL SKILLS                       ║",className:"accent"},{text:"╠══════════════════════════════════════════════════════════╣",className:"separator"},{text:""}];for(const s of J)t.push({text:`  ${s.label}  ${s.skills}`,className:s.label.trim()==="Currently"?"welcome-info":"output-line"});return t.push({text:""}),t.push({text:"╚══════════════════════════════════════════════════════════╝",className:"separator"}),t.push({text:""}),t.push({text:"  Run  about  for background, or  projects  to see my work.",className:"dim"}),t.push({text:""}),t}},z=performance.now();function Q(o){const e=Math.floor(o/1e3);if(e<60)return`${e} second${e!==1?"s":""}`;const t=Math.floor(e/60),s=e%60;if(t<60)return`${t}m ${s}s`;const a=Math.floor(t/60),n=t%60;return`${a}h ${n}m`}function X(o,e){return{name:"neofetch",description:"Display system info (neofetch style)",animated:!0,manPage:`NAME
    neofetch — display system information

SYNOPSIS
    neofetch

DESCRIPTION
    Shows a neofetch-style system info panel with ASCII
    portrait art alongside runtime information such as
    current theme, font, and session uptime.

SEE ALSO
    about(1), theme(1), font(1)`,execute:(t,s)=>{const a=performance.now()-z,n=o(),r=e(),c=["   .------.   ","  /  o  o  \\  "," |     ^    | "," |   -----  | ","  \\        /  ","   `------'   ","    \\    /    ","   __|  |__   ","  /  |  |  \\  "," /   |  |   \\ "],i=["fallowlone@terminal","───────────────────────────────","OS:       Ubuntu 24.04 LTS (WSL)","Location: Germany","Role:     Full Stack Developer","Stack:    TS · Next.js · Node.js · PostgreSQL","GitHub:   github.com/fallowlone",`Uptime:   ${Q(a)}`,`Theme:    ${n}`,`Font:     ${r}`],h=Math.max(c.length,i.length),d=[{text:""}];for(let u=0;u<h;u++){const g=c[u]??"               ",v=i[u]??"",k=u===0,T=u===1;d.push({text:`  ${g}  ${v}`,className:k?"accent":T?"separator":"output-line"})}return d.push({text:""}),d}}}function Z(o){return{name:"man",description:"Show manual page for a command  (usage: man <command>)",manPage:`NAME
    man — display manual for a command

SYNOPSIS
    man <command>

DESCRIPTION
    Shows the manual page for the given command if one exists.
    Not all commands have manual entries.

EXAMPLES
    man theme
    man projects
    man about

SEE ALSO
    help(1)`,argSuggestions:e=>o.getNames().filter(t=>t.startsWith(e)),execute:(e,t)=>{if(e.length===0)return[{text:""},{text:"  What manual page do you want?",className:"error"},{text:"  Usage: man <command>",className:"dim"},{text:""}];const s=e[0].toLowerCase(),a=o.get(s);if(!a||!a.manPage)return[{text:""},{text:`  No manual entry for ${s}`,className:"error"},{text:""}];const n=[{text:""}];for(const r of a.manPage.split(`
`)){const c=r.trim(),i=/^[A-Z ]+$/.test(c)&&c.length>0&&!c.includes("(");n.push({text:r,className:i?"accent":"output-line"})}return n.push({text:""}),n}}}function ee(){return{name:"open",description:"Open project URL in new tab  (usage: open <N>)",manPage:`NAME
    open — open a project URL in a new browser tab

SYNOPSIS
    open <N>

DESCRIPTION
    Opens the URL for project number N in a new browser tab.
    Run  projects  to see the list of projects and their numbers.

EXAMPLES
    open 1
    open 2

SEE ALSO
    projects(1)`,argSuggestions:o=>x.map((e,t)=>String(t+1)).filter(e=>e.startsWith(o)),execute:(o,e)=>{if(o.length===0)return[{text:""},{text:"  Usage: open <N>  (see projects for numbers)",className:"dim"},{text:""}];const t=parseInt(o[0],10);if(isNaN(t)||t<1||t>x.length)return[{text:""},{text:`  Invalid project number: "${o[0]}"`,className:"error"},{text:`  Valid range: 1–${x.length}  (run projects to see list)`,className:"dim"},{text:""}];const s=x[t-1];return window.open(s.url,"_blank","noopener,noreferrer"),[{text:""},{text:`  Opening ${s.name}...`,className:"accent"},{text:`  ${s.url}`,className:"dim"},{text:""}]}}}const te=[{name:"sudo",description:"Elevate privileges",hidden:!0,execute:()=>[{text:""},{text:"  Nice try.",className:"error"},{text:"  sudo: permission denied — this isn't your terminal.",className:"dim"},{text:""}]},{name:"hack",description:"Hack the mainframe",hidden:!0,execute:()=>[{text:""},{text:"  [████████░░░░░░░░] Accessing mainframe...",className:"accent"},{text:"  [████████████░░░░] Bypassing firewall...",className:"accent"},{text:"  [████████████████] Decrypting database...",className:"dim"},{text:""},{text:"  ERROR: coffee_level_too_low — aborting.",className:"error"},{text:""}]},{name:"vim",description:"Launch vim",hidden:!0,execute:()=>[{text:""},{text:"  :q!",className:"accent"},{text:"  Just kidding. There is no vim. There is only the terminal.",className:"dim"},{text:""}]},{name:"coffee",description:"Make coffee",hidden:!0,execute:()=>[{text:""},{text:"      ( (      ",className:"accent"},{text:"       ) )     ",className:"accent"},{text:"    ........   ",className:"accent"},{text:"    |      |]  ",className:"accent"},{text:"    \\      /   ",className:"accent"},{text:"     `----'    ",className:"accent"},{text:""},{text:"  Brewing... Stay focused.",className:"dim"},{text:""}]},{name:"exit",description:"Exit the terminal",hidden:!0,execute:()=>[{text:""},{text:"  There is no escape.",className:"error"},{text:"  You are already home.",className:"dim"},{text:""}]},{name:"quit",description:"Quit the terminal",hidden:!0,execute:()=>[{text:""},{text:"  There is no escape.",className:"error"},{text:"  You are already home.",className:"dim"},{text:""}]}];class se{constructor(e){l(this,"outputEl");this.outputEl=e}async start(e){this.appendLine("  Initializing terminal...","dim"),await this.animateProgressBar(),await this.animateLoadingDots(),this.appendLine("  System ready.","accent"),await this.delay(250),this.outputEl.innerHTML="",e()}appendLine(e,t){const s=document.createElement("p");s.className=`output-line${t?` ${t}`:""}`,s.textContent=e,this.outputEl.appendChild(s)}delay(e){return new Promise(t=>setTimeout(t,e))}async animateProgressBar(){const e=document.createElement("p");e.className="output-line dim",this.outputEl.appendChild(e);const t=16,s=600,a=20;for(let n=0;n<=a;n++){const r=Math.round(n/a*t),c=t-r,i=Math.round(n/a*100);e.textContent=`  [${"█".repeat(r)}${"░".repeat(c)}] ${i}%`,n<a&&await this.delay(s/a)}}async animateLoadingDots(){const e=document.createElement("p");e.className="output-line dim",this.outputEl.appendChild(e);const t=["  Loading modules","  Loading modules.","  Loading modules..","  Loading modules..."],s=300/(t.length-1);for(const a of t)e.textContent=a,await this.delay(s)}}const f=new Y,ae=document.getElementById("matrix-canvas"),ne=new I(ae);ne.start();const m=new R;m.register(j);m.register(H);m.register(U);m.register(W);m.register(G);m.register(q);m.register(ee());m.register(V(()=>f.getTheme(),o=>f.applyTheme(o)));m.register(K(()=>f.getFont(),o=>f.applyFont(o)));m.register(X(()=>f.getTheme(),()=>f.getFont()));m.register(Z(m));m.register(F(m));for(const o of te)m.register(o);const _=document.getElementById("output"),oe=document.getElementById("input-field"),re=document.getElementById("input-display"),C=document.getElementById("input-row"),ie=new D(_,oe,re,m);C.style.display="none";const ce=new se(_);ce.start(()=>{C.style.display="",ie.start()});
