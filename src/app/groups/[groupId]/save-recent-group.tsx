'use client'
import { saveRecentGroup } from '@/lib/groups'
import { RecentGroup } from '@/lib/schema-utils'
import { useEffect } from 'react'

type Props = {
  group: RecentGroup
}

export function SaveGroupLocally({ group }: Props) {
  useEffect(() => {
    saveRecentGroup(group)
  }, [group])

  return null
}
