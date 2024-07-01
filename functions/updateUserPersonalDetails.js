const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();
const corsHandler = cors({ origin: true });

exports.updateUserPersonalDetails = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).send("HTTP Method Not Allowed");
      return;
    }

    try {
      const { userDetails } = req.body;
      console.log("User details:", userDetails);

      if (!userDetails) {
        res.status(400).send("Missing product data or user email");
        return;
      }

      const userSnapshot = await db
        .collection("usersDetails")
        .where("email", "==", userDetails.email)
        .get();

      if (userSnapshot.empty) {
        console.log("No matching user found.");
        res.status(404).send("User not found");
        return;
      }

      const userId = userSnapshot.docs[0].id;
      const docRef = db.collection("usersDetails").doc(userId);
      const updated = admin.firestore.FieldValue.serverTimestamp();

      await docRef.update({
        fullName: userDetails.fullName,
        dateOfBirth: userDetails.dateOfBirth,
        reason: userDetails.reason,
        updated: updated,
      });

      console.log("Document successfully updated!");
      res.status(200).send("User details updated successfully");
    } catch (error) {
      console.log("Error updating user details: ", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

