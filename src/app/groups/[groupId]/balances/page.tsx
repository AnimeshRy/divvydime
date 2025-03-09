import { cached } from '@/app/cached-functions'
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Chip,
  Avatar,
  Progress,
  Tooltip,
} from '@nextui-org/react'
import { getGroupExpenses } from '@/lib/api'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Participant } from '@prisma/client'
import {
  ArrowUp,
  ArrowDown,
  ArrowRight,
  DollarSign,
  Users,
  RefreshCw,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Balances',
}

// Types for balance calculations
type Balance = {
  participantId: string
  amount: number
}

type PublicBalance = {
  participantId: string
  balance: number
}

type Reimbursement = {
  from: string
  to: string
  amount: number
}

// Helper functions for balance calculations
const getBalances = (expenses: any[]) => {
  const balances: Record<string, number> = {}

  for (const expense of expenses) {
    // Add what the payer paid
    const payerId = expense.paidBy.id
    balances[payerId] = (balances[payerId] || 0) + expense.amount

    // Subtract what each participant owes
    for (const paidFor of expense.paidFor) {
      const participantId = paidFor.participant.id
      balances[participantId] = (balances[participantId] || 0) - paidFor.amount
    }
  }

  return Object.entries(balances).map(([participantId, amount]) => ({
    participantId,
    amount,
  }))
}

const getPublicBalances = (reimbursements: Reimbursement[]) => {
  const balances: Record<string, number> = {}

  for (const reimbursement of reimbursements) {
    balances[reimbursement.from] =
      (balances[reimbursement.from] || 0) - reimbursement.amount
    balances[reimbursement.to] =
      (balances[reimbursement.to] || 0) + reimbursement.amount
  }

  return Object.entries(balances).map(([participantId, balance]) => ({
    participantId,
    balance,
  }))
}

const getSuggestedReimbursements = (balances: Balance[]) => {
  const debtors = balances
    .filter((balance) => balance.amount < 0)
    .sort((a, b) => a.amount - b.amount)
  const creditors = balances
    .filter((balance) => balance.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const reimbursements: Reimbursement[] = []

  let i = 0
  let j = 0

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i]
    const creditor = creditors[j]

    const amount = Math.min(Math.abs(debtor.amount), creditor.amount)

    if (amount > 0) {
      reimbursements.push({
        from: debtor.participantId,
        to: creditor.participantId,
        amount,
      })
    }

    debtor.amount += amount
    creditor.amount -= amount

    if (Math.abs(debtor.amount) < 1) {
      i++
    }

    if (creditor.amount < 1) {
      j++
    }
  }

  return reimbursements
}

// Format currency helper
const formatCurrency = (amount: number, currency: string) => {
  return (amount / 100)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: currency === '€' ? 'EUR' : currency === '£' ? 'GBP' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/[A-Z]{3}/, currency)
}

// Component to display individual balance
const BalanceItem = ({
  participant,
  balance,
  currency,
  maxAbsBalance,
}: {
  participant: Participant
  balance: number
  currency: string
  maxAbsBalance: number
}) => {
  const isPositive = balance > 0
  const isNeutral = balance === 0
  const absBalance = Math.abs(balance)
  const percentage = (absBalance / maxAbsBalance) * 100

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar
            name={participant.name}
            size="sm"
            className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white"
          />
          <span className="font-medium">{participant.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {!isNeutral && (
            <span
              className={`text-sm ${
                isPositive ? 'text-success' : 'text-danger'
              }`}
            >
              {isPositive ? (
                <ArrowUp className="w-4 h-4 inline mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 inline mr-1" />
              )}
            </span>
          )}
          <span
            className={`font-semibold ${
              isPositive
                ? 'text-success'
                : isNeutral
                  ? 'text-default-500'
                  : 'text-danger'
            }`}
          >
            {formatCurrency(balance, currency)}
          </span>
        </div>
      </div>
      <Progress
        value={percentage}
        color={isPositive ? 'success' : isNeutral ? 'default' : 'danger'}
        size="sm"
        aria-label={`${participant.name} balance`}
        className="max-w-full"
      />
    </div>
  )
}

// Component to display reimbursement
const ReimbursementItem = ({
  reimbursement,
  participants,
  currency,
}: {
  reimbursement: Reimbursement
  participants: Participant[]
  currency: string
}) => {
  const fromParticipant = participants.find((p) => p.id === reimbursement.from)
  const toParticipant = participants.find((p) => p.id === reimbursement.to)

  if (!fromParticipant || !toParticipant) return null

  return (
    <div className="p-4 border-b border-divider last:border-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar
            name={fromParticipant.name}
            size="sm"
            className="bg-gradient-to-br from-danger-500 to-danger-300 text-white"
          />
          <span className="font-medium">{fromParticipant.name}</span>
          <ArrowRight className="w-4 h-4 text-default-500" />
          <Avatar
            name={toParticipant.name}
            size="sm"
            className="bg-gradient-to-br from-success-500 to-success-300 text-white"
          />
          <span className="font-medium">{toParticipant.name}</span>
        </div>
        <Chip color="primary" variant="flat">
          {formatCurrency(reimbursement.amount, currency)}
        </Chip>
      </div>
    </div>
  )
}

// BalancesList component
const BalancesList = ({
  balances,
  participants,
  currency,
}: {
  balances: PublicBalance[]
  participants: Participant[]
  currency: string
}) => {
  // Find the maximum absolute balance for scaling the progress bars
  const maxAbsBalance = Math.max(
    ...balances.map((balance) => Math.abs(balance.balance)),
    1 // Ensure we don't divide by zero
  )

  return (
    <div className="space-y-2">
      {balances.length === 0 ? (
        <div className="text-center py-4 text-default-500">
          No balances to display
        </div>
      ) : (
        balances.map((balance) => {
          const participant = participants.find(
            (p) => p.id === balance.participantId
          )
          if (!participant) return null

          return (
            <BalanceItem
              key={balance.participantId}
              participant={participant}
              balance={balance.balance}
              currency={currency}
              maxAbsBalance={maxAbsBalance}
            />
          )
        })
      )}
    </div>
  )
}

// ReimbursementList component
const ReimbursementList = ({
  reimbursements,
  participants,
  currency,
}: {
  reimbursements: Reimbursement[]
  participants: Participant[]
  currency: string
}) => {
  return (
    <div>
      {reimbursements.length === 0 ? (
        <div className="text-center py-6 text-default-500">
          No reimbursements needed
        </div>
      ) : (
        reimbursements.map((reimbursement, index) => (
          <ReimbursementItem
            key={index}
            reimbursement={reimbursement}
            participants={participants}
            currency={currency}
          />
        ))
      )}
    </div>
  )
}

export default async function BalancesPage({
  params: { groupId },
}: {
  params: { groupId: string }
}) {
  const group = await cached.getGroup(groupId)
  if (!group) notFound()

  const expenses = await getGroupExpenses(groupId)
  console.log('expenses', expenses)
  const balances = getBalances(expenses)
  const reimbursements = getSuggestedReimbursements(balances)
  const publicBalances = getPublicBalances(reimbursements)

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <Card className="shadow-md border-none">
        <CardHeader className="flex flex-col items-start gap-1 pb-0">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-success" />
            <h2 className="text-xl font-bold">Balances</h2>
          </div>
          <p className="text-default-500 text-sm">
            This is the amount that each participant paid or was paid for.
          </p>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody>
          <BalancesList
            balances={publicBalances}
            participants={group.participants}
            currency={group.currency}
          />
        </CardBody>
      </Card>

      <Card className="shadow-md border-none">
        <CardHeader className="flex flex-col items-start gap-1 pb-0">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Suggested Reimbursements</h2>
          </div>
          <p className="text-default-500 text-sm">
            Here are suggestions for optimized reimbursements between
            participants.
          </p>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody className="p-0">
          <ReimbursementList
            reimbursements={reimbursements}
            participants={group.participants}
            currency={group.currency}
          />
        </CardBody>
      </Card>

      <Card className="shadow-md border-none bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20">
        <CardBody className="p-4">
          <div className="flex items-start gap-3">
            <Users className="w-6 h-6 text-primary mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-1">How Balances Work</h3>
              <p className="text-sm text-default-600">
                Positive balances (green) indicate that a participant has paid
                more than their share. Negative balances (red) indicate that a
                participant owes money to the group. The suggested
                reimbursements show the most efficient way to settle all debts.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
