// Nonaktifkan pemulihan posisi scroll bawaan browser
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Saat halaman selesai dimuat, scroll ke atas
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  // Opsi: bersihkan hash kalau ada (supaya reload tidak lompat ke anchor)
  if (location.hash) {
    history.replaceState(null, document.title, location.pathname + location.search);
  }
});

/* Loader (fade-out) */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader){ loader.style.opacity = "0"; setTimeout(()=> loader.style.display = "none", 400); }
});

/* Progress bar */
const bar = document.getElementById("progress-bar");
window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (bar && h > 0) bar.style.width = (window.scrollY / h * 100) + "%";
});

/* Scroll-to-top */
const topBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  if (!topBtn) return;
  window.scrollY > 300 ? topBtn.classList.add("show") : topBtn.classList.remove("show");
});
topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* Hamburger */
document.querySelector(".hamburger")?.addEventListener("click", () => {
  document.querySelector(".nav-links")?.classList.toggle("show");
});

/* Tema 3-mode + simpan */
(() => {
  const toggle = document.querySelector(".toggle-theme");
  const body = document.body;
  const modes = ["bg-neutral","bg-blue","bg-dark"];
  const saved = localStorage.getItem("lux-theme");
  if (saved && modes.includes(saved)){ body.classList.remove(...modes); body.classList.add(saved); toggle && (toggle.textContent = saved==="bg-neutral"?"🌞":saved==="bg-blue"?"🌊":"🌙"); }
  else { if(!modes.some(m=>body.classList.contains(m))){ body.classList.add("bg-neutral"); toggle && (toggle.textContent="🌞"); } }
  toggle?.addEventListener("click", () => {
    const cur = modes.find(m => body.classList.contains(m)) || "bg-neutral";
    const next = modes[(modes.indexOf(cur)+1)%modes.length];
    body.classList.remove(...modes); body.classList.add(next);
    toggle.textContent = next==="bg-neutral"?"🌞":next==="bg-blue"?"🌊":"🌙";
    localStorage.setItem("lux-theme", next);
  });
})();

/* Reveal */
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((ents)=>{
  ents.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("active"); io.unobserve(e.target); } });
},{threshold:.2});
revealEls.forEach(el=> io.observe(el));

/* Typing effect */
const words = ["Raju Nuardi Akbar", "Data Analyst", "Web Developer"];
let wi=0, ci=0, del=false;
(function type(){
  const el = document.getElementById("typed");
  if(!el) return;
  const w = words[wi];
  el.textContent = w.substring(0, ci);
  if(!del && ci < w.length) ci++; else if(del && ci>0) ci--;
  if(ci === w.length + 5) del = true;
  if(ci === 0 && del){ del=false; wi = (wi+1)%words.length; }
  setTimeout(type, del ? 80 : 120 + Math.random()*100);
})();

/* Ripple */
document.querySelectorAll(".btn.ripple").forEach(btn=>{
  btn.addEventListener("click", function(e){
    const r = document.createElement("span"); r.classList.add("ripple-span"); this.appendChild(r);
    const rect = this.getBoundingClientRect(); const d = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = d+"px";
    r.style.left = e.clientX - rect.left - d/2 + "px";
    r.style.top  = e.clientY - rect.top  - d/2 + "px";
    setTimeout(()=> r.remove(), 700);
  });
});

/* Skill bars & circles on view */
function animateBars(){
  document.querySelectorAll(".skill-bar .fill").forEach((bar,i)=>{
    const p = parseInt(bar.getAttribute("data-percent"),10); let c=0;
    setTimeout(()=>{
      const t = setInterval(()=>{
        if(c>=p) clearInterval(t);
        else { c++; bar.style.width = c+"%"; bar.querySelector("span").textContent = c+"%"; }
      },15);
    }, i*150);
  });
}
function animateCircles(){
  document.querySelectorAll(".circle").forEach((circle,i)=>{
    const p = parseInt(circle.getAttribute("data-percent"),10);
    const R=60, C=2*Math.PI*R; const prog = circle.querySelector("svg circle.progress"); const num = circle.querySelector(".number");
    let c=0;
    setTimeout(()=>{
      const t=setInterval(()=>{
        if(c>=p) clearInterval(t);
        else { c++; prog.style.strokeDashoffset = C - (c/100)*C; num.textContent = c+"%"; }
      },20);
    }, i*200);
  });
}
(() => {
  let done=false; const s = document.querySelector("#skills"); if(!s) return;
  const o = new IntersectionObserver((e)=>{ if(!done && e[0].isIntersecting){ animateBars(); animateCircles(); done=true; o.disconnect(); } }, {threshold:.3});
  o.observe(s);
})();

/* Lightbox */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lightbox-img");
const lbCap = document.getElementById("caption");
const lbClose = document.querySelector(".lightbox .close");
const gallery = document.querySelectorAll(".card img, .certificate-img");
let idx=0;
function showLB(i){
  const imgs = Array.from(gallery); if(!imgs.length) return;
  if(i<0) i = imgs.length-1; if(i>=imgs.length) i=0; idx=i;
  lb.style.display="flex"; lb.removeAttribute("hidden");
  lbImg.src = imgs[i].src; lbImg.alt = imgs[i].alt || ""; lbCap.textContent = imgs[i].alt || "";
}
gallery.forEach((g,i)=> g.addEventListener("click", ()=> showLB(i)));
lbClose?.addEventListener("click", ()=>{ lb.style.display="none"; lb.setAttribute("hidden",""); });
lb?.addEventListener("click",(e)=>{ if(e.target===lb){ lb.style.display="none"; lb.setAttribute("hidden",""); } });
window.addEventListener("keydown",(e)=>{ if(lb.style.display!=="flex") return; if(e.key==="ArrowLeft") showLB(idx-1); if(e.key==="ArrowRight") showLB(idx+1); if(e.key==="Escape"){ lb.style.display="none"; lb.setAttribute("hidden",""); } });

/* ========= GRID-LIMITED (per seksi) ========= */
(function gridLimited(){
  const grids = document.querySelectorAll(".grid-limited");
  grids.forEach(grid=>{
    const limit = parseInt(grid.getAttribute("data-limit")||"2",10);
    const cards = Array.from(grid.children).filter(el=> el.classList.contains("card"));
    if(cards.length <= limit) return;
    cards.slice(limit).forEach(el=> el.classList.add("is-hidden"));
    const wrap = document.createElement("div");
    wrap.className = "grid-toggle";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn glow";
    btn.textContent = "Tampilkan semua";
    wrap.appendChild(btn);
    grid.parentElement.appendChild(wrap);
    let opened = false;
    btn.addEventListener("click", ()=>{
      opened = !opened;
      cards.slice(limit).forEach(el=> el.classList.toggle("is-hidden", !opened));
      btn.textContent = opened ? "Tutup" : "Tampilkan semua";
    });
  });
})();

/* ===========================
   CV Download Language Picker
   =========================== */
(function cvLanguagePicker(){
  const dlLink = document.querySelector('.nav-right a[download]');
  if (!dlLink) return;

  const styleId = 'cv-choice-inline-style';
  if (!document.getElementById(styleId)) {
    const css = `
      .cv-choice{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;justify-content:center;align-items:center;z-index:4000}
      .cv-choice[hidden]{display:none}
      .cv-box{background:#1e293b;color:#fff;padding:1.5rem 2rem;border-radius:14px;box-shadow:0 10px 28px rgba(0,0,0,.4);
              text-align:center;max-width:340px;width:90%;position:relative}
      .cv-box h3{margin:0 0 .25rem 0;font-size:1.15rem}
      .cv-box p{margin:.25rem 0 .9rem 0;color:#cbd5e1}
      .cv-buttons{display:flex;gap:12px;justify-content:center}
      .cv-close{position:absolute;top:8px;right:12px;font-size:1.3rem;background:transparent;border:0;color:#fff;cursor:pointer}
    `;
    const st = document.createElement('style');
    st.id = styleId;
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);
  }

  let modal = document.getElementById('cvChoice');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'cvChoice';
    modal.className = 'cv-choice';
    modal.setAttribute('hidden','');
    modal.innerHTML = `
      <div class="cv-box" role="dialog" aria-modal="true" aria-labelledby="cvChoiceTitle">
        <button class="cv-close" type="button" aria-label="Tutup">×</button>
        <h3 id="cvChoiceTitle">Pilih Bahasa CV</h3>
        <p>Pilih versi CV yang ingin kamu download:</p>
        <div class="cv-buttons">
          <button type="button" class="btn" data-lang="id">Bahasa Indonesia 🇮🇩</button>
          <button type="button" class="btn-outline" data-lang="en">English 🇬🇧</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const closeBtn = modal.querySelector('.cv-close');

  function triggerDownload(filename, suggestedName){
    const a = document.createElement('a');
    a.href = filename;
    a.setAttribute('download', suggestedName || '');
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  dlLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.removeAttribute('hidden');
  });

  modal.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    const lang = btn.getAttribute('data-lang');
    if (lang === 'id') {
      triggerDownload('cv_indonesia.pdf', 'CV_RajuNuardi_Indonesia.pdf');
    } else if (lang === 'en') {
      triggerDownload('cv_english.pdf', 'CV_RajuNuardi_English.pdf');
    }
    modal.setAttribute('hidden','');
  });

  closeBtn?.addEventListener('click', () => modal.setAttribute('hidden',''));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.setAttribute('hidden',''); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hasAttribute('hidden')) modal.setAttribute('hidden',''); });
})();

/* ============================================
   ACTIVITIES & GALLERY – CAROUSEL “MELINGKAR”
   (1 item terlihat, snap, drag/scroll, tombol, keyboard, infinite)
   ============================================ */
(function galleryCarousel(){
  const wraps = document.querySelectorAll('.carou');
  if (!wraps.length) return;

  wraps.forEach(wrap => {
    const viewport = wrap.querySelector('.carou-viewport');
    const track    = wrap.querySelector('.carou-track');
    const btnPrev  = wrap.querySelector('.carou-btn.prev');
    const btnNext  = wrap.querySelector('.carou-btn.next');
    if (!viewport || !track) return;

    // ambil items asli
    let items = Array.from(track.querySelectorAll('.carou-item'));
    if (!items.length) return;
    const N = items.length;

    // clone untuk efek melingkar
    const firstClone = items[0].cloneNode(true);
    const lastClone  = items[N-1].cloneNode(true);
    track.insertBefore(lastClone, items[0]);
    track.appendChild(firstClone);

    // state & metrik
    let gap = 16;
    let step = 0;               // lebar 1 “halaman” (1 item)
    let currentIndex = 1;       // mulai di item asli pertama (setelah lastClone)
    let snappingTimer = null;
    let jumping = false;        // mencegah animasi saat lompat

    function computeMetrics(){
      const cs = getComputedStyle(track);
      gap = parseInt(cs.columnGap || cs.gap || '16', 10);
      // Dengan CSS grid-auto-columns:100%, lebar item ≈ lebar viewport
      // Gunakan clientWidth viewport supaya konsisten
      step = Math.round(viewport.clientWidth + gap);
    }

    function jumpTo(index){
      jumping = true;
      const prev = viewport.style.scrollBehavior;
      viewport.style.scrollBehavior = 'auto';
      viewport.scrollLeft = index * step;
      viewport.style.scrollBehavior = prev || '';
      currentIndex = index;
      jumping = false;
    }

    function scrollToIndex(index, smooth=true){
      currentIndex = index;
      viewport.scrollTo({ left: index * step, behavior: smooth ? 'smooth' : 'auto' });
    }

    // init metrik & posisikan ke index 1 (item asli pertama)
    computeMetrics();
    window.addEventListener('resize', () => {
      const ratio = viewport.scrollLeft / (step || 1);
      computeMetrics();
      // pertahankan posisi kira-kira di index yg sama
      jumpTo(Math.round(ratio));
    });
    // posisikan awal
    requestAnimationFrame(() => jumpTo(1));

    // tombol
    btnPrev?.addEventListener('click', () => scrollToIndex(currentIndex - 1));
    btnNext?.addEventListener('click', () => scrollToIndex(currentIndex + 1));

    // snap & loop saat berhenti scroll
    function onScrollStop(){
      if (snappingTimer) clearTimeout(snappingTimer);
      snappingTimer = setTimeout(() => {
        if (jumping) return;
        const idx = Math.round(viewport.scrollLeft / step);

        // jika di clone kiri (0) loncat ke akhir (N)
        if (idx <= 0) { jumpTo(N); return; }
        // jika di clone kanan (N+1) loncat ke awal (1)
        if (idx >= N + 1) { jumpTo(1); return; }

        // snap halus ke item terdekat
        scrollToIndex(idx);
      }, 90);
    }
    viewport.addEventListener('scroll', onScrollStop, { passive: true });

    // drag / geser
    let isDown = false, startX = 0, startLeft = 0;
    function onPointerDown(e){
      isDown = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      startLeft = viewport.scrollLeft;
      viewport.classList.add('dragging');
    }
    function onPointerMove(e){
      if(!isDown) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      const dx = x - startX;
      viewport.scrollLeft = startLeft - dx;
      e.preventDefault();
    }
    function onPointerUp(){
      if(!isDown) return;
      isDown = false;
      viewport.classList.remove('dragging');
      onScrollStop();
    }
    viewport.addEventListener('mousedown', onPointerDown);
    viewport.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    viewport.addEventListener('touchmove', onPointerMove, { passive: false });
    viewport.addEventListener('touchend', onPointerUp);

    // roda mouse → horizontal
    viewport.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        viewport.scrollLeft += e.deltaY;
      }
    }, { passive: false });

    // keyboard
    function isViewportOnScreen(){
      const r = viewport.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    }
    window.addEventListener('keydown', (e) => {
      if (!isViewportOnScreen()) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(currentIndex - 1); }
      if (e.key === 'ArrowRight'){ e.preventDefault(); scrollToIndex(currentIndex + 1); }
    });
  });
})();
