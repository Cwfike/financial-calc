import type { Metadata } from "next"

export const meta = {
  title: "How Your Credit Score Affects Your Mortgage Rate",
  description:
    "Learn how credit scores impact mortgage interest rates and discover how much money you could save by improving your credit. Includes current rate examples and practical improvement tips.",
  keywords: [
    "credit score mortgage rate",
    "how credit affects mortgage",
    "mortgage rates by credit score",
    "improve credit score mortgage",
    "credit score impact on home loan",
    "mortgage interest rates 2024",
  ],
  openGraph: {
    title: "How Your Credit Score Affects Your Mortgage Rate",
    description:
      "Discover how credit scores impact mortgage rates and learn strategies to improve your score before applying for a home loan.",
    url: "https://financial-calc.com/blog/credit-score-mortgage-rate",
  },
  canonical: "https://financial-calc.com/blog/credit-score-mortgage-rate",
}

// Next.js Metadata export
export const metadata: Metadata = {
  title: `${meta.title} | Financial Calc`,
  description: meta.description,
  keywords: meta.keywords, // string[]
  openGraph: {
    ...meta.openGraph,
    type: "article", // helps TS + SEO
  },
  alternates: {
    canonical: meta.canonical,
  },
}