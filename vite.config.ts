import devServer from '@hono/vite-dev-server'
import honox from 'honox/vite'
import client from 'honox/vite/client'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [client()],
    }
  } else {
    return {
      plugins: [
        honox({
          devServer: {
            entry: 'app/server.ts',
          },
        }),
      ],
    }
  }
})
