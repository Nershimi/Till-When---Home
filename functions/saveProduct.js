const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true}); // Add this line

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.addNewProduct = functions.https.onRequest(async (request, response) => {
  // Use CORS middleware
  cors(request, response, async () => {
    try {
      const product = request.body;

      // Adding the current timestamp for the 'created' field
      const created = admin.firestore.FieldValue.serverTimestamp();
      const expiryDateTimestamp = admin.firestore.Timestamp.fromDate(
          new Date(product.expiryDate));

      // Creating a new product document in the 'productsOfUsers' collection
      await db.collection("productsOfUsers").add({
        productsType: product.productsType,
        productName: product.productName,
        company: product.company,
        expiryDate: expiryDateTimestamp,
        created,
      });

      response.status(200).send("Product added successfully");
    } catch (error) {
      console.error("Error adding product:", error);
      response.status(500).send("Internal Server Error");
    }
  });
});
