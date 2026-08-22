export type Service = {
  index: string;
  slug: string;
  title: string;
  copy: string;
  tags: string[];
  cta: string;
};

export const services: Service[] = [
  {
    index: "01",
    slug: "custom-software",
    title: "Custom Software Development",
    copy: "Tailored software designed specifically for your business. Built to scale. Built to last.",
    tags: [
      "Custom Platforms",
      "Business Systems",
      "API Development",
      "Scalable Architecture",
      "Internal Tools",
      "Enterprise Software",
    ],
    cta: "Build It With Us",
  },
  {
    index: "02",
    slug: "web-development",
    title: "Web Development",
    copy: "Modern websites and web applications combining high performance with outstanding user experience.",
    tags: [
      "React",
      "Next.js",
      "Frontend",
      "Backend",
      "Responsive",
      "API Integration",
      "Performance",
    ],
    cta: "Launch Your Platform",
  },
  {
    index: "03",
    slug: "mobile-apps",
    title: "Mobile App Development",
    copy: "Native and cross-platform applications for iOS and Android, designed for scalability and peak performance.",
    tags: ["Flutter", "React Native", "iOS", "Android", "Cross Platform", "API Integration"],
    cta: "Ship Your App",
  },
  {
    index: "04",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    copy: "Beautiful, intuitive interfaces designed to enhance engagement and elevate brand identity.",
    tags: [
      "UX Research",
      "Wireframes",
      "Prototyping",
      "Interface Design",
      "Design Systems",
      "Responsive Design",
    ],
    cta: "Design That Speaks",
  },
  {
    index: "05",
    slug: "ai-automation",
    title: "AI & Automation",
    copy: "Smart automation solutions designed to improve efficiency and simplify complex business operations.",
    tags: [
      "AI Integration",
      "Workflow Automation",
      "Business Automation",
      "Intelligent Systems",
      "Process Optimization",
    ],
    cta: "Automate The Busywork",
  },
];

export const technologies = [
  { group: "Frontend", items: ["HTML5", "CSS3", "JavaScript", "React", "Next.js"] },
  { group: "Backend", items: ["Java", "FastAPI", "Node.js", "PHP"] },
  { group: "Databases", items: ["MySQL", "PostgreSQL", "MongoDB"] },
  { group: "Mobile", items: ["Flutter", "React Native", "Swift", "Kotlin"] },
  { group: "Tools", items: ["Git", "GitHub", "Docker", "Linux"] },
];

export const industries = [
  "Healthcare",
  "Education",
  "Retail",
  "Finance",
  "E-Commerce",
  "Restaurants",
  "Logistics",
  "Real Estate",
  "Manufacturing",
  "Startups",
  "SMEs",
  "Enterprises",
];

export const processSteps = [
  {
    index: "01",
    title: "Discovery & Consultation",
    copy: "We understand your goals, challenges, and vision through in-depth discussions.",
  },
  {
    index: "02",
    title: "Planning & Strategy",
    copy: "We define the roadmap, milestones, technology stack, and project scope.",
  },
  {
    index: "03",
    title: "UI/UX Design",
    copy: "Wireframes and high-fidelity designs, created for review and approval.",
  },
  {
    index: "04",
    title: "Software Development",
    copy: "Your solution, built with clean, scalable, and well-documented code.",
  },
  {
    index: "05",
    title: "Testing & Quality Assurance",
    copy: "Rigorous testing across devices, browsers, and performance benchmarks.",
  },
  {
    index: "06",
    title: "Deployment",
    copy: "A smooth production launch with monitoring and rollback readiness.",
  },
  {
    index: "07",
    title: "Maintenance & Support",
    copy: "Ongoing support, updates, and continuous improvement after launch.",
  },
];
