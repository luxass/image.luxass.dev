import { Hono } from 'hono'
import type { HonoContext } from '../types'

export const fontRouter = new Hono<HonoContext>()

fontRouter.get(
  '*',
  async (ctx, next) => {
    if (ctx.env.ENVIRONMENT !== 'production' && ctx.env.ENVIRONMENT !== 'staging') {
      return await next()
    }
    const key = ctx.req.url
    const cache = await caches.open('fonts')

    const response = await cache.match(key)
    if (!response) {
      // eslint-disable-next-line no-console
      console.info('serving font from network')
      await next()
      if (!ctx.res.ok) {
        console.error('failed to fetch font, skipping caching')
        return
      }

      ctx.res.headers.set('Cache-Control', 'public, max-age=3600')

      const response = ctx.res.clone()
      ctx.executionCtx.waitUntil(cache.put(key, response))
    } else {
      // eslint-disable-next-line no-console
      console.info('serving font from cache')
      return new Response(response.body, response)
    }
  },
)

fontRouter.get('/:family/:weight/:text?', async (ctx) => {
  const url = new URL(ctx.req.url)
  const { family: _family, weight, text } = ctx.req.param()

  const family = _family[0].toUpperCase() + _family.slice(1)

  let fontsUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}`
  if (text) {
    // allow font optimization if we pass text => only getting the characters we need
    fontsUrl += `&text=${encodeURIComponent(text)}`
  }

  const css = await (
    await fetch(fontsUrl, {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    })
  ).text()

  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  )

  if (!resource || !resource[1]) {
    return new Response('No resource found', { status: 404 })
  }

  const res = await fetch(resource[1])

  const response = new Response(
    // @ts-expect-error it is a readable stream, but i think we have a wrongly typed dependency
    res.body,
    res,
  )

  if (url.hostname === 'localhost') {
    response.headers.delete('content-encoding')
    response.headers.delete('content-length')
  }

  return response
})
