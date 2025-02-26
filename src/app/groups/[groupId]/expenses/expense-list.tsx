/* eslint-disable react/no-unescaped-entities */
'use client'

import { getGroupExpensesAction } from '@/app/groups/[groupId]/expenses/expense-list-fetch-action'
import {
  Button,
  Input,
  Skeleton,
  Card,
  CardBody,
  Chip,
  Tooltip,
  Avatar,
  Divider,
} from '@nextui-org/react'
import { normalizeString } from '@/lib/utils'
import { Participant } from '@prisma/client'
import dayjs, { type Dayjs } from 'dayjs'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Search, Calendar, User, Users } from 'lucide-react'

type ExpensesType = NonNullable<
  Awaited<ReturnType<typeof getGroupExpensesAction>>
>

type Props = {
  expensesFirstPage: ExpensesType
  expenseCount: number
  participants: Participant[]
  currency: string
  groupId: string
}

const EXPENSE_GROUPS = {
  UPCOMING: 'Upcoming',
  THIS_WEEK: 'This week',
  EARLIER_THIS_MONTH: 'Earlier this month',
  LAST_MONTH: 'Last month',
  EARLIER_THIS_YEAR: 'Earlier this year',
  LAST_YEAR: 'Last year',
  OLDER: 'Older',
}

function getExpenseGroup(date: Dayjs, today: Dayjs) {
  if (today.isBefore(date)) {
    return EXPENSE_GROUPS.UPCOMING
  } else if (today.isSame(date, 'week')) {
    return EXPENSE_GROUPS.THIS_WEEK
  } else if (today.isSame(date, 'month')) {
    return EXPENSE_GROUPS.EARLIER_THIS_MONTH
  } else if (today.subtract(1, 'month').isSame(date, 'month')) {
    return EXPENSE_GROUPS.LAST_MONTH
  } else if (today.isSame(date, 'year')) {
    return EXPENSE_GROUPS.EARLIER_THIS_YEAR
  } else if (today.subtract(1, 'year').isSame(date, 'year')) {
    return EXPENSE_GROUPS.LAST_YEAR
  } else {
    return EXPENSE_GROUPS.OLDER
  }
}

function getGroupedExpensesByDate(expenses: ExpensesType) {
  const today = dayjs()
  return expenses.reduce((result: { [key: string]: ExpensesType }, expense) => {
    const expenseGroup = getExpenseGroup(dayjs(expense.expenseDate), today)
    result[expenseGroup] = result[expenseGroup] ?? []
    result[expenseGroup].push(expense)
    return result
  }, {})
}

// ExpenseCard component to display expense information
const ExpenseCard = ({
  expense,
  currency,
  groupId,
}: {
  expense: ExpensesType[0]
  currency: string
  groupId: string
}) => {
  const formattedDate = dayjs(expense.expenseDate).format('MMM D, YYYY')
  const formattedAmount = (expense.amount / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  // Determine if the expense is a reimbursement or regular expense
  const isReimbursement = expense.isReimbursement

  // Get the category name if available
  const categoryName = expense.category?.name || 'Uncategorized'

  // Get the number of participants who paid for this expense
  const participantCount = expense.paidFor.length

  return (
    <Card
      as={Link}
      href={`/groups/${groupId}/expenses/${expense.id}/edit`}
      className="hover:bg-default-100 transition-colors cursor-pointer"
      isPressable
    >
      <CardBody className="flex flex-row justify-between items-center p-4">
        <div className="flex flex-col gap-1">
          <div className="font-medium text-md">{expense.title}</div>
          <div className="flex items-center gap-2 text-default-500 text-xs">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>Paid by {expense.paidBy.name}</span>
            </div>
            {participantCount > 0 && (
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>
                  Split among {participantCount}{' '}
                  {participantCount === 1 ? 'person' : 'people'}
                </span>
              </div>
            )}
          </div>
          <div className="mt-1">
            <Chip
              size="sm"
              color={isReimbursement ? 'warning' : 'primary'}
              variant="flat"
            >
              {categoryName}
            </Chip>
            {isReimbursement && (
              <Chip size="sm" color="warning" variant="flat" className="ml-2">
                Reimbursement
              </Chip>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className={`font-semibold text-green-600`}>
            {currency}
            {formattedAmount}
          </div>
          <div className="text-xs text-default-500">
            {expense.splitMode === 'EVENLY'
              ? 'Split evenly'
              : expense.splitMode === 'BY_SHARES'
                ? 'Split by shares'
                : expense.splitMode === 'BY_PERCENTAGE'
                  ? 'Split by percentage'
                  : 'Split by amount'}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export function ExpenseList({
  expensesFirstPage,
  expenseCount,
  currency,
  participants,
  groupId,
}: Props) {
  const firstLen = expensesFirstPage.length
  const [searchText, setSearchText] = useState('')
  const [dataIndex, setDataIndex] = useState(firstLen)
  const [dataLen, setDataLen] = useState(firstLen)
  const [hasMoreData, setHasMoreData] = useState(expenseCount > firstLen)
  const [isFetching, setIsFetching] = useState(false)
  const [expenses, setExpenses] = useState(expensesFirstPage)
  const { ref, inView } = useInView()

  useEffect(() => {
    const activeUser = localStorage.getItem('newGroup-activeUser')
    const newUser = localStorage.getItem(`${groupId}-newUser`)
    if (activeUser || newUser) {
      localStorage.removeItem('newGroup-activeUser')
      localStorage.removeItem(`${groupId}-newUser`)
      if (activeUser === 'None') {
        localStorage.setItem(`${groupId}-activeUser`, 'None')
      } else {
        const userId = participants.find(
          (p) => p.name === (activeUser || newUser)
        )?.id
        if (userId) {
          localStorage.setItem(`${groupId}-activeUser`, userId)
        }
      }
    }
  }, [groupId, participants])

  useEffect(() => {
    const fetchNextPage = async () => {
      setIsFetching(true)

      const newExpenses = await getGroupExpensesAction(groupId, {
        offset: dataIndex,
        length: dataLen,
      })

      if (newExpenses !== null) {
        const exp = expenses.concat(newExpenses)
        setExpenses(exp)
        setHasMoreData(exp.length < expenseCount)
        setDataIndex(dataIndex + dataLen)
        setDataLen(Math.ceil(1.5 * dataLen))
      }

      setTimeout(() => setIsFetching(false), 500)
    }

    if (inView && hasMoreData && !isFetching) fetchNextPage()
  }, [
    dataIndex,
    dataLen,
    expenseCount,
    expenses,
    groupId,
    hasMoreData,
    inView,
    isFetching,
  ])

  const groupedExpensesByDate = useMemo(() => {
    // First filter expenses based on search text
    const filteredExpenses = expenses.filter((expense) =>
      normalizeString(expense.title).includes(searchText)
    )

    // Then group the filtered expenses by date
    return getGroupedExpensesByDate(filteredExpenses)
  }, [expenses, searchText])

  // Check if there are any expenses that match the search
  const hasMatchingExpenses = useMemo(() => {
    return Object.values(groupedExpensesByDate).some(
      (group) => group.length > 0
    )
  }, [groupedExpensesByDate])

  return expenses.length > 0 ? (
    <div className="px-4 sm:px-6">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search expenses..."
          startContent={<Search className="text-default-400" size={20} />}
          onChange={(e) => setSearchText(normalizeString(e.target.value))}
          className="w-full"
        />
      </div>

      {hasMatchingExpenses ? (
        <div className="space-y-4">
          {Object.entries(groupedExpensesByDate).map(
            ([groupName, groupExpenses]) => {
              if (groupExpenses.length === 0) return null

              return (
                <div key={groupName} className="space-y-2">
                  <div className="text-default-500 text-xs font-semibold">
                    {groupName}
                  </div>
                  <div className="space-y-2">
                    {groupExpenses.map((expense) => (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        currency={currency}
                        groupId={groupId}
                      />
                    ))}
                  </div>
                </div>
              )
            }
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-default-500">
          No expenses match your search.
        </div>
      )}

      {expenses.length < expenseCount && hasMatchingExpenses && (
        <div ref={ref} className="py-4">
          {isFetching && (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <Card key={i} className="w-full">
                  <CardBody className="flex flex-row justify-between items-center p-4">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-4 w-32 rounded-full" />
                      <Skeleton className="h-3 w-48 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  ) : (
    <div className="px-6 text-sm py-6 flex flex-col items-center gap-4">
      Your group doesn't contain any expenses yet.
      <Button
        as={Link}
        href={`/groups/${groupId}/expenses/create`}
        color="success"
        variant="flat"
        size="md"
      >
        Create the first expense
      </Button>
    </div>
  )
}
