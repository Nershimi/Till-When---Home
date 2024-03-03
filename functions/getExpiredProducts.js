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
 * The function get by using query all the product that expired.
 */
exports.getExpiredProducts = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async ()  => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayStartTimestamp = admin.firestore.Timestamp
          .fromDate(todayStart);
      try {
        const querySnapshot = await db.collection("productsOfUsers")
            .where("expiryDate", "<", todayStartTimestamp)
            .get();
        const products = [];
        querySnapshot.forEach((doc) => {
          products.push({id: doc.id, ...doc.data()});
          console.log("Succeeds get all relevant products");
        });
        response.status(200).json(products);
      } catch (error) {
        console.log("Error getting documents: ", error);
        response.status(500).send("Error fetching products");
      }
    })});
    