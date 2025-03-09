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
// import {Calendar} from "@nextui-org/calendar";

type SplitMode = 'EVENLY' | 'BY_SHARES' | 'BY_PERCENTAGE' | 'BY_AMOUNT'

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
    `${group.id}-defaultSplittingOptions`
  )
  if (defaultSplitMode === null) return defaultValue
  const parsedDefaultSplitMode = JSON.parse(
    defaultSplitMode
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
      : searchParams.get('reimbursement')
        ? {
            title: 'Reimbursement',
            expenseDate: new Date(),
            amount: String(
              (Number(searchParams.get('amount')) || 0) / 100
            ) as unknown as number, // hack
            category: 1, // category with Id 1 is Payment
            paidBy: searchParams.get('from') ?? undefined,
            paidFor: [
              searchParams.get('to')
                ? {
                    participant: searchParams.get('to')!,
                    shares: '1' as unknown as number,
                  }
                : undefined,
            ],
            isReimbursement: true,
            splitMode: defaultSplittingOptions.splitMode,
            saveDefaultSplittingOptions: false,
            documents: [],
            notes: '',
          }
        : {
            title: searchParams.get('title') ?? '',
            expenseDate: searchParams.get('date')
              ? new Date(searchParams.get('date') as string)
              : new Date(),
            amount: (searchParams.get('amount') || 0) as unknown as number,
            category: searchParams.get('categoryId')
              ? Number(searchParams.get('categoryId'))
              : 1,
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
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  const sExpense = isIncome ? 'Income' : 'Expense'
  const sPaid = isIncome ? 'Received' : 'Paid'

  console.log('form.watch("paidFor")', form.watch('paidFor'))

  // Watch for split mode changes
  const currentSplitMode = form.watch('splitMode')

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data, activeUserId ?? undefined)
  })

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(activeUserId ?? undefined)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <Card className="mb-4">
        <CardHeader className="flex justify-between items-center">
          <h4 className="text-xl font-bold">
            {(isCreate ? 'Create ' : 'Edit ') + sExpense + ' 💸'}
          </h4>
          {!isCreate && onDelete && (
              <Button
                color="danger"
                variant="flat"
                onClick={handleDelete}
                aria-label="Delete expense"
              >
                Delete Expense
              </Button>
            )}
        </CardHeader>
        <CardBody className="gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                {...form.register('title')}
                placeholder="Monday evening restaurant"
                value={form.watch('title')}
                aria-label={`${capitalize(sExpense)} title`}
              />
              <p className="text-sm text-default-500">
                Enter a description for the {sExpense}.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="expenseDate" className="text-sm font-medium">
                {capitalize(sExpense)} date
              </label>
              <Input
                id="expenseDate"
                type="date"
                value={form.watch('expenseDate')?.toString() || ''}
                {...form.register('expenseDate', {
                  setValueAs: (value) =>
                    value ? new Date(value).toISOString().split('T')[0] : '',
                })}
                aria-label={`${capitalize(sExpense)} date`}
                className="w-full"
              />
              <p className="text-sm text-default-500">
                Enter the date the {sExpense} was {sPaid}.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <CategorySelector
                categories={categories}
                defaultValue={form.getValues('category')}
                onValueChange={(value) => {
                  console.log('value', value)
                  form.setValue('category', value)
                }}
                isLoading={isCategoryLoading}
              />
              <p className="text-sm text-default-500">
                Select the {sExpense} category.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="flex items-center gap-2">
                <span className="text-default-500">{group.currency}</span>
                <Input
                  id="amount"
                  className="flex-1"
                  {...form.register('amount')}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  aria-label="Amount"
                  value={form.watch('amount').toString()}
                  onChange={(e) => {
                    const v = enforceCurrencyPattern(e.target.value)
                    const income = Number(v) < 0
                    setIsIncome(income)
                    if (income) form.setValue('isReimbursement', false)
                    form.setValue('amount', v as unknown as number)
                  }}
                />
              </div>
              <p className="text-sm text-default-500">
                Enter the {sExpense} amount.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="paidBy" className="text-sm font-medium">
                {capitalize(sPaid)} by
              </label>
              <Select
                id="paidBy"
                defaultSelectedKeys={[getSelectedPayer() || '']}
                placeholder="Select a participant"
                selectedKeys={[form.watch('paidBy') || '']}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string
                  form.setValue('paidBy', selectedKey)
                }}
                aria-label={`${capitalize(sPaid)} by`}
              >
                {group.participants.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </Select>
              <p className="text-sm text-default-500">
                Select the participant who {sPaid} the {sExpense}.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes
              </label>
              <Textarea
                id="notes"
                minRows={2}
                value={form.watch('notes')}
                {...form.register('notes')}
                placeholder="Add any additional notes..."
                aria-label="Notes"
              />
            </div>

            {!isIncome && (
              <div className="col-span-2 flex items-center">
                <Checkbox
                  id="isReimbursement"
                  color="success"
                  {...form.register('isReimbursement')}
                  isSelected={form.watch('isReimbursement')}
                >
                  Is a Reimbursement?
                </Checkbox>
              </div>
            )}
          </div>

          {/* Split Payment Section */}
          <div className="mt-6 border-t border-divider pt-6">
            <h5 className="text-lg font-semibold mb-4">Split Payment</h5>

            <div className="space-y-1">
              {group.participants.map(({ id, name }) => {
                const isChecked = form
                  .getValues()
                  .paidFor?.some(({ participant }) => participant === id)
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between py-3 border-b border-divider last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`participant-${id}`}
                        defaultSelected={isChecked}
                        color="success"
                        classNames={{
                          label: 'text-sm',
                        }}
                        onChange={(e) => {
                          const currentValue = form.getValues().paidFor || []
                          if (e.target.checked) {
                            form.setValue(
                              'paidFor',
                              [
                                ...currentValue,
                                {
                                  participant: id,
                                  shares: 1,
                                },
                              ],
                              { shouldValidate: true }
                            )
                          } else {
                            form.setValue(
                              'paidFor',
                              currentValue.filter(
                                (value) => value.participant !== id
                              ),
                              { shouldValidate: true }
                            )
                          }
                        }}
                      >
                        {name}
                      </Checkbox>
                    </div>

                    {currentSplitMode !== 'EVENLY' && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          className="w-[80px]"
                          size="sm"
                          disabled={!isChecked}
                          value={String(
                            form.watch('paidFor')?.find(
                              ({ participant }) => participant === id
                            )?.shares || ''
                          )}
                          onChange={(e) => {
                            const newValue = enforceCurrencyPattern(e.target.value);
                            const currentPaidFor = [...(form.getValues().paidFor || [])];

                            // Find if this participant already exists in the array
                            const existingIndex = currentPaidFor.findIndex(
                              p => p.participant === id
                            );

                            if (existingIndex >= 0) {
                              // Update existing entry
                              currentPaidFor[existingIndex] = {
                                participant: id,
                                shares: Number(newValue),
                              };
                            } else {
                              // Add new entry
                              currentPaidFor.push({
                                participant: id,
                                shares: Number(newValue),
                              });
                            }

                            form.setValue('paidFor', currentPaidFor, {
                              shouldValidate: true
                            });
                          }}
                          placeholder={
                            currentSplitMode === 'BY_AMOUNT' ? '0.00' : '1'
                          }
                        />
                        <span className="text-sm text-default-500">
                          {currentSplitMode === 'BY_SHARES' && 'shares'}
                          {currentSplitMode === 'BY_PERCENTAGE' && '%'}
                          {currentSplitMode === 'BY_AMOUNT' && group.currency}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-2">
              <Button
                variant="light"
                color="success"
                onPress={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="p-3"
              >
                Advanced Options
              </Button>

              {showAdvancedOptions && (
                <div className="grid sm:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Split Mode</label>
                    <Select
                      defaultSelectedKeys={[form.getValues().splitMode]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as SplitMode
                        form.setValue('splitMode', selectedKey, {
                          shouldValidate: true,
                        })
                      }}
                    >
                      <SelectItem key="EVENLY" value="EVENLY">
                        Split Evenly
                      </SelectItem>
                      <SelectItem key="BY_SHARES" value="BY_SHARES">
                        Split by Shares
                      </SelectItem>
                      <SelectItem key="BY_PERCENTAGE" value="BY_PERCENTAGE">
                        Split by Percentage
                      </SelectItem>
                      <SelectItem key="BY_AMOUNT" value="BY_AMOUNT">
                        Split by Amount
                      </SelectItem>
                    </Select>
                    <p className="text-sm text-default-500">
                      Choose how to split the {sExpense.toLowerCase()}
                    </p>
                    <div className="flex items-start pt-2">
                      <Checkbox
                        isSelected={form.watch('saveDefaultSplittingOptions')}
                        color="success"
                        classNames={{
                          label: 'text-sm',
                        }}
                        onChange={(e) => {
                          form.setValue(
                            'saveDefaultSplittingOptions',
                            e.target.checked
                          )
                        }}
                      >
                        Save as default split option
                      </Checkbox>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t border-divider">
            <Button
              color="success"
              type="submit"
              variant="flat"
              startContent={<Save className="w-4 h-4" />}
              aria-label={isCreate ? 'Create expense' : 'Save changes'}
            >
              {isCreate ? 'Create' : 'Save'}
            </Button>

            <Button
              as={Link}
              href={`/groups/${group.id}`}
              variant="flat"
              color="default"
              aria-label="Cancel and return to group"
            >
              Cancel
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  )
}

function formatDate(date?: Date) {
  if (!date || isNaN(date as any)) date = new Date()
  return date.toISOString().substring(0, 10)
}
