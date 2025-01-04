import { getPrisma } from '@/lib/prisma'
import { ExpenseFormValues, GroupFormValues } from '@/lib/schema'
import { Expense } from '@prisma/client'
import { nanoid } from 'nanoid'

export function randomId() {
  return nanoid()
}

export async function createGroup(createGroupFormValues: GroupFormValues) {
  const prisma = await getPrisma()
  return prisma.group.create({
    data: {
      id: randomId(),
      name: createGroupFormValues.name,
      currency: createGroupFormValues.currency,
      participants: {
        create: createGroupFormValues.participants.map((participant) => ({
          id: randomId(),
          name: participant.name,
        })),
      },
    },
    include: {
      participants: true,
    },
  })
}

export async function getGroups(groupIds: string[]) {
  const prisma = await getPrisma()
  return (
    await prisma.group.findMany({
      where: {
        id: {
          in: groupIds,
        },
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })
  ).map((group) => ({
    ...group,
    createdAt: group.createdAt.toISOString(),
  }))
}

export async function getGroup(groupId: string) {
  const prisma = await getPrisma()
  return prisma.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  })
}

export async function createExpense(
  expenseFormValues: ExpenseFormValues,
  groupId: string
): Promise<Expense> {
  const group = await getGroup(groupId)
  if (!group) throw new Error(`Invalid group ID: ${groupId}`)

  for (const participant of [
    expenseFormValues.paidBy,
    ...expenseFormValues.paidFor.map((p) => p.participant),
  ]) {
    if (!group.participants.some((p) => p.id === participant))
      throw new Error(`Invalid participant ID: ${participant}`)
  }

  const prisma = await getPrisma()
  return prisma.expense.create({
    data: {
      id: randomId(),
      groupId,
      expenseDate: expenseFormValues.expenseDate,
      categoryId: expenseFormValues.category,
      amount: expenseFormValues.amount,
      title: expenseFormValues.title,
      paidById: expenseFormValues.paidBy,
      splitMode: expenseFormValues.splitMode,
      paidFor: {
        createMany: {
          data: expenseFormValues.paidFor.map((paidFor) => ({
            participantId: paidFor.participant,
            shares: paidFor.shares,
          })),
        },
      },
      isReimbursement: expenseFormValues.isReimbursement,
      documents: {
        createMany: {
          data: expenseFormValues.documents.map((doc) => ({
            id: randomId(),
            url: doc.url,
            width: doc.width,
            height: doc.height,
          })),
        },
      },
      notes: expenseFormValues.notes,
    },
  })
}

export async function deleteExpense(expenseId: string) {
  const prisma = await getPrisma()
  await prisma.expense.delete({
    where: { id: expenseId },
    include: { paidFor: true, paidBy: true },
  })
}

export async function getCategories() {
  const prisma = await getPrisma()
  return prisma.category.findMany()
}

export async function getGroupExpenses(groupId: string) {
  const prisma = await getPrisma()
  return prisma.expense.findMany({
    where: { groupId },
    include: {
      paidFor: { include: { participant: true } },
      paidBy: true,
      category: true,
    },
    orderBy: [{ expenseDate: 'desc' }, { createdAt: 'desc' }],
  })
}

export async function getExpense(groupId: string, expenseId: string) {
  const prisma = await getPrisma()
  return prisma.expense.findUnique({
    where: { id: expenseId },
    include: { paidBy: true, paidFor: true, category: true, documents: true },
  })
}

export async function getGroupExpensesParticipants(groupId: string) {
  const expenses = await getGroupExpenses(groupId)
  return Array.from(
    new Set(
      expenses.flatMap((e) => [
        e.paidById,
        ...e.paidFor.map((pf) => pf.participantId),
      ])
    )
  )
}
