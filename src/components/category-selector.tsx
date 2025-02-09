'use client'

import { CategoryIcon } from '@/components/category-icon'
import { Category } from '@prisma/client'
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  ScrollShadow,
} from '@nextui-org/react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  categories: Category[]
  onValueChange: (categoryId: Category['id']) => void
  defaultValue: Category['id']
  isLoading: boolean
}

export function CategorySelector({
  categories,
  onValueChange,
  defaultValue,
  isLoading,
}: Props) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<number>(defaultValue)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setValue(defaultValue)
    onValueChange(defaultValue)
  }, [defaultValue, onValueChange])

  const selectedCategory =
    categories.find((category) => category.id === value) ?? categories[0]

  const categoriesByGroup = categories.reduce<Record<string, Category[]>>(
    (acc, category) => ({
      ...acc,
      [category.grouping]: [...(acc[category.grouping] ?? []), category],
    }),
    {},
  )

  const filteredCategories = Object.entries(categoriesByGroup).reduce<
    Record<string, Category[]>
  >((acc, [group, cats]) => {
    const filtered = cats.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (filtered.length > 0) {
      acc[group] = filtered
    }
    return acc
  }, {})

  return (
    <Popover
      isOpen={open}
      onOpenChange={setOpen}
      placement="bottom"
      showArrow={true}
    >
      <PopoverTrigger>
        <Button
          variant="flat"
          className="w-full justify-between"
          endContent={
            isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin opacity-70" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-70" />
            )
          }
        >
          <CategoryLabel category={selectedCategory} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <div className="p-2 border-b">
          <Input
            placeholder="Search category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
            startContent={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 text-default-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            }
          />
        </div>
        <ScrollShadow className="max-h-[300px]">
          {Object.entries(filteredCategories).map(([group, groupCategories]) => (
            <div key={group}>
              <div className="px-2 py-1.5 text-sm font-semibold text-default-600 bg-default-100">
                {group}
              </div>
              <div className="p-1">
                {groupCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="light"
                    className="w-full justify-start mb-1"
                    onClick={() => {
                      setValue(category.id)
                      onValueChange(category.id)
                      setOpen(false)
                    }}
                  >
                    <CategoryLabel category={category} />
                  </Button>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(filteredCategories).length === 0 && (
            <div className="p-2 text-center text-default-500">
              No category found.
            </div>
          )}
        </ScrollShadow>
      </PopoverContent>
    </Popover>
  )
}

function CategoryLabel({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-3">
      <CategoryIcon category={category} className="w-4 h-4" />
      <span>{category.name}</span>
    </div>
  )
}
