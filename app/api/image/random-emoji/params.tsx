import { z } from 'zod'
import { params } from '~/lib/utils'

export const RANDOM_EMOJI_PARAMS = params(
  z.object({
    width: z.number().min(300).max(600).default(300),
    height: z.number().min(300).max(600).default(300),
    bgColor: z.string().default('white'),
  }),
)
