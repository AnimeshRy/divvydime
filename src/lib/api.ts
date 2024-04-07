import { getPrisma } from '@/lib/prisma'
import { GroupFormValues } from '@/lib/schema'
import { group } from 'console'
import { nanoid } from 'nanoid'

export function randomId() {
  return nanoid()
}

export async function createGroup(createGroupFormValues: GroupFormValues) {
  const prisma = await getPrisma()
  return prisma.group.create({
    data: {
      id: randomId(),
      name: createGroupFormValues.name,
      currency: createGroupFormValues.currency,
      participants: {
        create: createGroupFormValues.participants.map((participant) => ({
          id: randomId(),
          name: participant.name,
        })),
      },
    },
    include: {
      participants: true,
    },
  })
}

export async function getGroups(groupIds: string[]) {
  const prisma = await getPrisma()
  return (
    await prisma.group.findMany({
      where: {
        id: {
          in: groupIds,
        },
      },
      include: {
        _count: {
          select: {
            participants: true,
          },
        },
      },
    })
  ).map((group) => ({
    ...group,
    createdAt: group.createdAt.toISOString(),
  }))
}

export async function getGroup(groupId: string) {
  const prisma = await getPrisma()
  return prisma.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  })
}
