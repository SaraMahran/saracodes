import type { icons } from 'lucide-react';

/** Any lucide-react icon name, e.g. "Server" or "GraduationCap". */
export type IconName = keyof typeof icons;

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
  /** Code-style eyebrow shown above the section heading, e.g. "// services". */
  eyebrow: string;
  heading: string;
}

export interface Socials {
  github: string;
  linkedin: string;
  upwork: string | Todo;
}

export interface Brand {
  name: string;
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

export interface Hero {
  name: string;
  roles: string[];
  intro: string;
  primaryCta: string;
  secondaryCta: string;
  availability: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface About {
  paragraphs: string[];
  stats: Stat[];
  beyondCode?: string;
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
  confidentialBadge: string;
  hireMe: string;
  downloadCv: string;
  copyEmail: string;
  emailCopied: string;
}

export interface Content {
  brand: Brand;
  sections: Section[];
  hero: Hero;
  about: About;
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education;
  mentoring: Mentoring;
  certifications: Certification[];
  contact: Contact;
  ui: Ui;
}
