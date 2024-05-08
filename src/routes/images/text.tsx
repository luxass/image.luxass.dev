import * as React from 'react'
import { Hono } from 'hono'
import { validator } from 'hono/validator'
import { z } from 'zod'
import type { HonoContext } from '../../types'
import { ImageResponse } from '../../image-response'
import { font } from '../../utils'

export const textImageRouter = new Hono<HonoContext>()

const schema = z.object({
  width: z.coerce.number().min(300).max(600).default(300),
  height: z.coerce.number().min(300).max(600).default(300),
  text: z.string().default('LN'),
  textColor: z.string().default('blue-600'),
  bgColor: z.string().default('white'),
})

textImageRouter.get(
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
      bgColor: _bgColor,
      height,
      text,
      textColor: _textColor,
      width,
    } = ctx.req.valid('query')

    const inter400 = await font({
      family: 'Inter',
      weight: 400,
    })

    const bgColor = `bg-${_bgColor}`
    const textColor = `text-${_textColor}`

    return new ImageResponse(
      <div
        tw={`${bgColor} flex h-screen w-screen items-center justify-center p-5 text-center`}
        style={{ fontFamily: 'Inter' }}
      >
        <p tw={`text-[12rem] ${textColor}`}>{text}</p>
      </div>,
      {
        width,
        height,
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
