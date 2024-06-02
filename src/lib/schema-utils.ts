import { z } from 'zod'

export const recentGroupsSchema = z.array(
  z.object({
    id: z.string().min(1),
    name: z.string(),
  })
)

export const starredGroupsSchema = z.array(z.string())
export const archivedGroupsSchema = z.array(z.string())

export type RecentGroups = z.infer<typeof recentGroupsSchema>
export type RecentGroup = RecentGroups[number]
