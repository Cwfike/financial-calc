import type { Metadata } from "next"

export const meta = {
  title: "The True Cost of Making Only Minimum Credit Card Payments",
  description:
    "Paying only the minimum on your credit card can keep you in debt for nearly two decades and cost more in interest than the original balance. See the real numbers and how to escape the trap.",
  keywords: [
    "minimum payment trap",
    "credit card minimum payment",
    "cost of minimum payments",
    "how long to pay off credit card",
    "credit card interest calculator",
    "credit card payoff calculator",
  ],
  openGraph: {
    title: "The True Cost of Making Only Minimum Credit Card Payments",
    description:
      "Why paying only the minimum keeps you in debt for decades — and the simple change that cuts years and thousands of dollars off your balance.",
    url: "https://financial-calc.com/blog/minimum-payment-trap",
  },
  canonical: "https://financial-calc.com/blog/minimum-payment-trap",
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
