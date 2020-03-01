/* eslint-disable no-undef */
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  new RegExp('/api/random-word'), ({ url, event, params }) => {
    return fetch(event.request)
      .catch(() => {
        console.info('Random word api cannot be reached. Using fallback instead')
        const randomWord = Math.random().toFixed(10).substring(2)
        const resp = new Response(JSON.stringify(randomWord), {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        return resp
      })
  })
