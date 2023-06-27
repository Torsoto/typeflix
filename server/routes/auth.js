import express from "express";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
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
import xmlparser from "express-xml-bodyparser";

app.use(xmlparser());

const generateToken = (user, username, email) => {
  const payload = {
    uid: user.uid,
    username: username,
    email: email,
  };

  return jwt.sign(payload, secretKey, { expiresIn: "336h" });
};

const createThemesCollection = async (username, batch) => {
  const moviesRef = collection(db, "movies"); // /movies collection
  const moviesSnapshot = await getDocs(moviesRef); // get all movies of the project

  for (const movieDoc of moviesSnapshot.docs) {
    const movieName = movieDoc.id; // get each movie title
    const userMovieCollectionRef = collection(db, "users", username, movieName); // movie collection inside each user (for levels tracking)
    const userMovieCollectionSnapshot = await getDocs(userMovieCollectionRef);

    // if no specific movie inside username docs - recreate
    if (userMovieCollectionSnapshot.empty) {
      const levelsRef = collection(db, "movies", movieName, "levels");
      const levelsSnapshot = await getDocs(levelsRef);
      let firstLevel = true;
      let levelIndex = 1;
      levelsSnapshot.forEach((levelDoc) => {
        const levelDocRef = doc(userMovieCollectionRef, levelDoc.id);
        if (firstLevel) {
          batch.set(levelDocRef, { completed: true });
          firstLevel = false;
        } else {
          // second index in levels is lvl 10 (Because: lvl1, lvl10, lvl2, lvl3...)
          // is last boss and marks theme as completed
          if ([2].includes(levelIndex)) {
            batch.set(levelDocRef, {
              completed: false,
              bossWon: false,
              themeCompleted: false,
            });
            // 4, 7, 10 are mini boss levels (lvl3, 6 and 9)
            // they just track if boss has been defeated
          } else if ([4, 7, 10].includes(levelIndex)) {
            batch.set(levelDocRef, { completed: false, bossWon: false });
          } else {
            batch.set(levelDocRef, { completed: false });
          }
        }
        levelIndex++;
      });
    }
  }

  await batch.commit();
};

const handleLogin = async (email, username, password, res) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in successfully");

    const batch = writeBatch(db);
    await createThemesCollection(username, batch);
    console.log("Themes collections recreated successfully");

    const token = generateToken(userCredential.user, username, email);
    res.status(200).json({ token: token, username: userCredential.user.uid });
  } catch (error) {
    console.error("Error:", error.message);
    console.error(email, password);
    res.status(400).json({ error: error.message });
  }
};

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const lowercaseUsername = username.toLowerCase();

    const userDoc = await getDocs(collection(db, "users"));
    let usernameExists = false;

    userDoc.forEach((doc) => {
      if (doc.data().username === lowercaseUsername) {
        usernameExists = true;
      }
    });

    // username is used
    if (usernameExists) {
      console.log("Username already exists");
      res.status(401).json({ error: "Username already exists" });
    } else {
      try {
        createUserWithEmailAndPassword(auth, email, password)
          .then(async (userRecord) => {
            console.log("Successfully created new user:", userRecord.user.uid);

            const userDoc = doc(db, "users", lowercaseUsername); // user document reference
            const emailToUsernameDoc = doc(db, "emailToUsername", email); // emailToUsername document reference

            const batch = writeBatch(db);

            // create user data
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
              lastActivity: [],
            });

            // map email to username in /emailToUsername collection
            batch.set(emailToUsernameDoc, {
              username: lowercaseUsername,
            });

            // create themes collection in new username docs
            createThemesCollection(lowercaseUsername, batch).then(() => {
              console.log("User data stored in Firestore");
              // generate JWT
              const token = generateToken(
                userRecord.user,
                lowercaseUsername,
                email
              );
              res.status(200).json({
                token: token,
                uid: userRecord.user.uid,
              });
            });
          })
          .catch((error) => {
            console.log("Error creating new user:", error);
            res.status(500).json({ error: error.message });
          });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { identifier, password } = req.body;
  const lowercaseIdentifier = identifier.toLowerCase();

  const userDoc = await getDocs(collection(db, "users"));
  let email;

  // searches if there is a user with the identifier (username)
  userDoc.forEach((doc) => {
    if (doc.data().username === lowercaseIdentifier) {
      // email to the identifier (username) found
      email = doc.data().email;
    }
  });

  if (email) {
    // email for the given identifier (username) found
    await handleLogin(email, lowercaseIdentifier, password, res);
  } else {
    // email for the given identifier (username) not found, so the identifier is email
    try {
      // looks in emailToUsername map to find username to the email (identifier)
      const docSnapshot = await getDoc(
        doc(db, "emailToUsername", lowercaseIdentifier)
      );
      // takes username field of the email map
      const username = docSnapshot.data().username;
      // handles login, regenerates themes if needed.
      await handleLogin(lowercaseIdentifier, username, password, res);
    } catch (error) {
      console.error("Error getting username from email:", error);
      res.status(500).json({ error: error.message });
    }
  }
});

app.post("/validate", async (req, res) => {
  const token = req.body.token;
  if (token) {
    try {
      // secret is random hex (64), generated every startup
      const decoded = jwt.verify(token, secretKey);
      res.status(200).json({ valid: true, username: decoded.username });
    } catch (e) {
      res.status(401).json({ valid: false, error: e.message });
    }
  } else {
    res.status(400).json({ valid: false, error: "No token provided" });
  }
});

app.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
