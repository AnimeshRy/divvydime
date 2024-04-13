'use client'
import { NextPage } from 'next'
import { getGroupsAction } from './actions'
import { AddGroupByUrlButton } from '@/components/groups/add-group-by-url'
import { RecentGroups } from '@/lib/schema-utils'
import { getGroups } from '@/lib/api'
import { useState } from 'react'

export type RecentGroupsState =
  | {
      status: 'pending'
    }
  | {
      status: 'partial'
      groups: RecentGroups
      starredGroups: string[]
      archivedGroups: string[]
    }
  | {
      status: 'complete'
      groups: RecentGroups
      groupsDetails: Awaited<ReturnType<typeof getGroups>>
      starredGroups: string[]
      archivedGroups: string[]
    }

function sortGroups(
  state: RecentGroupsState & { status: 'complete' | 'partial' }
) {
  const starredGroupInfo = []
  const groupInfo = []
  const archivedGroupInfo = []
  for (const group of state.groups) {
    if (state.starredGroups.includes(group.id)) {
      starredGroupInfo.push(group)
    } else if (state.archivedGroups.includes(group.id)) {
      archivedGroupInfo.push(group)
    } else {
      groupInfo.push(group)
    }
  }
  return {
    starredGroupInfo,
    groupInfo,
    archivedGroupInfo,
  }
}

const RecentGroupList: NextPage = () => {
  const [state, setState] = useState<RecentGroupsState>({ status: 'pending' })

  const loadGroups = () => {
    const groupsInStorage = getRecent
  }

  return (
    <>
      <AddGroupByUrlButton reload={() => console.log('ee')} />
    </>
  )
}

export default RecentGroupList
