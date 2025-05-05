import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const config = {
    apiKey: "AIzaSyC7azEPCdosToGrcSdkqZyqba8p-_SkDgY",
    authDomain: "sophias-tree.firebaseapp.com",
    databaseURL: "https://sophias-tree-default-rtdb.firebaseio.com",
    projectId: "sophias-tree",
    storageBucket: "sophias-tree.firebasestorage.app",
    messagingSenderId: "552586991524",
    appId: "1:552586991524:web:633995e5b2a21ac1889331",
    measurementId: "G-G5XV3LF9KG"
  };

  const app = initializeApp(config)
  const database = getDatabase(app)
  const auth = getAuth(app)

  return {
    provide: {
      firebase: app,
      database,
      auth
    }
  }
})