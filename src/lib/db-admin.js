const admin = require("firebase-admin")

// Due to the way the key is provided by Netlify
// in production, we need to use the ternary
const config = {
  credential: admin.credential.cert({
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key:
      process.env.FIREBASE_PRIVATE_KEY[0] === "-"
        ? process.env.FIREBASE_PRIVATE_KEY
        : JSON.parse(process.env.FIREBASE_PRIVATE_KEY),
    project_id: process.env.FIREBASE_PROJECT_ID,
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
}

export default !admin.apps.length ? admin.initializeApp(config) : admin.app()
