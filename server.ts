import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

export interface HonoContext {
  Bindings: {
    GITHUB_TOKEN: string
    ENVIRONMENT: string
  }
}
const app = new Hono<HonoContext>()

app.get('/favicon.ico', async (ctx) => {
  // return a random emoji as favicon
  return ctx.redirect('/api/image/random-emoji')
})

app.get('/view-source', (ctx) => {
  return ctx.redirect('https://github.com/luxass/image.luxass.dev')
})

app.onError(async (err, ctx) => {
  console.error(err)
  if (err instanceof HTTPException) {
    return err.getResponse()
  }

  const message = ctx.env.ENVIRONMENT === 'production' ? 'Internal server error' : err.stack
  console.error(err)
  return new Response(message, {
    status: 500,
  })
})

app.notFound(async () => {
  return new Response('Not found', {
    status: 404,
  })
})

export default app
