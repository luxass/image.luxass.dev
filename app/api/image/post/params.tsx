import { z } from 'zod'
import { params, truncateWords } from '~/lib/utils'

export const POST_PARAMS = params(
  z.object({
    title: z
      .string()
      .transform((str) => truncateWords(str, 70)).default('No title'),
    description: z
      .string()
      .transform((str) => truncateWords(str, 145)).default('No description'),
    date: z
      .string()
      .transform((val) => new Date(val))
      .transform((date) =>
        Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(date),
      ),
  }),
)
