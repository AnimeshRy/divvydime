'use client'

import { CategorySelector } from '@/components/category-selector'
import { ExpenseDocumentsInput } from '@/components/expense-documents-input'
import { getCategories, getExpense, getGroup, randomId } from '@/lib/api'
import { RuntimeFeatureFlags } from '@/lib/feature-flags'
import { useActiveUser } from '@/lib/hooks'
import {
  ExpenseFormValues,
  SplittingOptions,
  expenseFormSchema,
} from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Checkbox,
  Select,
  SelectItem,
  Textarea,
} from '@nextui-org/react'
import { Save } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { extractCategoryFromTitle } from '../expense-form-actions'

export type Props = {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>
  expense?: NonNullable<Awaited<ReturnType<typeof getExpense>>>
  categories: NonNullable<Awaited<ReturnType<typeof getCategories>>>
  onSubmit: (values: ExpenseFormValues, participantId?: string) => Promise<void>
  onDelete?: (participantId?: string) => Promise<void>
  runtimeFeatureFlags: RuntimeFeatureFlags
}

const enforceCurrencyPattern = (value: string) =>
  value
    .replace(/^\s*-/, '_')
    .replace(/[.,]/, '#')
    .replace(/[-.,]/g, '')
    .replace(/_/, '-')
    .replace(/#/, '.')
    .replace(/[^-\d.]/g, '')

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1)

const getDefaultSplittingOptions = (group: Props['group']) => {
  const defaultValue = {
    splitMode: 'EVENLY' as const,
    paidFor: group.participants.map(({ id }) => ({
      participant: id,
      shares: '1' as unknown as number,
    })),
  }

  if (typeof localStorage === 'undefined') return defaultValue
  const defaultSplitMode = localStorage.getItem(
    `${group.id}-defaultSplittingOptions`,
  )
  if (defaultSplitMode === null) return defaultValue
  const parsedDefaultSplitMode = JSON.parse(
    defaultSplitMode,
  ) as SplittingOptions

  if (parsedDefaultSplitMode.paidFor === null) {
    parsedDefaultSplitMode.paidFor = defaultValue.paidFor
  }

  for (const parsedPaidFor of parsedDefaultSplitMode.paidFor) {
    if (
      !group.participants.some(({ id }) => id === parsedPaidFor.participant)
    ) {
      localStorage.removeItem(`${group.id}-defaultSplittingOptions`)
      return defaultValue
    }
  }

  return {
    splitMode: parsedDefaultSplitMode.splitMode,
    paidFor: parsedDefaultSplitMode.paidFor.map((paidFor) => ({
      participant: paidFor.participant,
      shares: String(paidFor.shares / 100) as unknown as number,
    })),
  }
}

export function ExpenseForm({
  group,
  expense,
  categories,
  onSubmit,
  onDelete,
  runtimeFeatureFlags,
}: Props) {
  const isCreate = expense === undefined
  const searchParams = useSearchParams()
  const getSelectedPayer = (field?: { value: string }) => {
    if (isCreate && typeof window !== 'undefined') {
      const activeUser = localStorage.getItem(`${group.id}-activeUser`)
      if (activeUser && activeUser !== 'None' && field?.value === undefined) {
        return activeUser
      }
    }
    return field?.value
  }

  const defaultSplittingOptions = getDefaultSplittingOptions(group)
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: expense
      ? {
          title: expense.title,
          expenseDate: expense.expenseDate ?? new Date(),
          amount: String(expense.amount / 100) as unknown as number,
          category: expense.categoryId,
          paidBy: expense.paidById,
          paidFor: expense.paidFor.map(({ participantId, shares }) => ({
            participant: participantId,
            shares: String(shares / 100) as unknown as number,
          })),
          splitMode: expense.splitMode,
          saveDefaultSplittingOptions: false,
          isReimbursement: expense.isReimbursement,
          documents: expense.documents,
          notes: expense.notes ?? '',
        }
      : {
          title: searchParams.get('title') ?? '',
          expenseDate: searchParams.get('date')
            ? new Date(searchParams.get('date') as string)
            : new Date(),
          amount: (searchParams.get('amount') || 0) as unknown as number,
          category: searchParams.get('categoryId')
            ? Number(searchParams.get('categoryId'))
            : 0,
          paidFor: defaultSplittingOptions.paidFor,
          paidBy: getSelectedPayer(),
          isReimbursement: false,
          splitMode: defaultSplittingOptions.splitMode,
          saveDefaultSplittingOptions: false,
          documents: searchParams.get('imageUrl')
            ? [
                {
                  id: randomId(),
                  url: searchParams.get('imageUrl') as string,
                  width: Number(searchParams.get('imageWidth')),
                  height: Number(searchParams.get('imageHeight')),
                },
              ]
            : [],
          notes: '',
        },
  })

  const [isCategoryLoading, setCategoryLoading] = useState(false)
  const activeUserId = useActiveUser(group.id)
  const [isIncome, setIsIncome] = useState(Number(form.getValues().amount) < 0)

  const sExpense = isIncome ? 'income' : 'expense'
  const sPaid = isIncome ? 'received' : 'paid'

  return (
    // <form onSubmit={form.handleSubmit(onSubmit)}>
    //   <Card className="mb-4">
    //     <CardHeader>
    //       <h4 className="text-xl font-bold">
    //         {(isCreate ? 'Create ' : 'Edit ') + sExpense}
    //       </h4>
    //     </CardHeader>
    //     <CardBody className="gap-6">
    //       <div className="grid sm:grid-cols-2 gap-6">
    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">
    //             {capitalize(sExpense)} title
    //           </label>
    //           <Input
    //             {...form.register('title')}
    //             placeholder="Monday evening restaurant"
    //             onBlur={async (e) => {
    //               if (runtimeFeatureFlags.enableCategoryExtract) {
    //                 setCategoryLoading(true)
    //                 const { categoryId } = await extractCategoryFromTitle(
    //                   e.target.value,
    //                 )
    //                 form.setValue('category', categoryId)
    //                 setCategoryLoading(false)
    //               }
    //             }}
    //           />
    //           <p className="text-sm text-default-500">
    //             Enter a description for the {sExpense}.
    //           </p>
    //         </div>

    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">
    //             {capitalize(sExpense)} date
    //           </label>
    //           <Input
    //             type="date"
    //             {...form.register('expenseDate')}
    //             defaultValue={formatDate(form.getValues('expenseDate'))}
    //           />
    //           <p className="text-sm text-default-500">
    //             Enter the date the {sExpense} was {sPaid}.
    //           </p>
    //         </div>

    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">Amount</label>
    //           <div className="flex items-center gap-2">
    //             <span>{group.currency}</span>
    //             <Input
    //               className="max-w-[120px]"
    //               {...form.register('amount')}
    //               type="text"
    //               inputMode="decimal"
    //               placeholder="0.00"
    //               onChange={(e) => {
    //                 const v = enforceCurrencyPattern(e.target.value)
    //                 const income = Number(v) < 0
    //                 setIsIncome(income)
    //                 if (income) form.setValue('isReimbursement', false)
    //                 form.setValue('amount', v as unknown as number)
    //               }}
    //             />
    //           </div>
    //           {!isIncome && (
    //             <div className="flex items-center gap-2 mt-2">
    //               <Checkbox
    //                 {...form.register('isReimbursement')}
    //                 defaultSelected={form.getValues('isReimbursement')}
    //               >
    //                 This is a reimbursement
    //               </Checkbox>
    //             </div>
    //           )}
    //         </div>

    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">Category</label>
    //           <CategorySelector
    //             categories={categories}
    //             defaultValue={form.getValues('category')}
    //             onValueChange={(value) => form.setValue('category', value)}
    //             isLoading={isCategoryLoading}
    //           />
    //           <p className="text-sm text-default-500">
    //             Select the {sExpense} category.
    //           </p>
    //         </div>

    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">{capitalize(sPaid)} by</label>
    //           <Select
    //             defaultSelectedKeys={[getSelectedPayer() || '']}
    //             onChange={(e) => form.setValue('paidBy', e.target.value)}
    //           >
    //             {group.participants.map(({ id, name }) => (
    //               <SelectItem key={id} value={id}>
    //                 {name}
    //               </SelectItem>
    //             ))}
    //           </Select>
    //           <p className="text-sm text-default-500">
    //             Select the participant who {sPaid} the {sExpense}.
    //           </p>
    //         </div>

    //         <div className="space-y-2">
    //           <label className="text-sm font-medium">Notes</label>
    //           <Textarea
    //             {...form.register('notes')}
    //             placeholder="Add any additional notes..."
    //           />
    //         </div>
    //       </div>
    //     </CardBody>
    //   </Card>

    //   <div className="flex gap-2 mt-4">
    //     <Button
    //       color="primary"
    //       type="submit"
    //       startContent={<Save className="w-4 h-4" />}
    //     >
    //       {isCreate ? 'Create' : 'Save'}
    //     </Button>
    //     {!isCreate && onDelete && (
    //       <Button
    //         color="danger"
    //         variant="flat"
    //         onClick={() => onDelete(activeUserId ?? undefined)}
    //       >
    //         Delete
    //       </Button>
    //     )}
    //     <Button
    //       as={Link}
    //       href={`/groups/${group.id}`}
    //       variant="flat"
    //       color="default"
    //     >
    //       Cancel
    //     </Button>
    //   </div>
    // </form>
    <></>
  )
}

function formatDate(date?: Date) {
  if (!date || isNaN(date as any)) date = new Date()
  return date.toISOString().substring(0, 10)
}
