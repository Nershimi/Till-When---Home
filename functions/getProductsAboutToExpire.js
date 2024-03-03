const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corsHandler = require("cors")({ origin: true });
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * Get: req, res
 * return: obj of products from database
 * The function get by using query all the product that going to expire in 3 days.
 */
exports.getProductsAboutToExpire = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    const todayStart = new Date();
    const threeDaysInMilliseconds = 3 * 24 * 60 * 60 * 1000;
    const futureDate = new Date(todayStart.getTime() + threeDaysInMilliseconds);
    const todayStartTimestamp = admin.firestore.Timestamp.fromDate(todayStart);
    const futureDateTimestamp = admin.firestore.Timestamp.fromDate(futureDate);
    try {
      const querySnapshot = await db
        .collection("productsOfUsers")
        .where("expiryDate", ">=", todayStartTimestamp)
        .where("expiryDate", "<=", futureDateTimestamp)
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
});
