const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corsHandler = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 *
 */
exports.deleteProduct = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
      return;
    }

    const { documentsId } = request.body;

    if (!documentsId || !Array.isArray(documentsId)) {
      response
        .status(400)
        .send("Bad request: documentId is required and should be an array");
      return;
    }
    console.log(" I get this", documentsId);

    try {
      const deletePromises = documentsId.map((docId) => {
        return admin
          .firestore()
          .collection("productsOfUsers")
          .doc(docId)
          .delete();
      });

      await Promise.all(deletePromises);

      response.status(200).json({
        massage: `Document with ID: ${documentsId.join(
          ", "
        )} deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      response.status(500).send("Internal Server Error");
    }
  });
});
