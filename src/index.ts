import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { HTTPException } from 'hono/http-exception'
import type { HonoContext } from './types'
// @ts-expect-error no types for html files
import indexPage from './assets/index.html'
import { fontRouter } from './routes/font'
import { imageRouter } from './routes/images'

const app = new Hono<HonoContext>()
app.use('*', logger())
app.use(prettyJSON())

app.route('/api/font', fontRouter)
app.route('/api/image', imageRouter)

app.get('/', async (ctx) => {
  return ctx.html(indexPage)
})

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
