import express from "express";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    collection,
    writeBatch,
} from "firebase/firestore";
import "../db/firebase.mjs";
import jwt from "jsonwebtoken";
import secretKey from "./secretKey.js";

const auth = getAuth();
const db = getFirestore();
const app = express.Router();

const usernameExists = async (username) => {
    const userDoc = await getDocs(collection(db, "users"));
    return userDoc.docs.some(doc => doc.data().username === username);
};

const getThemes = async () => {
    const moviesSnapshot = await getDocs(collection(db, "movies"));
    const themes = {};

    for (const movieDoc of moviesSnapshot.docs) {
        const movieName = movieDoc.id;
        const levelsSnapshot = await getDocs(collection(db, "movies", movieName, "levels"));
        const levels = {};

        levelsSnapshot.docs.forEach((levelDoc, index) => {
            levels[levelDoc.id] = index === 0;
        });

        themes[movieName] = { levels: levels };
    }

    return themes;
};

const getUserByEmail = async (email) => {
    const userDoc = await getDocs(collection(db, "users"));
    return userDoc.docs.find(doc => doc.data().email === email);
};

app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const lowercaseUsername = username.toLowerCase();

        if (await usernameExists(lowercaseUsername)) {
            console.log("Username already exists");
            return res.status(401).send({ error: "Username already exists" });
        }

        try {
            const userRecord = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Successfully created new user:", userRecord.user.uid);

            const userDoc = doc(db, "users", lowercaseUsername);
            const emailToUsernameDoc = doc(db, "emailToUsername", email);

            const batch = writeBatch(db);
            const themes = await getThemes();

            batch.set(userDoc, {
                username: lowercaseUsername,
                email: email,
                userid: userRecord.user.uid,
                following: [],
                followers: [],
                avatar: `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${lowercaseUsername}`,
                bestwpm: 0,
                avgwpm: 0,
                gamesplayed: 0,
                bosses: 0,
                themescompleted: 0,
                lastplayed: [],
                themes: themes,
            });

            batch.set(emailToUsernameDoc, {
                username: lowercaseUsername,
            });

            console.log("User data stored in Firestore");

            const payload = {
                uid: userRecord.user.uid,
                username: lowercaseUsername,
                email: email,
            };

            const token = jwt.sign(payload, secretKey, {
                expiresIn: "336h",
            });

            await batch.commit();
            return res.status(200).send({ token: token, uid: userRecord.user.uid });
        } catch (error) {
            console.log("Error creating new user:", error);
            return res.status(500).send({ error: error.message });
        }
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
});

app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  const lowercaseIdentifier = identifier.toLowerCase();

  let userDoc = await getUserByEmail(lowercaseIdentifier);
  let email = userDoc ? userDoc.data().email : null;

  if (!email) {
    // If email is null, user not found by username, attempt to sign in with the identifier as email.
    email = lowercaseIdentifier;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully");

    let username = lowercaseIdentifier;
    if (!userDoc) {
      const docSnapshot = await getDoc(doc(db, "emailToUsername", lowercaseIdentifier));
      if (docSnapshot.exists()) {
        username = docSnapshot.data().username;
      }
    }

    const payload = {
      uid: userCredential.user.uid,
      username: username,
      email: email,
    };

    const token = jwt.sign(payload, secretKey, { expiresIn: "336h" });
    res.status(200).send({ token: token, username: username });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(400).send({ error: error.message });
  }
});

app.post("/validate", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).send({ valid: false, error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    res.status(200).send({ valid: true, username: decoded.username });
  } catch (e) {
    res.status(401).send({ valid: false, error: e.message });
  }
});

export default app;