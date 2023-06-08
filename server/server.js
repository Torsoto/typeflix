const express = require("express");
const app = express();
const firebaseConfig = require("./db/firebase.js");
const {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} = require("firebase/auth");
const auth = getAuth();

app.get("/", (req, res) => {
  res.send("A very professional backend server of Typeflix Corp.");
});

app.get("/signup", (req, res) => {
  const { email, password } = req.body;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Successfully created new user:", user.uid);
      res.status(200).send({ uid: user.uid }); // Send the UID to the client
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
      res.status(500).send({ error: error.message });
    });
});

app.listen(3000, () => {
  console.log("Typeflix listening on port http://localhost:3000/");
});
