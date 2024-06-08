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
 * The function get by using query all the product that expired.
 */
exports.getExpiredProducts = functions.https.onRequest((request, response) => {
  const start = Date.now();
  corsHandler(request, response, async () => {
    try {
      const { userEmail } = request.body;
      console.log("user email: ", userEmail);

      if (!userEmail) {
        console.log("Missing user email.", userEmail);
        response.status(400).send("Missing user email. check if user connect");
        return;
      }

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayStartTimestamp =
        admin.firestore.Timestamp.fromDate(todayStart);

      console.log(`Timestamp generation took ${Date.now() - start}ms`);

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

      console.log(`User query took ${Date.now() - start}ms`);

      const querySnapshot = await db
        .collection("productsOfUsers")
        .where("expiryDate", "<", todayStartTimestamp)
        .where("userId", "==", userId)
        .get();
      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() });
        console.log("Succeeds get all relevant products");
      });
      console.log("Fetched products:", products);
      console.log(`Products query took ${Date.now() - start}ms`);
      response.status(200).json(products);
    } catch (error) {
      if (
        error.code === 9 &&
        error.details &&
        error.details.includes("The query requires an index")
      ) {
        console.error("Index required: ", error.details);
        response
          .status(400)
          .send(
            "Firestore index is missing or not yet enabled. Please check Firestore indexes."
          );
      } else {
        console.error("Error fetching products: ", error);
        response.status(500).send("Error fetching products");
      }
    }
  });
});
