'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home, Calculator, Car, BookOpen } from 'lucide-react'

interface BreadcrumbItem {
  name: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  current?: boolean
}

export default function Breadcrumb() {
  const pathname = usePathname()

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', href: '/', icon: Home }
    ]

    let currentPath = ''
    
    for (let i = 0; i < segments.length; i++) {
      currentPath += `/${segments[i]}`
      const isLast = i === segments.length - 1
      
      let name = segments[i]
      let icon: React.ComponentType<{ className?: string }> | undefined

      // Customize names and icons based on the segment
      switch (segments[i]) {
        case 'calculators':
          name = 'Calculators'
          icon = Calculator
          break
        case 'mortgage':
          name = 'Mortgage Calculator'
          icon = Home
          break
        case 'auto-loan':
          name = 'Auto Loan Calculator'
          icon = Car
          break
        case 'blog':
          name = 'Blog'
          icon = BookOpen
          break
        case 'credit-score-mortgage-rate':
          name = 'How Credit Scores Affect Mortgage Rates'
          break
        default:
          // Convert kebab-case to Title Case
          name = segments[i]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
      }

      breadcrumbs.push({
        name,
        href: currentPath,
        icon,
        current: isLast
      })
    }

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumbs on homepage
  if (pathname === '/') {
    return null
  }

  // Generate structured data for breadcrumbs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://financial-calc.com${item.href}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ol className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
              )}
              
              {item.current ? (
                <span className="flex items-center text-gray-500 font-medium">
                  {item.icon && (
                    <item.icon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  )}
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.icon && (
                    <item.icon className="h-4 w-4 mr-1.5" aria-hidden="true" />
                  )}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
    </>
  )
}