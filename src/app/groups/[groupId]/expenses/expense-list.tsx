'use client'

import { ExpenseCard } from '@/app/groups/[groupId]/expenses/expense-card'
import { getGroupExpensesAction } from '@/app/groups/[groupId]/expenses/expense-list-fetch-action'
import { Button, Input, Skeleton } from '@nextui-org/react'
import { normalizeString } from '@/lib/utils'
import { Participant } from '@prisma/client'
import dayjs, { type Dayjs } from 'dayjs'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Search } from 'lucide-react'

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
          (p) => p.name === (activeUser || newUser),
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

  const groupedExpensesByDate = useMemo(
    () => getGroupedExpensesByDate(expenses),
    [expenses],
  )

  return expenses.length > 0 ? (
    <>
      <div className="px-6">
        <Input
          type="text"
          placeholder="Search expenses..."
          startContent={<Search className="text-default-400" size={20} />}
          onChange={(e) => setSearchText(normalizeString(e.target.value))}
          className="mb-4"
        />
      </div>
      {Object.values(EXPENSE_GROUPS).map((expenseGroup: string) => {
        let groupExpenses = groupedExpensesByDate[expenseGroup]
        if (!groupExpenses) return null

        groupExpenses = groupExpenses.filter(({ title }) =>
          normalizeString(title).includes(searchText),
        )

        if (groupExpenses.length === 0) return null

        return (
          <div key={expenseGroup}>
            <div className="text-default-500 text-xs pl-4 sm:pl-6 py-1 font-semibold sticky top-16 bg-background">
              {expenseGroup}
            </div>
            {groupExpenses.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                currency={currency}
                groupId={groupId}
              />
            ))}
          </div>
        )
      })}
      {expenses.length < expenseCount &&
        [0, 1, 2].map((i) => (
          <div
            key={i}
            className="border-t flex justify-between items-center px-6 py-4 text-sm"
            ref={i === 0 ? ref : undefined}
          >
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-32 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
        ))}
    </>
  ) : (
    <div className="px-6 text-sm py-6 flex items-center gap-2">
      Your group doesn't contain any expense yet.{' '}
      <Button
        as={Link}
        href={`/groups/${groupId}/expenses/create`}
        color="primary"
        variant="light"
        size="sm"
      >
        Create the first one
      </Button>
    </div>
  )
}
