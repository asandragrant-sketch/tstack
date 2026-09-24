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
  'Website Design',
  'Website Development',
  'E-commerce Development',
  'UI/UX Design',
  'Web Applications',
  'WordPress Development',
  'SEO',
  'Website Maintenance',
  'Website Redesign',
  'Performance Optimization',
  'Custom Software Development',
  'Digital Strategy',
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
export const FIVERR_LABEL = 'Hire Us on Fiverr'

export const SERVICE_REGIONS = 'USA • UK • Spain • Selected Parts of Asia'
