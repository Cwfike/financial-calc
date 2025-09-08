'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calculator, Home, Car, ChevronDown, Menu, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [isCalculatorMenuOpen, setIsCalculatorMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const calculators = [
    {
      href: '/calculators/mortgage',
      name: 'Mortgage Calculator',
      description: 'Calculate monthly mortgage payments',
      icon: Home,
      color: 'text-blue-600'
    },
    {
      href: '/calculators/auto-loan',
      name: 'Auto Loan Calculator',
      description: 'Calculate car loan payments',
      icon: Car,
      color: 'text-green-600'
    }
  ]

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsCalculatorMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsCalculatorMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <Calculator className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                Financial Calc
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Calculators Dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsCalculatorMenuOpen(!isCalculatorMenuOpen)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname.startsWith('/calculators')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                aria-expanded={isCalculatorMenuOpen}
                aria-haspopup="true"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculators
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isCalculatorMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCalculatorMenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-900">Financial Calculators</h3>
                  </div>
                  {calculators.map((calc) => (
                    <Link
                      key={calc.href}
                      href={calc.href}
                      className={`flex items-start px-4 py-3 hover:bg-gray-50 transition-colors ${
                        isActive(calc.href) ? 'bg-blue-50' : ''
                      }`}
                    >
                      <calc.icon className={`h-5 w-5 ${calc.color} mt-0.5 mr-3 flex-shrink-0`} />
                      <div>
                        <div className={`text-sm font-medium ${
                          isActive(calc.href) ? 'text-blue-700' : 'text-gray-900'
                        }`}>
                          {calc.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {calc.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Link */}
            <Link
              href="/blog"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/blog')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-1">
              {/* Mobile Calculators Section */}
              <div className="px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Calculators
                </div>
                {calculators.map((calc) => (
                  <Link
                    key={calc.href}
                    href={calc.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(calc.href)
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <calc.icon className={`h-4 w-4 ${calc.color} mr-3`} />
                    {calc.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Blog Link */}
              <Link
                href="/blog"
                className={`block px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/blog')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Blog
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}