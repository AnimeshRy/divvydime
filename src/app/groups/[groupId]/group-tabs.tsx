'use client'

import { Tabs, Tab } from '@nextui-org/react'
import { usePathname, useRouter } from 'next/navigation'

type Props = {
  groupId: string
}

export function GroupTabs({ groupId }: Props) {
  const pathname = usePathname()
  const value =
    pathname.replace(/\/groups\/[^\/]+\/([^/]+).*/, '$1') || 'expenses'
  const router = useRouter()

  return (
    <Tabs
      selectedKey={value}
      onSelectionChange={(key) => {
        if (typeof key === 'string') {
          router.push(`/groups/${groupId}/${key}`)
        }
      }}
      aria-label="Group Tabs"
      variant="solid"
      className="overflow-x-auto"
      color="success"
    >
      <Tab key="expenses" title="Expenses" />
      <Tab key="balances" title="Balances" />
      <Tab key="stats" title="Stats" />
      <Tab key="activity" title="Activity" />
      <Tab key="edit" title="Settings" />
    </Tabs>
  )
}
