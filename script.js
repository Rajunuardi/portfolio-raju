/* ================================
   SCRIPT.JS – Portfolio Raju (CLEAN + PDF LIGHTBOX FIX)
   - Loader + Progress bar
   - Scroll-to-top
   - Navbar hamburger + active state
   - Theme 3-mode (saved)
   - Reveal anim (.reveal -> .active)
   - Typing effect
   - Ripple button
   - Lightbox (cert + project preview + experience img) + PDF iframe scroll
   - Grid limited toggle
   - CV modal (btnCv -> cvChoice)
   ================================ */

(() => {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const setBodyLock = (locked) => {
    document.body.style.overflow = locked ? "hidden" : "";
  };

  /* ========== Scroll restore OFF + top on load + loader fade ========== */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  window.addEventListener("load", () => {
    // always start at top
    window.scrollTo(0, 0);

    // remove hash from URL (optional)
    if (location.hash) {
      history.replaceState(null, document.title, location.pathname + location.search);
    }

    // loader fade out
    const loader = $("#loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => (loader.style.display = "none"), 400);
    }
  });

  /* ========== Progress bar ========== */
  const progressBar = $("#progress-bar");
  window.addEventListener("scroll", () => {
    if (!progressBar) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (h <= 0) return;
    progressBar.style.width = (window.scrollY / h) * 100 + "%";
  });

  /* ========== Scroll-to-top ========== */
  const topBtn = $("#scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (!topBtn) return;
    topBtn.classList.toggle("show", window.scrollY > 300);
  });
  topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ========== Hamburger menu ========== */
  (() => {
    const burger = $(".hamburger");
    const navLinks = $(".nav-links");
    const navWrap = $(".nav-container");
    if (!burger || !navLinks) return;

    const close = () => {
      navLinks.classList.remove("show");
      burger.setAttribute("aria-expanded", "false");
    };

    burger.addEventListener("click", () => {
      const opened = navLinks.classList.toggle("show");
      burger.setAttribute("aria-expanded", opened ? "true" : "false");
    });

    // close when click a link
    navLinks.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) close();
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("show")) return;
      if (navWrap && e.target.closest(".nav-container")) return;
      close();
    });

    // close on Escape
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  })();

  /* ========== Active nav link on scroll ========== */
  (() => {
    const links = $$(".nav-links a");
    if (!links.length) return;

    const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
    };

    const io = new IntersectionObserver(
      (entries) => {
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
    const toggle = $(".toggle-theme");
    const body = document.body;
    const modes = ["bg-neutral", "bg-blue", "bg-dark"];
    const saved = localStorage.getItem("lux-theme");

    const setIcon = (mode) => {
      if (!toggle) return;
      toggle.textContent = mode === "bg-neutral" ? "🌞" : mode === "bg-blue" ? "🌊" : "🌙";
    };

    const apply = (mode) => {
      body.classList.remove(...modes);
      body.classList.add(mode);
      setIcon(mode);
      localStorage.setItem("lux-theme", mode);
    };

    if (saved && modes.includes(saved)) apply(saved);
    else {
      const current = modes.find((m) => body.classList.contains(m)) || "bg-neutral";
      apply(current);
    }

    toggle?.addEventListener("click", () => {
      const cur = modes.find((m) => body.classList.contains(m)) || "bg-neutral";
      const next = modes[(modes.indexOf(cur) + 1) % modes.length];
      apply(next);
    });
  })();

  /* ========== Reveal on view (.reveal -> .active) ========== */
  (() => {
    const revealEls = $$(".reveal");
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
/* ========== Tools stagger delay (muncul satu-satu) ========== */
(() => {
  const items = document.querySelectorAll("#skills .tool-card.reveal-item");
  items.forEach((el, i) => {
    el.style.setProperty("--d", `${i * 70}ms`);
  });
})();

  /* ========== Typing effect (simple) ========== */
  (() => {
    const el = $("#typed");
    if (!el) return;

    const words = ["Raju Nuardi Akbar", "Data Analyst"];
    let wi = 0;
    let ci = 0;
    let del = false;
    let hold = 0;

    function tick() {
      const w = words[wi];
      el.textContent = w.substring(0, ci);

      if (!del && ci < w.length) ci++;
      else if (!del && ci === w.length) {
        hold++;
        if (hold > 10) {
          del = true;
          hold = 0;
        }
      } else if (del && ci > 0) ci--;
      else {
        del = false;
        wi = (wi + 1) % words.length;
      }

      setTimeout(tick, del ? 70 : 110);
    }

    tick();
  })();

  /* ========== Ripple button ========== */
  (() => {
    $$(".btn.ripple, .btn-outline.ripple").forEach((btn) => {
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

  /* =========================================================
     LIGHTBOX (cert + project preview + experience img)
     + PDF support via iframe (#lightbox-pdf)
     ========================================================= */
  (() => {
    const lb = $("#lightbox");
    const lbImg = $("#lightbox-img");
    const lbPdf = $("#lightbox-pdf"); // ✅ NEW
    const lbCap = $("#caption");
    const btnClose = lb?.querySelector(".close");
    const btnBack = lb?.querySelector(".lb-back");

    if (!lb || !lbImg || !lbPdf || !btnClose || !btnBack) return;

    const certThumbs = $$(".certificate-img");

    // gallery hanya untuk cert yang bukan PDF
    const gallery = certThumbs.filter((img) => {
      const a = img.closest("a");
      const href = (a?.getAttribute("href") || "").trim();
      return !/\.pdf(\?|#|$)/i.test(href);
    });

    let idx = 0;
    let mode = "single"; // "gallery" | "single"

    const open = ({ src, alt = "", caption = "", showBack = false, lock = true }) => {
      const cleanSrc = (src || "").trim();
      const isPdf = /\.pdf(\?|#|$)/i.test(cleanSrc);

      if (isPdf) {
        // PDF -> iframe
        lbImg.hidden = true;
        lbImg.removeAttribute("src");

        lbPdf.hidden = false;
        lbPdf.src = "";
        lbPdf.src = cleanSrc;
      } else {
        // image -> img
        lbPdf.hidden = true;
        lbPdf.src = "";

        lbImg.hidden = false;
        lbImg.src = cleanSrc;
        lbImg.alt = alt || caption || "Preview";
      }

      if (lbCap) lbCap.textContent = caption || alt || "";
      btnBack.style.display = showBack ? "inline-flex" : "none";

      lb.classList.add("show");
      lb.removeAttribute("hidden");
      if (lock) setBodyLock(true);
    };

    const close = () => {
      lb.classList.remove("show");
      lb.setAttribute("hidden", "");
      setBodyLock(false);

      // reset image
      lbImg.src = "";
      lbImg.hidden = false;

      // reset pdf
      lbPdf.src = "";
      lbPdf.hidden = true;

      if (lbCap) lbCap.textContent = "";
      mode = "single";
    };

   const showGallery = (i) => {
  if (!gallery.length) return;
  if (i < 0) i = gallery.length - 1;
  if (i >= gallery.length) i = 0;
  idx = i;

  const img = gallery[i];
  const a = img.closest("a");
  const href = (a?.getAttribute("href") || img.getAttribute("src") || "").trim();
  const cap = img.getAttribute("alt") || "Preview";

  open({
    src: href,
    alt: cap,
    caption: cap,
    showBack: false,
  });

  mode = "gallery";
};

    // cert click (img + PDF)
certThumbs.forEach((img) => {
  img.addEventListener("click", (e) => {
    const a = img.closest("a");
    const href = (a?.getAttribute("href") || "").trim();

    // PDF → buka di lightbox (iframe)
    if (/\.pdf(\?|#|$)/i.test(href)) {
      e.preventDefault();
      const cap = img.getAttribute("alt") || "PDF Preview";
      open({ src: href, alt: cap, caption: cap, showBack: true });
      mode = "single";
      return;
    }

    // IMAGE → buka gallery
    e.preventDefault();
    const i = gallery.indexOf(img);
    if (i !== -1) showGallery(i);
  });
});

    // project preview (single mode, showBack true)
    $$(".js-viewlive").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const src = btn.getAttribute("href");
        const cap = btn.getAttribute("data-caption") || "Dashboard Preview";
        if (!src || src === "#") return;

        open({ src, alt: cap, caption: cap, showBack: true });
        mode = "single";
      });
    });

    // experience image (single mode, showBack false)
    $$("#experience .card-media img").forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        const cap = img.alt || "Experience Preview";
        open({ src: img.src, alt: cap, caption: cap, showBack: false });
        mode = "single";
      });
    });

    // close handlers
    btnClose.addEventListener("click", close);
    btnBack.addEventListener("click", close);

    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });

    window.addEventListener("keydown", (e) => {
      const isOpen = !lb.hasAttribute("hidden");
      if (!isOpen) return;

      if (e.key === "Escape") close();

      // arrow nav only for gallery cert images
      if (mode === "gallery" && gallery.length) {
        if (e.key === "ArrowLeft") showGallery(idx - 1);
        if (e.key === "ArrowRight") showGallery(idx + 1);
      }
    });
  })();

  /* ========== GRID-LIMITED per section ========== */
  (() => {
    const grids = $$(".grid-limited");
    grids.forEach((grid) => {
      const limit = parseInt(grid.getAttribute("data-limit") || "2", 10);
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
    const btn = $("#btnCv");
    const modal = $("#cvChoice");
    const closeBtn = modal?.querySelector(".cv-close");
    const box = modal?.querySelector(".cv-box");
    if (!btn || !modal) return;

    const open = () => modal.removeAttribute("hidden");
    const close = () => modal.setAttribute("hidden", "");

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });

    closeBtn?.addEventListener("click", close);

    // click outside box closes modal
    modal.addEventListener("click", (e) => {
      if (box && !e.target.closest(".cv-box")) close();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hasAttribute("hidden")) close();
    });
  })();
})();
document.querySelectorAll(".exp-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("aria-controls");
    const panel = document.getElementById(id);
    const isOpen = btn.getAttribute("aria-expanded") === "true";

    btn.setAttribute("aria-expanded", String(!isOpen));
    panel.hidden = isOpen;

    const icon = btn.querySelector("i");
    if (icon) icon.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
  });
});
