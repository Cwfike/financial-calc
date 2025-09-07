import Link from 'next/link'
import { ArrowLeft, Calculator } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How Your Credit Score Affects Your Mortgage Rate | Financial Calc',
  description: 'Learn how credit scores impact mortgage interest rates and discover how much money you could save by improving your credit. Includes current rate examples and practical improvement tips.',
  keywords: [
    'credit score mortgage rate',
    'how credit affects mortgage',
    'mortgage rates by credit score',
    'improve credit score mortgage',
    'credit score impact on home loan',
    'mortgage interest rates 2024'
  ],
  openGraph: {
    title: 'How Your Credit Score Affects Your Mortgage Rate',
    description: 'Discover how credit scores impact mortgage rates and learn strategies to improve your score before applying for a home loan.',
    url: 'https://financial-calc.com/blog/credit-score-mortgage-rate',
  },
  alternates: {
    canonical: 'https://financial-calc.com/blog/credit-score-mortgage-rate',
  },
}

export default function CreditScoreMortgageRatePost() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Link href="/blog" className="flex items-center text-blue-600 hover:text-blue-800 mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Blog
            </Link>
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">Financial Calc Blog</h1>
          </div>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 lg:p-12">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How Your Credit Score Affects Your Mortgage Rate
            </h1>
            <div className="flex items-center text-gray-600 text-sm">
              <time dateTime="2024-12-20">Published: December 20, 2024</time>
              <span className="mx-2">•</span>
              <span>Reading time: 6 minutes</span>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-6">
              When you&apos;re shopping for a mortgage, one number can make the difference between saving thousands or paying tens of thousands more over the life of your loan: your credit score. Understanding how credit scores affect mortgage rates can help you make informed decisions and potentially save significant money on your home purchase.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              The Credit Score-Mortgage Rate Connection
            </h2>
            <p className="mb-4">
              Your credit score serves as a snapshot of your creditworthiness to lenders. Mortgage companies use this three-digit number (typically ranging from 300 to 850) to assess the risk of lending to you. The logic is straightforward: borrowers with higher credit scores have historically been more likely to repay their loans on time, while those with lower scores present higher risk.
            </p>
            <p className="mb-6">
              This risk assessment directly translates to the interest rate you&apos;ll receive. Lower-risk borrowers (those with higher credit scores) qualify for better rates, while higher-risk borrowers pay premium rates to compensate lenders for the increased risk.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Current Credit Score Brackets and Typical Rates
            </h2>
            <p className="mb-4">As of late 2024, here&apos;s how credit scores typically translate to mortgage interest rates:</p>
            
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-green-700">Excellent Credit (800+)</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                    <li>Interest rates: 6.75% - 7.00%</li>
                    <li>Best available terms and lowest rates</li>
                    <li>May qualify for special loan programs</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-700">Very Good Credit (740-799)</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                    <li>Interest rates: 7.10% - 7.35%</li>
                    <li>Access to competitive rates</li>
                    <li>Wide variety of loan options</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-700">Good Credit (670-739)</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                    <li>Interest rates: 7.60% - 8.00%</li>
                    <li>Decent rates with most lenders</li>
                    <li>Some premium loan products available</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-700">Fair Credit (580-669)</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                    <li>Interest rates: 8.80% - 9.50%</li>
                    <li>Limited loan options</li>
                    <li>May require higher down payments</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-red-700">Poor Credit (300-579)</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                    <li>Interest rates: 10.50%+</li>
                    <li>Very limited options</li>
                    <li>Often requires significant down payments</li>
                    <li>May need government-backed loans (FHA, VA)</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4 italic">
                *Note: These rates are estimates and can vary based on market conditions, loan type, down payment, and other factors.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              The Real Cost Impact
            </h2>
            <p className="mb-4">
              The difference between credit score brackets isn&apos;t just a few tenths of a percentage point—it can mean massive differences in what you pay over time.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Example: $320,000 loan over 30 years</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span><strong>Excellent credit (800+):</strong> 6.75% rate</span>
                  <span>$2,077/month, $427,720 total interest</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Good credit (670-739):</strong> 7.60% rate</span>
                  <span>$2,259/month, $493,240 total interest</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Fair credit (580-669):</strong> 8.80% rate</span>
                  <span>$2,529/month, $590,440 total interest</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Poor credit (300-579):</strong> 10.50% rate</span>
                  <span>$2,940/month, $738,400 total interest</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-red-100 rounded">
                <p className="text-sm font-semibold text-red-800">
                  The difference between excellent and poor credit: $863/month and $310,680 over the life of the loan.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Factors Beyond the Basic Score
            </h2>
            <p className="mb-4">While your credit score is crucial, lenders consider several factors when determining your rate:</p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Credit History Length</h3>
            <p className="mb-4">
              A longer credit history generally helps your case, even if your score isn&apos;t perfect. Lenders like to see established patterns of responsible credit use.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Recent Credit Activity</h3>
            <p className="mb-4">
              Multiple recent credit inquiries or new accounts can negatively impact your rate, even with a good score. Avoid opening new credit accounts in the months before applying for a mortgage.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Debt-to-Income Ratio</h3>
            <p className="mb-4">
              Even with excellent credit, a high debt-to-income ratio can result in higher rates or loan denial. Most lenders prefer to see your total monthly debt payments (including the new mortgage) at 43% or less of your gross income.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Down Payment Size</h3>
            <p className="mb-6">
              A larger down payment can sometimes offset a lower credit score. Putting down 20% or more shows lenders you have significant stake in the property.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Strategies to Improve Your Credit Before Applying
            </h2>
            <p className="mb-4">If your credit score isn&apos;t where you&apos;d like it to be, consider these steps before applying for a mortgage:</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800">Pay Down Credit Card Balances</h3>
                <p className="text-gray-700">Credit utilization (the percentage of available credit you&apos;re using) heavily impacts your score. Aim to use less than 30% of available credit, ideally under 10%.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Don&apos;t Close Old Credit Cards</h3>
                <p className="text-gray-700">Keep older accounts open to maintain credit history length. If there&apos;s an annual fee you don&apos;t want to pay, see if you can downgrade to a no-fee version.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Pay All Bills on Time</h3>
                <p className="text-gray-700">Payment history is the largest factor in your credit score. Set up automatic payments to ensure you never miss a due date.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800">Check Your Credit Report</h3>
                <p className="text-gray-700">Review your credit reports from all three bureaus (Experian, Equifax, TransUnion) for errors. Dispute any inaccuracies you find, as these can be corrected relatively quickly.</p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              The Bottom Line
            </h2>
            <p className="mb-4">
              Your credit score significantly impacts your mortgage rate, which in turn affects both your monthly payment and the total amount you&apos;ll pay over the life of your loan. The difference between credit score tiers can mean hundreds of dollars per month and hundreds of thousands over time.
            </p>
            <p className="mb-6">
              While you can&apos;t change your credit score overnight, understanding its impact can help you make informed decisions about when to apply for a mortgage and what terms to expect. Whether you decide to work on improving your credit first or proceed with your current score, knowing how lenders view your creditworthiness puts you in a stronger position to negotiate the best possible terms.
            </p>

            {/* Call-to-Action */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                See How Your Credit Score Affects Your Payment
              </h3>
              <p className="text-blue-800 mb-4">
                Use our mortgage calculator to see how different credit scores and interest rates would affect your specific situation. By inputting various scenarios, you can better understand the financial impact of improving your credit score before applying for your home loan.
              </p>
              <Link 
                href="/calculators/mortgage"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Try Our Mortgage Calculator
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}