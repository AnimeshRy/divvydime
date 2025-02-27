import { RecentGroups } from '@/lib/schema-utils'
import { SetStateAction } from 'react'
import RecentGroupListCard from './recent-group-list-card'
import { RecentGroupsState } from '../../app/groups/recent-group-list'

function GroupList({
  groups,
  state,
  setState,
}: {
  groups: RecentGroups
  state: RecentGroupsState
  setState: (state: SetStateAction<RecentGroupsState>) => void
}) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {groups.map((group) => (
        <RecentGroupListCard
          key={group.id}
          group={group}
          state={state}
          setState={setState}
        />
      ))}
    </ul>
  )
}

export default GroupList
