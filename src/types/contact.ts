export interface ContactFormData {
  fullName: string
  email: string
  phone?: string
  company?: string
  service: string
  budget: string
  message: string
  websiteBotHoneypot?: string
}

export const SERVICE_OPTIONS = [
  'AI Automation & Workflows',
  'AI Agents & Assistants',
  'Web & Business Solutions',
  'Website Design & Development',
  'Client Portals & Dashboards',
  'API & CRM Integrations',
  'Performance Optimization',
  'Other'
] as const

export const BUDGET_OPTIONS = [
  'Under $1,000',
  '$1,000–$5,000',
  '$5,000–$10,000',
  '$10,000–$25,000',
  '$25,000+',
  'Not sure yet'
] as const

export const CONTACT_EMAILS = [
  'B.ELOWENWEBPRO@GMAIL.COM',
  'D.JACOBWEBPRO@GMAIL.COM',
  'DAVIDALISONWEBPRO@GMAIL.COM',
  'BARONWEBPRO@GMAIL.COM'
]

export const FIVERR_URL = 'https://www.fiverr.com/s/bkdlzbX'
export const FIVERR_LABEL = 'Order on Fiverr'

// Verified Direct Gig URLs
export const FIVERR_GIG_AUTOMATION_URL = 'https://www.fiverr.com/s/qbD3WD5'
export const FIVERR_GIG_AGENTS_WEB_URL = 'https://www.fiverr.com/s/432kmGk'

export interface FiverrGigItem {
  id: string
  title: string
  shortTitle: string
  description: string
  url: string
  category: string
  badge?: string
}

export const FIVERR_GIGS: FiverrGigItem[] = [
  {
    id: 'ai-automation',
    title: 'AI Automation & Workflows Gig',
    shortTitle: 'AI Automation Gig',
    description: 'Custom automated pipelines, webhook & API sync, CRM lead routing, and document processing.',
    url: 'https://www.fiverr.com/s/qbD3WD5',
    category: 'Automation & Integration',
    badge: 'Popular',
  },
  {
    id: 'ai-agents-web',
    title: 'AI Agents & Web Solutions Gig',
    shortTitle: 'AI Agents & Web Gig',
    description: 'Autonomous customer support agents, private RAG knowledge assistants, and modern web platforms.',
    url: 'https://www.fiverr.com/s/432kmGk',
    category: 'Agents & Full-Stack',
    badge: 'Direct Order',
  },
  {
    id: 'main-profile',
    title: 'TSTACK Pro Profile & Custom Scopes',
    shortTitle: 'Main Pro Profile',
    description: 'Bespoke enterprise milestones, consulting contracts, and multi-disciplinary systems architecture.',
    url: 'https://www.fiverr.com/s/bkdlzbX',
    category: 'All Services',
    badge: 'Pro Verified',
  },
]

export const SERVICE_REGIONS = 'USA • UK • Spain • Selected Parts of Asia'
