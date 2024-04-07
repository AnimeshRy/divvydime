import * as z from 'zod'

export const createGroupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Enter at least two characters.')
      .max(50, 'Enter at most 50 characters.'),
    currency: z
      .string()
      .min(1, 'Enter at least one character.')
      .max(5, 'Enter at most five characters.'),
    participants: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z
            .string()
            .min(2, 'Enter at least two characters.')
            .max(50, 'Enter at most 50 characters.'),
        })
      )
      .min(1),
  })
  .superRefine(({ participants }, ctx) => {
    const seen = new Set()
    participants.forEach((participant, i) => {
      if (seen.has(participant.name)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Another participant already has this name.',
          path: ['participants', i, 'name'],
        })
      }
      seen.add(participant.name)
    })
  })

export type GroupFormValues = z.infer<typeof createGroupFormSchema>
