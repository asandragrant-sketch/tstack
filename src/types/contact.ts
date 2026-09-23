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
  'D.JACOBWEBPRO@GMAIL.COM'
]

export const WHATSAPP_NUMBER = '+66 96 101 4547'
export const WHATSAPP_RAW = '66961014547'
export const WHATSAPP_LINK = 'https://wa.me/66961014547'

export const SERVICE_REGIONS = 'USA • UK • Spain • Selected Parts of Asia'
