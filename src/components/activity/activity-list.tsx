'use client'

import { Activity, ActivityType } from '@prisma/client'
import dayjs, { Dayjs } from 'dayjs'
import { Card, CardBody, Chip } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

type ActivityListProps = {
  activities: Activity[]
}

const DATE_GROUPS = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  EARLIER_THIS_WEEK: 'Earlier this week',
  LAST_WEEK: 'Last week',
  EARLIER_THIS_MONTH: 'Earlier this month',
  LAST_MONTH: 'Last month',
  EARLIER_THIS_YEAR: 'Earlier this year',
  LAST_YEAR: 'Last year',
  OLDER: 'Older',
}

function getDateGroup(date: Dayjs, today: Dayjs) {
  if (today.isSame(date, 'day')) {
    return DATE_GROUPS.TODAY
  } else if (today.subtract(1, 'day').isSame(date, 'day')) {
    return DATE_GROUPS.YESTERDAY
  } else if (today.isSame(date, 'week')) {
    return DATE_GROUPS.EARLIER_THIS_WEEK
  } else if (today.subtract(1, 'week').isSame(date, 'week')) {
    return DATE_GROUPS.LAST_WEEK
  } else if (today.isSame(date, 'month')) {
    return DATE_GROUPS.EARLIER_THIS_MONTH
  } else if (today.subtract(1, 'month').isSame(date, 'month')) {
    return DATE_GROUPS.LAST_MONTH
  } else if (today.isSame(date, 'year')) {
    return DATE_GROUPS.EARLIER_THIS_YEAR
  } else if (today.subtract(1, 'year').isSame(date, 'year')) {
    return DATE_GROUPS.LAST_YEAR
  } else {
    return DATE_GROUPS.OLDER
  }
}

function getGroupedActivitiesByDate(activities: Activity[]) {
  const today = dayjs()
  return activities.reduce(
    (result: { [key: string]: Activity[] }, activity: Activity) => {
      const activityGroup = getDateGroup(dayjs(activity.time), today)
      result[activityGroup] = result[activityGroup] ?? []
      result[activityGroup].push(activity)
      return result
    },
    {}
  )
}

export function ActivityList({ activities }: ActivityListProps) {
  const router = useRouter()
  const groupedActivities = getGroupedActivitiesByDate(activities)

  const handleActivityClick = (activity: Activity) => {
    if (activity.expenseId) {
      router.push(`/groups/${activity.groupId}/expenses/${activity.expenseId}`)
    }
  }

  // Sort date groups in chronological order
  const dateGroupOrder = [
    DATE_GROUPS.TODAY,
    DATE_GROUPS.YESTERDAY,
    DATE_GROUPS.EARLIER_THIS_WEEK,
    DATE_GROUPS.LAST_WEEK,
    DATE_GROUPS.EARLIER_THIS_MONTH,
    DATE_GROUPS.LAST_MONTH,
    DATE_GROUPS.EARLIER_THIS_YEAR,
    DATE_GROUPS.LAST_YEAR,
    DATE_GROUPS.OLDER,
  ]

  return (
    <div className="space-y-8">
      {dateGroupOrder.map((dateGroup) => {
        const activitiesInGroup = groupedActivities[dateGroup]
        if (!activitiesInGroup || activitiesInGroup.length === 0) return null

        return (
          <div key={dateGroup} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {dateGroup}
            </h2>
            <div className="space-y-3">
              {activitiesInGroup.map((activity) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  onClick={
                    activity.expenseId
                      ? () => handleActivityClick(activity)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

type ActivityItemProps = {
  activity: Activity
  onClick?: () => void
}

function ActivityItem({ activity, onClick }: ActivityItemProps) {
  const { activityType, time, data, participantId } = activity
  const formattedTime = dayjs(time).format('h:mm A')

  return (
    <Card
      className={`w-full ${
        onClick ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
      }`}
      isPressable={!!onClick}
      onPress={onClick}
    >
      <CardBody className="p-4">
        <div className="flex items-start gap-4">
          <ActivityIcon activityType={activityType} />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {getActivityTitle(activityType)}
                </h3>
                <p className="text-sm text-gray-500">{data}</p>
                {participantId && (
                  <p className="text-xs text-gray-400 mt-1">
                    By participant ID: {participantId}
                  </p>
                )}
              </div>
              <Chip
                size="sm"
                variant="flat"
                color={getActivityColor(activityType)}
              >
                {formattedTime}
              </Chip>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

function ActivityIcon({ activityType }: { activityType: ActivityType }) {
  const iconClass =
    'w-8 h-8 rounded-full flex items-center justify-center text-white'

  switch (activityType) {
    case 'CREATE_EXPENSE':
      return (
        <div className={`${iconClass} bg-green-500`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )
    case 'UPDATE_EXPENSE':
      return (
        <div className={`${iconClass} bg-blue-500`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      )
    case 'DELETE_EXPENSE':
      return (
        <div className={`${iconClass} bg-red-500`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )
    case 'UPDATE_GROUP':
      return (
        <div className={`${iconClass} bg-purple-500`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </div>
      )
    default:
      return (
        <div className={`${iconClass} bg-gray-500`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )
  }
}

function getActivityTitle(activityType: ActivityType): string {
  switch (activityType) {
    case 'CREATE_EXPENSE':
      return 'Expense Created'
    case 'UPDATE_EXPENSE':
      return 'Expense Updated'
    case 'DELETE_EXPENSE':
      return 'Expense Deleted'
    case 'UPDATE_GROUP':
      return 'Group Updated'
    default:
      return 'Activity'
  }
}

function getActivityColor(
  activityType: ActivityType
): 'success' | 'primary' | 'danger' | 'secondary' | 'default' {
  switch (activityType) {
    case 'CREATE_EXPENSE':
      return 'success'
    case 'UPDATE_EXPENSE':
      return 'primary'
    case 'DELETE_EXPENSE':
      return 'danger'
    case 'UPDATE_GROUP':
      return 'secondary'
    default:
      return 'default'
  }
}
