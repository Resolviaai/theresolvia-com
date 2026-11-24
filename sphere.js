/**
 * Resolvia 3D VideoSphere Canvas Engine
 * Interactive 3D video thumbnail globe with fluid cursor reaction & elastic displacement.
 * No big popup card overlay.
 */
(function() {
  const TOTAL_DOTS = 3000;
  const ASPECT_RATIO = 3 / 4;

  function initSphere() {
    const anchor = document.querySelector("[data-sphere-anchor]");
    if (!anchor) return;

    const container = anchor.parentElement;
    if (!container) return;

    // Create Canvas if not already present
    let canvas = container.querySelector("canvas.resolvia-sphere-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "resolvia-sphere-canvas pointer-events-auto absolute top-0 left-0 size-full z-0";
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.pointerEvents = "auto";
      canvas.classList.add("cursor-grab"); canvas.style.cursor = window.RESOLVIA_CURSORS ? window.RESOLVIA_CURSORS.grab : "url('/assets/cursor-grab.png') 14 14, grab";
      canvas.style.filter = "contrast(1.08) brightness(1.02) saturate(1.08)";
      container.insertBefore(canvas, container.firstChild);
    } else {
      canvas.style.filter = "contrast(1.08) brightness(1.02) saturate(1.08)";
    }

    // Ensure any detached popup card is completely removed
    const oldTooltips = container.querySelectorAll(".sphere-hover-tooltip, .tooltip-canvas, [data-sphere-tooltip]");
    oldTooltips.forEach(t => t.remove());

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Load assets
    Promise.all([
      fetch("/sphere/dots.json").then(r => r.json()),
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = "/sphere/atlas.webp";
      })
    ]).then(([dotsData, atlasImg]) => {
      runSphere(canvas, ctx, dotsData, atlasImg, anchor, container);
    }).catch(err => {
      console.warn("Could not load local sphere assets, trying fallback:", err);
      Promise.all([
        fetch("https://hqqnviehspjqnwekafzq.supabase.co/storage/v1/object/public/sphere/20261120-1331-4c0917/dots.json").then(r => r.json()),
        new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = "https://hqqnviehspjqnwekafzq.supabase.co/storage/v1/object/public/sphere/20261120-1331-4c0917/atlas.webp";
        })
      ]).then(([dotsData, atlasImg]) => {
        runSphere(canvas, ctx, dotsData, atlasImg, anchor, container);
      });
    });
  }

  function runSphere(canvas, ctx, dotsData, atlasImg, anchor, container) {
    const v = TOTAL_DOTS;
    const c = ASPECT_RATIO;
    const cols = dotsData.cols || 60;
    const tw = dotsData.tile ? dotsData.tile[0] : 18;
    const th = dotsData.tile ? dotsData.tile[1] : 24;

    // Generate Fibonacci sphere coordinates
    function calcGrid(e) {
      let t = Math.max(2, Math.round(Math.PI / e)), n = [], a = 0;
      for (let r = 0; r < t; r++) {
        let l = -Math.PI / 2 + (r + 0.5) * Math.PI / t;
        let o = Math.max(1, Math.round((2 * Math.PI * Math.cos(l)) / (e * c)));
        n.push({ lat: l, n: o });
        a += o;
      }
      return { out: n, total: a, dlat: Math.PI / t };
    }

    let f = 0.01, w = 0.6;
    for (let e = 0; e < 40; e++) {
      let mid = (f + w) / 2;
      calcGrid(mid).total > v ? (f = mid) : (w = mid);
    }
    const grid = calcGrid(w);
    const dlat = grid.dlat;

    const M = new Float32Array(v);
    const A = new Float32Array(v);
    const k = new Float32Array(v);
    const _ = new Float32Array(v);
    const T = new Float32Array(v);
    const N = new Float32Array(v);
    const P = new Float32Array(v);
    const O = new Float32Array(v);

    let dotIdx = 0;
    grid.out.forEach(({ lat: t, n }, a) => {
      let r = (2 * Math.PI) / n;
      for (let l = 0; l < n && dotIdx < v; l++, dotIdx++) {
        let angle = (l + (a % 2) * 0.5) * r;
        N[dotIdx] = Math.sin(t);
        P[dotIdx] = Math.cos(t);
        _[dotIdx] = Math.sin(angle);
        T[dotIdx] = Math.cos(angle);
        M[dotIdx] = P[dotIdx] * T[dotIdx];
        A[dotIdx] = N[dotIdx];
        k[dotIdx] = P[dotIdx] * _[dotIdx];
        O[dotIdx] = r * P[dotIdx];
      }
    });

    const Q = new Float32Array(v);
    const Z = new Float32Array(v);
    const J = new Float32Array(v);
    const depthProj = new Float32Array(v);
    const K = new Float32Array(v);
    const X = new Float32Array(v);
    const Y = new Float32Array(v);
    const V = new Float32Array(v);
    const G = new Float32Array(v);
    const U = new Float32Array(v);

    // Elastic displacement arrays for fluid cursor reaction
    const ee = new Float32Array(v);
    const et = new Float32Array(v);

    let width = 0, height = 0, dpr = 1;
    let centerX = 0, centerY = 0, sphereRadius = 380;

    function resize() {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height || 640;
      // High-DPI support: ensure Retina screens render at full native crispness
      dpr = Math.max(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      centerX = width / 2;

      const isMobile = width < 640;
      sphereRadius = isMobile 
        ? Math.max(340, width * 0.65)
        : Math.max(540, width * 0.55);
      // Crest height calibrated: 42px headroom ensures all crest cards remain completely within canvas bounds with 0 clipping
      const crestTopMargin = isMobile ? 30 : 42;
      centerY = crestTopMargin + sphereRadius;
    }

    resize();
    window.addEventListener("resize", resize);

    // Rotation and physics controls (Drag to spin)
    let rotY = 0.6;
    let tiltX = 0.28;
    let velY = 0.055;
    let velX = 0;
    let isDragging = false;
    let startX = 0, startY = 0;
    let lastTime = performance.now();

    // Cursor position & proximity tracking
    let mouseX = -9999, mouseY = -9999;
    let isCursorOverGlobe = false;

    window.addEventListener("pointermove", e => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      const distFromCenter = Math.hypot(mouseX - centerX, mouseY - centerY);
      isCursorOverGlobe = distFromCenter < sphereRadius * 1.08;

      if (!isDragging) {
        if (isCursorOverGlobe) {
          canvas.classList.add("cursor-grab"); canvas.style.cursor = window.RESOLVIA_CURSORS ? window.RESOLVIA_CURSORS.grab : "url('/assets/cursor-grab.png') 14 14, grab";
        } else {
          canvas.style.cursor = "default";
        }
        return;
      }

      const now = performance.now();
      const dt = Math.max(1, now - lastTime);
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      rotY += (dx / sphereRadius) * (Math.cos(tiltX) < 0 ? -1 : 1);
      tiltX += -dy / sphereRadius;
      tiltX = Math.max(-0.15, Math.min(0.55, tiltX));

      velY = (dx / dt) * 0.4;
      velX = (-dy / dt) * 0.4;

      startX = e.clientX;
      startY = e.clientY;
      lastTime = now;
    }, { passive: true });

    canvas.addEventListener("pointerdown", e => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      lastTime = performance.now();
      velY = velX = 0;
      canvas.classList.add("is-grabbing", "cursor-grabbing"); canvas.classList.remove("cursor-grab"); canvas.style.cursor = window.RESOLVIA_CURSORS ? window.RESOLVIA_CURSORS.grabbing : "url('/assets/cursor-grabbing.png') 14 14, grabbing";
    });

    window.addEventListener("pointerup", () => {
      if (isDragging) {
        isDragging = false;
        canvas.classList.remove("is-grabbing", "cursor-grabbing");
        if (isCursorOverGlobe) {
          canvas.classList.add("cursor-grab");
          canvas.style.cursor = window.RESOLVIA_CURSORS ? window.RESOLVIA_CURSORS.grab : "url('/assets/cursor-grab.png') 14 14, grab";
        } else {
          canvas.classList.remove("cursor-grab");
          canvas.style.cursor = window.RESOLVIA_CURSORS ? window.RESOLVIA_CURSORS.default : "url('/assets/cursor-default.png') 2 0, auto";
        }
      }
    });

    document.addEventListener("pointerleave", () => {
      mouseX = -9999;
      mouseY = -9999;
      isCursorOverGlobe = false;
    });

    // Animation loop with fluid cursor reaction (NO popup card)
    let lastAnimTime = performance.now();

    function render(now) {
      const dt = Math.min(0.05, (now - lastAnimTime) / 1000);
      lastAnimTime = now;

      if (!isDragging) {
        // Natural idle rotation
        velY += (0.045 - velY) * Math.min(1, dt * 2);
        velX -= velX * Math.min(1, dt * 2);
        rotY += velY * dt;
        tiltX += velX * dt;
        tiltX += (0.28 - tiltX) * Math.min(1, dt * 0.8);
      }

      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(tiltX), sinX = Math.sin(tiltX);

      // 1. Calculate 3D projected coordinates for all 3000 dots
      for (let e = 0; e < v; e++) {
        let t = M[e] * cosY + k[e] * sinY;
        let n = -M[e] * sinY + k[e] * cosY;
        let a = A[e] * cosX - n * sinX;
        let r = A[e] * sinX + n * cosX;
        let l = 3.2 / (3.2 - r);

        Q[e] = centerX + t * sphereRadius * l;
        Z[e] = centerY + a * sphereRadius * l;
        J[e] = r;
        depthProj[e] = l;

        let o = _[e] * cosY - T[e] * sinY;
        let i = -(-_[e] * sinY - T[e] * cosY) * sinX;
        let s = -N[e] * T[e];
        let c = P[e];
        let u = -N[e] * _[e];
        let h = s * cosY + u * sinY;
        let d = c * cosX - (-s * sinY + u * cosY) * sinX;
        let m = sphereRadius * l;

        K[e] = o * m;
        X[e] = i * m;
        Y[e] = h * m;
        V[e] = d * m;
        G[e] = Math.max(0.05, Math.hypot(o, i));
        U[e] = Math.max(0.05, Math.hypot(h, d));
      }

      // 2. Compute elastic cursor reaction & displacement (Cards react to cursor)
      const influenceRadius = isCursorOverGlobe ? 95 * Math.min(1, sphereRadius / 410) : 0;
      const smoothFactor = Math.min(1, 9 * dt);

      for (let e = 0; e < v; e++) {
        let targetDx = 0;
        let targetDy = 0;

        if (influenceRadius > 0 && J[e] > 0) {
          let dx = Q[e] - mouseX;
          let dy = Z[e] - mouseY;
          let dist = Math.hypot(dx, dy);

          if (dist < influenceRadius && dist > 0.001) {
            let push = (influenceRadius - dist) * (0.92 + (dist / influenceRadius) * 0.08);
            targetDx = (dx / dist) * push;
            targetDy = (dy / dist) * push;
          }
        }

        ee[e] += (targetDx - ee[e]) * smoothFactor;
        et[e] += (targetDy - et[e]) * smoothFactor;
      }

      // 3. Clear Canvas
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 4. Render cards in 3D with reaction
      for (let e = 0; e < v; e++) {
        if (J[e] < -0.05) continue; // Skip rear hemisphere

        let dispMagnitude = Math.hypot(ee[e], et[e]);
        let dispScale = Math.min(1, dispMagnitude / 28);
        let scaleBoost = 1 + 0.16 * dispScale; // Cards near cursor subtly bulge and react!

        let depthFactor = (J[e] + 1) / 2;
        let alpha = J[e] >= 0 ? 0.38 + 0.62 * depthFactor : 0.08 + 0.25 * depthFactor;
        alpha = Math.min(1, alpha + 0.35 * dispScale);

        let posX = Q[e] + ee[e];
        let posY = Z[e] + et[e];

        // Optimized card scale: reduces stretching of the 18x24 thumbnail texture, enhancing sharpness
        let cardW = sphereRadius * depthProj[e] * O[e] * 0.75 * G[e] * scaleBoost;
        let cardH = sphereRadius * depthProj[e] * dlat * 0.75 * U[e] * scaleBoost;

        // Allow cards near top canvas boundary to render without premature clipping
        if (cardW < 0.8 || posX + cardW < 0 || posX - cardW > width || posY + cardH < -40 || posY - cardH > height) continue;

        let bottomDist = height - posY;
        let edgeFade = bottomDist < 45 ? Math.max(0, bottomDist / 45) : 1;
        // Keep crest cards 100% visible behind buttons
        let topEdgeFade = posY < -15 ? Math.max(0, 1 + (posY + 15) / 40) : 1;
        ctx.globalAlpha = Math.min(1, alpha * edgeFade * topEdgeFade);
        let scaleX = 0.75 * O[e] * scaleBoost;
        let scaleY = 0.75 * dlat * scaleBoost;

        ctx.setTransform(
          dpr * K[e] * scaleX,
          dpr * X[e] * scaleX,
          dpr * Y[e] * scaleY,
          dpr * V[e] * scaleY,
          dpr * posX,
          dpr * posY
        );

        let col = e % cols;
        let row = Math.floor(e / cols);
        ctx.drawImage(atlasImg, col * tw, row * th, tw, th, -0.5, -0.5, 1, 1);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 1;

      if (isVisible) {
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    }

    let isVisible = false;
    let animId = null;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      isVisible = !!(entry && entry.isIntersecting);
      if (isVisible) {
        if (!animId) {
          lastTime = performance.now();
          animId = requestAnimationFrame(render);
        }
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    }, { rootMargin: "100px", threshold: 0.01 });

    observer.observe(container);
  }

  function scheduleInit() {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(initSphere, { timeout: 2500 });
    } else {
      setTimeout(initSphere, 200);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleInit);
  } else {
    scheduleInit();
  }
})();
