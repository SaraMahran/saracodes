import type { IconName } from '@/lib/icons';

/** A registered lucide-react icon name (see src/lib/icons.ts). */
export type { IconName };

/** Placeholder values start with "TODO:" so they are easy to find and are hidden by the UI. */
export type Todo = `TODO:${string}`;

export type SectionId =
  | 'hero'
  | 'about'
  | 'services'
  | 'projects'
  | 'experience'
  | 'mentoring'
  | 'certifications'
  | 'contact';

export interface Section {
  id: SectionId;
  /** Navigation label, e.g. "Services". */
  label: string;
  /** Short lowercase name rendered as a numbered mono label, e.g. "// 02. services". */
  eyebrow: string;
  heading: string;
  /** Optional line under the heading. */
  subheading?: string;
  /** Whether the section gets a link in the navbar. */
  inNav: boolean;
}

export interface Socials {
  github: string;
  linkedin: string;
  upwork: string | Todo;
}

export interface Brand {
  name: string;
  /** The wordmark split into its two colored halves, e.g. Sara (secondary) + Codes (primary). */
  wordmark: { first: string; second: string };
  owner: string;
  domain: string;
  url: string;
  tagline: string;
  logoPath: string;
  logoMarkPath: string;
  logoAlt: string;
  email: string;
  location: string;
  socials: Socials;
  cvPath: string;
}

export type CodeValue = string | string[] | boolean;

/** A tiny Python class rendered as a syntax-highlighted editor card in the hero. */
export interface CodeSnippet {
  fileName: string;
  /** Accessible description of the decorative editor card. */
  label: string;
  className: string;
  fields: { name: string; value: CodeValue }[];
}

export interface Hero {
  name: string;
  roles: string[];
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  availability: string;
  greeting: string;
  nameHighlight: string;
  rolesLabel: string;
  scrollHint: string;
  scrollHintLabel: string;
  code: CodeSnippet;
}

export interface Stat {
  label: string;
  value: string;
}

export interface About {
  paragraphs: string[];
  stats: Stat[];
  beyondCode?: string;
  statsLabel: string;
  techStackHeading: string;
  techStack: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  stack: string[];
  deliverables: string[];
}

export interface ProjectLinks {
  live?: string | Todo;
  repo?: string | Todo;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  outcome: string | Todo;
  stack: string[];
  tags: string[];
  image: string;
  links?: ProjectLinks;
  /** Professional work under confidentiality: described generically and never linked. */
  confidential: boolean;
}

export interface ProjectsUi {
  filterLabel: string;
  filterAll: string;
  filterProfessional: string;
  filterOwn: string;
  resultsCount: string;
  empty: string;
  viewCaseStudy: string;
  problemHeading: string;
  solutionHeading: string;
  outcomeHeading: string;
  stackHeading: string;
  confidentialNote: string;
  liveLink: string;
  repoLink: string;
  previous: string;
  next: string;
  position: string;
  imageAlt: string;
}

export interface Experience {
  role: string;
  org: string;
  period: string | Todo;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  period: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface Mentoring {
  intro: string;
  stats: Stat[];
  topics: string[];
  formats: string[];
  testimonials: Testimonial[];
  statsLabel: string;
  topicsHeading: string;
  formatsHeading: string;
  testimonialsHeading: string;
  cta: string;
  ctaSubject: string;
  carousel: {
    label: string;
    previous: string;
    next: string;
    slideLabel: string;
    goTo: string;
  };
}

export interface ExperienceUi {
  timelineLabel: string;
  educationHeading: string;
}

export interface CertificationsUi {
  viewCertificate: string;
  verifyCredential: string;
  enlarge: string;
  imageAlt: string;
}

export interface Certification {
  title: string | Todo;
  issuer: string | Todo;
  date: string | Todo;
  fileUrl?: string;
  image?: string;
  credentialUrl?: string;
}

export interface Contact {
  heading: string;
  subheading: string;
  formEndpoint: string | Todo;
  availability: string;
  responseTime: string;
}

/** Small UI strings that are not tied to one section. */
export interface Ui {
  comingSoon: string;
  sectionPlaceholder: string;
  confidentialBadge: string;
  hireMe: string;
  downloadCv: string;
  copyEmail: string;
  emailCopied: string;
  skipToContent: string;
  mainNavLabel: string;
  mobileNavLabel: string;
  homeLinkLabel: string;
  openMenu: string;
  closeMenu: string;
  openCommandPalette: string;
  switchToLight: string;
  switchToDark: string;
  backToTop: string;
  emailLabel: string;
  socialsLabel: string;
  copyright: string;
  social: Record<keyof Socials, string>;
  viewDetails: string;
  requestService: string;
  deliverablesHeading: string;
  stackHeading: string;
  closeDialog: string;
}

export interface Content {
  brand: Brand;
  sections: Section[];
  hero: Hero;
  about: About;
  services: Service[];
  projects: Project[];
  projectsUi: ProjectsUi;
  experience: Experience[];
  education: Education;
  mentoring: Mentoring;
  experienceUi: ExperienceUi;
  certificationsUi: CertificationsUi;
  certifications: Certification[];
  contact: Contact;
  ui: Ui;
}
