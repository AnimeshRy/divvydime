import { cached } from '@/app/cached-functions'
import { ActivityList } from '@/components/activity/activity-list'
import { Card, CardBody, CardHeader, Divider, Spinner } from '@nextui-org/react'
import { getActivities } from '@/lib/api'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Activity',
}

export default async function ActivityPage({
  params: { groupId },
}: {
  params: { groupId: string }
}) {
  const group = await cached.getGroup(groupId)
  if (!group) notFound()

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Group Activity</h1>
      </CardHeader>
      <Divider />
      <CardBody className="px-4 md:px-6">
        <Suspense fallback={<ActivityLoading />}>
          <ActivityContent groupId={groupId} />
        </Suspense>
      </CardBody>
    </Card>
  )
}

function ActivityLoading() {
  return (
    <div className="flex justify-center items-center py-12 w-full">
      <Spinner size="lg" color="success" />
    </div>
  )
}

async function ActivityContent({ groupId }: { groupId: string }) {
  const activities = await getActivities(groupId)

  if (activities.length === 0) {
    return <p className="text-center py-8">No activities found</p>
  }

  return (
    <div className="w-full">
      <ActivityList activities={activities} />
    </div>
  )
}
