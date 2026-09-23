import React from 'react'
import SectionHeading from '@/components/common/SectionHeading'
import {
  Code2,
  Cpu,
  Database,
  Cloud,
  Layers,
  FileCode,
  Globe2,
  Workflow
} from 'lucide-react'

const TECHNOLOGIES = [
  {
    name: 'Next.js',
    category: 'Framework',
    desc: 'React framework for production SSR, static site generation, and optimized edge delivery.',
    icon: Layers,
    level: 'Core Framework',
  },
  {
    name: 'React',
    category: 'UI Library',
    desc: 'Declarative component-driven frontend architecture for responsive, dynamic user interfaces.',
    icon: Cpu,
    level: 'Frontend Core',
  },
  {
    name: 'TypeScript',
    category: 'Language',
    desc: 'Strict compile-time type safety preventing runtime bugs and enhancing codebase scalability.',
    icon: Code2,
    level: 'Code Standard',
  },
  {
    name: 'Tailwind CSS',
    category: 'Styling',
    desc: 'Utility-first CSS architecture for high-speed styling, design consistency, and zero bloat.',
    icon: FileCode,
    level: 'Design Tokens',
  },
  {
    name: 'Modern JavaScript (ES6+)',
    category: 'Language',
    desc: 'Clean, asynchronous, functional JavaScript for browser and Node.js server runtimes.',
    icon: Code2,
    level: 'Runtime Base',
  },
  {
    name: 'Semantic HTML5 & Modern CSS',
    category: 'Foundations',
    desc: 'Accessible, SEO-compliant markup with CSS Grid, Flexbox, and hardware-accelerated animations.',
    icon: Layers,
    level: 'Standards',
  },
  {
    name: 'WordPress / Headless CMS',
    category: 'Content Systems',
    desc: 'Custom themes, custom Gutenberg blocks, and headless decoupled REST/GraphQL setups.',
    icon: Globe2,
    level: 'CMS Solutions',
  },
  {
    name: 'APIs (REST & GraphQL)',
    category: 'Integration',
    desc: 'Secure endpoint architecture connecting third-party platforms, payments, and data feeds.',
    icon: Workflow,
    level: 'Integration',
  },
  {
    name: 'Databases & Schemas',
    category: 'Data Management',
    desc: 'Relational & key-value data modeling using PostgreSQL, SQLite, and serverless edge databases.',
    icon: Database,
    level: 'Persistence',
  },
  {
    name: 'Cloud Deployment & CI/CD',
    category: 'Infrastructure',
    desc: 'Automated build pipelines, edge caching networks, SSL hardening, and continuous deployment.',
    icon: Cloud,
    level: 'Hosting & Ops',
  },
]

export default function TechStack() {
  return (
    <section className="relative py-24 sm:py-32 bg-slate-950/90 tech-grid-pattern border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Supported Capabilities"
          title="PRODUCTION TECHNOLOGIES &amp;"
          highlight="DEVELOPMENT PRACTICES"
          description="We work strictly with modern, verified web technologies that guarantee speed, long-term maintainability, and clean code hygiene."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {TECHNOLOGIES.map((tech) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.name}
                className="p-5 rounded-xl glass-panel border border-slate-800/80 hover:border-blue-500/40 hover:bg-slate-900/70 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold">
                    {tech.category}
                  </span>
                  <h3 className="text-base font-bold text-white font-display mt-0.5 mb-2 group-hover:text-blue-200 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tech.desc}
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-500">
                    {tech.level}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
