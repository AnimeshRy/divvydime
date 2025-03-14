import { cached } from '@/app/cached-functions'
// import { ActiveUserModal } from '@/app/groups/[groupId]/expenses/active-user-modal'
// import { CreateFromReceiptButton } from '@/app/groups/[groupId]/expenses/create-from-receipt-button'
// import { ExpenseList } from '@/app/groups/[groupId]/expenses/expense-list'
import { Card, CardHeader, CardBody, Button, Skeleton } from '@nextui-org/react'
import {
  getCategories,
  getGroupExpenseCount,
  getGroupExpenses,
} from '@/lib/api'
// import { env } from '@/lib/env'
import { Download, Plus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ExpenseList } from './expense-list'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Expenses',
}

export default async function GroupExpensesPage({
  params: { groupId },
}: {
  params: { groupId: string }
}) {
  const group = await cached.getGroup(groupId)
  if (!group) notFound()

  const categories = await getCategories()

  return (
    <>
      <Card className="mb-4 sm:mx-0">
        <CardHeader className="flex justify-between items-center p-4 sm:p-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-bold">Expenses</h4>
            <p className="text-sm text-default-500">
              Track and manage all expenses shared within your group. Add new
              expenses or export data as needed.
            </p>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              isIconOnly
              variant="flat"
              as={Link}
              href={`/groups/${groupId}/expenses/export/json`}
              target="_blank"
              title="Export to JSON"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              isIconOnly
              color="success"
              as={Link}
              href={`/groups/${groupId}/expenses/create`}
              title="Create expense"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardBody className="px-0 pt-2 pb-4 sm:pb-6 flex flex-col gap-4 relative">
          <Suspense
            fallback={[0, 1, 2].map((i) => (
              <div
                key={i}
                className="border-t flex justify-between items-center px-6 py-4 text-sm"
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
          >
            <Expenses group={group} />
          </Suspense>
        </CardBody>
      </Card>

      {/* <ActiveUserModal group={group} /> */}
    </>
  )
}

type Props = {
  group: NonNullable<Awaited<ReturnType<typeof cached.getGroup>>>
}

async function Expenses({ group }: Props) {
  const expenseCount = await getGroupExpenseCount(group.id)

  const expenses = await getGroupExpenses(group.id, {
    offset: 0,
    length: 200,
  })

  return (
    <ExpenseList
      expensesFirstPage={expenses}
      expenseCount={expenseCount}
      groupId={group.id}
      currency={group.currency}
      participants={group.participants}
    />
  )
}
