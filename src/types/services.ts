export interface ServiceItem {
  id: string
  title: string
  shortDescription: string
  fullDescription: string
  icon: string
  capabilities: string[]
  deliverables: string[]
  badge?: string
  accentColor?: string
}

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'website-design',
    title: 'Website Design',
    shortDescription: 'Custom, high-conversion visual design tailored precisely to your brand identity and audience expectations.',
    fullDescription: 'We design modern, distinctive digital interfaces that captivate users from their first second on screen. Moving beyond cookie-cutter templates, our bespoke designs merge brand storytelling with psychological layout hierarchies.',
    icon: 'Layout',
    capabilities: [
      'Bespoke Brand & Layout Systems',
      'Art Direction & Interactive Prototyping',
      'High-Impact Typography & Grid Structures',
      'Cross-Device Visual Consistency'
    ],
    deliverables: ['Custom Figma Design System', 'Interactive Prototypes', 'Production Asset Library', 'Responsive Breakpoint Guides'],
    badge: 'Core Specialty'
  },
  {
    id: 'website-development',
    title: 'Website Development',
    shortDescription: 'Engineered for lightning performance, bulletproof security, and seamless maintainability on modern stacks.',
    fullDescription: 'Production-ready web development utilizing Next.js, React, TypeScript, and modern CSS architecture. We write pristine, scalable code structured to perform flawlessly across global viewports.',
    icon: 'Code2',
    capabilities: [
      'Next.js & React App Router Architecture',
      'TypeScript Strict Type Safety',
      'Accessible Semantic HTML5 & Modern CSS',
      'Zero-Latency Server-Side Rendering (SSR)'
    ],
    deliverables: ['Clean Production Repository', 'Modular Component Architecture', 'API Integration Layer', 'CI/CD Deployment Pipelines'],
    badge: 'Most Requested'
  },
  {
    id: 'ecommerce-development',
    title: 'E-commerce Development',
    shortDescription: 'Frictionless purchasing journeys, high-speed checkout flows, and enterprise-grade inventory integrations.',
    fullDescription: 'Empower your online business with robust e-commerce solutions built to convert visitors into loyal repeat customers. From custom headless storefronts to bespoke payment gateways, we optimize every touchpoint.',
    icon: 'ShoppingBag',
    capabilities: [
      'Headless Commerce & Custom Gateways',
      'Conversion-Optimized Checkout Funnels',
      'Inventory & ERP Systems Synchronizations',
      'International Currency & Tax Calculation'
    ],
    deliverables: ['Custom Storefront Architecture', 'Secure Payment Integrations', 'Product Catalog Engine', 'Analytics & Cart Abandonment Hooks'],
    badge: 'Revenue Focused'
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    shortDescription: 'Intuitive user experiences backed by behavioral research, user journey mapping, and micro-interactions.',
    fullDescription: 'Bridging the gap between user intent and business conversion through meticulous UX research, information architecture, wireframing, and elegant interface mechanics that feel natural and effortless.',
    icon: 'Compass',
    capabilities: [
      'User Journey & Flow Mapping',
      'Wireframing & Usability Heuristics',
      'Micro-interactions & State Transitions',
      'Design Systems & Component Tokens'
    ],
    deliverables: ['Complete Wireframe Blueprints', 'Clickable High-Fidelity Prototypes', 'User Journey Maps', 'Accessibility Audit Reports']
  },
  {
    id: 'web-applications',
    title: 'Web Applications',
    shortDescription: 'Complex web applications, SaaS dashboards, and dynamic client portals built with scalable cloud backends.',
    fullDescription: 'Full-stack engineering for modern software platforms. We architect high-concurrency cloud backends, reactive client interfaces, and real-time state management tailored for serious operational scale.',
    icon: 'Cpu',
    capabilities: [
      'Full-Stack Architecture & State Management',
      'REST & GraphQL API Engineering',
      'Role-Based Access Control (RBAC)',
      'Real-Time WebSockets & Telemetry'
    ],
    deliverables: ['Enterprise Web Application', 'Database Schema & Migrations', 'Secure Authentication Suite', 'API Documentation']
  },
  {
    id: 'wordpress-development',
    title: 'WordPress Development',
    shortDescription: 'Modern, high-performance custom WordPress builds, headless CMS implementations, and custom blocks.',
    fullDescription: 'Reinventing WordPress through clean modern development. We eliminate bloated themes and slow plugins, crafting custom block themes and headless WordPress APIs that load in milliseconds.',
    icon: 'FileCode',
    capabilities: [
      'Custom Gutenberg Block Development',
      'Headless WordPress with Next.js Frontends',
      'Lean Database Optimization & Hardening',
      'Custom Post Types & Advanced Custom Fields'
    ],
    deliverables: ['Tailored WordPress Theme', 'Custom Block Library', 'Security Hardening Protocol', 'Client Admin Training Manual']
  },
  {
    id: 'seo-services',
    title: 'SEO',
    shortDescription: 'Technical SEO, structured schema data, performance scoring, and semantic optimization for top rankings.',
    fullDescription: 'Dominate organic search results with technical search engine optimization built into the foundation of your website. We implement schema architectures, Core Web Vitals optimizations, and indexation strategies.',
    icon: 'Search',
    capabilities: [
      'Comprehensive Technical SEO Audits',
      'Structured JSON-LD Schema Markups',
      'Core Web Vitals Metric Optimization',
      'Search Engine Crawl & Index Optimization'
    ],
    deliverables: ['Technical SEO Architecture', 'Structured Schema Implementation', 'Sitemap & Robots Automation', 'Meta Tag Governance Framework']
  },
  {
    id: 'website-maintenance',
    title: 'Website Maintenance',
    shortDescription: 'Proactive 24/7 security monitoring, routine dependency updates, speed tuning, and SLA-backed support.',
    fullDescription: 'Ensure uninterrupted uptime, rock-solid security, and continuous improvements. Our maintenance programs protect your digital asset with regular patches, automated backups, and rapid incident response.',
    icon: 'ShieldCheck',
    capabilities: [
      'Proactive Security Scanning & Patching',
      'Scheduled Cloud Backups & Instant Restore',
      'Uptime Monitoring & Health Telemetry',
      'Continuous Framework & Dependency Updates'
    ],
    deliverables: ['Monthly Health & Security Report', 'Guaranteed SLA Response Times', 'Continuous Vulnerability Patching', 'Automated Daily Backups']
  },
  {
    id: 'website-redesign',
    title: 'Website Redesign',
    shortDescription: 'Transforming outdated digital assets into modern, high-performing growth engines with zero downtime.',
    fullDescription: 'Give your brand the modern digital presence it deserves. We analyze the shortcomings of your legacy website, revitalize the design aesthetic, modernize the tech stack, and protect your existing SEO equity.',
    icon: 'Sparkles',
    capabilities: [
      'Legacy Site Audit & Gap Analysis',
      'Modern Brand Elevation & UX Overhaul',
      '301 Redirect Mapping & SEO Preservation',
      'Zero-Downtime Data & Content Migration'
    ],
    deliverables: ['Complete UX/UI Modernization', 'SEO Migration Map & Verification', 'Speed & Performance Benchmarks', 'Brand Cohesion Upgrade']
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    shortDescription: 'Radical speed engineering, asset compression, caching strategies, and green 95+ PageSpeed scores.',
    fullDescription: 'Every 100ms delay degrades conversions. We dissect your critical rendering path, eliminate render-blocking resources, configure smart edge caching, and fine-tune image delivery for near-instant loads.',
    icon: 'Zap',
    capabilities: [
      'Critical Rendering Path Streamlining',
      'Next-Gen Image & Font Optimization',
      'Server Cache & CDN Edge Invalidation',
      'Bundle Reduction & Code Tree-Shaking'
    ],
    deliverables: ['90+ Google PageSpeed Scores', 'Core Web Vitals Pass Certificate', 'Edge Caching Configuration', 'Comprehensive Audit Diff']
  },
  {
    id: 'custom-software-development',
    title: 'Custom Software Development',
    shortDescription: 'Tailor-engineered digital platforms, custom internal tools, workflow automations, and enterprise utilities.',
    fullDescription: 'When off-the-shelf software fails to match your exact business operational model, we develop bespoke software solutions that automate workflows, centralize data, and unlock proprietary competitive advantages.',
    icon: 'Boxes',
    capabilities: [
      'Bespoke Business Logic Engineering',
      'Custom Web Portals & Workflow Automation',
      'Third-Party API & Microservice Hookups',
      'Scalable Multi-Tenant Architecture'
    ],
    deliverables: ['Tailor-Built Software Engine', 'Full Source Code Rights', 'Infrastructure Deployment Blueprint', 'API & Integration Docs']
  },
  {
    id: 'digital-strategy',
    title: 'Digital Strategy',
    shortDescription: 'Technology roadmapping, digital transformation advisory, and conversion-focused systems planning.',
    fullDescription: 'Clear, actionable technical direction tailored to scale your organization. We analyze your market landscape, define technical requirements, choose the optimal infrastructure, and chart a milestone-driven launch path.',
    icon: 'TrendingUp',
    capabilities: [
      'Technology Stack Selection & Audit',
      'Competitive Digital Landscape Analysis',
      'User Journey & Conversion Funnel Scoping',
      'Phased Engineering Delivery Roadmaps'
    ],
    deliverables: ['Comprehensive Strategic Blueprint', 'Architecture Recommendation Brief', 'Technical Milestones Roadmap', 'ROI & Scaling Framework']
  }
]
