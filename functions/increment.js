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

admin.initializeApp(config)

exports.handler = async (event, context, callback) => {
  const { id } = event.queryStringParameters
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing "id" query parameter',
      }),
    }
  }

  const ref = admin.database().ref(process.env.FIREBASE_DB_TABLE_NAME).child(id)
  const { snapshot } = await ref.transaction(currentViews => {
    if (currentViews === null) {
      return 1
    }

    return currentViews + 1
  })

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      pageId: id,
      totalViews: snapshot.val(),
    }),
  })
}
