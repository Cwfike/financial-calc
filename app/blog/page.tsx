import Link from "next/link"
import { Calculator, Home, Car, ArrowLeft } from "lucide-react"

// Import all blog post meta
import { meta as creditScoreMeta } from "./credit-score-mortgage-rate/meta"

const posts = [
  {
    slug: "credit-score-mortgage-rate",
    meta: creditScoreMeta,
    date: "2024-12-20",
    readingTime: "6 minutes",
  },
  // Add more posts here in the same format
]

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Home
              </Link>
              <Calculator className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                Financial Calc Blog
              </h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/calculators/mortgage" 
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Mortgage Calculator
              </Link>
              <Link 
                href="/calculators/auto-loan" 
                className="text-gray-700 hover:text-green-600 transition-colors font-medium"
              >
                Auto Loan Calculator
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Calculator Cards - Featured Section */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Try Our Financial Calculators
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/calculators/mortgage" className="group">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-center mb-3">
                  <Home className="h-6 w-6 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Mortgage Calculator</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Calculate monthly payments with credit score-based rates
                </p>
              </div>
            </Link>
            <Link href="/calculators/auto-loan" className="group">
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex items-center mb-3">
                  <Car className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Auto Loan Calculator</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Calculate car payments for new and used vehicles
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600"
                >
                  {post.meta.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-4">{post.meta.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <time dateTime={post.date}>Published: {post.date}</time>
                <span className="mx-2">•</span>
                <span>{post.readingTime}</span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Read More
              </Link>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <section className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Calculate Your Payments?
          </h2>
          <p className="text-blue-100 mb-6">
            Use our calculators to get personalized loan estimates based on your credit score
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculators/mortgage"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Calculate Mortgage Payment
            </Link>
            <Link
              href="/calculators/auto-loan"
              className="px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Calculate Auto Payment
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}