'use server'
import { getGroups } from '@/lib/api'

export async function getGroupsAction(groupIds: string[]) {
    console.log('Is this getting called?')
  'use server'
  return getGroups(groupIds)
}
