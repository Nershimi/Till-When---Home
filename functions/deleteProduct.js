const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { firestore } = require("firebase-admin");
const corsHandler = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

exports.deleteProduct = functions.https.onRequest(async (request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
      return;
    }

    const { documentId } = request.body;

    if (!documentId) {
      response.status(400).send("Bad request: documentId is require");
      return;
    }

    try {
      const result = await firestore()
        .collection("productsOfUsers")
        .doc(documentId)
        .delete();
      response
        .status(200)
        .send(`Document with ID: ${documentId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting document: ", error);
      response.status(500).send("Internal Server Error");
    }
  });
});
