import { cached } from '@/app/cached-functions'
import { getGroupExpenses } from '@/lib/api'
import { getTotalGroupSpending } from '@/lib/totals'
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Chip,
  Tooltip,
  Progress,
} from '@nextui-org/react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { TrendingUp, Calendar, Users, PieChart } from 'lucide-react'
import dayjs from 'dayjs'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Stats',
}

// Helper function to get spending by category
const getSpendingByCategory = (
  expenses: Awaited<ReturnType<typeof getGroupExpenses>>
) => {
  const categories: Record<string, { name: string; amount: number }> = {}

  expenses.forEach((expense) => {
    const categoryName = expense.category?.name || 'Uncategorized'
    if (!categories[categoryName]) {
      categories[categoryName] = { name: categoryName, amount: 0 }
    }
    categories[categoryName].amount += expense.amount
  })

  return Object.values(categories).sort((a, b) => b.amount - a.amount)
}

// Helper function to get spending by month
const getSpendingByMonth = (
  expenses: Awaited<ReturnType<typeof getGroupExpenses>>
) => {
  const months: Record<string, { name: string; amount: number }> = {}

  expenses.forEach((expense) => {
    const monthKey = dayjs(expense.expenseDate).format('YYYY-MM')
    const monthName = dayjs(expense.expenseDate).format('MMM YYYY')

    if (!months[monthKey]) {
      months[monthKey] = { name: monthName, amount: 0 }
    }
    months[monthKey].amount += expense.amount
  })

  return Object.values(months)
    .sort(
      (a, b) =>
        dayjs(a.name, 'MMM YYYY').unix() - dayjs(b.name, 'MMM YYYY').unix()
    )
    .slice(-6) // Get last 6 months
}

// Helper function to get top spenders
const getTopSpenders = (
  expenses: Awaited<ReturnType<typeof getGroupExpenses>>
) => {
  const spenders: Record<string, { name: string; amount: number }> = {}

  expenses.forEach((expense) => {
    const payerId = expense.paidBy.id
    const payerName = expense.paidBy.name

    if (!spenders[payerId]) {
      spenders[payerId] = { name: payerName, amount: 0 }
    }
    spenders[payerId].amount += expense.amount
  })

  return Object.values(spenders)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5) // Get top 5 spenders
}

// Helper function to format currency based on the group's currency
const formatCurrency = (amount: number, currencySymbol: string) => {
  // Convert cents to actual currency value
  const value = amount / 100

  // Format with the appropriate currency symbol
  return `${currencySymbol}${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default async function GroupStatsPage({
  params: { groupId },
}: {
  params: { groupId: string }
}) {
  const group = await cached.getGroup(groupId)
  if (!group) notFound()

  const expenses = await getGroupExpenses(groupId)
  const totalGroupSpendings = getTotalGroupSpending(expenses)
  const spendingByCategory = getSpendingByCategory(expenses)
  const topSpenders = getTopSpenders(expenses)

  // Format the total amount
  const formattedTotal = formatCurrency(totalGroupSpendings, group.currency)

  // Calculate average expense
  const averageExpense =
    expenses.length > 0 ? totalGroupSpendings / expenses.length : 0

  const formattedAverage = formatCurrency(averageExpense, group.currency)

  // Get the highest expense
  const highestExpense =
    expenses.length > 0 ? Math.max(...expenses.map((e) => e.amount)) : 0

  const formattedHighest = formatCurrency(highestExpense, group.currency)

  // Get the most recent expense date
  const mostRecentDate =
    expenses.length > 0
      ? dayjs(expenses[0].expenseDate).format('MMM D, YYYY')
      : 'No expenses yet'

  console.log('group', group.currency)

  return (
    <div className="space-y-6">
      <Card className="mb-4 sm:mx-0">
        <CardHeader className="flex justify-between items-center p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-bold">Group Statistics</h4>
            <p className="text-sm text-default-500">
              Overview of all expenses and spending patterns in your group
            </p>
          </div>
        </CardHeader>

        <CardBody className="px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
          {/* Total Spending Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Total Spending
                  </p>
                  <h3 className="text-white text-3xl font-bold">
                    {formattedTotal}
                  </h3>
                  <p className="text-white/80 text-xs mt-1">
                    Across {expenses.length} expenses
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Average Expense
                  </p>
                  <h3 className="text-white text-3xl font-bold">
                    {formattedAverage}
                  </h3>
                  <p className="text-white/80 text-xs mt-1">Per transaction</p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Highest Expense
                  </p>
                  <h3 className="text-white text-3xl font-bold">
                    {formattedHighest}
                  </h3>
                  <p className="text-white/80 text-xs mt-1">
                    Last activity: {mostRecentDate}
                  </p>
                </div>
                <div className="bg-white/20 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Spending by Category</h3>
              </div>
              <Divider className="my-2" />
              <div className="space-y-4 mt-4">
                {spendingByCategory.slice(0, 5).map((category, index) => {
                  const percentage = Math.round(
                    (category.amount / totalGroupSpendings) * 100
                  )
                  const formattedAmount = formatCurrency(
                    category.amount,
                    group.currency
                  )

                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <Chip size="sm" color="success" variant="flat">
                            {category.name}
                          </Chip>
                          <span className="text-xs text-default-500">
                            {percentage}%
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {formattedAmount}
                        </span>
                      </div>
                      <Tooltip content={`${percentage}% of total spending`}>
                        <Progress
                          value={percentage}
                          color="success"
                          size="sm"
                          className="max-w-full"
                          aria-label={`${category.name} spending percentage`}
                        />
                      </Tooltip>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold">Top Spenders</h3>
              </div>
              <Divider className="my-2" />
              <div className="space-y-4 mt-4">
                {topSpenders.map((spender, index) => {
                  const percentage = Math.round(
                    (spender.amount / totalGroupSpendings) * 100
                  )
                  const formattedAmount = formatCurrency(
                    spender.amount,
                    group.currency
                  )

                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{spender.name}</span>
                          <span className="text-xs text-default-500">
                            {percentage}%
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {formattedAmount}
                        </span>
                      </div>
                      <Tooltip content={`${percentage}% of total spending`}>
                        <Progress
                          value={percentage}
                          color="primary"
                          size="sm"
                          className="max-w-full"
                          aria-label={`${spender.name} spending percentage`}
                        />
                      </Tooltip>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
