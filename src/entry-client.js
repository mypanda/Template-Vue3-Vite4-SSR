import { createApp } from './main'

const { app, router, pinia } = createApp()

if (window.__INITIAL_STATE__) {
  pinia.state.value = JSON.parse(window.__INITIAL_STATE__)
}

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount('#app')

  console.log('hydrated')
})