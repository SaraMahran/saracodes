import type { Content } from './types';

/**
 * Single source of truth for all site copy.
 * Search for "TODO:" to find every value that still needs real content.
 * The UI hides TODO values (see src/lib/todo.ts) so placeholders never reach visitors.
 */
export const content: Content = {
  brand: {
    name: 'SaraCodes',
    wordmark: { first: 'Sara', second: 'Codes' },
    owner: 'Sara Ali Mahran',
    domain: 'saramahran.com',
    url: 'https://saramahran.com',
    tagline: 'Software engineering services & technical mentoring',
    logoPath: 'src/assets/logo.svg',
    logoMarkPath: 'src/assets/logo-mark.svg',
    logoAlt: 'SaraCodes logo',
    email: 'sara@saramahran.com',
    location: 'Egypt · working with clients worldwide, remote',
    socials: {
      github: 'https://github.com/SaraMahran',
      linkedin: 'https://www.linkedin.com/in/sara-ali-mahran/',
      upwork: 'TODO: Upwork profile URL',
    },
    cvPath: '/Sara_Ali_Mahran_CV.pdf',
  },

  // eyebrow renders as a numbered mono label, e.g. "// 02. services". inNav controls the navbar links.
  sections: [
    { id: 'hero', label: 'Home', eyebrow: 'hello', heading: 'Sara Ali Mahran', inNav: false },
    { id: 'about', label: 'About', eyebrow: 'about', heading: 'About me', inNav: true },
    {
      id: 'services',
      label: 'Services',
      eyebrow: 'services',
      heading: 'Services',
      subheading:
        'Services I offer to clients, from first prototype to production. Every engagement is scoped, built and delivered directly by me through SaraCodes.',
      inNav: true,
    },
    {
      id: 'projects',
      label: 'Projects',
      eyebrow: 'projects',
      heading: 'Selected work',
      inNav: true,
    },
    {
      id: 'experience',
      label: 'Experience',
      eyebrow: 'experience',
      heading: 'Experience',
      inNav: true,
    },
    {
      id: 'mentoring',
      label: 'Mentoring',
      eyebrow: 'mentoring',
      heading: 'Mentoring & teaching',
      inNav: true,
    },
    {
      id: 'certifications',
      label: 'Certifications',
      eyebrow: 'certifications',
      heading: 'Certifications',
      inNav: true,
    },
    {
      id: 'contact',
      label: 'Contact',
      eyebrow: 'contact',
      heading: "Let's work together",
      inNav: false,
    },
  ],

  hero: {
    name: 'Sara Ali Mahran',
    roles: ['Senior Software Engineer', 'Technical Mentor & Instructor', 'Product Builder'],
    intro:
      'I design and build desktop applications, backend systems and web and mobile products end to end. I also mentor developers to ship real-world projects with confidence.',
    primaryCta: 'Start a Project',
    secondaryCta: 'View Services',
    availability: 'Open to new projects',
    greeting: '> hello, world',
    // Part of the name rendered in the brand gradient.
    nameHighlight: 'Mahran',
    rolesLabel: 'Roles',
    scrollHint: 'Scroll',
    scrollHintLabel: 'Scroll to About',
    code: {
      fileName: 'sara_mahran.py',
      label: 'Code snippet describing Sara as a Python class',
      className: 'SaraMahran',
      fields: [
        { name: 'brand', value: 'SaraCodes' },
        { name: 'role', value: 'Senior Software Engineer' },
        { name: 'stack', value: ['Python', 'FastAPI', 'PySide6', 'React', 'Flutter'] },
        {
          name: 'services',
          value: ['Desktop apps', 'Backends', 'Web & mobile', 'AI features', 'Mentoring'],
        },
        { name: 'available', value: true },
      ],
    },
  },

  about: {
    paragraphs: [
      "I'm a senior software engineer with 3+ years of experience building production Python systems. My recent work is cross-platform desktop software in Python and PySide6, backed by a multi-service FastAPI and PostgreSQL platform that I deploy with Docker on DigitalOcean and keep running at 99.4%+ uptime.",
      "I'm comfortable with the parts of a system that are easy to get wrong: multi-tenant architecture, session and token security, and real-time delivery. Through SaraCodes I work as an independent freelancer for clients and build my own products.",
      "Teaching is the other half of my work. As a technical instructor and mentor I've guided learners from their first lines of code to finished, real-world projects. I'm currently deepening my work in LLM engineering, focusing on RAG and agentic AI.",
    ],
    stats: [
      { label: 'Years of experience', value: '3+' },
      { label: 'System uptime', value: '99.4%+' },
      { label: 'Learners mentored on real projects', value: '130+' },
      { label: 'Technical sessions delivered', value: '40+' },
    ],
    // optional: delete if not wanted
    beyondCode:
      "Beyond code, I'm an avid reader (roughly 900 books over 12 years). I'm building a books podcast in Egyptian dialect and writing my first book.",
    statsLabel: 'At a glance',
    techStackHeading: 'Tools I work with',
    techStack: [
      'Python',
      'PySide6',
      'FastAPI',
      'Django',
      'PostgreSQL',
      'PgBouncer',
      'Redis',
      'pgvector',
      'Docker',
      'nginx',
      'DigitalOcean',
      'React',
      'TypeScript',
      'Tailwind',
      'React Native',
      'Flutter',
      'Supabase',
      'Vercel',
    ],
  },

  services: [
    {
      id: 'desktop-apps',
      title: 'Custom Desktop Applications',
      description:
        'Production desktop tools with rich, responsive interfaces, reusable component libraries, file import and export, and integrations with industry software such as Oracle Primavera P6.',
      icon: 'AppWindow',
      stack: ['Python', 'PySide6', 'Qt'],
      deliverables: [
        'Cross-platform desktop application',
        'Reusable UI component library',
        'File import/export and third-party integrations',
        'Installer and release builds',
      ],
    },
    {
      id: 'backend-apis',
      title: 'Backend & API Development',
      description:
        'Multi-service and multi-tenant APIs with solid authentication and session security, subscriptions and entitlements, and real-time notifications over Server-Sent Events.',
      icon: 'Server',
      stack: ['FastAPI', 'PostgreSQL', 'Django', 'Docker'],
      deliverables: [
        'Documented REST API',
        'Authentication and session security',
        'Subscription and entitlement logic',
        'Real-time notifications (SSE)',
      ],
    },
    {
      id: 'web-mobile',
      title: 'Web & Mobile Apps',
      description:
        'Fast, accessible web apps and cross-platform mobile apps, from first prototype to a product your users can rely on.',
      icon: 'Smartphone',
      stack: ['React', 'TypeScript', 'Vite', 'Tailwind', 'React Native', 'Flutter', 'Supabase'],
      deliverables: [
        'Responsive web application',
        'iOS and Android app',
        'Supabase or custom backend integration',
        'Deployment to production',
      ],
    },
    {
      id: 'ai-features',
      title: 'AI-Powered Features',
      description:
        'Practical AI inside your product: LLM integrations, semantic search with pgvector, retrieval-augmented generation and AI-assisted matching, with API keys kept safely server-side.',
      icon: 'Sparkles',
      stack: ['LLM APIs', 'pgvector', 'RAG', 'Serverless functions'],
      deliverables: [
        'LLM feature integrated into your app',
        'Semantic search over your data',
        'RAG pipeline',
        'Secure server-side key handling',
      ],
    },
    {
      id: 'deployment-fixes',
      title: 'Server Setup, Deployment & Bug Fixing',
      description:
        'Production-ready hosting with backups and monitoring, plus focused debugging and fixes for issues in existing codebases.',
      icon: 'Rocket',
      stack: ['DigitalOcean', 'Docker Compose', 'nginx', 'Vercel', 'Railway'],
      deliverables: [
        'Production server and deployment setup',
        'Backups, health checks and alerting',
        'Root-cause bug fixes',
        'Handover notes for your team',
      ],
    },
    {
      id: 'mentoring',
      title: 'Technical Mentoring & Training',
      description:
        'Mentoring and training for individuals and teams, grounded in real projects rather than theory.',
      icon: 'GraduationCap',
      stack: ['Python', 'React', 'React Native'],
      deliverables: [
        '1:1 mentoring',
        'Project and code reviews',
        'Workshops',
        'Curriculum design',
        'Technical interviews',
      ],
    },
  ],

  projects: [
    {
      id: 'planning-desktop-suite',
      title: 'Planning & Scheduling Desktop Suite',
      category: 'Desktop application',
      summary:
        'A cross-platform desktop application that helps construction planning engineers automate scheduling work and visualize project data.',
      problem:
        'Planning engineers spent significant time on repetitive scheduling tasks and moving data in and out of Oracle Primavera P6 by hand.',
      solution:
        'I built a PySide6 desktop application with an Oracle Primavera P6 (XER) import/export engine written from scratch, automated scheduling and data visualization tools, trial and subscription gating, and a shared UI component library used across the product.',
      outcome: 'TODO: add measurable outcome',
      stack: ['Python', 'PySide6', 'Qt', 'PostgreSQL'],
      tags: ['Desktop', 'Data visualization', 'Integrations'],
      image: '/projects/planning-desktop-suite.png',
      confidential: true,
    },
    {
      id: 'multi-tenant-saas-backend',
      title: 'Multi-Tenant SaaS Backend',
      category: 'Backend platform',
      summary:
        'A multi-service FastAPI backend that powers desktop clients for multiple client organizations, with strict data isolation and hardened security.',
      problem:
        "Desktop clients needed a backend that keeps every organization's data fully isolated, enforces subscriptions reliably and keeps user sessions secure.",
      solution:
        'I designed a dedicated managed PostgreSQL database per client organization, with PgBouncer pooling, encrypted credentials and per-tenant routing. I added subscription lifecycle enforcement and a full session and token security hardening: refresh token rotation with reuse detection, OS keyring storage, rate limiting and device-based session control. Real-time notifications and remote logout run over Server-Sent Events.',
      outcome: '99.4%+ uptime in production',
      stack: ['FastAPI', 'PostgreSQL', 'PgBouncer', 'Redis', 'Docker', 'nginx', 'DigitalOcean'],
      tags: ['Multi-tenant', 'Security', 'Real-time'],
      image: '/projects/multi-tenant-saas-backend.png',
      confidential: true,
    },
    {
      id: 'admin-console',
      title: 'Admin & Organization Management Console',
      category: 'Desktop application',
      summary:
        'An admin application for managing organizations, users, role-scoped access and subscriptions.',
      problem:
        'Administrators needed one reliable place to manage client organizations, user access and subscriptions without touching the database directly.',
      solution:
        'I built a PySide6 admin console on top of the FastAPI platform, with role-scoped access control, subscription management and in-app notification publishing to desktop clients.',
      outcome: 'TODO: add measurable outcome',
      stack: ['Python', 'PySide6', 'FastAPI'],
      tags: ['Desktop', 'Admin tools', 'Access control'],
      image: '/projects/admin-console.png',
      confidential: true,
    },
    {
      id: 'wanas',
      title: 'Wanas',
      category: 'Own product',
      summary:
        'A bilingual Arabic and English platform for discovering quotes by mood, curated from books I have read.',
      problem:
        'Meaningful quotes are hard to find when you are looking for a feeling rather than a keyword, and few platforms serve Arabic and English readers equally well.',
      solution:
        'I built a bilingual platform where quotes are curated from my own reading, discovered by mood through pgvector semantic search, and paired with audio recordings for accessibility.',
      outcome: 'TODO: add measurable outcome',
      stack: ['Django', 'PostgreSQL', 'pgvector', 'React', 'Vercel', 'Railway'],
      tags: ['Bilingual', 'Semantic search', 'Accessibility'],
      image: '/projects/wanas.png',
      links: { live: 'TODO: Wanas live URL', repo: 'TODO: Wanas repo URL' },
      confidential: false,
    },
    {
      id: 'baed-connect',
      title: 'Baed Connect',
      category: 'Own product',
      summary: 'A career platform with an AI-powered Career Match feature.',
      problem:
        'Job seekers need personalized career guidance, and calling an LLM straight from the browser would expose private API keys.',
      solution:
        'I built the platform in React and TypeScript and moved the AI Career Match call into a server-side serverless function, so API keys never reach the client.',
      outcome: 'TODO: add measurable outcome',
      stack: ['React 18', 'TypeScript', 'Vite', 'Tailwind', 'Vercel serverless', 'LLM APIs'],
      tags: ['AI', 'Careers', 'Serverless'],
      image: '/projects/baed-connect.png',
      links: { live: 'TODO: Baed Connect live URL' },
      confidential: false,
    },
    {
      id: 'rouya',
      title: 'Rouya',
      category: 'Own product',
      summary: 'A personal achievement tracker app, with an AI feature planned.',
      problem:
        'Personal goals and achievements are easy to lose track of when they are scattered across notes and apps.',
      solution:
        'I am building a Flutter app backed by Supabase that keeps achievements in one place, with an AI feature planned to help users reflect on their progress.',
      outcome: 'TODO: add measurable outcome',
      stack: ['Flutter', 'Supabase'],
      tags: ['Mobile', 'Productivity'],
      image: '/projects/rouya.png',
      links: { live: 'TODO: Rouya live URL', repo: 'TODO: Rouya repo URL' },
      confidential: false,
    },
    {
      id: 'upnow',
      title: 'UpNow',
      category: 'Product prototype',
      summary:
        'A working product prototype of a two-sided marketplace and operating system for the UAE market, with Services and Spaces verticals.',
      problem:
        'Service providers, space owners and their customers in the UAE juggle separate tools for bookings, messaging and reporting.',
      solution:
        'I built a working prototype with role-based dashboards that stay in sync with each other, context-aware messaging, notifications and drill-down reporting across both verticals.',
      outcome: 'TODO: add measurable outcome',
      stack: ['React', 'TypeScript'],
      tags: ['Marketplace', 'Dashboards', 'Prototype'],
      image: '/projects/upnow.png',
      links: { live: 'TODO: UpNow live URL', repo: 'TODO: UpNow repo URL' },
      confidential: false,
    },
  ],

  experience: [
    {
      role: 'Senior Software Engineer',
      org: 'Planning Engineer Company',
      period: 'Apr 2025 – Present',
      highlights: [
        'Design and develop cross-platform desktop applications for planning engineers with Python, PySide6 and PostgreSQL, including an Oracle Primavera P6 (XER) import/export engine built from scratch.',
        'Architected multi-tenant data isolation with a dedicated managed PostgreSQL database per client organization, PgBouncer pooling, encrypted credentials and per-tenant routing.',
        'Led a full session and token security audit and hardening: refresh token rotation with reuse detection, OS keyring token storage, login rate limiting and device-based session control.',
        'Built real-time event delivery over Server-Sent Events for in-app notifications, instant remote logout and live subscription expiry enforcement.',
        'Designed the subscription and trial lifecycle end to end: entitlement enforcement, renewal flows, trial feature gating and offline-safe expiry checks.',
        'Raised reliability to 99.4%+ uptime, led the migration from a monolith to modular, independently deployable tools, and own production infrastructure on DigitalOcean (Docker Compose, nginx, managed PostgreSQL, backups and health alerting).',
        'Conducted 31 candidate interviews: 26 screening and 5 live coding interviews.',
      ],
    },
    {
      role: 'Session Lead',
      org: 'Udacity (DECI / DCDE programs)',
      period: 'Jul 2024 – Sep 2025',
      highlights: [
        'Delivered 40+ technical sessions in Python, React and React Native to 100+ youth and adult learners, from absolute beginners to advanced builders.',
        'Achieved 86–96% learner graduation rates across 5 cohorts, at or above the top performance threshold.',
        'Mentored 130+ learners through real-world projects, from debugging to clean code practices; several have since landed junior developer roles.',
      ],
    },
    // Hidden by the UI while the period or highlights are still TODO.
    {
      role: 'Instructor',
      org: 'iSchool',
      period: 'TODO: iSchool period',
      highlights: ['TODO: iSchool highlights'],
    },
    {
      role: 'Independent Software Engineer & Founder',
      org: 'SaraCodes',
      period: 'TODO: SaraCodes start date – Present',
      highlights: [
        'Deliver freelance software projects for clients through Upwork and direct engagements.',
        'Build and ship my own products: Wanas, Baed Connect, Rouya and UpNow.',
      ],
    },
  ],

  education: {
    degree: "Bachelor's Degree, Software Engineering",
    school: 'Cairo University',
    period: 'Oct 2016 – May 2022',
  },

  mentoring: {
    intro:
      "I've taught and mentored developers from their first program to job-ready portfolios. My sessions are practical and project-based: we debug real code, review real pull requests and prepare for real interviews.",
    stats: [
      { label: 'Students taught across Udacity and iSchool', value: '150+' },
      { label: 'Learners mentored on real projects', value: '130+' },
      { label: 'Graduation rate across 5 cohorts', value: '86–96%' },
      { label: 'Technical sessions delivered', value: '40+' },
    ],
    topics: [
      'Python',
      'React',
      'React Native',
      'Backend with FastAPI',
      'Git & code review',
      'Interview preparation',
    ],
    formats: [
      '1:1 mentoring',
      'Project reviews',
      'Workshops',
      'Curriculum design',
      'Technical interviews',
    ],
    // TODO: add testimonials. The UI hides the carousel while this list is empty.
    testimonials: [],
  },

  certifications: [
    {
      title: 'Forward Program',
      issuer: 'McKinsey.org',
      date: 'Nov 2023',
      fileUrl: '/certificates/mckinsey-forward.pdf',
    },
    {
      title: 'LLM Engineering: RAG & Agentic AI',
      issuer: 'Udemy',
      date: 'TODO: completion date',
    },
    {
      title: 'TODO: certification title',
      issuer: 'TODO: issuer',
      date: 'TODO: date',
    },
  ],

  contact: {
    heading: "Let's build something together",
    subheading:
      'Tell me about your project, timeline and goals. Whether you need a new product, a feature, a fix or a mentor, I will get back to you with clear next steps.',
    formEndpoint: 'TODO: Formspree endpoint',
    availability: 'Open to new projects',
    responseTime: 'I usually reply within 24 to 48 hours',
  },

  ui: {
    comingSoon: 'Coming soon',
    sectionPlaceholder: 'This section is being built. Check back soon.',
    confidentialBadge: 'Confidential client work',
    hireMe: 'Hire me',
    downloadCv: 'Download CV',
    copyEmail: 'Copy email',
    emailCopied: 'Email copied',
    skipToContent: 'Skip to content',
    mainNavLabel: 'Main',
    mobileNavLabel: 'Mobile',
    homeLinkLabel: 'SaraCodes, back to top',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    openCommandPalette: 'Open command palette',
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
    backToTop: 'Back to top',
    emailLabel: 'Email',
    socialsLabel: 'Social profiles',
    // {year} is replaced with the current year.
    copyright: '© {year} SaraCodes · Sara Ali Mahran',
    social: { github: 'GitHub', linkedin: 'LinkedIn', upwork: 'Upwork' },
    viewDetails: 'View details',
    requestService: 'Request this service',
    deliverablesHeading: "What you'll get",
    stackHeading: 'Tech stack',
    closeDialog: 'Close',
  },
};
