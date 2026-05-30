export interface Internship {
  company: string;
  role: string;
  period: string;
  bullets: string[];
  website?: string;
}

export interface Project {
  title: string;
  role: string;
  description: string;
  technologies: string[];
  bullets: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  score: string;
  coursework?: string[];
}

export interface Skills {
  languages: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  mlAi: string[];
  tools: string[];
  deployment: string[];
  concepts: string[];
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  summary: string;
  education: Education[];
  internships: Internship[];
  projects: Project[];
  skills: Skills;
  achievements: string[];
  certifications: string[];
}

export const resumeData: ResumeData = {
  name: "Dhairya Tiwari",
  title: "Full-Stack Developer & ML Engineer",
  email: "dhairyatiwari186@gmail.com",
  phone: "+91-9721631005",
  github: "https://github.com", // standard github placeholder as requested
  linkedin: "https://linkedin.com", // LinkedIn link placeholder
  summary: "Full-Stack Developer and ML Engineer with hands-on production internship experience in scalable MERN stack ecosystems, RESTful APIs, JWT authentication, and deep learning deployment. Skilled in cloud infrastructure, database optimization, distributed backend architectures, and predictive ML systems with a strong focus on performance optimization, scalable system design, and end-to-end software delivery.",
  education: [
    {
      institution: "Vellore Institute of Technology, Chennai",
      degree: "B.Tech Computer Science & Engineering",
      period: "Expected 2027",
      score: "B.Tech Undergrad",
      coursework: ["Data Structures & Algorithms", "DBMS", "Operating Systems", "Computer Networks", "Machine Learning", "OOP"]
    },
    {
      institution: "Puranchandra Vidyaniketan (CBSE)",
      degree: "Class XII",
      period: "2023",
      score: "95.8%"
    },
    {
      institution: "Birla School Pilani (CBSE)",
      degree: "Class X",
      period: "2021",
      score: "90.2%"
    }
  ],
  internships: [
    {
      company: "BrandedBuddies",
      role: "Software Development Intern (Full-Stack)",
      period: "May 2025 - June 2025",
      website: "thesafarbuddy.com",
      bullets: [
        "Built and deployed SafarBuddy (thesafarbuddy.com), a travel booking platform using React.js, Node.js, and MongoDB handling end-to-end booking and real-time availability.",
        "Designed REST APIs with JWT auth, session handling, and optimized MongoDB aggregation queries; managed CI/CD pipelines and Agile sprint deliverables on Render.",
        "Improved frontend performance via lazy loading and memoization, reducing page load latency; implemented responsive UI/UX design with seamless cross-device support."
      ]
    },
    {
      company: "DevLaunch Pvt Ltd",
      role: "Web Developer Intern",
      period: "May 2025 - July 2025",
      website: "pujapathseva.com",
      bullets: [
        "Developed pujapathseva.com, a production full-stack platform with OTP-based auth, role management, booking workflows, and payment integration.",
        "Designed normalized MySQL schemas, built REST API integrations, and ensured full cross-browser/cross-device UI compatibility across all major platforms.",
        "Collaborated with design and backend teams to optimize responsive layouts and reduce server response times via query indexing."
      ]
    }
  ],
  projects: [
    {
      title: "Prescripto Healthcare Management System",
      role: "User | Admin Portal",
      description: "Full-stack healthcare coordination and appointment engine built with the MERN ecosystem.",
      technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "RBAC"],
      bullets: [
        "Created an integrated role-based portal for patients, doctors, and system administrators.",
        "Implemented conflict-aware appointment scheduling, auto-calculating real-time availability queues.",
        "Designed secure patient records vaults and highly modular REST APIs supporting zero-refactoring upgrades."
      ],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "AI Website Builder",
      role: "Full-Stack Dev",
      description: "Automated, AI-powered CMS engine utilizing generative API text and layout schema modeling.",
      technologies: ["OpenRouter API", "TypeScript", "Prisma ORM", "PostgreSQL", "Stripe API"],
      bullets: [
        "Engineered on-the-fly layout generation using prompt translation to structural JSON nodes.",
        "Incorporated recursive usage limits, credit-based rate limiters, and direct Stripe subscription bindings.",
        "Created secure webhook relays and server-side secret credentials isolation."
      ],
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Tomato Disease Predictor",
      role: "ML / Full-Stack Engineer",
      description: "Transfer-learning agricultural classification suite deploying deep learning to user edge points.",
      technologies: ["FastAPI", "React.js", "GoogLeNet (Inception v1)", "PyTorch", "NumPy", "Pandas"],
      bullets: [
        "Fine-tuned GoogLeNet across 10 disease categories using PlantVillage datasets with data augmentation.",
        "Engineered high-concurrency FastAPI inference routers to support real-time digital agricultural image triage.",
        "Achieved near-instant latency and robust multi-class cross-validation metrics."
      ],
      liveUrl: "#",
      githubUrl: "#"
    }
  ],
  skills: {
    languages: ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "SQL"],
    frontend: ["React.js", "HTML5", "CSS3", "Responsive UI Design", "Tailwind CSS"],
    backend: ["Node.js", "Express.js", "FastAPI", "REST APIs", "JWT", "RBAC"],
    databases: ["MongoDB", "MySQL", "PostgreSQL", "Prisma ORM"],
    mlAi: ["NumPy", "Pandas", "Scikit-learn", "PyTorch", "CNN", "Transfer Learning"],
    tools: ["Git", "Postman", "VS Code", "GitHub Actions"],
    deployment: ["Vercel", "Render", "CI/CD", "Cloud Platforms"],
    concepts: ["OOP", "DBMS", "OS", "CN", "System Design Basics"]
  },
  achievements: [
    "Consistent competitive programming practice with high-level proficiency in algorithmic designs and complex problem-solving methodologies.",
    "1st Place Winner - EmpowerTech Hackathon under tight constraints.",
    "Rank 8 / 250+ teams in HacknDroid Hackathon."
  ],
  certifications: [
    "Full Stack Web Development MERN Stack Certified (Udemy, 40+ hours).",
    "Citi ICG Technology Software Engineering Job Simulation (Designed UML loan lifecycles, researched ML credit risk models, built Java market risk visualizers)."
  ]
};
