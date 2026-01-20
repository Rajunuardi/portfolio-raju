/* ================================
   SCRIPT.JS – Portfolio Raju
   (CLEAN + sesuai HTML/CSS final)
   - Loader + Progress bar
   - Navbar hamburger + active state
   - Theme 3-mode (saved)
   - Reveal anim
   - Typing effect
   - Ripple button
   - Skills bars + circle
   - Lightbox (cert + project view live)
   - Grid limited toggle
   - CV modal (btnCv -> cvChoice)
   ================================ */

/* ========== Scroll restore OFF + top on load ========== */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  if (location.hash) {
    history.replaceState(null, document.title, location.pathname + location.search);
  }
});

/* ========== Loader (fade out) ========== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.style.opacity = "0";
  setTimeout(() => (loader.style.display = "none"), 400);
});

/* ========== Progress bar ========== */
const progressBar = document.getElementById("progress-bar");
window.addEventListener("scroll", () => {
  if (!progressBar) return;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (h <= 0) return;
  progressBar.style.width = (window.scrollY / h) * 100 + "%";
});

/* ========== Scroll-to-top ========== */
const topBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  if (!topBtn) return;
  window.scrollY > 300 ? topBtn.classList.add("show") : topBtn.classList.remove("show");
});
topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ========== Hamburger menu ========== */
(() => {
  const burger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!burger || !navLinks) return;

  burger.addEventListener("click", () => {
    const opened = navLinks.classList.toggle("show");
    burger.setAttribute("aria-expanded", opened ? "true" : "false");
  });

  // close menu when click a link (mobile UX)
  navLinks.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    navLinks.classList.remove("show");
    burger.setAttribute("aria-expanded", "false");
  });

  // close menu on outside click
  document.addEventListener("click", (e) => {
    if (!navLinks.classList.contains("show")) return;
    if (e.target.closest(".nav-container")) return;
    navLinks.classList.remove("show");
    burger.setAttribute("aria-expanded", "false");
  });
})();

/* ========== Active nav link on scroll ========== */
(() => {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
  };

  const io = new IntersectionObserver(
    (entries) => {
      // pick the most visible section
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis?.target?.id) setActive(vis.target.id);
    },
    { threshold: [0.25, 0.35, 0.5, 0.65] }
  );

  sections.forEach((s) => io.observe(s));
})();

/* ========== Theme 3-mode + save ========== */
(() => {
  const toggle = document.querySelector(".toggle-theme");
  const body = document.body;
  const modes = ["bg-neutral", "bg-blue", "bg-dark"];
  const saved = localStorage.getItem("lux-theme");

  const setIcon = (mode) => {
    if (!toggle) return;
    toggle.textContent = mode === "bg-neutral" ? "🌞" : mode === "bg-blue" ? "🌊" : "🌙";
  };

  if (saved && modes.includes(saved)) {
    body.classList.remove(...modes);
    body.classList.add(saved);
    setIcon(saved);
  } else {
    if (!modes.some((m) => body.classList.contains(m))) body.classList.add("bg-neutral");
    setIcon(modes.find((m) => body.classList.contains(m)) || "bg-neutral");
  }

  toggle?.addEventListener("click", () => {
    const cur = modes.find((m) => body.classList.contains(m)) || "bg-neutral";
    const next = modes[(modes.indexOf(cur) + 1) % modes.length];
    body.classList.remove(...modes);
    body.classList.add(next);
    setIcon(next);
    localStorage.setItem("lux-theme", next);
  });
})();

/* ========== Reveal on view ========== */
(() => {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("active");
        io.unobserve(e.target);
      });
    },
    { threshold: 0.2 }
  );

  revealEls.forEach((el) => io.observe(el));
})();

/* ========== Typing effect (simple) ========== */
(() => {
  const el = document.getElementById("typed");
  if (!el) return;

  const words = ["Raju Nuardi Akbar", "Data Analyst", ];
  let wi = 0, ci = 0, del = false, hold = 0;

  function tick() {
    const w = words[wi];
    el.textContent = w.substring(0, ci);

    if (!del && ci < w.length) {
      ci++;
    } else if (!del && ci === w.length) {
      hold++;
      if (hold > 10) { del = true; hold = 0; }
    } else if (del && ci > 0) {
      ci--;
    } else if (del && ci === 0) {
      del = false;
      wi = (wi + 1) % words.length;
    }

    setTimeout(tick, del ? 70 : 110);
  }
  tick();
})();

/* ========== Ripple button ========== */
(() => {
  document.querySelectorAll(".btn.ripple, .btn-outline.ripple").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const r = document.createElement("span");
      r.className = "ripple-span";
      this.appendChild(r);

      const rect = this.getBoundingClientRect();
      const d = Math.max(rect.width, rect.height);
      r.style.width = r.style.height = d + "px";
      r.style.left = e.clientX - rect.left - d / 2 + "px";
      r.style.top = e.clientY - rect.top - d / 2 + "px";

      setTimeout(() => r.remove(), 700);
    });
  });
})();

/* ========== Skills bars + circles (once on skills visible) ========== */
function animateBars() {
  document.querySelectorAll(".skill-bar .fill").forEach((bar, i) => {
    const p = parseInt(bar.getAttribute("data-percent") || "0", 10);
    const label = bar.querySelector("span");
    let c = 0;

    setTimeout(() => {
      const t = setInterval(() => {
        if (c >= p) return clearInterval(t);
        c++;
        bar.style.width = c + "%";
        if (label) label.textContent = c + "%";
      }, 14);
    }, i * 120);
  });
}

function animateCircles() {
  // CSS kamu: circle svg circle r=40; dasharray 251
  const R = 40;
  const C = 2 * Math.PI * R; // ≈ 251.2

  document.querySelectorAll(".circle").forEach((circle, i) => {
    const p = parseInt(circle.getAttribute("data-percent") || "0", 10);
    const prog = circle.querySelector("svg circle.progress");
    const num = circle.querySelector(".number");
    if (!prog) return;

    // pastikan dasharray sesuai
    prog.style.strokeDasharray = String(C);
    prog.style.strokeDashoffset = String(C);

    let c = 0;
    setTimeout(() => {
      const t = setInterval(() => {
        if (c >= p) return clearInterval(t);
        c++;
        prog.style.strokeDashoffset = String(C - (c / 100) * C);
        if (num) num.textContent = c + "%";
      }, 18);
    }, i * 170);
  });
}

(() => {
  let done = false;
  const skills = document.querySelector("#skills");
  if (!skills) return;

  const io = new IntersectionObserver(
    (entries) => {
      if (done) return;
      if (!entries[0].isIntersecting) return;
      animateBars();
      animateCircles();
      done = true;
      io.disconnect();
    },
    { threshold: 0.3 }
  );

  io.observe(skills);
})();

/* =========================================================
   LIGHTBOX (sesuai HTML final)
   - cert (.certificate-img) + optional gallery (.gallery-grid img)
   - project View Live (.js-viewlive) -> tampilkan tombol Kembali
   ========================================================= */
(() => {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("caption");
  const btnClose = lb?.querySelector(".close");
  const btnBack = lb?.querySelector(".lb-back");

  if (!lb || !lbImg || !btnClose || !btnBack) return;

  const gallery = Array.from(document.querySelectorAll(".certificate-img, .gallery-grid img"));
  let idx = 0;

  function openLightbox({ src, alt = "", caption = "", showBack = false }) {
    lbImg.src = src;
    lbImg.alt = alt || caption || "Preview";
    if (lbCap) lbCap.textContent = caption || alt || "";

    btnBack.style.display = showBack ? "inline-flex" : "none";

    lb.style.display = "flex";
    lb.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lb.style.display = "none";
    lb.setAttribute("hidden", "");
    document.body.style.overflow = "";
    lbImg.src = "";
    if (lbCap) lbCap.textContent = "";
  }

  function showGallery(i) {
    if (!gallery.length) return;
    if (i < 0) i = gallery.length - 1;
    if (i >= gallery.length) i = 0;
    idx = i;

    const img = gallery[i];
    openLightbox({
      src: img.getAttribute("src"),
      alt: img.getAttribute("alt") || "",
      caption: img.getAttribute("alt") || "",
      showBack: false
    });
  }

  // open from certificate/gallery thumbnail
  gallery.forEach((img, i) => {
    img.addEventListener("click", (e) => {
      e.preventDefault();
      showGallery(i);
    });
  });

  // View Live project (pakai class HTML kamu: .js-viewlive)
  document.querySelectorAll(".js-viewlive").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const src = btn.getAttribute("href");
      const cap = btn.getAttribute("data-caption") || "Dashboard Preview";
      if (!src || src === "#") return;

      openLightbox({
        src,
        alt: cap,
        caption: cap,
        showBack: true
      });
    });
  });

  // close handlers
  btnClose.addEventListener("click", closeLightbox);
  btnBack.addEventListener("click", closeLightbox);

  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  window.addEventListener("keydown", (e) => {
    if (lb.getAttribute("hidden") !== null) return; // hidden ada -> tidak aktif

    if (e.key === "Escape") closeLightbox();
    if (gallery.length) {
      if (e.key === "ArrowLeft") showGallery(idx - 1);
      if (e.key === "ArrowRight") showGallery(idx + 1);
    }
  });
})();

/* ========== GRID-LIMITED per section ========== */
(() => {
  const grids = document.querySelectorAll(".grid-limited");
  grids.forEach((grid) => {
    const limit = parseInt(grid.getAttribute("data-limit") || "2", 10);

    // grid anaknya bisa card / element lain
    const items = Array.from(grid.children);

    if (items.length <= limit) return;

    items.slice(limit).forEach((el) => el.classList.add("is-hidden"));

    const wrap = document.createElement("div");
    wrap.className = "grid-toggle";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn glow";
    btn.textContent = "Tampilkan semua";

    wrap.appendChild(btn);
    grid.parentElement?.appendChild(wrap);

    let opened = false;
    btn.addEventListener("click", () => {
      opened = !opened;
      items.slice(limit).forEach((el) => el.classList.toggle("is-hidden", !opened));
      btn.textContent = opened ? "Tutup" : "Tampilkan semua";
    });
  });
})();

/* ========== CV Modal (btnCv -> #cvChoice) ========== */
(() => {
  const btn = document.getElementById("btnCv");
  const modal = document.getElementById("cvChoice");
  const closeBtn = modal?.querySelector(".cv-close");
  if (!btn || !modal) return;

  const open = () => modal.removeAttribute("hidden");
  const close = () => modal.setAttribute("hidden", "");

  btn.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);

  // click outside box closes modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) close();
  });
})();
/* ===========================
   FIX untuk HTML FINAL kamu
   - View Live pakai .js-viewlive
   - CV modal pakai tombol #btnCv
   - Hamburger update aria-expanded
   =========================== */

/* Hamburger + aria-expanded */
(() => {
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav-links");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    nav.classList.toggle("show");
    burger.setAttribute("aria-expanded", nav.classList.contains("show") ? "true" : "false");
  });
})();

/* View Live (Project) -> buka lightbox (pakai class HTML: .js-viewlive) */
(() => {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("caption");
  const lbClose = document.querySelector(".lightbox .close");
  const backBtn = document.querySelector(".lightbox .lb-back");

  if (!lb || !lbImg) return;

  function openLB({ src, caption = "", showBack = false }) {
    lbImg.src = src;
    lbImg.alt = caption || "Preview";
    if (lbCap) lbCap.textContent = caption || "";

    if (backBtn) backBtn.style.display = showBack ? "inline-flex" : "none";

    lb.style.display = "flex";
    lb.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLB() {
    lb.style.display = "none";
    lb.setAttribute("hidden", "");
    document.body.style.overflow = "";
    lbImg.src = "";
    if (lbCap) lbCap.textContent = "";
  }

  // tombol close & back
  lbClose?.addEventListener("click", closeLB);
  backBtn?.addEventListener("click", closeLB);

  // klik background
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });

  // ESC
  window.addEventListener("keydown", (e) => {
    if (lb.style.display === "flex" && e.key === "Escape") closeLB();
  });

  // untuk tombol View Live di project (HTML kamu: .js-viewlive)
  document.querySelectorAll(".js-viewlive").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const src = btn.getAttribute("href");
      const cap = btn.getAttribute("data-caption") || "Dashboard Preview";
      if (!src || src === "#") return;
      openLB({ src, caption: cap, showBack: true });
    });
  });
})();

/* CV Modal: tombol navbar #btnCv buka modal #cvChoice */
(() => {
  const btn = document.getElementById("btnCv");
  const modal = document.getElementById("cvChoice");
  const closeBtn = modal?.querySelector(".cv-close");

  if (!btn || !modal) return;

  function open() { modal.removeAttribute("hidden"); }
  function close() { modal.setAttribute("hidden", ""); }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    open();
  });

  closeBtn?.addEventListener("click", close);

  modal.addEventListener("click", (e) => {
    // klik luar box => tutup
    if (e.target === modal) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hasAttribute("hidden")) close();
  });
})();
/* ===========================
   Experience image -> Lightbox
   =========================== */
(() => {
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("caption");
  const closeBtn = document.querySelector("#lightbox .close");
  const backBtn = document.querySelector("#lightbox .lb-back");

  if (!lb || !lbImg) return;

  function openLB(src, captionText = "") {
    lbImg.src = src;
    lbImg.alt = captionText || "Preview";
    if (lbCap) lbCap.textContent = captionText;

    // experience tidak butuh tombol kembali
    if (backBtn) backBtn.style.display = "none";

    lb.style.display = "flex";
    lb.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLB() {
    lb.style.display = "none";
    lb.setAttribute("hidden", "");
    document.body.style.overflow = "";
    lbImg.src = "";
    if (lbCap) lbCap.textContent = "";
  }

  closeBtn?.addEventListener("click", closeLB);
  backBtn?.addEventListener("click", closeLB);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLB(); });

  window.addEventListener("keydown", (e) => {
    if (lb.style.display === "flex" && e.key === "Escape") closeLB();
  });

  // KHUSUS gambar experience
  document.querySelectorAll("#experience .card-media img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      const captionText = img.alt || "Experience Preview";
      openLB(img.src, captionText);
    });
  });
})();

/* =========================================
   Fade + Up + Stagger (Skills & Tools)
   ========================================= */
(() => {
  const groups = document.querySelectorAll(".tools-grid, .skill-cards");
  if (!groups.length) return;

  // state awal
  groups.forEach(group => {
    group.querySelectorAll(".tool-card, .skill-card").forEach(el => {
      el.classList.add("reveal-item");
      el.classList.remove("in");
      el.style.transitionDelay = "0ms";
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const groupItems = Array.from(
        entry.target.querySelectorAll(".tool-card, .skill-card")
      );

      groupItems.forEach((el, i) => {
        el.style.transitionDelay = (i * 80) + "ms";
      });

      requestAnimationFrame(() => {
        groupItems.forEach((el) => el.classList.add("in"));
      });

      io.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  groups.forEach((g) => io.observe(g));
})();

(() => {
  const grid = document.querySelector(".tools-grid");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".tool-card"));

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;

    items.forEach((el, i) => {
      el.style.transitionDelay = (i * 80) + "ms";
      el.classList.add("in");
    });

    io.disconnect();
  }, { threshold: 0.2 });

  io.observe(grid);
})();
