import { NextPage } from 'next'
import { GroupForm } from '@/components/form'
import { groupFormSchema } from '@/lib/schema'
import { createGroup } from '@/lib/api'
import { redirect } from 'next/navigation'

const CreateGroup: NextPage = () => {
  async function createGroupAction(values: unknown) {
    'use server'
    const groupFormValues = groupFormSchema.parse(values)
    const group = await createGroup(groupFormValues)
    redirect(`/groups/${group.id}`)
  }

  return <GroupForm onSubmit={createGroupAction} />
}

export default CreateGroup
