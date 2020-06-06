exports.handler = async (event, context) => {
  console.log("DEBUG: function has fired")
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "debugging in prod",
    }),
  }
}
