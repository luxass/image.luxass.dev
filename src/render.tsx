import React from 'react'
import { z } from 'zod'
import type { SatoriOptions } from 'satori'
import { font, params } from './utils'
import { ImageResponse } from './og'
import { IMAGES, IMAGE_NAMES } from './images'
import type { Env } from './types'

const SIZE_SCHEMA = z.object({
  width: z.number().min(300).max(600).default(300),
  height: z.number().min(300).max(600).default(300),
})

export async function render(
  imageName: string,
  request: Request,
  env: Env,
): Promise<Response> {
  if (!IMAGE_NAMES.includes(imageName)) {
    return new Response('Not found', { status: 404 })
  }

  const { default: Image, schema, fonts: fontsToDownload } = IMAGES[imageName]

  if (Image == null) {
    return new Response('Not found', { status: 404 })
  }

  const parsed = params(SIZE_SCHEMA.merge(schema)).decodeRequest(request)

  if (!parsed.success) {
    return new Response(JSON.stringify(parsed.error), { status: 400 })
  }

  const props = parsed.data.input!

  const { width, height } = props

  delete props.width
  delete props.height

  let fonts: SatoriOptions['fonts'] = []

  if (fontsToDownload) {
    fonts = await Promise.all(
      fontsToDownload.map(async ({
        family,
        weight,
        text,
      }) => ({
        data: await font({ HOST: env.HOST, family, weight, text }),
        name: family,
        weight,
        style: 'normal',
      }),
      ),
    )
  }

  return new ImageResponse(
    <Image {...props} />,
    {
      format: 'png',
      width,
      height,
      fonts,
      emoji: 'twemoji',

    },
  )
}
