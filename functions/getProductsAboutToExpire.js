const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();
const corsHandler = cors({ origin: true });

/**
 * Get: req, res
 * return: obj of products from database
 * The function get by using query all the product that going to expire in 3 days.
 */
exports.getProductsAboutToExpire = functions.https.onRequest(
  (request, response) => {
    corsHandler(request, response, async () => {
      try{
        const { userEmail } = request.body;
        console.log("user email: ", userEmail);
  
        if (!userEmail) {
          console.log("Missing user email.", userEmail);
          response.status(400).send("Missing user email. check if user connect");
          return;
        }

        const todayStart = new Date();
        const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
        const futureDate = new Date(
          todayStart.getTime() + threeDaysInMilliseconds
        );
        const todayStartTimestamp =
          admin.firestore.Timestamp.fromDate(todayStart);
        const futureDateTimestamp =
          admin.firestore.Timestamp.fromDate(futureDate);

          const userSnapshot = await db
          .collection("usersDetails")
          .where("email", "==", userEmail)
          .get();
        if (userSnapshot.empty) {
          console.log("No matching user found.");
          response.status(404).send("User not found");
          return;
        }
        const userId = userSnapshot.docs[0].id;
        console.log("this is ID:", userId);
  
        const querySnapshot = await db
          .collection("productsOfUsers")
          .where("expiryDate", ">=", todayStartTimestamp)
          .where("expiryDate", "<=", futureDateTimestamp)
          .where("userId", "==", userId)
          .get();
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({ id: doc.id, ...doc.data() });
        });
        console.log("Succeeds get all relevant products");
        response.status(200).json(products);
        
      } catch (error) {
        console.log("Error getting documents: ", error);
        response.status(500).send("Error fetching products");
      }
    });
  }
);
