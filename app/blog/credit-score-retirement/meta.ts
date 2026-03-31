import type { Metadata } from "next"

export const meta = {
  title: "How Your Credit Score Is Quietly Killing Your Retirement",
  description:
    "Most people optimize their 401(k) contributions but ignore the $300–780/month they're losing to high-interest debt. Here's the math — and how to fix it.",
  keywords: [
    "credit score retirement savings",
    "how credit score affects retirement",
    "debt and retirement planning",
    "high interest debt retirement",
    "improve credit score save more",
    "debt consolidation retirement savings",
    "retirement savings tips",
    "credit score financial planning",
  ],
  openGraph: {
    title: "How Your Credit Score Is Quietly Killing Your Retirement",
    description:
      "Most people focus on 401(k) contributions but ignore the hundreds per month lost to high-interest debt. See the real numbers and what to do about it.",
    url: "https://financial-calc.com/blog/credit-score-retirement",
  },
  canonical: "https://financial-calc.com/blog/credit-score-retirement",
}

export const metadata: Metadata = {
  title: `${meta.title} | Financial Calc`,
  description: meta.description,
  keywords: meta.keywords,
  openGraph: {
    ...meta.openGraph,
    type: "article",
  },
  alternates: {
    canonical: meta.canonical,
  },
}
