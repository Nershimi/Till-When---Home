const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

exports.saveUserPersonalDetails = functions.https.onRequest(
  async (req, res) => {
    cors(req, res, async () => {
      try {
        const userDetails = req.body;

        const created = admin.firestore.FieldValue.serverTimestamp();
        const dateOfBirth = admin.firestore.Timestamp.fromDate(new Date(userDetails.dateOfBirth));


        await db.collection("usersDetails").add({
          email: userDetails.email,
          dateOfBirth: dateOfBirth,
          fullName: userDetails.fullName,
          reason: userDetails.reason,
          created: created,
        });
        res.status(200).send("User's details saved successfully");
      } catch (error) {
        console.log("Error adding user details: ", error);
        res.status(500).send("Internal Server Error");
      }
    });
  }
);
