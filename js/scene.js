// ============================================================
// Three.js 3D Background — Particle field with dynamic lighting
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
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.0008);

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 0, 600);

  // --- Particle System ---
  const PARTICLE_COUNT = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  const velocities = new Float32Array(PARTICLE_COUNT * 3);

  // Default color (purple tint)
  const baseColor = { r: 0.55, g: 0.36, b: 0.96 };

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 2000;
    positions[i3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i3 + 2] = (Math.random() - 0.5) * 1500;

    colors[i3] = baseColor.r;
    colors[i3 + 1] = baseColor.g;
    colors[i3 + 2] = baseColor.b;

    sizes[i] = Math.random() * 3 + 1;

    velocities[i3] = (Math.random() - 0.5) * 0.3;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.3;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  // Particle material
  const material = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // --- Grid Lines (subtle floor grid) ---
  const gridHelper = new THREE.GridHelper(2000, 40, 0x1a1030, 0x0d0b1a);
  gridHelper.position.y = -400;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.15;
  scene.add(gridHelper);

  // --- Ambient Light ---
  const ambient = new THREE.AmbientLight(0x8b5cf6, 0.3);
  scene.add(ambient);

  // --- Point Lights (dynamic) ---
  const light1 = new THREE.PointLight(0x8b5cf6, 1.5, 800);
  light1.position.set(200, 200, 300);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xef4444, 0.8, 600);
  light2.position.set(-300, -100, 200);
  scene.add(light2);

  // --- Color Transition State ---
  const currentColor = { r: baseColor.r, g: baseColor.g, b: baseColor.b };
  let targetColor = { r: baseColor.r, g: baseColor.g, b: baseColor.b };
  let targetFog = 0x0a0a0f;
  let targetLight1 = 0x8b5cf6;
  let targetLight2 = 0xef4444;
  const lerpSpeed = 0.02;

  // Expose color change to main.js
  window.setSceneLocation = function (locationId) {
    switch (locationId) {
      case "bangalore":
        targetColor = { r: 0.55, g: 0.36, b: 0.96 }; // purple
        targetFog = 0x0d0520;
        targetLight1 = 0x8b5cf6;
        targetLight2 = 0xc084fc;
        break;
      case "chennai":
        targetColor = { r: 0.94, g: 0.27, b: 0.27 }; // red
        targetFog = 0x150505;
        targetLight1 = 0xef4444;
        targetLight2 = 0xf87171;
        break;
      case "uk":
        targetColor = { r: 0.13, g: 0.77, b: 0.37 }; // green
        targetFog = 0x031a0a;
        targetLight1 = 0x22c55e;
        targetLight2 = 0x4ade80;
        break;
      default:
        targetColor = { r: 0.55, g: 0.36, b: 0.96 };
        targetFog = 0x0a0a0f;
        targetLight1 = 0x8b5cf6;
        targetLight2 = 0xef4444;
    }
  };

  // --- Mouse parallax ---
  let mouseX = 0,
    mouseY = 0;
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

  function lerpColor(color, target, hex) {
    const t = new THREE.Color(hex);
    color.lerp(t, lerpSpeed);
  }

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Lerp particle colors toward target
    currentColor.r = lerp(currentColor.r, targetColor.r, lerpSpeed);
    currentColor.g = lerp(currentColor.g, targetColor.g, lerpSpeed);
    currentColor.b = lerp(currentColor.b, targetColor.b, lerpSpeed);

    const colorsAttr = geometry.attributes.color;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Update positions with velocity
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Wrap around boundaries
      if (positions[i3] > 1000) positions[i3] = -1000;
      if (positions[i3] < -1000) positions[i3] = 1000;
      if (positions[i3 + 1] > 1000) positions[i3 + 1] = -1000;
      if (positions[i3 + 1] < -1000) positions[i3 + 1] = 1000;

      // Gentle wave motion
      positions[i3 + 1] += Math.sin(elapsed * 0.3 + i * 0.01) * 0.05;

      // Update colors with slight variation per particle
      const variation = Math.sin(i * 0.5 + elapsed) * 0.1;
      colorsAttr.array[i3] = currentColor.r + variation;
      colorsAttr.array[i3 + 1] = currentColor.g + variation * 0.5;
      colorsAttr.array[i3 + 2] = currentColor.b + variation * 0.3;
    }

    geometry.attributes.position.needsUpdate = true;
    colorsAttr.needsUpdate = true;

    // Lerp fog & lights
    lerpColor(scene.fog.color, scene.fog.color, targetFog);
    scene.fog.color.lerp(new THREE.Color(targetFog), lerpSpeed);
    light1.color.lerp(new THREE.Color(targetLight1), lerpSpeed);
    light2.color.lerp(new THREE.Color(targetLight2), lerpSpeed);

    // Subtle rotation
    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = elapsed * 0.005;

    // Mouse parallax
    camera.position.x += (mouseX * 60 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 40 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    // Light orbit
    light1.position.x = Math.sin(elapsed * 0.3) * 400;
    light1.position.z = Math.cos(elapsed * 0.3) * 300;
    light2.position.x = Math.cos(elapsed * 0.2) * 350;
    light2.position.y = Math.sin(elapsed * 0.4) * 200;

    renderer.render(scene, camera);
  }

  animate();
})();
