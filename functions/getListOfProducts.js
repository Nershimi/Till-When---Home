const functions = require("firebase-functions");
const admin = require("firebase-admin");
const corsHandler = require("cors")({ origin: true }); 
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

exports.getTodayProducts = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async ()  => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      const todayStartTimestamp = admin.firestore.Timestamp
          .fromDate(todayStart);
      const todayEndTimestamp = admin.firestore.Timestamp.fromDate(todayEnd);
      try {
        const querySnapshot = await db.collection("productsOfUsers")
            .where("expiryDate", ">=", todayStartTimestamp)
            .where("expiryDate", "<=", todayEndTimestamp)
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
    