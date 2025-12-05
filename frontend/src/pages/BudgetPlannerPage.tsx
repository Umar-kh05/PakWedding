import { useState } from 'react'

interface Category {
  name: string
  allocationRatio: number
  spent: number
  allocated: number
}

const defaultCategories: Category[] = [
  { name: 'Venue', allocationRatio: 0.3, spent: 0, allocated: 0 },
  { name: 'Catering', allocationRatio: 0.4, spent: 0, allocated: 0 },
  { name: 'Photography', allocationRatio: 0.2, spent: 0, allocated: 0 },
  { name: 'Decoration', allocationRatio: 0.1, spent: 0, allocated: 0 }
]

export default function BudgetPlannerPage() {
  const [totalBudget, setTotalBudget] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryRatio, setNewCategoryRatio] = useState('')

  const currency = (value: number) => `Rs. ${Math.round(value).toLocaleString('en-PK')}`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(inputValue)
    if (parsed > 0) {
      setTotalBudget(parsed)
      // Calculate allocated amounts
      setCategories(prev => prev.map(cat => ({
        ...cat,
        allocated: parsed * cat.allocationRatio
      })))
    }
  }

  const handleReset = () => {
    setTotalBudget(null)
    setInputValue('')
    setCategories(defaultCategories.map(cat => ({ ...cat, spent: 0, allocated: 0 })))
  }

  const handleSpentChange = (categoryName: string, spent: number) => {
    setCategories(prev => prev.map(cat =>
      cat.name === categoryName ? { ...cat, spent } : cat
    ))
  }

  const handleRatioChange = (categoryName: string, ratio: number) => {
    if (ratio < 0 || ratio > 1) return
    setCategories(prev => {
      const updated = prev.map(cat =>
        cat.name === categoryName ? { ...cat, allocationRatio: ratio } : cat
      )
      // Recalculate allocated amounts
      if (totalBudget) {
        return updated.map(cat => ({
          ...cat,
          allocated: totalBudget * cat.allocationRatio
        }))
      }
      return updated
    })
  }

  const handleAddCategory = () => {
    if (newCategoryName && newCategoryRatio) {
      const ratio = parseFloat(newCategoryRatio) / 100
      if (ratio > 0 && ratio <= 1) {
        const newCategory: Category = {
          name: newCategoryName,
          allocationRatio: ratio,
          spent: 0,
          allocated: totalBudget ? totalBudget * ratio : 0
        }
        setCategories(prev => [...prev, newCategory])
        setNewCategoryName('')
        setNewCategoryRatio('')
        setEditingCategory(null)
      }
    }
  }

  const handleDeleteCategory = (categoryName: string) => {
    setCategories(prev => prev.filter(cat => cat.name !== categoryName))
  }

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocationRatio, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const remaining = totalBudget ? totalBudget - totalSpent : 0
  const remainingAllocated = totalBudget ? totalBudget * (1 - totalAllocated) : 0

  return (
    <div className="bg-gradient-to-b from-pink-50/30 via-white to-pink-50/20 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-pink-600 to-gray-900 bg-clip-text text-transparent mb-4">
            Budget Planner
          </h1>
          <p className="text-xl text-gray-700 font-medium">
            Plan and track your wedding expenses
          </p>
        </div>

        {!totalBudget ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Set Your Budget</h2>
            <p className="text-gray-700 mb-6 font-medium">
              Enter your total wedding budget to generate personalized category allocations.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter total budget (e.g. 500000)"
                className="flex-1 h-14 px-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                required
                min={10000}
              />
              <button
                type="submit"
                className="h-14 px-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Continue
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Total Budget Card */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-pink-100 font-semibold uppercase tracking-wide text-sm">
                    Total Budget
                  </p>
                  <button
                    onClick={handleReset}
                    className="text-sm text-white font-semibold hover:text-pink-200 underline"
                  >
                    Edit Budget
                  </button>
                </div>
                <div className="text-5xl md:text-6xl font-extrabold mb-4">
                  {currency(totalBudget)}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-pink-100 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold">{currency(totalSpent)}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                    <p className="text-sm text-pink-100 mb-1">Remaining</p>
                    <p className="text-2xl font-bold">{currency(remaining)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Cards */}
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-pink-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          Allocated: <span className="font-bold text-gray-800">{currency(category.allocated)}</span> ({Math.round(category.allocationRatio * 100)}%)
                        </span>
                        {editingCategory === category.name ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={category.allocationRatio * 100}
                              onChange={(e) => handleRatioChange(category.name, parseFloat(e.target.value) / 100)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                              min="0"
                              max="100"
                              step="1"
                            />
                            <span className="text-gray-600">%</span>
                            <button
                              onClick={() => setEditingCategory(null)}
                              className="text-pink-600 hover:text-pink-700 font-semibold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingCategory(category.name)}
                            className="text-pink-600 hover:text-pink-700 font-semibold text-xs"
                          >
                            Edit %
                          </button>
                        )}
                      </div>
                    </div>
                    {categories.length > 1 && (
                      <button
                        onClick={() => handleDeleteCategory(category.name)}
                        className="text-red-500 hover:text-red-700 font-bold text-xl"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Amount Spent:
                    </label>
                    <input
                      type="number"
                      value={category.spent || ''}
                      onChange={(e) => handleSpentChange(category.name, parseFloat(e.target.value) || 0)}
                      placeholder="Enter amount spent"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600 focus:border-pink-600"
                      min="0"
                      max={category.allocated}
                    />
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className={`font-semibold ${category.spent > category.allocated ? 'text-red-600' : 'text-green-600'}`}>
                        Spent: {currency(category.spent)}
                      </span>
                      <span className="text-gray-600">
                        Remaining: {currency(category.allocated - category.spent)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          category.spent > category.allocated
                            ? 'bg-red-500'
                            : category.spent / category.allocated > 0.8
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((category.spent / category.allocated) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Category */}
              {editingCategory === 'new' ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-pink-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Category</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={newCategoryRatio}
                        onChange={(e) => setNewCategoryRatio(e.target.value)}
                        placeholder="Percentage (e.g. 10)"
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-600"
                        min="0"
                        max="100"
                      />
                      <span className="text-gray-600">%</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddCategory}
                        className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transition-all"
                      >
                        Add Category
                      </button>
                      <button
                        onClick={() => {
                          setEditingCategory(null)
                          setNewCategoryName('')
                          setNewCategoryRatio('')
                        }}
                        className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setEditingCategory('new')}
                  className="w-full bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-pink-400 text-gray-600 hover:text-pink-600 font-semibold transition-all"
                >
                  + Add New Category
                </button>
              )}

              {/* Remaining Allocation Warning */}
              {remainingAllocated > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                  <p className="text-yellow-800 font-semibold">
                    ⚠️ You have {currency(remainingAllocated)} ({Math.round((remainingAllocated / (totalBudget || 1)) * 100)}%) unallocated. Consider adding more categories or adjusting percentages.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
