import * as React from 'react'
import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { z } from 'zod'
import type { HonoContext } from '../../types'
import { ImageResponse } from '../../og'
import { font } from '../../utils'

export const randomEmojiImageRouter = new Hono<HonoContext>()

const schema = z.object({
  width: z.number().min(300).max(600).default(300),
  height: z.number().min(300).max(600).default(300),
  bgColor: z.string().default('white'),
})

const EMOJIS = [
  '😊',
  '🚀',
  '⭐',
  '🔧',
  '🎉',
  '🔍',
  '📚',
  '🔥',
  '👨‍💻',
  '🔄',
  '🚦',
  '🤔',
  '💡',
  '👍',
  '🌍',
  '💡',
  '🤖',
]

randomEmojiImageRouter.get(
  '/',
  validator('query', (value, ctx) => {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
      return ctx.body(parsed.error.toString(), 400)
    }
    return parsed.data
  }),
  async (ctx) => {
    const {
      bgColor,
      width,
      height,
    } = ctx.req.valid('query')

    const inter400 = await font({
      family: 'Inter',
      weight: 400,
    })

    const text = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const bg = `bg-${bgColor}`

    return new ImageResponse(
      <div
        tw={`${bg} flex h-screen w-screen items-center justify-center p-5 text-center`}
      >
        <p
          tw="text-[12rem]"
        >
          {text}
        </p>
      </div>,
      {
        width,
        height,
        emoji: 'twemoji',
        format: 'svg',
        fonts: [
          {
            name: 'Inter',
            weight: 400,
            data: inter400,
          },
        ],
      },
    )
  },
)
