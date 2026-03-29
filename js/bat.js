// ============================================================
// Animated Spaceship — Canvas, top center, retro sci-fi style
// ============================================================

(function () {
  const canvas = document.getElementById("bat-canvas");
  if (!canvas) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W, H;

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
  }
  resize();
  window.addEventListener("resize", resize);

  const ctx = canvas.getContext("2d");

  function animate(time) {
    requestAnimationFrame(animate);
    ctx.save();
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, W, H);

    const t = time * 0.001;
    const cx = W / 2;
    const cy = H / 2;

    // Gentle floating motion
    const floatY = Math.sin(t * 1.5) * 3;
    const floatX = Math.sin(t * 0.9) * 2;
    const tilt = Math.sin(t * 1.1) * 0.04;

    ctx.translate(cx + floatX, cy + floatY);
    ctx.rotate(tilt);

    // Scale to fit canvas
    const s = W / 160;
    ctx.scale(s, s);

    // ---- ENGINE EXHAUST (behind ship) ----
    const exhaustPulse = 0.6 + Math.sin(t * 12) * 0.25 + Math.sin(t * 18) * 0.15;
    const exhaustLen = 14 + Math.sin(t * 10) * 5;

    // Outer exhaust glow
    const exGlow = ctx.createRadialGradient(0, 18, 0, 0, 22, 20 * exhaustPulse);
    exGlow.addColorStop(0, "rgba(239, 68, 68, 0.5)");
    exGlow.addColorStop(0.4, "rgba(139, 92, 246, 0.25)");
    exGlow.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = exGlow;
    ctx.beginPath();
    ctx.arc(0, 22, 20 * exhaustPulse, 0, Math.PI * 2);
    ctx.fill();

    // Left exhaust flame
    ctx.globalAlpha = 0.7 * exhaustPulse;
    const flameL = ctx.createLinearGradient(-6, 14, -6, 14 + exhaustLen);
    flameL.addColorStop(0, "#ef4444");
    flameL.addColorStop(0.3, "#f97316");
    flameL.addColorStop(0.7, "#8b5cf6");
    flameL.addColorStop(1, "transparent");
    ctx.fillStyle = flameL;
    ctx.beginPath();
    ctx.moveTo(-9, 14);
    ctx.quadraticCurveTo(-7, 14 + exhaustLen * 0.6, -6, 14 + exhaustLen);
    ctx.quadraticCurveTo(-5, 14 + exhaustLen * 0.6, -3, 14);
    ctx.closePath();
    ctx.fill();

    // Right exhaust flame
    const flameR = ctx.createLinearGradient(6, 14, 6, 14 + exhaustLen);
    flameR.addColorStop(0, "#ef4444");
    flameR.addColorStop(0.3, "#f97316");
    flameR.addColorStop(0.7, "#8b5cf6");
    flameR.addColorStop(1, "transparent");
    ctx.fillStyle = flameR;
    ctx.beginPath();
    ctx.moveTo(3, 14);
    ctx.quadraticCurveTo(5, 14 + exhaustLen * 0.6, 6, 14 + exhaustLen);
    ctx.quadraticCurveTo(7, 14 + exhaustLen * 0.6, 9, 14);
    ctx.closePath();
    ctx.fill();

    // Center exhaust (bright core)
    ctx.globalAlpha = 0.9 * exhaustPulse;
    const flameC = ctx.createLinearGradient(0, 13, 0, 13 + exhaustLen * 1.2);
    flameC.addColorStop(0, "#fbbf24");
    flameC.addColorStop(0.2, "#ef4444");
    flameC.addColorStop(0.6, "#8b5cf6");
    flameC.addColorStop(1, "transparent");
    ctx.fillStyle = flameC;
    ctx.beginPath();
    ctx.moveTo(-4, 13);
    ctx.quadraticCurveTo(-1, 13 + exhaustLen * 0.8, 0, 13 + exhaustLen * 1.2);
    ctx.quadraticCurveTo(1, 13 + exhaustLen * 0.8, 4, 13);
    ctx.closePath();
    ctx.fill();

    // ---- MAIN BODY ----
    ctx.globalAlpha = 1;
    const bodyGrad = ctx.createLinearGradient(0, -28, 0, 16);
    bodyGrad.addColorStop(0, "#6d28d9");
    bodyGrad.addColorStop(0.3, "#4c1d95");
    bodyGrad.addColorStop(0.6, "#3b0764");
    bodyGrad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = bodyGrad;

    // Sleek fuselage
    ctx.beginPath();
    ctx.moveTo(0, -30);                          // Nose tip
    ctx.bezierCurveTo(-3, -24, -7, -16, -10, -4); // Left upper curve
    ctx.bezierCurveTo(-11, 2, -11, 8, -10, 14);   // Left lower
    ctx.lineTo(-6, 16);                            // Left engine base
    ctx.lineTo(6, 16);                             // Right engine base
    ctx.lineTo(10, 14);                            // Right lower
    ctx.bezierCurveTo(11, 8, 11, 2, 10, -4);      // Right upper curve
    ctx.bezierCurveTo(7, -16, 3, -24, 0, -30);    // Right to nose
    ctx.closePath();
    ctx.fill();

    // Body panel line highlights
    ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
    ctx.lineWidth = 0.6;
    ctx.globalAlpha = 0.7;

    // Center ridge
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.lineTo(0, 14);
    ctx.stroke();

    // Side panel lines
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.bezierCurveTo(-8, -8, -8, 4, -7, 14);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, -18);
    ctx.bezierCurveTo(8, -8, 8, 4, 7, 14);
    ctx.stroke();

    // ---- WINGS ----
    ctx.globalAlpha = 1;
    const wingGrad = ctx.createLinearGradient(-35, 0, 35, 0);
    wingGrad.addColorStop(0, "#4c1d95");
    wingGrad.addColorStop(0.3, "#6d28d9");
    wingGrad.addColorStop(0.5, "#7c3aed");
    wingGrad.addColorStop(0.7, "#6d28d9");
    wingGrad.addColorStop(1, "#4c1d95");
    ctx.fillStyle = wingGrad;

    // Left wing
    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(-34, 8);
    ctx.lineTo(-36, 12);
    ctx.lineTo(-30, 14);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();

    // Right wing
    ctx.beginPath();
    ctx.moveTo(9, 0);
    ctx.lineTo(34, 8);
    ctx.lineTo(36, 12);
    ctx.lineTo(30, 14);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();

    // Wing edge glow
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.5;

    ctx.beginPath();
    ctx.moveTo(-9, 0);
    ctx.lineTo(-34, 8);
    ctx.lineTo(-36, 12);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(9, 0);
    ctx.lineTo(34, 8);
    ctx.lineTo(36, 12);
    ctx.stroke();

    // Wing tip lights (blinking)
    const blink = Math.sin(t * 4) > 0 ? 1 : 0.2;

    // Left tip
    ctx.globalAlpha = blink;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(-35, 10, 1.5, 0, Math.PI * 2);
    ctx.fill();
    const tipGlowL = ctx.createRadialGradient(-35, 10, 0, -35, 10, 5);
    tipGlowL.addColorStop(0, "rgba(239, 68, 68, 0.5)");
    tipGlowL.addColorStop(1, "transparent");
    ctx.fillStyle = tipGlowL;
    ctx.beginPath();
    ctx.arc(-35, 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Right tip
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(35, 10, 1.5, 0, Math.PI * 2);
    ctx.fill();
    const tipGlowR = ctx.createRadialGradient(35, 10, 0, 35, 10, 5);
    tipGlowR.addColorStop(0, "rgba(34, 197, 94, 0.5)");
    tipGlowR.addColorStop(1, "transparent");
    ctx.fillStyle = tipGlowR;
    ctx.beginPath();
    ctx.arc(35, 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // ---- COCKPIT (canopy) ----
    ctx.globalAlpha = 0.85;
    const cockpitGrad = ctx.createRadialGradient(0, -14, 1, 0, -14, 8);
    cockpitGrad.addColorStop(0, "rgba(139, 92, 246, 0.6)");
    cockpitGrad.addColorStop(0.5, "rgba(109, 40, 217, 0.4)");
    cockpitGrad.addColorStop(1, "rgba(76, 29, 149, 0.2)");
    ctx.fillStyle = cockpitGrad;

    ctx.beginPath();
    ctx.moveTo(0, -24);
    ctx.bezierCurveTo(-4, -18, -5, -12, -4, -6);
    ctx.bezierCurveTo(-2, -4, 2, -4, 4, -6);
    ctx.bezierCurveTo(5, -12, 4, -18, 0, -24);
    ctx.closePath();
    ctx.fill();

    // Cockpit frame
    ctx.strokeStyle = "rgba(196, 181, 253, 0.5)";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.6;
    ctx.stroke();

    // Cockpit reflection
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 0.4;
    ctx.beginPath();
    ctx.moveTo(-1, -22);
    ctx.bezierCurveTo(-3, -16, -3, -10, -2, -7);
    ctx.stroke();

    // ---- NOSE LIGHT ----
    const noseGlow = 0.5 + Math.sin(t * 3) * 0.3;
    ctx.globalAlpha = noseGlow;
    ctx.fillStyle = "#c084fc";
    ctx.beginPath();
    ctx.arc(0, -29, 1.2, 0, Math.PI * 2);
    ctx.fill();

    const noseG = ctx.createRadialGradient(0, -29, 0, 0, -29, 6);
    noseG.addColorStop(0, "rgba(192, 132, 252, 0.5)");
    noseG.addColorStop(1, "transparent");
    ctx.fillStyle = noseG;
    ctx.beginPath();
    ctx.arc(0, -29, 6, 0, Math.PI * 2);
    ctx.fill();

    // ---- ENGINE NOZZLES ----
    ctx.globalAlpha = 0.9;
    [-6, 6].forEach(ex => {
      const nozGrad = ctx.createLinearGradient(ex, 12, ex, 17);
      nozGrad.addColorStop(0, "#4c1d95");
      nozGrad.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = nozGrad;
      ctx.beginPath();
      ctx.moveTo(ex - 3.5, 13);
      ctx.lineTo(ex - 4, 17);
      ctx.lineTo(ex + 4, 17);
      ctx.lineTo(ex + 3.5, 13);
      ctx.closePath();
      ctx.fill();

      // Nozzle rim glow
      ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.6 + exhaustPulse * 0.3;
      ctx.beginPath();
      ctx.moveTo(ex - 4, 17);
      ctx.lineTo(ex + 4, 17);
      ctx.stroke();
    });

    // ---- AMBIENT SHIP GLOW ----
    ctx.globalAlpha = 0.15;
    const shipGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, 40);
    shipGlow.addColorStop(0, "rgba(139, 92, 246, 0.3)");
    shipGlow.addColorStop(1, "transparent");
    ctx.fillStyle = shipGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  requestAnimationFrame(animate);
})();
