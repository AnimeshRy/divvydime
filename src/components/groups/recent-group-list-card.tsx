import { RecentGroup } from '@/lib/schema-utils'
import { useRouter } from 'next/navigation'
import { RecentGroupsState } from '../../app/groups/recent-group-list'
import { SetStateAction } from 'react'
import { toast } from 'react-hot-toast'
import {
  archiveGroup,
  getArchivedGroups,
  getStarredGroups,
  starGroup,
  unarchiveGroup,
  unstarGroup,
} from '@/lib/groups'
import {
  Card,
  CardHeader,
  CardFooter,
  Button,
  Tooltip,
} from '@nextui-org/react'
import Link from 'next/link'
import { RxStar, RxStarFilled, RxArchive, RxPerson } from 'react-icons/rx'

export function RecentGroupListCard({
  group,
  state,
  setState,
}: {
  group: RecentGroup
  state: RecentGroupsState
  setState: (state: SetStateAction<RecentGroupsState>) => void
}) {
  const router = useRouter()

  const details =
    state.status === 'complete'
      ? state.groupsDetails.find((d) => d.id === group.id)
      : null

  if (state.status === 'pending') return null

  const refreshGroupsFromStorage = () =>
    setState({
      ...state,
      starredGroups: getStarredGroups(),
      archivedGroups: getArchivedGroups(),
    })

  const isStarred = state.starredGroups.includes(group.id)
  const isArchived = state.archivedGroups.includes(group.id)

  return (
    <li key={group.id}>
      <Card
        className="max-w-[400px] cursor-pointer"
        onClick={() => router.push(`/groups/${group.id}`)}
      >
        <CardHeader className="flex justify-between items-center pb-0">
          <div>
            <p>{group.name}</p>
          </div>
          <div className="flex gap-2">
            <Tooltip content={isStarred ? 'Unstar' : 'Star'}>
              <Button
                size="sm"
                color={isStarred ? 'warning' : 'default'}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isStarred) {
                    unstarGroup(group.id)
                    toast.success('Group unstarred', { duration: 1000 })
                  } else {
                    starGroup(group.id)
                    unarchiveGroup(group.id)
                    toast.success('Group starred', { duration: 1000 })
                  }
                  refreshGroupsFromStorage()
                }}
              >
                {isStarred ? <RxStarFilled /> : <RxStar />}
              </Button>
            </Tooltip>
            <Tooltip content={isArchived ? 'Unarchive' : 'Archive'}>
              <Button
                size="sm"
                color={isArchived ? 'secondary' : 'default'}
                onClick={(e) => {
                  e.stopPropagation()
                  if (isArchived) {
                    unarchiveGroup(group.id)
                    toast.success('Group unarchived', { duration: 1000 })
                  } else {
                    archiveGroup(group.id)
                    toast.success('Group archived', { duration: 1000 })
                  }
                  refreshGroupsFromStorage()
                }}
              >
                {isArchived ? (
                  <RxArchive />
                ) : (
                  <RxArchive className="rotate-45" />
                )}
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardFooter>
          {details ? (
            <Tooltip content="Participants & Creation Date">
              <div className="flex justify-between w-full">
                <div className="flex items-center gap-1">
                  <p>{details._count.participants}</p>
                  <RxPerson />
                  <p className="text-sm ml-2">
                    {new Date(details.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </Tooltip>
          ) : (
            'Loading details...'
          )}
          <Link className="ml-2" href={`/groups/${group.id}`} passHref>
            <Button className="text-base mt-4 text-green-600">
              View Group
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </li>
  )
}

export default RecentGroupListCard
