/* ── Solar Portfolio — scene engine ───────────────────────── */
(function () {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── data ────────────────────────────────────────────────── */
  const PLANETS = [
    {
      id: "x",
      label: "01 / X",
      handle: "@6001k1d",
      quip: "hot takes, occasionally lukewarm",
      glyph: "X",
      url: "https://x.com/6001k1d",
      r: 0.32,          // orbit radius, fraction of half-width
      size: 30,         // planet diameter px
      period: 16,       // seconds per revolution
      phase: 0.9,
      feature: "moon",
      dashed: false,
    },
    {
      id: "li",
      label: "02 / LinkedIn",
      handle: "/in/awaisisane",
      quip: "professional mode: engaged",
      glyph: "in",
      url: "https://www.linkedin.com/in/awaisisane/",
      r: 0.52,
      size: 42,
      period: 26,
      phase: 2.7,
      feature: "crater",
      dashed: true,
    },
    {
      id: "gh",
      label: "03 / GitHub",
      handle: "@AwaisIsane",
      quip: "I paint contribution graphs. literally.",
      glyph: "gh",
      url: "https://github.com/AwaisIsane",
      r: 0.72,
      size: 38,
      period: 38,
      phase: 4.5,
      feature: "band",
      dashed: false,
    },
    {
      id: "cv",
      label: "04 / Resume",
      handle: "PDF",
      quip: "radiologist-approved pixels inside",
      glyph: "cv",
      url: "Awais-Isane-Resume.pdf",
      r: 0.94,
      size: 46,
      period: 54,
      phase: 5.8,
      feature: "saturn",
      dashed: false,
    },
  ];

  const DEFAULT_READOUT = "hover a body — click the sun for the saga";

  /* ── dom refs ────────────────────────────────────────────── */
  const system = document.getElementById("system");
  const readout = document.getElementById("readout");
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");

  /* ── build orbits + planets ──────────────────────────────── */
  const nodes = []; // { el, orbitEl, data, angVel, hover }

  PLANETS.forEach(function (p) {
    const orbit = document.createElement("div");
    orbit.className = "orbit" + (p.dashed ? " dashed" : "");
    system.appendChild(orbit);

    const a = document.createElement("a");
    a.className = "planet";
    a.href = p.url;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", p.label.replace(/^\d+ \/ /, ""));
    a.dataset.id = p.id;

    let featureHtml = "";
    if (p.feature === "saturn") featureHtml = '<span class="saturn"></span>';
    if (p.feature === "moon") featureHtml = '<span class="moonpath"></span>';
    if (p.feature === "crater")
      featureHtml =
        '<span class="crater" style="width:6px;height:6px;top:22%;left:30%"></span>' +
        '<span class="crater" style="width:4px;height:4px;top:58%;left:62%"></span>';
    if (p.feature === "band") featureHtml = '<span class="band"></span>';

    a.innerHTML =
      '<span class="body" style="width:' + p.size + "px;height:" + p.size + 'px">' +
      featureHtml +
      '<span class="glyph" style="font-size:' + Math.round(p.size * 0.38) + 'px">' +
      p.glyph +
      "</span></span>" +
      '<span class="tag"><span>' + p.label + " — " + p.handle + "</span></span>";

    system.appendChild(a);

    const node = {
      el: a,
      orbitEl: orbit,
      data: p,
      angle: p.phase,
      angVel: 1, // multiplier, eased
      hover: false,
    };

    a.addEventListener("mouseenter", function () {
      node.hover = true;
      orbit.classList.add("lit");
      readout.textContent = p.label + " — " + p.handle + " · " + p.quip;
      readout.classList.add("active");
    });
    a.addEventListener("mouseleave", function () {
      node.hover = false;
      orbit.classList.remove("lit");
      readout.textContent = DEFAULT_READOUT;
      readout.classList.remove("active");
    });
    a.addEventListener("focus", function () {
      readout.textContent = p.label + " — " + p.handle + " · " + p.quip;
      readout.classList.add("active");
    });
    a.addEventListener("blur", function () {
      readout.textContent = DEFAULT_READOUT;
      readout.classList.remove("active");
    });

    nodes.push(node);
  });

  readout.textContent = DEFAULT_READOUT;

  /* sun → star wars resume crawl */
  (function crawlEgg() {
    const sun = document.getElementById("sun");
    const overlay = document.getElementById("crawl-overlay");
    const intro = document.getElementById("crawl-intro");
    const text = document.getElementById("crawl-text");
    const endCard = document.getElementById("crawl-end");

    function startCrawl() {
      endCard.hidden = true;
      intro.classList.remove("run");
      text.classList.remove("run");
      void text.offsetWidth; // restart animations
      intro.classList.add("run");
      text.classList.add("run");
    }

    function openCrawl() {
      overlay.hidden = false;
      startCrawl();
    }

    function closeCrawl() {
      overlay.hidden = true;
      intro.classList.remove("run");
      text.classList.remove("run");
      endCard.hidden = true;
    }

    sun.style.cursor = "pointer";
    sun.setAttribute("title", "Click for the saga");
    sun.addEventListener("click", function () {
      sun.animate(
        [
          { transform: "translate(-50%,-50%) scale(1)" },
          { transform: "translate(-50%,-50%) scale(1.12)" },
          { transform: "translate(-50%,-50%) scale(1)" },
        ],
        { duration: 300, easing: "ease-out" }
      );
      openCrawl();
    });

    text.addEventListener("animationend", function () {
      endCard.hidden = false;
    });

    document.getElementById("crawl-close").addEventListener("click", closeCrawl);
    document.getElementById("crawl-exit").addEventListener("click", closeCrawl);
    document.getElementById("crawl-replay").addEventListener("click", startCrawl);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !overlay.hidden) closeCrawl();
    });
  })();

  /* degree ticks on the outer orbit */
  (function addTicks() {
    for (let i = 0; i < 4; i++) {
      const t = document.createElement("div");
      t.className = "tick";
      t.dataset.deg = i * 90;
      system.appendChild(t);
    }
  })();

  /* ── layout (responsive) ─────────────────────────────────── */
  let half = 0;

  function layout() {
    const rect = system.getBoundingClientRect();
    half = rect.width / 2;
    nodes.forEach(function (n) {
      const d = n.data.r * rect.width;
      n.orbitEl.style.width = d + "px";
      n.orbitEl.style.height = d + "px";
    });
    // position ticks on outer orbit
    const outerR = (PLANETS[PLANETS.length - 1].r * rect.width) / 2;
    document.querySelectorAll("#system .tick").forEach(function (t) {
      const deg = (parseFloat(t.dataset.deg) * Math.PI) / 180;
      t.style.left = half + Math.cos(deg) * outerR + "px";
      t.style.top = half + Math.sin(deg) * outerR + "px";
      t.style.transform =
        "translate(-50%,-50%) rotate(" + (t.dataset.deg * 1 + 90) + "deg)";
    });
    sizeCanvas();
  }

  window.addEventListener("resize", layout);

  /* ── drag to spin ────────────────────────────────────────── */
  let dragOffset = 0;
  let dragVel = 0;
  let dragging = false;
  let lastX = 0;

  system.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".planet, #sun")) return;
    dragging = true;
    lastX = e.clientX;
    system.classList.add("dragging");
    system.setPointerCapture(e.pointerId);
  });
  system.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    dragOffset += dx * 0.006;
    dragVel = dx * 0.006;
  });
  function endDrag() {
    dragging = false;
    system.classList.remove("dragging");
  }
  system.addEventListener("pointerup", endDrag);
  system.addEventListener("pointercancel", endDrag);

  /* ── starfield ───────────────────────────────────────────── */
  let stars = [];
  let mouseX = 0.5, mouseY = 0.5;

  function sizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedStars();
  }

  function seedStars() {
    const count = Math.round(
      (window.innerWidth * window.innerHeight) / 9000
    );
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.3 + 0.4,
        depth: Math.random() * 0.7 + 0.3, // parallax strength
        tw: Math.random() * Math.PI * 2,  // twinkle phase
      });
    }
  }

  window.addEventListener("pointermove", function (e) {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
  });

  function fgColor() {
    return getComputedStyle(document.body).getPropertyValue("--fg").trim();
  }

  let starColor = "#f4f3ef";

  /* comet — streaks across every so often */
  const comet = { active: false, x: 0, y: 0, vx: 0, vy: 0, life: 0 };
  let nextComet = performance.now() + 5000 + Math.random() * 7000;

  function updateComet(now, dt) {
    if (REDUCED) return;
    if (!comet.active && now > nextComet) {
      comet.active = true;
      comet.life = 0;
      const fromLeft = Math.random() > 0.5;
      comet.x = fromLeft ? -60 : window.innerWidth + 60;
      comet.y = Math.random() * window.innerHeight * 0.5;
      const speed = 700 + Math.random() * 400;
      const ang = (Math.random() * 0.35 + 0.12) * (fromLeft ? 1 : Math.PI - 1) ;
      comet.vx = Math.cos(ang) * speed * (fromLeft ? 1 : -1);
      comet.vy = Math.sin(Math.abs(ang)) * speed * 0.45;
    }
    if (comet.active) {
      comet.x += comet.vx * dt;
      comet.y += comet.vy * dt;
      comet.life += dt;
      if (
        comet.x < -120 || comet.x > window.innerWidth + 120 ||
        comet.y > window.innerHeight + 120 || comet.life > 6
      ) {
        comet.active = false;
        nextComet = now + 9000 + Math.random() * 14000;
      }
    }
  }

  function drawComet() {
    if (!comet.active) return;
    const tail = 90;
    const nx = comet.vx, ny = comet.vy;
    const len = Math.hypot(nx, ny) || 1;
    const tx = comet.x - (nx / len) * tail;
    const ty = comet.y - (ny / len) * tail;
    const grad = ctx.createLinearGradient(comet.x, comet.y, tx, ty);
    grad.addColorStop(0, starColor);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(comet.x, comet.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();
    ctx.fillStyle = starColor;
    ctx.beginPath();
    ctx.arc(comet.x, comet.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function refreshStarColor() {
    starColor = fgColor();
  }

  function drawStars(t) {
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    const px = (mouseX - 0.5) * 30;
    const py = (mouseY - 0.5) * 30;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const alpha = REDUCED
        ? 0.5
        : 0.3 + 0.35 * (1 + Math.sin(t * 0.0012 + s.tw)) * 0.5 + 0.15;
      ctx.globalAlpha = alpha * s.depth;
      ctx.fillStyle = starColor;
      ctx.beginPath();
      ctx.arc(
        s.x * w - px * s.depth,
        s.y * h - py * s.depth,
        s.r,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    drawComet();
  }

  /* ── main loop ───────────────────────────────────────────── */
  const config = { speed: 1 };
  let lastT = performance.now();

  function placeAll() {
    nodes.forEach(function (n) {
      const a = n.angle + dragOffset;
      const r = n.data.r * half;
      const x = half + Math.cos(a) * r;
      const y = half + Math.sin(a) * r;
      n.el.style.transform = "translate(" + x + "px," + y + "px)";
      // flip label side when planet is on the right edge
      n.el.classList.toggle("tag-left", Math.cos(a) > 0.45);
    });
  }

  function frame(now) {
    const dt = Math.min((now - lastT) / 1000, 0.05);
    lastT = now;

    // drag inertia
    if (!dragging) {
      dragOffset += dragVel;
      dragVel *= 0.94;
    }

    nodes.forEach(function (n) {
      const target = n.hover ? 0.04 : 1;
      n.angVel += (target - n.angVel) * Math.min(dt * 7, 1);
      if (!REDUCED) {
        n.angle +=
          ((Math.PI * 2) / n.data.period) * dt * config.speed * n.angVel;
      }
    });

    updateComet(now, dt);
    placeAll();
    drawStars(now);
    requestAnimationFrame(frame);
  }

  /* ── tweaks bridge ───────────────────────────────────────── */
  window.SOLAR = {
    applyTweaks: function (t) {
      config.speed = t.speed;
      document.body.classList.toggle("theme-blueprint", t.theme === "blueprint");
      refreshStarColor();
      // wait for the CSS transition before resampling color
      setTimeout(refreshStarColor, 550);

      const name = (t.name || "Your Name").trim() || "Your Name";
      document.getElementById("hud-name").textContent = name;
      document.getElementById("hud-tagline").textContent =
        t.tagline || "Software Developer";
      const initials = name
        .split(/\s+/)
        .map(function (w) { return w[0]; })
        .join("")
        .slice(0, 3)
        .toUpperCase();
      document.getElementById("sun-initials").textContent = initials;
    },
  };

  /* ── go ──────────────────────────────────────────────────── */
  layout();
  refreshStarColor();
  placeAll();
  drawStars(performance.now());
  requestAnimationFrame(frame);
})();
