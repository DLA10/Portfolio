// ============================================================
// 3D Animated Bat — Canvas rendered, top center
// ============================================================

(function () {
  const canvas = document.getElementById("bat-canvas");
  if (!canvas) return;

  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let W = 200, H = 120;

  function resize() {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
  }
  resize();
  window.addEventListener("resize", resize);

  const ctx = canvas.getContext("2d");

  // Bat color
  const BAT_COLOR = "#ef4444";
  const BAT_DARK = "#8b1a1a";
  const EYE_COLOR = "#ff6b6b";

  function animate(time) {
    requestAnimationFrame(animate);
    ctx.save();
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, W, H);

    const t = time * 0.001;
    const cx = W / 2;
    const cy = H / 2 + 8;

    // Floating motion
    const floatY = Math.sin(t * 1.2) * 5;
    const floatX = Math.sin(t * 0.7) * 3;
    const tilt = Math.sin(t * 0.9) * 0.05;

    ctx.translate(cx + floatX, cy + floatY);
    ctx.rotate(tilt);

    // Wing flap angle (smooth sinusoidal)
    const flapAngle = Math.sin(t * 8) * 0.55 + 0.1;
    const flapAngle2 = Math.sin(t * 8 + 0.3) * 0.45; // secondary joint delay

    // Scale based on canvas size
    const scale = W / 200;
    ctx.scale(scale, scale);

    // ---- DRAW BAT ----

    // Body glow
    const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, 50);
    glow.addColorStop(0, "rgba(239, 68, 68, 0.15)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 50, 0, Math.PI * 2);
    ctx.fill();

    // ---- LEFT WING ----
    ctx.save();
    ctx.rotate(flapAngle);

    // Wing membrane (inner section)
    ctx.fillStyle = BAT_COLOR;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.quadraticCurveTo(-20, -15 + flapAngle2 * 15, -40, -20 + flapAngle2 * 25);
    ctx.lineTo(-55, -18 + flapAngle2 * 30);
    ctx.quadraticCurveTo(-70, -12 + flapAngle2 * 35, -80, -8 + flapAngle2 * 40);
    // Wing tip fingers
    ctx.lineTo(-85, -5 + flapAngle2 * 42);
    ctx.lineTo(-78, 2 + flapAngle2 * 20);
    ctx.lineTo(-65, 6 + flapAngle2 * 15);
    ctx.lineTo(-50, 8 + flapAngle2 * 10);
    ctx.lineTo(-35, 10 + flapAngle2 * 5);
    ctx.quadraticCurveTo(-18, 12, -6, 8);
    ctx.closePath();
    ctx.fill();

    // Wing bone structure
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = BAT_DARK;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";

    // Main bone
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.quadraticCurveTo(-35, -12 + flapAngle2 * 18, -82, -6 + flapAngle2 * 40);
    ctx.stroke();

    // Finger bones
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(-45, -10 + flapAngle2 * 15);
    ctx.lineTo(-65, 5 + flapAngle2 * 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-55, -12 + flapAngle2 * 22);
    ctx.lineTo(-50, 8 + flapAngle2 * 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-65, -10 + flapAngle2 * 30);
    ctx.lineTo(-35, 10 + flapAngle2 * 5);
    ctx.stroke();

    // Wing vein texture
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const py = -8 + i * 5;
      ctx.beginPath();
      ctx.moveTo(-15, py + flapAngle2 * 3);
      ctx.quadraticCurveTo(-40, py + flapAngle2 * 12, -70, py + flapAngle2 * 25);
      ctx.stroke();
    }

    ctx.restore();

    // ---- RIGHT WING ----
    ctx.save();
    ctx.scale(-1, 1);
    ctx.rotate(flapAngle);

    ctx.fillStyle = BAT_COLOR;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.quadraticCurveTo(-20, -15 + flapAngle2 * 15, -40, -20 + flapAngle2 * 25);
    ctx.lineTo(-55, -18 + flapAngle2 * 30);
    ctx.quadraticCurveTo(-70, -12 + flapAngle2 * 35, -80, -8 + flapAngle2 * 40);
    ctx.lineTo(-85, -5 + flapAngle2 * 42);
    ctx.lineTo(-78, 2 + flapAngle2 * 20);
    ctx.lineTo(-65, 6 + flapAngle2 * 15);
    ctx.lineTo(-50, 8 + flapAngle2 * 10);
    ctx.lineTo(-35, 10 + flapAngle2 * 5);
    ctx.quadraticCurveTo(-18, 12, -6, 8);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = BAT_DARK;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.quadraticCurveTo(-35, -12 + flapAngle2 * 18, -82, -6 + flapAngle2 * 40);
    ctx.stroke();

    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(-45, -10 + flapAngle2 * 15);
    ctx.lineTo(-65, 5 + flapAngle2 * 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-55, -12 + flapAngle2 * 22);
    ctx.lineTo(-50, 8 + flapAngle2 * 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-65, -10 + flapAngle2 * 30);
    ctx.lineTo(-35, 10 + flapAngle2 * 5);
    ctx.stroke();

    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      const py = -8 + i * 5;
      ctx.beginPath();
      ctx.moveTo(-15, py + flapAngle2 * 3);
      ctx.quadraticCurveTo(-40, py + flapAngle2 * 12, -70, py + flapAngle2 * 25);
      ctx.stroke();
    }

    ctx.restore();

    // ---- BODY ----
    ctx.globalAlpha = 0.9;

    // Body fur
    const bodyGrad = ctx.createLinearGradient(0, -14, 0, 18);
    bodyGrad.addColorStop(0, BAT_COLOR);
    bodyGrad.addColorStop(0.5, BAT_DARK);
    bodyGrad.addColorStop(1, BAT_COLOR);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 2, 7, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // ---- HEAD ----
    const headGrad = ctx.createRadialGradient(0, -14, 1, 0, -14, 10);
    headGrad.addColorStop(0, BAT_COLOR);
    headGrad.addColorStop(1, BAT_DARK);
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, -14, 8, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // ---- EARS ----
    ctx.fillStyle = BAT_COLOR;
    ctx.globalAlpha = 0.95;

    // Left ear
    ctx.beginPath();
    ctx.moveTo(-5, -18);
    ctx.quadraticCurveTo(-8, -32, -4, -35);
    ctx.quadraticCurveTo(-1, -28, -2, -18);
    ctx.closePath();
    ctx.fill();

    // Right ear
    ctx.beginPath();
    ctx.moveTo(5, -18);
    ctx.quadraticCurveTo(8, -32, 4, -35);
    ctx.quadraticCurveTo(1, -28, 2, -18);
    ctx.closePath();
    ctx.fill();

    // Inner ears
    ctx.fillStyle = BAT_DARK;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(-4, -19);
    ctx.quadraticCurveTo(-6, -28, -4, -31);
    ctx.quadraticCurveTo(-2, -26, -2, -19);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(4, -19);
    ctx.quadraticCurveTo(6, -28, 4, -31);
    ctx.quadraticCurveTo(2, -26, 2, -19);
    ctx.closePath();
    ctx.fill();

    // ---- EYES ----
    // Glowing eyes
    const eyeGlow = ctx.createRadialGradient(-4, -14, 0, -4, -14, 6);
    eyeGlow.addColorStop(0, EYE_COLOR);
    eyeGlow.addColorStop(0.5, "rgba(239, 68, 68, 0.3)");
    eyeGlow.addColorStop(1, "transparent");
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = eyeGlow;
    ctx.beginPath();
    ctx.arc(-4, -14, 6, 0, Math.PI * 2);
    ctx.fill();

    const eyeGlow2 = ctx.createRadialGradient(4, -14, 0, 4, -14, 6);
    eyeGlow2.addColorStop(0, EYE_COLOR);
    eyeGlow2.addColorStop(0.5, "rgba(239, 68, 68, 0.3)");
    eyeGlow2.addColorStop(1, "transparent");
    ctx.fillStyle = eyeGlow2;
    ctx.beginPath();
    ctx.arc(4, -14, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye orbs
    ctx.globalAlpha = 1;
    ctx.fillStyle = EYE_COLOR;
    ctx.beginPath();
    ctx.ellipse(-4, -14, 2.2, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, -14, 2.2, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pupils (follow a subtle pattern)
    const pupilX = Math.sin(t * 0.5) * 0.5;
    const pupilY = Math.cos(t * 0.7) * 0.3;
    ctx.fillStyle = "#0a0a0f";
    ctx.beginPath();
    ctx.ellipse(-4 + pupilX, -14 + pupilY, 1, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4 + pupilX, -14 + pupilY, 1, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();

    // ---- NOSE ----
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = BAT_DARK;
    ctx.beginPath();
    ctx.ellipse(-1.5, -9, 1, 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1.5, -9, 1, 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // ---- FEET ----
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = BAT_COLOR;
    // Left foot
    ctx.beginPath();
    ctx.moveTo(-4, 15);
    ctx.lineTo(-6, 20);
    ctx.lineTo(-3, 18);
    ctx.lineTo(-4, 22);
    ctx.lineTo(-1, 18);
    ctx.lineTo(-2, 15);
    ctx.closePath();
    ctx.fill();
    // Right foot
    ctx.beginPath();
    ctx.moveTo(4, 15);
    ctx.lineTo(6, 20);
    ctx.lineTo(3, 18);
    ctx.lineTo(4, 22);
    ctx.lineTo(1, 18);
    ctx.lineTo(2, 15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  requestAnimationFrame(animate);
})();
