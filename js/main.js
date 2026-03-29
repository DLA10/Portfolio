// ============================================================
// Main — Initialization, typing effect, location hover, nav
// ============================================================

(function () {
  // --- Typing Effect ---
  const phrases = [
    "ML/AI Engineer",
    "Building Intelligent Systems",
    "Turning Data into Decisions",
    "Knowledge Graph Architect",
  ];

  const typedEl = document.getElementById("typed-text");
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeLoop() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 400; // pause before next word
    }

    setTimeout(typeLoop, typeSpeed);
  }

  // Start typing after a brief delay
  setTimeout(typeLoop, 1500);

  // --- Location Hover → 3D Scene ---
  const locationDots = document.querySelectorAll(".location-dot");

  locationDots.forEach((dot) => {
    dot.addEventListener("mouseenter", () => {
      const loc = dot.dataset.location;
      if (window.setSceneLocation) {
        window.setSceneLocation(loc);
      }
      // Pulse animation
      dot.querySelector(".dot-ring").style.animation =
        "locPulse 1s ease-in-out infinite";
    });

    dot.addEventListener("mouseleave", () => {
      if (window.setSceneLocation) {
        window.setSceneLocation("default");
      }
      dot.querySelector(".dot-ring").style.animation = "";
    });
  });

  // Add pulse keyframes dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes locPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.4); }
    }
  `;
  document.head.appendChild(style);

  // --- Hide scroll hint when archives section enters viewport ---
  const scrollHint = document.querySelector(".hero-scroll-hint");
  const archivesSection = document.getElementById("projects");
  if (scrollHint && archivesSection) {
    window.addEventListener("scroll", () => {
      const archivesTop = archivesSection.getBoundingClientRect().top;
      if (archivesTop <= window.innerHeight) {
        scrollHint.classList.add("hidden");
      } else {
        scrollHint.classList.remove("hidden");
      }
    });
  }

  // --- Mobile Navigation ---
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      mobileMenu.classList.toggle("open");
      document.body.style.overflow = mobileMenu.classList.contains("open")
        ? "hidden"
        : "";
    });

    // Close on link click
    mobileMenu.querySelectorAll(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  // --- Smooth Scroll for Nav Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();
