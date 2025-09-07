import Link from "next/link"
import { Calculator } from "lucide-react"

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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">
              Financial Calc Blog
            </h1>
          </div>
        </div>
      </header>

      {/* Blog List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600"
                >
                  {post.meta.title}
                </Link>
              </h2>
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
      </main>
    </div>
  )
}