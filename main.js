(function(){
  const NS="http://www.w3.org/2000/svg", svg=document.getElementById("court");
  const el=(n,a,p)=>{const e=document.createElementNS(NS,n);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;};
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

  /* ---- court ---- */
  const defs=el("defs",{},svg);
  [["ah","ah"],["ahr","ah-r"]].forEach(([id,c])=>{const m=el("marker",{id,viewBox:"0 0 10 10",refX:"8",refY:"5",markerWidth:"5",markerHeight:"5",orient:"auto-start-reverse"},defs);el("path",{d:"M0,0 L10,5 L0,10 z",class:c},m);});
  el("rect",{x:-200,y:-200,width:900,height:1340,class:"floor"},svg);
  el("rect",{x:170,y:0,width:160,height:190,class:"pt"},svg);
  el("rect",{x:170,y:750,width:160,height:190,class:"pt"},svg);
  [["rect",{x:0,y:0,width:500,height:940}],["line",{x1:0,y1:470,x2:500,y2:470}],["circle",{cx:250,cy:470,r:60}],
   ["rect",{x:170,y:0,width:160,height:190}],["circle",{cx:250,cy:190,r:60}],["path",{d:"M30,0 L30,140 A237.5 237.5 0 0 0 470,140 L470,0"}],
   ["line",{x1:220,y1:40,x2:280,y2:40}],["path",{d:"M210,52 A40 40 0 0 0 290,52"}],
   ["rect",{x:170,y:750,width:160,height:190}],["circle",{cx:250,cy:750,r:60}],["path",{d:"M30,940 L30,800 A237.5 237.5 0 0 1 470,800 L470,940"}],
   ["line",{x1:220,y1:900,x2:280,y2:900}],["path",{d:"M210,888 A40 40 0 0 1 290,888"}]
  ].forEach(([n,a])=>el(n,Object.assign({class:"ln"},a),svg));
  const rim=el("circle",{cx:250,cy:52,r:9,class:"rim"},svg);
  el("circle",{cx:250,cy:888,r:9,class:"rim"},svg);

  /* ---- career stations ---- */
  const start={x:250,y:925};
  const stations=[{x:360,y:820,l:"KOMATSU"},{x:150,y:705,l:"QLU.AI"},{x:350,y:590,l:"EMUMBA"},{x:250,y:490,l:"RESOURCEPOOL"}];
  const stG=el("g",{},svg);
  const stEls=stations.map((s,i)=>{const g=el("g",{class:"station"},stG);el("circle",{cx:s.x,cy:s.y,r:8},g);
    const t=el("text",{x:s.x+(s.x<250?-16:16),y:s.y+5,"text-anchor":s.x<250?"end":"start"},g);t.textContent=s.l;
    if(i===3){t.setAttribute("x",s.x+16);t.setAttribute("text-anchor","start");t.setAttribute("y",s.y+22);}return g;});
  const route=[start,...stations], segs=[];let total=0;
  for(let i=1;i<route.length;i++){const d=Math.hypot(route[i].x-route[i-1].x,route[i].y-route[i-1].y);segs.push(d);total+=d;}

  /* ---- plays (half-court coords 300x250, scaled to the front court) ---- */
  const S=5/3, R=20;
  const plays=[
    {nodes:{R:[150,212,"R","Router",1],O:[52,152,"O","Overseer"],P:[248,152,"P","Planner"],A:[40,58,"A","Analyst"],Sc:[260,58,"S","Scribe"],C:[150,112,"C","AI CEO"]},
     edges:[["R","O"],["R","P"],["R","A"],["R","Sc"],["C","P","loop",-30,"argues"],["P","C","loop",-30]],seq:[0,4,5,1,2,3]},
    {nodes:{P:[150,212,"P","Planner",1],S:[50,140,"S","Security"],T:[250,140,"T","Tests"],Y:[150,118,"Y","Style","r"],G:[150,42,"G","Report","r"]},
     edges:[["P","S"],["P","T"],["P","Y"],["S","G"],["T","G"],["Y","G"]],seq:[0,3,1,4,2,5]},
    {nodes:{P:[150,212,"P","Planner",1],R:[50,170,"R","Retrieve"],D:[72,86,"D","Drafter"],C:[236,128,"C","Critic"],G:[150,42,"✓","Ship","r"]},
     edges:[["P","R"],["R","D"],["D","C"],["C","R","loop",34,"re-retrieve"],["C","D","loop",-34,"regenerate"],["C","G"]],seq:[0,1,2,3,1,2,4,2,5]},
    {nodes:{C:[150,212,"C","Client",1],A:[150,132,"A","Auth gate","r"],R1:[58,62,"1","Clients"],R2:[150,42,"2","Reports","r"],R3:[242,62,"3","Admin"]},
     edges:[["C","A"],["A","C","loop",-64,"401"],["A","R1"],["A","R2"],["A","R3"]],seq:[0,1,0,2,3,4]}
  ];
  plays.forEach((p,pi)=>{
    const g=el("g",{class:"play"},svg); p.g=g;
    const N={}; for(const k in p.nodes){const [x,y,t,l,f]=p.nodes[k];N[k]={x:x*S,y:y*S,t,l,f};} p.N=N;
    const eG=el("g",{},g), lG=el("g",{},g), nG=el("g",{},g);
    p.E=p.edges.map(([a,b,kind,bend,label],ei)=>{
      const A=N[a],B=N[b],dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L; let d,mid;
      if(!bend){d=`M${A.x+ux*(R+3)},${A.y+uy*(R+3)} L${B.x-ux*(R+6)},${B.y-uy*(R+6)}`;mid={x:(A.x+B.x)/2,y:(A.y+B.y)/2};}
      else{const b2=bend*S,mx=(A.x+B.x)/2-uy*b2,my=(A.y+B.y)/2+ux*b2,t1=Math.hypot(mx-A.x,my-A.y),t2=Math.hypot(B.x-mx,B.y-my);
        d=`M${A.x+(mx-A.x)/t1*(R+3)},${A.y+(my-A.y)/t1*(R+3)} Q${mx},${my} ${B.x-(B.x-mx)/t2*(R+6)},${B.y-(B.y-my)/t2*(R+6)}`;mid={x:(A.x+2*mx+B.x)/4,y:(A.y+2*my+B.y)/4};}
      const mid_=`m${pi}-${ei}`, mk=el("mask",{id:mid_,maskUnits:"userSpaceOnUse",x:-50,y:-50,width:600,height:600},defs);
      const mp=el("path",{d,stroke:"#fff","stroke-width":18,fill:"none",pathLength:1,"stroke-dasharray":"1 1","stroke-dashoffset":1,"stroke-linecap":"round"},mk);
      const path=el("path",{d,class:"edge"+(kind==="loop"?" loop":""),mask:`url(#${mid_})`,"marker-end":`url(#${kind==="loop"?"ahr":"ah"})`},eG);
      let lab=null; if(label){lab=el("text",{x:mid.x,y:mid.y+(bend>0?24:-10),class:"elbl"},lG);lab.textContent=label;}
      return {path,mp,lab,len:0};
    });
    for(const k in N){const n=N[k],ng=el("g",{class:"node"+(n.f===1?" lead":"")},nG);
      el("circle",{cx:n.x,cy:n.y,r:R},ng); const t=el("text",{x:n.x,y:n.y+1,class:"tg"},ng);t.textContent=n.t;
      let lx=n.x,ly=n.y+R+20,anc="middle"; if(n.f==="r"){lx=n.x+R+8;ly=n.y+6;anc="start";} else if(n.y>330){ly=n.y-R-10;}
      const l=el("text",{x:lx,y:ly,class:"nl","text-anchor":anc},ng);l.textContent=n.l;}
  });

  /* ---- ball + score ---- */
  const ballG=el("g",{},svg), ball=el("circle",{cx:start.x,cy:start.y,r:13,class:"ball"},ballG);
  const seam=el("path",{class:"seam"},ballG);
  const pop=el("text",{x:250,y:150,class:"score-pop"},svg); pop.textContent="+2";

  const steps=[...document.querySelectorAll(".step")];
  const logEls=stations.map((_,i)=>document.querySelector('.log [data-st="'+i+'"]'));
  const markStop=(i,on)=>{stEls[i].classList.toggle("on",on);if(logEls[i])logEls[i].classList.toggle("on",on);};
  const chap=document.getElementById("chap"), clock=document.getElementById("clock"), clockBox=document.getElementById("clockBox"), score=document.getElementById("score");
  const FULL=[0,0,500,940], FRONT=[-30,-24,560,540];
  let vbNow=FULL.slice();

  function setBall(x,y,r){ball.setAttribute("cx",x);ball.setAttribute("cy",y);ball.setAttribute("r",r);
    seam.setAttribute("d",`M${x-r},${y} L${x+r},${y} M${x},${y-r} L${x},${y+r}`);}

  function update(){
    const vh=innerHeight, mid=vh*(innerWidth<=860?0.62:0.5);
    let active=0,t=0;
    steps.forEach((s,i)=>{const r=s.getBoundingClientRect();if(r.top<=mid){active=i;t=clamp((mid-r.top)/r.height,0,1);}});
    const g=clamp(scrollY/Math.max(1,document.documentElement.scrollHeight-vh),0,1);
    const sc=Math.max(0.6,24-23.4*g); clock.textContent=sc.toFixed(1); clockBox.classList.toggle("low",sc<5);
    chap.textContent=steps[active].dataset.chap;

    // camera
    let k = active===0?0 : active===1?ease(clamp((t-0.72)/0.28,0,1)) : 1;
    const vb=FULL.map((v,i)=>lerp(v,FRONT[i],k)); svg.setAttribute("viewBox",vb.join(" "));

    // stations
    let ballX=start.x,ballY=start.y,ballR=13;
    if(active===0){ballY=lerp(960,start.y,ease(clamp(t*1.6,0,1)));}
    if(active===1){
      const u=clamp(t/0.72,0,1); let dist=u*total, i=0; while(i<segs.length-1&&dist>segs[i]){dist-=segs[i];i++;}
      const f=clamp(dist/segs[i],0,1); ballX=lerp(route[i].x,route[i+1].x,f); ballY=lerp(route[i].y,route[i+1].y,f);
      ballR=13-2.5*Math.abs(Math.sin(u*Math.PI*14));
      stEls.forEach((s,j)=>markStop(j,u*total>=segs.slice(0,j+1).reduce((a,b)=>a+b,0)-1));
    } else stEls.forEach((s,j)=>markStop(j,active>1));

    // plays
    plays.forEach((p,pi)=>{
      const on=+steps[active].dataset.play===pi && steps[active].dataset.play!==undefined;
      p.g.classList.toggle("active",on);
      const shown=new Array(p.E.length).fill(on&&active>2+pi-0?0:0);
      let u=on?clamp((t-0.06)/0.8,0,1)*p.seq.length:0, cur=Math.min(Math.floor(u),p.seq.length-1), frac=on?u-Math.floor(u):0;
      if(on&&u>=p.seq.length){cur=p.seq.length-1;frac=1;}
      const rev=new Array(p.E.length).fill(0);
      if(on){for(let s=0;s<cur;s++)rev[p.seq[s]]=1; rev[p.seq[cur]]=Math.max(rev[p.seq[cur]],frac);}
      p.E.forEach((e,i)=>{e.mp.setAttribute("stroke-dashoffset",1-rev[i]); if(e.lab)e.lab.style.opacity=rev[i]>.6?1:0;});
      if(on){
        const lead=Object.values(p.N).find(n=>n.f===1);
        if(u<=0){ballX=lead.x;ballY=lead.y-1;ballR=11;}
        else{const e=p.E[p.seq[cur]];if(!e.len)e.len=e.path.getTotalLength();const pt=e.path.getPointAtLength(e.len*frac);ballX=pt.x;ballY=pt.y;ballR=11;}
      }
    });

    // shot
    const last=steps.length-1; let made=false;
    if(active===last){
      const u=ease(clamp(t/0.55,0,1)); ballX=250; ballY=lerp(340,52,u); ballR=11*(1+0.8*Math.sin(Math.PI*u))*(u>=1?0.75:1);
      made=u>=1;
    }
    rim.classList.toggle("flash",made); pop.classList.toggle("on",made); score.textContent=made?"2":"0";
    setBall(ballX,ballY,ballR);
  }
  let ticking=false;
  const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{ticking=false;update();});}};
  addEventListener("scroll",onScroll,{passive:true}); addEventListener("resize",onScroll);
  update();

  /* ---- theme ---- */
  const rootEl=document.documentElement, themeBtn=document.getElementById("theme");
  const themeNow=()=>rootEl.dataset.theme||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");
  const paintTheme=()=>{const d=themeNow()==="dark";themeBtn.textContent=d?"Light":"Dark";themeBtn.setAttribute("aria-label","Switch to "+(d?"light":"dark")+" mode");};
  try{const s=localStorage.getItem("theme");if(s==="dark"||s==="light")rootEl.dataset.theme=s;}catch(e){}
  themeBtn.addEventListener("click",()=>{const n=themeNow()==="dark"?"light":"dark";rootEl.dataset.theme=n;try{localStorage.setItem("theme",n);}catch(e){}paintTheme();});
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change",paintTheme);
  paintTheme();

  const btn=document.getElementById("copy"), mail=document.getElementById("mail");
  btn.addEventListener("click",()=>{
    const reset=()=>setTimeout(()=>btn.textContent="Copy",1600);
    const sel=()=>{const r=document.createRange();r.selectNodeContents(mail);const s=getSelection();s.removeAllRanges();s.addRange(r);btn.textContent="Selected";reset();};
    try{navigator.clipboard.writeText(mail.textContent.trim()).then(()=>{btn.textContent="Copied";reset();},sel);}catch(e){sel();}
  });
})();
