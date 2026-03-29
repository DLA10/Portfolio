// ============================================================
// GSAP Scroll & Hover Animations
// ============================================================

(function () {
  gsap.registerPlugin(ScrollTrigger);

  // --- Reveal animations for all sections ---
  const sections = document.querySelectorAll(".section:not(.hero)");

  sections.forEach((section) => {
    // Section headers
    const header = section.querySelector(".section-header");
    if (header) {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }
  });

  // --- Project cards stagger ---
  gsap.from(".project-card", {
    scrollTrigger: {
      trigger: ".projects-grid",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });

  // --- Project card 3D tilt on mouse move ---
  document.querySelectorAll(".project-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  });

  // --- Experience card ---
  gsap.from(".exp-card", {
    scrollTrigger: {
      trigger: ".exp-card",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
  });

  // --- Experience list items ---
  gsap.from(".exp-list li", {
    scrollTrigger: {
      trigger: ".exp-list",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    x: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: "power2.out",
  });

  // --- Achievement cards ---
  gsap.from(".achievement-card", {
    scrollTrigger: {
      trigger: ".achievement-grid",
      start: "top 85%",
      toggleActions: "play none none none",
    },
    y: 40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.15,
    ease: "power3.out",
  });

  // --- Education timeline items ---
  gsap.from(".edu-item", {
    scrollTrigger: {
      trigger: ".edu-timeline",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    x: -40,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    ease: "power3.out",
  });

  // --- Education line draw ---
  gsap.from(".edu-line", {
    scrollTrigger: {
      trigger: ".edu-timeline",
      start: "top 80%",
      toggleActions: "play none none none",
    },
    scaleY: 0,
    transformOrigin: "top center",
    duration: 1.2,
    ease: "power2.out",
  });

  // --- Contact cards ---
  gsap.from(".contact-card", {
    scrollTrigger: {
      trigger: ".contact-links",
      start: "top 90%",
      toggleActions: "play none none none",
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: "power3.out",
  });

  // --- Navbar scroll effect ---
  ScrollTrigger.create({
    start: "top -80",
    onUpdate: (self) => {
      const navbar = document.getElementById("navbar");
      if (self.direction === 1 && self.progress > 0) {
        navbar.classList.add("scrolled");
      } else if (self.progress === 0) {
        navbar.classList.remove("scrolled");
      }
    },
  });

  // --- Active nav link on scroll ---
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionIds = ["hero", "projects", "experience", "education", "contact"];

  sectionIds.forEach((id) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateActiveNav(id),
      onEnterBack: () => updateActiveNav(id),
    });
  });

  function updateActiveNav(activeId) {
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === activeId);
    });
  }
})();
