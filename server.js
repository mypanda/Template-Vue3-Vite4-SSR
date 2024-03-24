import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const isTest = process.env.VITEST

export async function createServer(root = process.cwd(), isProd = process.env.NODE_ENV === 'production', hmrPort) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const resolve = p => path.resolve(__dirname, p)

  const indexProd = isProd ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8') : ''
  const manifest = isProd ? JSON.parse(fs.readFileSync(resolve('dist/client/ssr-manifest.json'), 'utf-8')) : {}

  const app = express()

  let vite
  if (!isProd) {
    const viteConfig = {
      base: '/',
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          usePolling: true,
          interval: 100
        },
        hmr: {
          port: hmrPort
        }
      },
      appType: 'custom',
      envFile: true
    }

    // vite = (await import('vite')).createServer(viteConfig)
    vite = await createViteServer(viteConfig)

    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use('/', (await import('serve-static')).default(resolve('dist/client'), { index: false }))
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
  
      let template, render
      if (!isProd) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.js')).render
      } else {
        template = indexProd
        render = (await import('./dist/server/entry-server.js')).render
      }
  
      const [appHtml, pinia, preloadLinks] = await render(url, manifest)
  
      const html = template
        .replace(`<!--preload-links-->`, preloadLinks)
        .replace(`<!--app-html-->`, appHtml)
        .replace('<!--pinia-state-->', pinia)
  
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      vite && vite.ssrFixStacktrace(error)
      console.log(error.stack)
      res.status(500).end(error.stack)
    }
  
    return { app, vite }
  })

  return { app, vite }
}


if (!isTest) {
  createServer().then(({ app }) => {
    app.listen(6173, _ => {
      console.log(`http://localhost:6173`)
    })
  })
}