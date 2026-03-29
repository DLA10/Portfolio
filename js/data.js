// ============================================================
// Portfolio Data — Edit this file to update all content
// ============================================================

export const profile = {
  name: "Lalith Aditya",
  title: "ML/AI Engineer",
  tagline: "Turning raw data into intelligent systems",
  links: {
    linkedin: "https://www.linkedin.com/in/lalithadityad/",
    leetcode: "https://leetcode.com/u/LalithxAdityax/",
    github: "https://github.com/DLA10",
  },
};

export const locations = [
  {
    id: "bangalore",
    name: "Bangalore",
    label: "BLR",
    color: { r: 0.55, g: 0.36, b: 0.96 },    // purple
    hex: "#8b5cf6",
  },
  {
    id: "chennai",
    name: "Chennai",
    label: "MAA",
    color: { r: 0.94, g: 0.27, b: 0.27 },     // red
    hex: "#ef4444",
  },
  {
    id: "uk",
    name: "United Kingdom",
    label: "UK",
    color: { r: 0.13, g: 0.77, b: 0.37 },     // green
    hex: "#22c55e",
  },
];

export const projects = [
  {
    id: "signal-pair",
    title: "Signal Pair Arbitrage Engine",
    subtitle: "Quantitative Trading System",
    description:
      "A statistical arbitrage system leveraging pairs trading strategies to identify and exploit price divergences across correlated financial instruments.",
    tags: ["Python", "Statistical Analysis", "Trading", "Time Series"],
    role: "Developer",
    watermark: "candlestick",
    accent: "#ef4444",
  },
  {
    id: "molecule-audit",
    title: "Molecule Audit Foundry",
    subtitle: "Molecular Intelligence Platform",
    description:
      "An AI-powered molecular auditing platform that validates and analyzes chemical compound structures for pharmaceutical and research applications.",
    tags: ["ML", "Chemistry", "NLP", "Python"],
    role: "Founder",
    watermark: "dna",
    accent: "#22c55e",
  },
  {
    id: "clinical-rag",
    title: "Clinical Intelligence Graph RAG",
    subtitle: "Healthcare Knowledge System",
    description:
      "A retrieval-augmented generation system built on a medical knowledge graph, enabling intelligent clinical decision support through structured reasoning.",
    tags: ["Knowledge Graphs", "RAG", "NLP", "Healthcare"],
    role: "Founder",
    watermark: "asclepius",
    accent: "#8b5cf6",
  },
];

export const experience = {
  company: "NielsenIQ",
  logo: "NIQ",
  period: "Aug 2023 — Aug 2025",
  duration: "2 years",
  role: "Data Processing Analyst",
  responsibilities: [
    "Analyzed large datasets and delivered high-quality, actionable insights to support business objectives.",
    "Optimized data delivery processes under pressure to meet tight deadlines and client SLAs.",
    "Ensured data accuracy by identifying and correcting system-generated errors and incorporating client queries into internal systems.",
    "Collaborated with cross-functional teams and internal stakeholders to meet client requirements while maintaining data integrity standards.",
    "Utilized SQL and advanced Excel techniques for data cleaning, transformation, and analysis, improving report reliability.",
    "Developed dashboards and reports to visualize key metrics (KPIs), supporting data-driven decisions and process improvements.",
    "Trained junior associates on BAU activities and stakeholder presentation preparation, enhancing team productivity.",
  ],
  achievements: [
    {
      title: "NIQ Hackfest",
      subtitle: "Decode & Correct: Structuring Data Chaos in Seconds",
      points: [
        "Developed a machine learning pipeline to structure multilingual, unorganized retail data.",
        "Applied character-level TF-IDF vectorization, chi-squared feature selection, and Multinomial Naive Bayes tuned via GridSearchCV.",
        "Validated the model using real-world noisy datasets, demonstrating practical ML skills.",
      ],
    },
    {
      title: "UAT Leadership",
      subtitle: "Internal Tool Deployment",
      points: [
        "Led User Acceptance Testing for an internal report automation tool; acted as SPOC between users and dev team.",
        "Translated business feedback into structured test cases and ensured smooth deployment.",
      ],
    },
    {
      title: "Project Whitelisting",
      subtitle: "Prediction System Optimization",
      points: [
        "Improved prediction resolution of core databases by integrating cross-functional data streams.",
        "Handled large-scale structured datasets to optimize prediction accuracy.",
      ],
    },
  ],
};

export const education = [
  {
    degree: "Bachelor of Business Administration",
    school: "JAIN University",
    location: "India",
    period: "2019 — 2022",
    icon: "mortarboard",
  },
  {
    degree: "MBA — Data Science & Analytics",
    school: "JAIN University",
    location: "India",
    period: "2023 — 2025",
    icon: "chart",
  },
  {
    degree: "MSc in Data Science",
    school: "Kingston University",
    location: "United Kingdom",
    period: "2025 — 2026",
    icon: "globe",
  },
];
