const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

/**
 * get:userToken
 * return: obj - user details
 * get the user token and get his doc from collection by email.
 * push the dot to array and return.
 */
exports.getUserDetails = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const idToken = req.headers.authorization;
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const userEmail = decodedToken.email;

      const querySnapshot = await db
        .collection("usersDetails")
        .where("email", "==", userEmail)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return res.status(404).json({ error: "User not found" });
      }

      const userDetails = querySnapshot.docs[0].data();

      res.json({ userDetails });
    } catch (error) {
      console.log("Error getting document: ", error);
      res.status(500).send("Error fetching userDetails");
    }
  });
});
