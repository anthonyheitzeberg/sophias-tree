// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-04',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  // colorMode: {
  //   classSuffix: '',
  //   preference: 'light',
  //   fallback: 'light'
  // },
  // runtimeConfig: {
  //   public: {
  //     firebaseApiKey: process.env.FIREBASE_API_KEY,
  //     firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
  //     firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
  //     firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  //     firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  //     firebaseAppId: process.env.FIREBASE_APP_ID,
  //     firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL
  //   }
  // },
  app: {
    head: {
      title: "Sophia's Tree of Love",
      meta: [
        { name: 'description', content: 'A growing collection of thoughts and compliments for Sophia' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  nitro: {
    firebase: {
        nodeVersion: "20",
        gen: 2,
    },
    preset: "firebase"
  }
})