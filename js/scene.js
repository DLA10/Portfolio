// ============================================================
// Three.js 3D Background — Star Wars hyperspace star field
// ============================================================

(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // --- Scene ---
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.00035);

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    4000
  );
  camera.position.set(0, 0, 1000);

  // ==========================================================
  // STAR FIELD — dense rushing stars (hyperspace effect)
  // ==========================================================
  const STAR_COUNT = 6000;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(STAR_COUNT * 3);
  const starColors = new Float32Array(STAR_COUNT * 3);
  const starSpeeds = new Float32Array(STAR_COUNT); // per-star z-speed

  const FIELD_W = 3000;
  const FIELD_H = 2000;
  const FIELD_D = 4000;

  // Base palette — purple tint
  const baseColor = { r: 0.55, g: 0.36, b: 0.96 };

  for (let i = 0; i < STAR_COUNT; i++) {
    const i3 = i * 3;
    starPos[i3]     = (Math.random() - 0.5) * FIELD_W;
    starPos[i3 + 1] = (Math.random() - 0.5) * FIELD_H;
    starPos[i3 + 2] = Math.random() * FIELD_D - FIELD_D;

    // Colour: mostly white with a slight purple/blue tint, some colored
    const tint = Math.random();
    if (tint < 0.6) {
      // white/cool
      starColors[i3]     = 0.85 + Math.random() * 0.15;
      starColors[i3 + 1] = 0.82 + Math.random() * 0.15;
      starColors[i3 + 2] = 0.95 + Math.random() * 0.05;
    } else if (tint < 0.8) {
      // purple
      starColors[i3]     = 0.55 + Math.random() * 0.3;
      starColors[i3 + 1] = 0.3  + Math.random() * 0.2;
      starColors[i3 + 2] = 0.9  + Math.random() * 0.1;
    } else if (tint < 0.9) {
      // red
      starColors[i3]     = 0.9  + Math.random() * 0.1;
      starColors[i3 + 1] = 0.2  + Math.random() * 0.2;
      starColors[i3 + 2] = 0.2  + Math.random() * 0.2;
    } else {
      // green
      starColors[i3]     = 0.15 + Math.random() * 0.15;
      starColors[i3 + 1] = 0.7  + Math.random() * 0.3;
      starColors[i3 + 2] = 0.3  + Math.random() * 0.2;
    }

    // Each star has its own rush speed
    starSpeeds[i] = 1.5 + Math.random() * 4;
  }

  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ==========================================================
  // AMBIENT PARTICLES — slower, larger, colored glow
  // ==========================================================
  const AMBIENT_COUNT = 800;
  const ambGeo = new THREE.BufferGeometry();
  const ambPos = new Float32Array(AMBIENT_COUNT * 3);
  const ambCol = new Float32Array(AMBIENT_COUNT * 3);
  const ambVel = new Float32Array(AMBIENT_COUNT * 3);

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const i3 = i * 3;
    ambPos[i3]     = (Math.random() - 0.5) * 2500;
    ambPos[i3 + 1] = (Math.random() - 0.5) * 1800;
    ambPos[i3 + 2] = (Math.random() - 0.5) * 2000;

    ambCol[i3]     = baseColor.r;
    ambCol[i3 + 1] = baseColor.g;
    ambCol[i3 + 2] = baseColor.b;

    ambVel[i3]     = (Math.random() - 0.5) * 0.25;
    ambVel[i3 + 1] = (Math.random() - 0.5) * 0.25;
    ambVel[i3 + 2] = (Math.random() - 0.5) * 0.12;
  }

  ambGeo.setAttribute("position", new THREE.BufferAttribute(ambPos, 3));
  ambGeo.setAttribute("color", new THREE.BufferAttribute(ambCol, 3));

  const ambMat = new THREE.PointsMaterial({
    size: 3.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const ambientParticles = new THREE.Points(ambGeo, ambMat);
  scene.add(ambientParticles);

  // --- Grid Lines (subtle floor grid) ---
  const gridHelper = new THREE.GridHelper(2000, 40, 0x1a1030, 0x0d0b1a);
  gridHelper.position.y = -500;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.1;
  scene.add(gridHelper);

  // --- Lights ---
  const ambient = new THREE.AmbientLight(0x8b5cf6, 0.2);
  scene.add(ambient);

  const light1 = new THREE.PointLight(0x8b5cf6, 1.5, 1200);
  light1.position.set(200, 200, 300);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xef4444, 0.8, 800);
  light2.position.set(-300, -100, 200);
  scene.add(light2);

  // --- Color Transition State ---
  const currentColor = { r: baseColor.r, g: baseColor.g, b: baseColor.b };
  let targetColor = { r: baseColor.r, g: baseColor.g, b: baseColor.b };
  let targetFog = 0x0a0a0f;
  let targetLight1 = 0x8b5cf6;
  let targetLight2 = 0xef4444;
  let warpSpeed = 1.0;       // multiplier for star rush speed
  let targetWarp = 1.0;
  const lerpSpeed = 0.02;

  // Expose color change to main.js
  window.setSceneLocation = function (locationId) {
    switch (locationId) {
      case "uk":
        targetColor = { r: 0.13, g: 0.77, b: 0.37 };
        targetFog = 0x031a0a;
        targetLight1 = 0x22c55e;
        targetLight2 = 0x4ade80;
        targetWarp = 2.5; // speed burst on hover
        break;
      default:
        targetColor = { r: 0.55, g: 0.36, b: 0.96 };
        targetFog = 0x0a0a0f;
        targetLight1 = 0x8b5cf6;
        targetLight2 = 0xef4444;
        targetWarp = 1.0;
    }
  };

  // --- Mouse parallax ---
  let mouseX = 0, mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // --- Resize ---
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // --- Animation loop ---
  const clock = new THREE.Clock();

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Smooth warp speed transition
    warpSpeed = lerp(warpSpeed, targetWarp, 0.03);

    // ---- HYPERSPACE STARS ----
    const posArr = starGeo.attributes.position.array;
    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      // Rush toward camera (positive Z)
      posArr[i3 + 2] += starSpeeds[i] * warpSpeed;

      // Recycle behind camera
      if (posArr[i3 + 2] > 1000) {
        posArr[i3]     = (Math.random() - 0.5) * FIELD_W;
        posArr[i3 + 1] = (Math.random() - 0.5) * FIELD_H;
        posArr[i3 + 2] = -FIELD_D + Math.random() * 200;
      }
    }
    starGeo.attributes.position.needsUpdate = true;

    // Star streak effect — increase size with warp
    starMat.size = 2.2 + (warpSpeed - 1.0) * 1.5;

    // ---- AMBIENT PARTICLES ----
    currentColor.r = lerp(currentColor.r, targetColor.r, lerpSpeed);
    currentColor.g = lerp(currentColor.g, targetColor.g, lerpSpeed);
    currentColor.b = lerp(currentColor.b, targetColor.b, lerpSpeed);

    const ambPosArr = ambGeo.attributes.position.array;
    const ambColArr = ambGeo.attributes.color.array;
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const i3 = i * 3;

      ambPosArr[i3]     += ambVel[i3];
      ambPosArr[i3 + 1] += ambVel[i3 + 1];
      ambPosArr[i3 + 2] += ambVel[i3 + 2];

      // Wrap
      if (ambPosArr[i3] > 1250) ambPosArr[i3] = -1250;
      if (ambPosArr[i3] < -1250) ambPosArr[i3] = 1250;
      if (ambPosArr[i3 + 1] > 900) ambPosArr[i3 + 1] = -900;
      if (ambPosArr[i3 + 1] < -900) ambPosArr[i3 + 1] = 900;

      // Wave
      ambPosArr[i3 + 1] += Math.sin(elapsed * 0.3 + i * 0.01) * 0.04;

      // Color
      const v = Math.sin(i * 0.5 + elapsed) * 0.1;
      ambColArr[i3]     = currentColor.r + v;
      ambColArr[i3 + 1] = currentColor.g + v * 0.5;
      ambColArr[i3 + 2] = currentColor.b + v * 0.3;
    }
    ambGeo.attributes.position.needsUpdate = true;
    ambGeo.attributes.color.needsUpdate = true;

    // Fog & lights
    scene.fog.color.lerp(new THREE.Color(targetFog), lerpSpeed);
    light1.color.lerp(new THREE.Color(targetLight1), lerpSpeed);
    light2.color.lerp(new THREE.Color(targetLight2), lerpSpeed);

    // Subtle rotation on ambient particles
    ambientParticles.rotation.y = elapsed * 0.015;
    ambientParticles.rotation.x = elapsed * 0.004;

    // Mouse parallax
    camera.position.x += (mouseX * 80 - camera.position.x) * 0.025;
    camera.position.y += (-mouseY * 50 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);

    // Light orbit
    light1.position.x = Math.sin(elapsed * 0.3) * 500;
    light1.position.z = Math.cos(elapsed * 0.3) * 400;
    light2.position.x = Math.cos(elapsed * 0.2) * 450;
    light2.position.y = Math.sin(elapsed * 0.4) * 250;

    renderer.render(scene, camera);
  }

  animate();
})();
