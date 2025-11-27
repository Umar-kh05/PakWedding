import { useState } from 'react'

const baseCategories = [
  { name: 'Venue', allocationRatio: 0.3, spentRatio: 1 },
  { name: 'Catering', allocationRatio: 0.4, spentRatio: 0.9 },
  { name: 'Photography', allocationRatio: 0.2, spentRatio: 1 },
  { name: 'Decoration', allocationRatio: 0.1, spentRatio: 0.8 }
]

export default function BudgetPlannerPage() {
  const [totalBudget, setTotalBudget] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')

  const currency = (value: number) => `Rs. ${Math.round(value).toLocaleString('en-PK')}`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(inputValue)
    if (parsed > 0) {
      setTotalBudget(parsed)
    }
  }

  const handleReset = () => {
    setTotalBudget(null)
    setInputValue('')
  }

  const computedCategories =
    totalBudget === null
      ? []
      : baseCategories.map((category) => {
          const allocated = totalBudget * category.allocationRatio
          const spent = allocated * category.spentRatio
          return { ...category, allocated, spent }
        })

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {!totalBudget ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Set Your Budget</h1>
            <p className="text-gray-600 mb-6">
              Enter your total wedding budget to generate personalized category allocations.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter total budget (e.g. 500000)"
                className="flex-1 h-14 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
                min={10000}
              />
              <button
                type="submit"
                className="h-14 px-8 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-colors"
              >
                Continue
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Total Budget Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 font-semibold uppercase tracking-wide text-sm">
                  Total Budget
                </p>
                <button
                  onClick={handleReset}
                  className="text-sm text-pink-600 font-semibold hover:underline"
                >
                  Edit Budget
                </button>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-pink-600">
                {currency(totalBudget)}
              </div>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
              {computedCategories.map((category) => (
                <div
                  key={category.name}
                  className="bg-white rounded-2xl shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Allocated:{' '}
                    <span className="font-medium text-gray-800">
                      {currency(category.allocated)}
                    </span>
                  </p>
                  <p className="text-green-600 text-sm font-medium">
                    Spent: {currency(category.spent)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

