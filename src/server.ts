import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { INDEX_PAGE } from './utils'

export interface HonoContext {
  Bindings: {
    GITHUB_TOKEN: string
    ENVIRONMENT: string
  }
}
const app = new Hono<HonoContext>()

// app.route('/api/image', imageRouter)

app.get('/', async (ctx) => {
  const index = INDEX_PAGE
    // .replaceAll('{{ ENVIRONMENT }}', ctx.env.ENVIRONMENT)
    // .replaceAll('{{ STRINGIFIED_ENVIRONMENT }}', ctx.env.ENVIRONMENT === 'staging' ? 'staging.' : '')
    // .replaceAll('{{ URL }}', `https://${ctx.env.ENVIRONMENT === 'staging' ? 'staging.' : ''}image.luxass.dev`)
    .replaceAll('{{ OG_URL }}', `https://image.luxass.dev/api/image/random-emoji`)
  return ctx.html(index)
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
