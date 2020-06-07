import firebaseDb from "../src/lib/db-admin"

exports.handler = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false
  const db = firebaseDb.database()
  const { id } = event.queryStringParameters
  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing "id" query parameter',
      }),
    }
  }

  const ref = db.ref(process.env.FIREBASE_DB_TABLE_NAME).child(id)
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
