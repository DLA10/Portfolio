// ============================================================
// Canvas Watermark Renderer — math-driven, anti-aliased
// ============================================================

(function () {
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function setupCanvas(id, w, h) {
    const c = document.getElementById(id);
    if (!c) return null;
    c.width = w * DPR;
    c.height = h * DPR;
    c.style.width = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d");
    ctx.scale(DPR, DPR);
    return ctx;
  }

  // ============================================================
  // 1. CANDLESTICK CHART
  // ============================================================
  function drawCandlestick() {
    const W = 500, H = 500;
    const ctx = setupCanvas("wm-candlestick", W, H);
    if (!ctx) return;

    const color = "#ef4444";

    // Generate realistic OHLC data with an uptrend
    const candles = [];
    let price = 280;
    for (let i = 0; i < 14; i++) {
      const trend = (i / 14) * -120; // uptrend (lower Y = higher price)
      const volatility = 30 + Math.random() * 40;
      const open = price + trend + (Math.random() - 0.5) * 20;
      const close = open + (Math.random() - 0.4) * volatility;
      const high = Math.min(open, close) - Math.random() * 30 - 5;
      const low = Math.max(open, close) + Math.random() * 30 + 5;
      candles.push({ open, close, high, low });
      price = close - trend;
    }

    const spacing = W / (candles.length + 1);
    const bodyW = spacing * 0.55;

    // Draw grid
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.08;
    for (let y = 50; y < H; y += 60) {
      ctx.beginPath();
      ctx.setLineDash([4, 8]);
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw candles
    candles.forEach((c, i) => {
      const x = spacing * (i + 1);
      const bullish = c.close < c.open; // lower Y = higher price = bullish
      const bodyTop = Math.min(c.open, c.close);
      const bodyBot = Math.max(c.open, c.close);
      const bodyH = Math.max(bodyBot - bodyTop, 2);

      // Wick
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, c.high);
      ctx.lineTo(x, c.low);
      ctx.stroke();

      // Body
      ctx.globalAlpha = bullish ? 0.2 : 0.7;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      // Rounded rect body
      const r = 3;
      const bx = x - bodyW / 2;
      ctx.beginPath();
      ctx.moveTo(bx + r, bodyTop);
      ctx.lineTo(bx + bodyW - r, bodyTop);
      ctx.quadraticCurveTo(bx + bodyW, bodyTop, bx + bodyW, bodyTop + r);
      ctx.lineTo(bx + bodyW, bodyTop + bodyH - r);
      ctx.quadraticCurveTo(bx + bodyW, bodyTop + bodyH, bx + bodyW - r, bodyTop + bodyH);
      ctx.lineTo(bx + r, bodyTop + bodyH);
      ctx.quadraticCurveTo(bx, bodyTop + bodyH, bx, bodyTop + bodyH - r);
      ctx.lineTo(bx, bodyTop + r);
      ctx.quadraticCurveTo(bx, bodyTop, bx + r, bodyTop);
      ctx.closePath();

      if (bullish) {
        ctx.globalAlpha = 0.15;
        ctx.fill();
        ctx.globalAlpha = 0.7;
        ctx.stroke();
      } else {
        ctx.globalAlpha = 0.65;
        ctx.fill();
      }
    });

    // EMA line — smooth curve through candle midpoints
    ctx.globalAlpha = 0.45;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    let ema = (candles[0].open + candles[0].close) / 2;
    const k = 0.3;
    candles.forEach((c, i) => {
      const x = spacing * (i + 1);
      const mid = (c.open + c.close) / 2;
      ema = mid * k + ema * (1 - k);
      if (i === 0) ctx.moveTo(x, ema);
      else ctx.lineTo(x, ema);
    });
    ctx.stroke();

    // Second EMA (slower)
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ema = (candles[0].open + candles[0].close) / 2;
    const k2 = 0.12;
    candles.forEach((c, i) => {
      const x = spacing * (i + 1);
      const mid = (c.open + c.close) / 2;
      ema = mid * k2 + ema * (1 - k2);
      if (i === 0) ctx.moveTo(x, ema);
      else ctx.lineTo(x, ema);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Volume bars at bottom
    ctx.globalAlpha = 0.12;
    candles.forEach((c, i) => {
      const x = spacing * (i + 1) - bodyW / 2;
      const vol = 10 + Math.random() * 40;
      ctx.fillStyle = color;
      ctx.fillRect(x, H - vol, bodyW, vol);
    });
  }

  // ============================================================
  // 2. DNA DOUBLE HELIX
  // ============================================================
  function drawDNA() {
    const W = 500, H = 500;
    const ctx = setupCanvas("wm-dna", W, H);
    if (!ctx) return;

    const color = "#22c55e";
    const cx = W / 2;
    const amplitude = 110;
    const periods = 3.5;
    const steps = 300;
    const dy = H / steps;

    // Precompute helix positions
    const helixA = [];
    const helixB = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2 * periods;
      const y = i * dy;
      helixA.push({ x: cx + Math.sin(t) * amplitude, y, z: Math.cos(t) });
      helixB.push({ x: cx + Math.sin(t + Math.PI) * amplitude, y, z: Math.cos(t + Math.PI) });
    }

    // Draw base pair rungs (every ~20 steps where strands are far apart)
    const rungInterval = Math.round(steps / (periods * 2));
    for (let i = rungInterval / 2; i < steps; i += rungInterval) {
      const idx = Math.round(i);
      if (idx >= helixA.length) continue;
      const a = helixA[idx];
      const b = helixB[idx];

      // Rung with middle gap (hydrogen bond style)
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;

      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      // Left half
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(midX - 6, midY);
      ctx.stroke();

      // Right half
      ctx.beginPath();
      ctx.moveTo(midX + 6, midY);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();

      // Dots for nucleotide bases at each end
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = color;
      [a, b].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Middle hydrogen bond dots
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(midX - 3, midY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(midX + 3, midY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw backbone strands with depth (z-based thickness & opacity)
    function drawStrand(helix) {
      for (let i = 1; i < helix.length; i++) {
        const prev = helix[i - 1];
        const curr = helix[i];
        const z = (curr.z + 1) / 2; // 0 to 1

        ctx.globalAlpha = 0.25 + z * 0.55;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 + z * 4;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
      }
    }

    // Draw back-strand first, front-strand second for depth
    // Strand in back = where z < 0
    function drawStrandBack(helix) {
      for (let i = 1; i < helix.length; i++) {
        const curr = helix[i];
        if (curr.z > 0) continue;
        const prev = helix[i - 1];
        const z = (curr.z + 1) / 2;
        ctx.globalAlpha = 0.15 + z * 0.3;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 + z * 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
      }
    }

    function drawStrandFront(helix) {
      for (let i = 1; i < helix.length; i++) {
        const curr = helix[i];
        if (curr.z <= 0) continue;
        const prev = helix[i - 1];
        const z = (curr.z + 1) / 2;
        ctx.globalAlpha = 0.3 + z * 0.6;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 + z * 4.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();
      }
    }

    // Render order: back parts of both, then front parts of both
    drawStrandBack(helixA);
    drawStrandBack(helixB);
    drawStrandFront(helixA);
    drawStrandFront(helixB);

    // Phosphate glow nodes at the peaks
    for (let i = 0; i < helixA.length; i += Math.round(steps / (periods * 2))) {
      [helixA[i], helixB[i]].forEach(p => {
        if (!p) return;
        const z = (p.z + 1) / 2;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.15 + z * 0.25;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  // ============================================================
  // 3. ROD OF ASCLEPIUS
  // ============================================================
  function drawAsclepius() {
    const W = 500, H = 500;
    const ctx = setupCanvas("wm-asclepius", W, H);
    if (!ctx) return;

    const color = "#8b5cf6";
    const rodX = W / 2;
    const rodTop = 30;
    const rodBot = H - 30;

    // Rod glow
    const rodGrad = ctx.createLinearGradient(rodX, rodTop, rodX, rodBot);
    rodGrad.addColorStop(0, color);
    rodGrad.addColorStop(0.5, color);
    rodGrad.addColorStop(1, color);

    // Rod shadow/glow
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = color;
    ctx.lineWidth = 24;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(rodX, rodTop);
    ctx.lineTo(rodX, rodBot);
    ctx.stroke();

    // Rod main
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = rodGrad;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(rodX, rodTop);
    ctx.lineTo(rodX, rodBot);
    ctx.stroke();

    // Rod highlight (left edge)
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rodX - 3, rodTop + 20);
    ctx.lineTo(rodX - 3, rodBot - 10);
    ctx.stroke();

    // Rod knob top
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(rodX, rodTop, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rod base
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(rodX, rodBot, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // ---- Snake ----
    // Snake wraps around rod using sinusoidal path
    const coils = 4.5;
    const snakeSteps = 400;
    const snakeAmplitude = 75;
    const snakeStartY = rodBot - 20;
    const snakeEndY = rodTop + 30;
    const snakeLen = snakeStartY - snakeEndY;

    const snakePoints = [];
    for (let i = 0; i <= snakeSteps; i++) {
      const t = i / snakeSteps;
      const y = snakeStartY - t * snakeLen;
      const angle = t * Math.PI * 2 * coils;
      const x = rodX + Math.sin(angle) * snakeAmplitude;
      const z = Math.cos(angle); // -1 behind rod, +1 in front
      // Taper: thicker in middle, thinner at ends
      const taper = Math.sin(t * Math.PI) * 0.8 + 0.2;
      snakePoints.push({ x, y, z, taper });
    }

    // Draw snake segments behind the rod first
    for (let i = 1; i < snakePoints.length; i++) {
      const curr = snakePoints[i];
      const prev = snakePoints[i - 1];
      if (curr.z > 0.1) continue; // skip front parts

      const z01 = (curr.z + 1) / 2;
      ctx.globalAlpha = (0.15 + z01 * 0.25) * curr.taper;
      ctx.strokeStyle = color;
      ctx.lineWidth = (2 + z01 * 3) * curr.taper + 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
    }

    // Redraw rod over behind-snake segments
    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = rodGrad;
    ctx.lineWidth = 7;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(rodX, rodTop);
    ctx.lineTo(rodX, rodBot);
    ctx.stroke();

    // Draw snake segments in front of the rod
    for (let i = 1; i < snakePoints.length; i++) {
      const curr = snakePoints[i];
      const prev = snakePoints[i - 1];
      if (curr.z <= 0.1) continue; // skip back parts

      const z01 = (curr.z + 1) / 2;
      ctx.globalAlpha = (0.35 + z01 * 0.55) * curr.taper;
      ctx.strokeStyle = color;
      ctx.lineWidth = (3 + z01 * 5) * curr.taper + 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
    }

    // Snake belly scales — small arcs on front segments
    for (let i = 10; i < snakePoints.length - 10; i += 8) {
      const p = snakePoints[i];
      if (p.z < 0.5) continue;
      ctx.globalAlpha = 0.1 * p.taper;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4 * p.taper, 0, Math.PI);
      ctx.stroke();
    }

    // Snake head (at top of coil)
    const head = snakePoints[snakePoints.length - 1];
    const headSize = 14;

    // Head shape — triangular
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(head.x - 8, head.y - 2, headSize, headSize * 0.6, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = "#0a0a0f";
    ctx.beginPath();
    ctx.arc(head.x - 15, head.y - 6, 3, 0, Math.PI * 2);
    ctx.fill();
    // Eye glint
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(head.x - 16, head.y - 7, 1, 0, Math.PI * 2);
    ctx.fill();

    // Forked tongue
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(head.x - 22, head.y - 2);
    ctx.lineTo(head.x - 38, head.y - 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(head.x - 22, head.y - 2);
    ctx.lineTo(head.x - 36, head.y + 4);
    ctx.stroke();

    // Glow aura around the whole thing
    ctx.globalAlpha = 0.04;
    const aura = ctx.createRadialGradient(rodX, H / 2, 20, rodX, H / 2, 200);
    aura.addColorStop(0, color);
    aura.addColorStop(1, "transparent");
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, W, H);
  }

  // ============================================================
  // INIT
  // ============================================================
  drawCandlestick();
  drawDNA();
  drawAsclepius();
})();
