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
  tagline: string;
  intro: string;
  proofLabel: string;
  proof: Stat[];
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

export interface BeyondCodeItem {
  icon: IconName;
  title: string;
  text: string;
}

export interface BeyondCode {
  heading: string;
  intro: string;
  items: BeyondCodeItem[];
}

export interface About {
  paragraphs: string[];
  stats: Stat[];
  beyondCode?: BeyondCode;
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
  live?: string;
  repo?: string;
  release?: string;
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
  links: {
    live: { label: string; ariaLabel: string };
    repo: { label: string; ariaLabel: string };
    release: {
      label: string;
      ariaLabel: string;
      fallbackLabel: string;
      fallbackAriaLabel: string;
    };
  };
  linksLabel: string;
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
  ctaProjectType: string;
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
  viewCertificateLabel: string;
  verifyCredential: string;
  verifyCredentialLabel: string;
  enlarge: string;
  imageAlt: string;
  skillsLabel: string;
  verifyPrintLabel: string;
}

export interface Certification {
  title: string | Todo;
  issuer: string | Todo;
  date: string | Todo;
  /** Kind of credential, e.g. "Nanodegree", "Certificate", "Digital badge". */
  type?: string;
  skills?: string[];
  /** Short extra line, e.g. a sponsorship. */
  note?: string;
  /** PDF of the certificate. */
  fileUrl?: string;
  /** Thumbnail image (about 4:3). */
  image?: string;
  credentialUrl?: string;
}

export interface Contact {
  heading: string;
  subheading: string;
  formEndpoint: string | Todo;
  availability: string;
  responseTime: string;
  sidePanelHeading: string;
  emailHeading: string;
  locationHeading: string;
  socialsHeading: string;
  defaultSubject: string;
  form: ContactForm;
}

interface FieldText {
  label: string;
  placeholder: string;
}

export interface ContactForm {
  label: string;
  optional: string;
  name: FieldText;
  email: FieldText;
  subject: FieldText;
  projectType: FieldText & { other: string };
  budget: FieldText & { options: string[] };
  message: FieldText;
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    messageTooShort: string;
  };
  submit: string;
  submitting: string;
  successTitle: string;
  successText: string;
  errorTitle: string;
  errorText: string;
  mailtoNotice: string;
  mailtoFields: { name: string; email: string; projectType: string; budget: string };
}

/** Small UI strings that are not tied to one section. */
export interface Ui {
  confidentialBadge: string;
  hireMe: string;
  downloadCv: string;
  copyEmail: string;
  emailCopied: string;
  skipToContent: string;
  mainNavLabel: string;
  mobileNavLabel: string;
  homeLinkLabel: string;
  logoMarkAlt: string;
  paletteTip: string;
  paletteShortcut: { mac: string; other: string };
  openMenu: string;
  closeMenu: string;
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
  notificationsLabel: string;
  dismissNotification: string;
  copyFailed: string;
}

export interface Seo {
  title: string;
  description: string;
  /** Canonical site URL without a trailing slash. */
  url: string;
  ogImage: string;
  ogImageAlt: string;
  jobTitle: string;
  areaServed: string;
  locale: string;
}

export interface NotFound {
  title: string;
  prompt: string;
  command: string;
  error: string;
  hint: string;
  homeLink: string;
}

export interface Content {
  brand: Brand;
  seo: Seo;
  notFound: NotFound;
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
