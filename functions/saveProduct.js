const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.addNewProduct = functions.https.onRequest(async (request, response) => {
  try {
    const product = request.body;

    if (!product.productName || !product.company || !product.expiryDate) {
      response.status(400).send("Bad Request: Missing required fields");
      return;
    }
    if (!product || !product.productsType) {
      // Check if required fields are present in the request
      response.status(400).send("Bad Request: Missing required fields");
      return;
    }

    // Adding the current timestamp for the 'created' field
    const created = admin.firestore.FieldValue.serverTimestamp();

    // Creating a new product document in the 'productsOfUsers' collection
    await db.collection("productsOfUsers").add({
      productsType: product.productsType,
      productName: product.productName,
      company: product.company,
      expiryDate: product.expiryDate,
      created,
    });

    response.status(200).send("Product added successfully");
  } catch (error) {
    console.error("Error adding product:", error);
    response.status(500).send("Internal Server Error");
  }
});

// const {onRequest} = require("firebase-functions/v2/https");
// const {addNewProduct} = require("../backend/addProduct.js");

// exports.savingProduct = onRequest(async (request, response) => {
//   try {
//     const product = request.body;
//     await addNewProduct(product);
//     response.status(200).send("Product added successfully");
//   } catch (error) {
//     console.error(error.message);
//     response.send("Internal server error");
//   }
// });
