'use client'
import { NextPage } from 'next'
import { getGroupsAction } from './actions'
import { AddGroupByUrlButton } from '@/components/groups/add-group-by-url'
import { RecentGroups } from '@/lib/schema-utils'
import { getGroups } from '@/lib/api'
import { useEffect, useState } from 'react'
import {
  getRecentGroups,
  getStarredGroups,
  getArchivedGroups,
} from '@/lib/groups'
import { Loader2 } from 'lucide-react'
import GroupsPage from '@/components/groups/group-page'
import { Button, Link } from '@nextui-org/react'

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
    const groupsInStorage = getRecentGroups()
    const starredGroups = getStarredGroups()
    const archivedGroups = getArchivedGroups()

    setState({
      status: 'partial',
      groups: groupsInStorage,
      starredGroups,
      archivedGroups,
    })
    getGroupsAction(groupsInStorage.map((g) => g.id)).then((groupsDetails) => {
      setState({
        status: 'complete',
        groups: groupsInStorage,
        groupsDetails,
        starredGroups,
        archivedGroups,
      })
    })
  }

  useEffect(() => {
    loadGroups()
  }, [])

  if (state.status === 'pending') {
    return (
      <GroupsPage reload={loadGroups}>
        <p>
          <Loader2 className="w-4 m-4 mr-2 inline animate-spin" /> Loading
          recent groups…
        </p>
      </GroupsPage>
    )
  }

  if (state.groups.length === 0) {
    return (
      <GroupsPage reload={loadGroups}>
        <div className="text-sm space-y-2">
          <p>You have not visited any group recently.</p>
          <p>
            <Button className="-m-4">
              <Link href={`/groups/create`}>Create one</Link>
            </Button>{' '}
            or ask a friend to send you the link to an existing one.
          </p>
        </div>
      </GroupsPage>
    )
  }

  const { starredGroupInfo, groupInfo, archivedGroupInfo } = sortGroups(state)

  return (
    <GroupsPage reload={loadGroups}>
      {starredGroupInfo.length > 0 && (
        <>
          <h2 className="mb-2">Starred groups</h2>
          <GroupList
            groups={starredGroupInfo}
            state={state}
            setState={setState}
          />
        </>
      )}

      {groupInfo.length > 0 && (
        <>
          <h2 className="mt-6 mb-2">Recent groups</h2>
          <GroupList groups={groupInfo} state={state} setState={setState} />
        </>
      )}

      {archivedGroupInfo.length > 0 && (
        <>
          <h2 className="mt-6 mb-2 opacity-50">Archived groups</h2>
          <div className="opacity-50">
            <GroupList
              groups={archivedGroupInfo}
              state={state}
              setState={setState}
            />
          </div>
        </>
      )}
    </GroupsPage>
  )
}

export default RecentGroupList
