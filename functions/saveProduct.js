const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true }); // Add this line

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.addNewProduct = functions.https.onRequest(async (request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).send("HTTP Method Not Allowed");
      return;
    }

    try {
      const { productData, userEmail } = request.body;
      console.log("User Input:", productData); // Debugging
      console.log("User Email:", userEmail); // Debugging

      if (!productData || !userEmail) {
        console.log("This is the email: ", userEmail);
        console.log("This is the product: ", productData);
        response.status(400).send("Missing product data or user email");
        return;
      }

      const addNewProductWithUser = async (productData, userEmail) => {
        const userSnapshot = await db
          .collection("usersDetails")
          .where("email", "==", userEmail)
          .get();
        if (userSnapshot.empty) {
          console.log("No matching user found.");
          return "User not found";
        }
        const userId = userSnapshot.docs[0].id;

        const productDocument = {
          ...productData,
          userId: userId,
          created: admin.firestore.FieldValue.serverTimestamp(),
          expiryDate: admin.firestore.Timestamp.fromDate(
            new Date(productData.expiryDate)
          ),
        };
        await db.collection("productsOfUsers").add(productDocument);
        return "Product added successfully";
      };

      const result = await addNewProductWithUser(productData, userEmail);
      response.status(200).send(result);
    } catch (error) {
      console.error("Error adding product:", error);
      response.status(500).send("Internal Server Error");
    }
  });
});
