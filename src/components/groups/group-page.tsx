import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { AddGroupByUrlButton } from './add-group-by-url'
import { Button } from '@nextui-org/react'

const GroupsPage = ({
  children,
  reload,
}: PropsWithChildren<{ reload: () => void }>) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="font-bold text-2xl flex-1">
          <Link href="/groups">My Groups</Link>
        </h1>
        <div className="flex gap-2">
          <AddGroupByUrlButton reload={reload} />
          <Button>
            <Link href="/groups/create">Create</Link>
          </Button>
        </div>
      </div>
      <div>{children}</div>
    </>
  )
}
export default GroupsPage
