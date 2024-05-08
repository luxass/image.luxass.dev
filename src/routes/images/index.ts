import { Hono } from 'hono'
import type { HonoContext } from '../../types'
import { textImageRouter } from './text'
import { randomEmojiImageRouter } from './random-emoji'
import { projectImageRouter } from './project'
import { postImageRouter } from './post'

export const imageRouter = new Hono<HonoContext>()

imageRouter.get(
  '*',
  async (ctx, next) => {
    if (ctx.env.ENVIRONMENT !== 'production' && ctx.env.ENVIRONMENT !== 'staging') {
      return await next()
    }
    const key = ctx.req.url
    const cache = await caches.open('og-images')

    const response = await cache.match(key)
    if (!response) {
      await next()
      if (!ctx.res.ok) {
        return
      }

      ctx.res.headers.set('Cache-Control', 'public, max-age=3600')

      const response = ctx.res.clone()
      ctx.executionCtx.waitUntil(cache.put(key, response))
    } else {
      return new Response(response.body, response)
    }
  },
)

imageRouter.route('/text', textImageRouter)
imageRouter.route('/random-emoji', randomEmojiImageRouter)
imageRouter.route('/project', projectImageRouter)
imageRouter.route('/post', postImageRouter)