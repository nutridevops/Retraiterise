
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createUser = functions.https.onRequest(async (req, res) => {
  try {
    const userRecord = await admin.auth().createUser({
      email: 'nutridevops@gmail.com',
      password: 'TemporaryPassword123!',
      displayName: 'Chris Massamba'
    });
    res.status(200).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
          