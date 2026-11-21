// Liquid Text WebGL2 Engine for Resolvia Hero Section
// Signed Distance Field (SDF) + Smooth-Min Metaballs + Viscous Surface Tension
(function() {
  const container = document.getElementById('liquid-text-container');
  const canvas = document.getElementById('liquid-text-canvas');
  if (!container || !canvas) return;

  const text = "Resolvia";
  const MAX_TRAIL = 10;
  const INF = 1e20;

  // ─── WebGL2 Support Check ──────────────────────────────────────────────────
  function getWebGL2Support() {
    try {
      const probe = document.createElement("canvas");
      const gl = probe.getContext("webgl2");
      const ok = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      return ok;
    } catch {
      return false;
    }
  }

  // ─── TinySDF (Euclidean Distance Transform) ──────────────────────────────────
  function edt1d(grid, offset, stride, length, f, v, z) {
    v[0] = 0;
    z[0] = -INF;
    z[1] = INF;
    f[0] = grid[offset];
    for (let q = 1, k = 0, s = 0; q < length; q++) {
      f[q] = grid[offset + q * stride];
      const q2 = q * q;
      do {
        const r = v[k];
        s = (f[q] - f[r] + q2 - r * r) / (q - r) / 2;
      } while (s <= z[k] && --k > -1);
      k++;
      v[k] = q;
      z[k] = s;
      z[k + 1] = INF;
    }
    for (let q = 0, k = 0; q < length; q++) {
      while (z[k + 1] < q) k++;
      const r = v[k];
      const qr = q - r;
      grid[offset + q * stride] = f[r] + qr * qr;
    }
  }

  function edt(grid, w, h, f, v, z) {
    for (let x = 0; x < w; x++) edt1d(grid, x, w, h, f, v, z);
    for (let y = 0; y < h; y++) edt1d(grid, y * w, 1, w, f, v, z);
  }

  function boxBlur(src, dst, len, lines, r, step, stride) {
    const span = 2 * r + 1;
    for (let line = 0; line < lines; line++) {
      const base = line * stride;
      let acc = 0;
      for (let k = -r; k <= r; k++) {
        acc += src[base + Math.min(len - 1, Math.max(0, k)) * step];
      }
      for (let i = 0; i < len; i++) {
        dst[base + i * step] = acc / span;
        const out = Math.max(0, i - r);
        const inn = Math.min(len - 1, i + r + 1);
        acc += src[base + inn * step] - src[base + out * step];
      }
    }
  }

  // ─── Layout & Field Builder ────────────────────────────────────────────────
  let scratchCtx = null;
  function getScratch() {
    if (!scratchCtx) {
      scratchCtx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    }
    return scratchCtx;
  }

  function computeLayout(width, fontFam, weight, maxFont) {
    const ctx = getScratch();
    if (!ctx || width < 16) return null;

    const setFont = (px) => {
      ctx.font = `${weight} ${px}px ${fontFam}`;
      if ("letterSpacing" in ctx) {
        ctx.letterSpacing = `${-0.025 * px}px`;
      }
    };

    setFont(100);
    const w100 = Math.max(1, ctx.measureText(text).width);
    const fontSize = Math.max(28, Math.min(maxFont, (width * 0.88 * 100) / w100));
    setFont(fontSize);

    const m = ctx.measureText(text);
    const asc = m.actualBoundingBoxAscent || fontSize * 0.72;
    const desc = m.actualBoundingBoxDescent || fontSize * 0.18;
    
    // Generous headroom and footroom so dragging/pulling ink never clips above or below
    const padY = Math.round(fontSize * 0.95);
    const height = Math.round(fontSize * 1.4 + padY * 2);
    const baseline = padY + Math.round(fontSize * 0.72 + (asc - desc) / 2);
    const contentHeight = Math.round(fontSize * 1.32);

    return {
      width,
      height,
      padY,
      contentHeight,
      fontSize,
      font: `${weight} ${fontSize}px ${fontFam}`,
      tracking: -0.025 * fontSize,
      baseline,
      textWidth: m.width,
      inkTop: baseline - asc,
      inkBottom: baseline + desc,
    };
  }

  function buildField(layout) {
    const scale = Math.min(1.25, 1800 / layout.width);
    const w = Math.max(2, Math.round(layout.width * scale));
    const h = Math.max(2, Math.round(layout.height * scale));
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.scale(scale, scale);
    ctx.font = layout.font;
    if ("letterSpacing" in ctx) {
      ctx.letterSpacing = `${layout.tracking}px`;
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, layout.width / 2, layout.baseline);

    const img = ctx.getImageData(0, 0, w, h).data;
    const n = w * h;
    const outer = new Float64Array(n);
    const inner = new Float64Array(n);

    for (let i = 0; i < n; i++) {
      const a = img[i * 4 + 3] / 255;
      if (a >= 1) {
        outer[i] = 0;
        inner[i] = INF;
      } else if (a <= 0) {
        outer[i] = INF;
        inner[i] = 0;
      } else {
        const d = 0.5 - a;
        outer[i] = d > 0 ? d * d : 0;
        inner[i] = d < 0 ? d * d : 0;
      }
    }

    const len = Math.max(w, h);
    const f = new Float64Array(len);
    const v = new Uint32Array(len);
    const z = new Float64Array(len + 1);
    edt(outer, w, h, f, v, z);
    edt(inner, w, h, f, v, z);

    const data = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      data[i] = (Math.sqrt(outer[i]) - Math.sqrt(inner[i])) / scale;
    }

    // Softened distance field for smooth normals
    const soft = Float32Array.from(data);
    const tmp = new Float32Array(n);
    const radius = Math.max(1, Math.round(layout.fontSize * 0.035 * scale));
    for (let pass = 0; pass < 3; pass++) {
      boxBlur(soft, tmp, w, h, radius, 1, w);
      boxBlur(tmp, soft, h, w, radius, w, 1);
    }

    const packed = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      packed[i * 2] = data[i];
      packed[i * 2 + 1] = soft[i];
    }

    return { data, packed, w, h, scale };
  }

  function sampleField(field, x, y) {
    const fx = Math.min(field.w - 1, Math.max(0, Math.round(x * field.scale)));
    const fy = Math.min(field.h - 1, Math.max(0, Math.round(y * field.scale)));
    return field.data[fy * field.w + fx];
  }

  function nearestInside(field, x, y, inset) {
    let px = x;
    let py = y;
    for (let i = 0; i < 10; i++) {
      const d = sampleField(field, px, py) + inset;
      if (Math.abs(d) < 0.5) break;
      const e = 1.5;
      const gx = (sampleField(field, px + e, py) - sampleField(field, px - e, py)) / (2 * e);
      const gy = (sampleField(field, px, py + e) - sampleField(field, px, py - e)) / (2 * e);
      const gl = Math.hypot(gx, gy) || 1;
      px -= (gx / gl) * d;
      py -= (gy / gl) * d;
    }
    return [px, py];
  }

  // ─── Shaders ───────────────────────────────────────────────────────────────
  const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

  const FRAG = `#version 300 es
precision highp float;
uniform sampler2D uSdf;
uniform vec2 uSize;
uniform float uDpr;
uniform float uCanvasH;
uniform vec4 uBlob[${MAX_TRAIL}];
uniform vec2 uWarp[${MAX_TRAIL}];
uniform int uCount;
uniform float uSigma;
uniform float uBevel;
uniform vec3 uInk;
uniform vec3 uHi;
uniform vec4 uAccent;
uniform float uSpec;
uniform float uShade;
out vec4 outColor;

float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float glyph(vec2 p, float soft) {
  vec2 t = texture(uSdf, p / uSize).rg;
  return mix(t.r, t.g, soft);
}

float field(vec2 p, float soft, out float g0) {
  vec2 warp = vec2(0.0);
  float wsum = 0.0;
  for (int i = 0; i < ${MAX_TRAIL}; i++) {
    if (i >= uCount) break;
    vec2 d = p - uBlob[i].xy;
    float g = exp(-dot(d, d) / (uSigma * uSigma));
    warp += uWarp[i] * g;
    wsum += g;
  }
  warp /= max(1.0, wsum);
  float f = glyph(p - warp, soft);
  g0 = f;
  for (int i = 0; i < ${MAX_TRAIL}; i++) {
    if (i >= uCount) break;
    float r = uBlob[i].z;
    if (r < 0.05) continue;
    float b = length(p - uBlob[i].xy) - r;
    f = smin(f, b, r * 1.45);
  }
  return f;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uCanvasH - gl_FragCoord.y) / uDpr;
  float g0;
  float f = field(p, 0.0, g0);
  float fw = max(fwidth(f), 1e-4);
  float alpha = clamp(0.5 - f / fw, 0.0, 1.0);
  if (alpha <= 0.0) { outColor = vec4(0.0); return; }

  float e = 1.0;
  float tmp;
  vec2 grad = vec2(
    field(p + vec2(e, 0.0), 1.0, tmp) - field(p - vec2(e, 0.0), 1.0, tmp),
    field(p + vec2(0.0, e), 1.0, tmp) - field(p - vec2(0.0, e), 1.0, tmp)
  ) / (2.0 * e);
  float fs = field(p, 1.0, tmp);
  float gl = length(grad);
  vec2 n2 = gl > 1e-4 ? grad / gl : vec2(0.0);

  // Rounded liquid cross-section
  float s = 1.0 - clamp(-min(fs, f + 0.5) / uBevel, 0.0, 1.0);
  s = pow(s, 1.6);
  vec3 N = normalize(vec3(n2 * s, sqrt(max(0.0, 1.0 - s * s))));
  vec3 L = normalize(vec3(-0.45, -0.7, 0.62));
  float diff = clamp(dot(N, L), 0.0, 1.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(N, H), 0.0), 48.0);

  vec3 col = uInk * mix(1.0 - uShade, 1.0, diff);
  float pulled = clamp((g0 - f) / (uBevel * 1.4), 0.0, 1.0);
  col = mix(col, uAccent.rgb, pulled * uAccent.a);
  col += uHi * spec * uSpec;
  outColor = vec4(col * alpha, alpha);
}`;

  function compileShader(gl, type, src) {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      console.warn("LiquidText shader:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  // ─── Simulation State ──────────────────────────────────────────────────────
  const sim = {
    n: 8,
    x: new Float32Array(MAX_TRAIL),
    y: new Float32Array(MAX_TRAIL),
    vx: new Float32Array(MAX_TRAIL),
    vy: new Float32Array(MAX_TRAIL),
    mass: 0,
    massV: 0,
    load: 0.5,
    mode: "idle",
    tx: 0,
    ty: 0,
    homeX: 0,
    homeY: 0,
    releaseT: 0,
    idleBlend: 1,
    clock: 0,
    seeded: false,
    anchorX: 0,
    anchorY: 0,
    tether: 0,
  };

  const UNIFORMS = [
    "uSdf", "uSize", "uDpr", "uCanvasH", "uBlob", "uWarp", "uCount",
    "uSigma", "uBevel", "uInk", "uHi", "uAccent", "uSpec", "uShade"
  ];

  const blobBuf = new Float32Array(MAX_TRAIL * 4);
  const warpBuf = new Float32Array(MAX_TRAIL * 2);

  const look = {
    ink: [0.98, 0.98, 0.98],
    hi: [1.0, 1.0, 1.0],
    accent: [47 / 255, 134 / 255, 247 / 255, 0.85],
    spec: 0.65,
    shade: 0.28,
    viscosity: 0.55,
    blobRadius: null,
    trail: 8,
    autoplay: true,
  };

  function idlePoint(layout, t) {
    const cx = layout.width / 2;
    const capH = layout.inkBottom - layout.inkTop;
    const ax = layout.textWidth * 0.44;
    const y = layout.inkTop + capH * (0.04 + 0.2 * Math.sin(t * 0.53 + 1.1) + 0.08 * Math.sin(t * 1.27));
    return [cx + ax * Math.sin(t * 0.21), y];
  }

  function stepSim(dt, layout, field) {
    const n = Math.max(2, Math.min(MAX_TRAIL, Math.round(look.trail)));
    sim.n = n;
    const visc = Math.min(1, Math.max(0, look.viscosity));

    if (!sim.seeded) {
      const [ix, iy] = idlePoint(layout, sim.clock);
      for (let i = 0; i < MAX_TRAIL; i++) {
        sim.x[i] = ix;
        sim.y[i] = iy;
      }
      sim.seeded = true;
    }

    let massTarget = 0;
    let gx = sim.tx;
    let gy = sim.ty;

    if (sim.mode === "pointer") {
      massTarget = 1;
    } else if (sim.mode === "release") {
      sim.releaseT += dt;
      gx = sim.homeX;
      gy = sim.homeY;
      if (sim.releaseT > 2.2 && look.autoplay) {
        sim.mode = "idle";
        sim.idleBlend = 0;
      }
    }

    if (sim.mode === "idle") {
      if (!look.autoplay) {
        gx = sim.homeX;
        gy = sim.homeY;
      } else {
        sim.clock += dt;
        sim.idleBlend = Math.min(1, sim.idleBlend + dt / 2.4);
        const b = sim.idleBlend * sim.idleBlend * (3 - 2 * sim.idleBlend);
        const [ix, iy] = idlePoint(layout, sim.clock);
        gx = sim.homeX + (ix - sim.homeX) * b;
        gy = sim.homeY + (iy - sim.homeY) * b;
        massTarget = 0.55 * b;
      }
    }

    const k = 330 - 270 * visc;
    const c = 2 * 0.62 * Math.sqrt(k);
    const kf = k * 1.25;
    const cf = 2 * 0.48 * Math.sqrt(kf);
    const km = 70;
    const cm = 2 * 0.3 * Math.sqrt(km);

    // Surface tension anchoring
    const headD = sampleField(field, sim.x[0], sim.y[0]);
    if (sim.mode === "pointer" || (sim.mode === "idle" && look.autoplay)) {
      if (headD < 0) {
        sim.tether = Math.min(1, sim.tether + dt * 8);
        const [ax, ay] = nearestInside(field, sim.x[0], sim.y[0], layout.fontSize * 0.04);
        sim.anchorX = ax;
        sim.anchorY = ay;
      } else if (sim.tether > 0) {
        const stretch = Math.hypot(sim.x[0] - sim.anchorX, sim.y[0] - sim.anchorY);
        const breakLen = layout.fontSize * (0.42 + 0.4 * visc);
        if (stretch > breakLen) sim.tether = 0;
      }
    } else {
      sim.tether = Math.max(0, sim.tether - dt * 3);
    }

    const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
    const h = dt / steps;
    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < n; i++) {
        const tx = i === 0 ? gx : sim.x[i - 1];
        const ty = i === 0 ? gy : sim.y[i - 1];
        const kk = i === 0 ? k : kf;
        const cc = i === 0 ? c : cf;
        let fx = (tx - sim.x[i]) * kk;
        let fy = (ty - sim.y[i]) * kk;
        if (i > 0 && sim.tether > 0) {
          const w = sim.tether * Math.pow(i / (n - 1), 1.3) * 1.6;
          fx += (sim.anchorX - sim.x[i]) * kk * w;
          fy += (sim.anchorY - sim.y[i]) * kk * w;
        }
        sim.vx[i] += (fx - sim.vx[i] * cc) * h;
        sim.vy[i] += (fy - sim.vy[i] * cc) * h;
        sim.x[i] += sim.vx[i] * h;
        sim.y[i] += sim.vy[i] * h;
      }
      sim.massV += ((massTarget - sim.mass) * km - sim.massV * cm) * h;
      sim.mass += sim.massV * h;
    }

    for (let i = n; i < MAX_TRAIL; i++) {
      sim.x[i] = sim.x[n - 1];
      sim.y[i] = sim.y[n - 1];
      sim.vx[i] = 0;
      sim.vy[i] = 0;
    }

    const inside = sampleField(field, sim.x[0], sim.y[0]) < layout.fontSize * 0.02;
    sim.load = inside ? Math.min(1, sim.load + dt * 5) : Math.max(0.4, sim.load - dt * 0.35);
  }

  // ─── WebGL2 Implementation ────────────────────────────────────────────────
  const isWebGL2Supported = getWebGL2Support();

  if (isWebGL2Supported) {
    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: true,
      antialias: false,
      alpha: true,
    });

    if (gl) {
      const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
      const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
      const prog = gl.createProgram();
      const buf = gl.createBuffer();
      const tex = gl.createTexture();

      if (vs && fs && prog && buf && tex) {
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.bindAttribLocation(prog, 0, "aPos");
        gl.linkProgram(prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const u = {};
        for (const name of UNIFORMS) {
          u[name] = gl.getUniformLocation(prog, name);
        }

        let layout = null;
        let field = null;
        let dpr = 1;

        function updateLayout() {
          const rect = container.getBoundingClientRect();
          const w = Math.max(300, rect.width || window.innerWidth);
          dpr = Math.min(window.devicePixelRatio || 1, 2);

          const fam = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          const maxFont = Math.min(150, Math.max(64, w * 0.14));
          layout = computeLayout(w, fam, 800, maxFont);
          if (!layout) return;

          field = buildField(layout);
          if (!field) return;

          canvas.width = Math.round(layout.width * dpr);
          canvas.height = Math.round(layout.height * dpr);
          canvas.style.width = layout.width + 'px';
          canvas.style.height = layout.height + 'px';
          canvas.style.position = 'absolute';
          canvas.style.top = `-${layout.padY}px`;
          canvas.style.left = '0';
          canvas.style.pointerEvents = 'auto';

          container.style.position = 'relative';
          container.style.overflow = 'visible';
          container.style.height = layout.contentHeight + 'px';
          container.style.minHeight = layout.contentHeight + 'px';

          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
          gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RG16F,
            field.w, field.h, 0,
            gl.RG, gl.FLOAT, field.packed
          );

          const [hx, hy] = nearestInside(
            field,
            layout.width / 2,
            (layout.inkTop + layout.inkBottom) / 2,
            layout.fontSize * 0.03
          );
          sim.homeX = hx;
          sim.homeY = hy;
        }

        function draw() {
          if (!layout || !field || gl.isContextLost()) return;
          const R = look.blobRadius ?? layout.fontSize * 0.13;
          const n = sim.n;
          const visc = Math.min(1, Math.max(0, look.viscosity));
          const maxWarp = layout.fontSize * 0.05;
          const warpTime = 0.028 - visc * 0.01;
          const mass = Math.max(0, sim.mass);

          for (let i = 0; i < MAX_TRAIL; i++) {
            const taper = i === 0 ? 1 : 0.62 - 0.34 * (1 - 0.6 * sim.tether) * ((i - 1) / Math.max(1, n - 2));
            blobBuf[i * 4] = sim.x[i];
            blobBuf[i * 4 + 1] = sim.y[i];
            blobBuf[i * 4 + 2] = i < n ? R * mass * (0.45 + 0.55 * sim.load) * taper : 0;
            blobBuf[i * 4 + 3] = 0;

            let wx = sim.vx[i] * warpTime * Math.min(1, mass * 1.4);
            let wy = sim.vy[i] * warpTime * Math.min(1, mass * 1.4);
            const wl = Math.hypot(wx, wy);
            if (wl > maxWarp) {
              wx *= maxWarp / wl;
              wy *= maxWarp / wl;
            }
            warpBuf[i * 2] = wx;
            warpBuf[i * 2 + 1] = wy;
          }

          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.useProgram(prog);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.uniform1i(u.uSdf, 0);
          gl.uniform2f(u.uSize, layout.width, layout.height);
          gl.uniform1f(u.uDpr, dpr);
          gl.uniform1f(u.uCanvasH, canvas.height);
          gl.uniform4fv(u.uBlob, blobBuf);
          gl.uniform2fv(u.uWarp, warpBuf);
          gl.uniform1i(u.uCount, n);
          gl.uniform1f(u.uSigma, R * 1.8);
          gl.uniform1f(u.uBevel, Math.max(2, layout.fontSize * 0.085));
          gl.uniform3f(u.uInk, look.ink[0], look.ink[1], look.ink[2]);
          gl.uniform3f(u.uHi, look.hi[0], look.hi[1], look.hi[2]);
          gl.uniform4f(u.uAccent, look.accent[0], look.accent[1], look.accent[2], look.accent[3]);
          gl.uniform1f(u.uSpec, look.spec);
          gl.uniform1f(u.uShade, look.shade);

          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }

        // Pointer event handling
        function toLocal(e) {
          if (!layout) return null;
          const rect = canvas.getBoundingClientRect();
          const sx = rect.width > 0 ? layout.width / rect.width : 1;
          const sy = rect.height > 0 ? layout.height / rect.height : 1;
          return [(e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy];
        }

        function onMove(e) {
          const pt = toLocal(e);
          if (!pt || !layout) return;
          const m = layout.fontSize * 0.08;
          sim.tx = Math.min(layout.width - m, Math.max(m, pt[0]));
          sim.ty = Math.min(layout.height - m, Math.max(m, pt[1]));
          if (sim.mode !== "pointer") {
            sim.mode = "pointer";
            sim.mass = 0;
            sim.massV = 0;
          }
        }

        function onDown(e) {
          if (e.button !== undefined && e.button !== 0) return;
          try {
            container.setPointerCapture?.(e.pointerId);
          } catch (_) {}
          onMove(e);
        }

        function onLeave() {
          if (sim.mode === "pointer") {
            sim.mode = "release";
            sim.releaseT = 0;
            if (layout && field) {
              const [hx, hy] = nearestInside(field, sim.x[0], sim.y[0], layout.fontSize * 0.03);
              sim.homeX = hx;
              sim.homeY = hy;
            }
          }
        }

        function onUp(e) {
          try {
            if (container.hasPointerCapture?.(e.pointerId)) {
              container.releasePointerCapture(e.pointerId);
            }
          } catch (_) {}
          const rect = canvas.getBoundingClientRect(); const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
          if (e.pointerType !== "mouse" || outside) onLeave();
        }

        container.addEventListener("pointermove", onMove, { passive: true });
        container.addEventListener("pointerdown", onDown, { passive: true });
        container.addEventListener("pointerleave", onLeave, { passive: true });
        container.addEventListener("pointercancel", onLeave, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });

        // Loop & ResizeObserver
        let lastTime = performance.now();
        function loop(now) {
          const dt = Math.min((now - lastTime) / 1000, 0.1);
          lastTime = now;
          if (layout && field) {
            stepSim(dt, layout, field);
            draw();
          }
          requestAnimationFrame(loop);
        }

        // Initialize layout immediately to eliminate blank screen flicker
        updateLayout();
        requestAnimationFrame(loop);

        // Re-rasterize once web fonts load to ensure crisp typography
        if (document.fonts) {
          document.fonts.ready.then(() => {
            updateLayout();
          });
        }

        window.addEventListener("resize", updateLayout);
        const ro = new ResizeObserver(updateLayout);
        ro.observe(container);
        return;
      }
    }
  }

  // ─── 2D Canvas Fallback ─────────────────────────────────────────────────────
  let activeCanvas = canvas;
  let ctx = activeCanvas.getContext('2d');
  if (!ctx) {
    const freshCanvas = activeCanvas.cloneNode(false);
    activeCanvas.parentNode?.replaceChild(freshCanvas, activeCanvas);
    activeCanvas = freshCanvas;
    ctx = activeCanvas.getContext('2d');
  }
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  const trailX = new Float32Array(MAX_TRAIL);
  const trailY = new Float32Array(MAX_TRAIL);
  const trailVx = new Float32Array(MAX_TRAIL);
  const trailVy = new Float32Array(MAX_TRAIL);
  let isPointerDown = false;
  let pointerX = 0;
  let pointerY = 0;
  let pointerActive = false;
  let clock = 0;

  function resizeFallback() {
    const rect = container.getBoundingClientRect();
    width = Math.max(300, rect.width || window.innerWidth);
    const fontSize = Math.max(36, Math.min(130, width * 0.14));
    const padY = Math.round(fontSize * 0.95);
    height = Math.round(fontSize * 1.4 + padY * 2);
    const contentHeight = Math.round(fontSize * 1.32);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    activeCanvas.width = Math.round(width * dpr);
    activeCanvas.height = Math.round(height * dpr);
    activeCanvas.style.width = width + 'px';
    activeCanvas.style.height = height + 'px';
    activeCanvas.style.position = 'absolute';
    activeCanvas.style.top = `-${padY}px`;
    activeCanvas.style.left = '0';
    container.style.position = 'relative';
    container.style.overflow = 'visible';
    container.style.height = contentHeight + 'px';

    const cx = width / 2;
    const cy = height / 2;
    for (let i = 0; i < MAX_TRAIL; i++) {
      trailX[i] = cx;
      trailY[i] = cy;
      trailVx[i] = 0;
      trailVy[i] = 0;
    }
  }

  function updatePointerFallback(e) {
    const rect = activeCanvas.getBoundingClientRect();
    pointerX = e.clientX - rect.left;
    pointerY = e.clientY - rect.top;
    pointerActive = true;
  }

  container.addEventListener('pointermove', updatePointerFallback, { passive: true });
  container.addEventListener('pointerdown', function(e) {
    isPointerDown = true;
    updatePointerFallback(e);
  }, { passive: true });
  window.addEventListener('pointerup', function() {
    isPointerDown = false;
  }, { passive: true });
  container.addEventListener('pointerleave', function() {
    pointerActive = false;
  }, { passive: true });

  window.addEventListener('resize', resizeFallback);
  resizeFallback();

  let lastTime2 = performance.now();
  function renderFallback(now) {
    const dt = Math.min((now - lastTime2) / 1000, 0.1);
    lastTime2 = now;
    clock += dt;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const fontSize = Math.max(36, Math.min(130, width * 0.14));
    ctx.font = `800 ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const cx = width / 2;
    const cy = height / 2;

    const targetX = pointerActive ? pointerX : cx + Math.sin(clock * 1.5) * (fontSize * 0.35);
    const targetY = pointerActive ? pointerY : cy + Math.cos(clock * 2.2) * (fontSize * 0.12);

    const pullSpeed = isPointerDown ? 0.35 : 0.18;
    trailX[0] += (targetX - trailX[0]) * pullSpeed;
    trailY[0] += (targetY - trailY[0]) * pullSpeed;

    for (let i = 1; i < MAX_TRAIL; i++) {
      const spring = 0.42;
      const damping = 0.72;
      const dx = trailX[i - 1] - trailX[i];
      const dy = trailY[i - 1] - trailY[i];
      trailVx[i] = (trailVx[i] + dx * spring) * damping;
      trailVy[i] = (trailVy[i] + dy * spring) * damping;
      trailX[i] += trailVx[i];
      trailY[i] += trailVy[i];
    }

    if (pointerActive || isPointerDown) {
      for (let i = 0; i < MAX_TRAIL; i++) {
        const r = Math.max(2, (fontSize * 0.13) * (1 - i / MAX_TRAIL));
        const alpha = Math.max(0, 0.4 - (i / MAX_TRAIL) * 0.35);
        ctx.beginPath();
        ctx.arc(trailX[i], trailY[i], r * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(47, 134, 247, ${alpha * 0.5})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(trailX[i], trailY[i], r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha + 0.2})`;
        ctx.fill();
      }
    }

    const grad = ctx.createLinearGradient(cx - 200, cy - 60, cx + 200, cy + 60);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#e2edff');
    grad.addColorStop(1, '#94bfff');

    ctx.shadowColor = 'rgba(47, 134, 247, 0.35)';
    ctx.shadowBlur = 32;
    ctx.fillStyle = grad;
    ctx.fillText(text, cx, cy);

    ctx.shadowBlur = 0;
    const highlightGrad = ctx.createLinearGradient(0, cy - fontSize * 0.5, 0, cy + fontSize * 0.5);
    highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    highlightGrad.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
    highlightGrad.addColorStop(1, 'rgba(150, 195, 255, 0.6)');

    ctx.fillStyle = highlightGrad;
    ctx.fillText(text, cx, cy);

    ctx.restore();
    requestAnimationFrame(renderFallback);
  }

  requestAnimationFrame(renderFallback);
})();
