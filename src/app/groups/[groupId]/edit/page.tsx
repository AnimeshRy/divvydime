import { cached } from '@/app/cached-functions'
import { GroupForm } from '@/components/form'
import { getGroupExpensesParticipants, updateGroup } from '@/lib/api'
import { createGroupFormSchema } from '@/lib/schema'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function EditGroupPage({
  params: { groupId },
}: {
  params: { groupId: string }
}) {
  const group = await cached.getGroup(groupId)
  if (!group) notFound()

  async function updateGroupAction(values: unknown, participantId?: string) {
    'use server'
    const groupFormValues = createGroupFormSchema.parse(values)
    const group = await updateGroup(groupId, groupFormValues, participantId)
    redirect(`/groups/${group.id}`)
  }

  const protectedParticipantIds = await getGroupExpensesParticipants(groupId)
  return (
    <GroupForm
      group={group}
      onSubmit={updateGroupAction}
      protectedParticipantIds={protectedParticipantIds}
    />
  )
}
