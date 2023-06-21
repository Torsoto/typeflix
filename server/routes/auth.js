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

        if (usernameExists) {
            console.log("Username already exists");
            res.status(401).send({ error: "Username already exists" });
        } else {
            try {
                createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userRecord) => {
                        console.log("Successfully created new user:", userRecord.user.uid);

                        const userDoc = doc(db, "users", lowercaseUsername);
                        const emailToUsernameDoc = doc(db, "emailToUsername", email);

                        const batch = writeBatch(db);

                        // Retrieve the levels for each movie and add them to the user's document
                        const moviesRef = collection(db, "movies");
                        const moviesSnapshot = await getDocs(moviesRef);

                        for (const movieDoc of moviesSnapshot.docs) {
                            const movieName = movieDoc.id;
                            const levelsRef = collection(db, "movies", movieName, "levels");
                            const levelsSnapshot = await getDocs(levelsRef);
                            const movieCollection = collection(db, "users", lowercaseUsername, movieName);
                            let firstLevel = true;
                            levelsSnapshot.forEach((levelDoc, index) => {
                                const levelDocRef = doc(movieCollection, levelDoc.id);
                                if (firstLevel) {
                                    batch.set(levelDocRef, { completed: true });
                                    firstLevel = false;
                                } else {
                                    console.log(index)
                                    batch.set(levelDocRef, { completed: false });
                                }
                            });
                        }

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

                        res.status(200).send({ token: token, uid: userRecord.user.uid });

                        return batch.commit();
                    })
                    .catch((error) => {
                        console.log("Error creating new user:", error);
                        res.status(500).send({ error: error.message });
                    });
            } catch (e) {
                res.status(500).send({ error: e.message });
            }
        }
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

app.post("/login", async (req, res) => {
    const { identifier, password } = req.body;
    const lowercaseIdentifier = identifier.toLowerCase();

    // First, attempt to find the user by username.
    const userDoc = await getDocs(collection(db, "users"));
    let email;

    userDoc.forEach((doc) => {
        if (doc.data().username === lowercaseIdentifier) {
            email = doc.data().email;
        }
    });

    if (email) {
        // User found by username, attempt to sign in with their email.
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                console.log("User logged in successfully");

                // Here we start to check and add missing movie collections
                const moviesRef = collection(db, "movies");
                const moviesSnapshot = await getDocs(moviesRef);

                const batch = writeBatch(db);

                for (const movieDoc of moviesSnapshot.docs) {
                    const movieName = movieDoc.id;
                    const userMovieCollectionRef = collection(db, "users", lowercaseIdentifier, movieName);
                    const userMovieCollectionSnapshot = await getDocs(userMovieCollectionRef);

                    // If the user movie collection does not exist or is empty, create it.
                    if (!userMovieCollectionSnapshot.exists || userMovieCollectionSnapshot.empty) {
                        const levelsRef = collection(db, "movies", movieName, "levels");
                        const levelsSnapshot = await getDocs(levelsRef);
                        let firstLevel = true;
                        levelsSnapshot.forEach((levelDoc) => {
                            const levelDocRef = doc(userMovieCollectionRef, levelDoc.id);
                            if (firstLevel) {
                                batch.set(levelDocRef, { completed: true });
                                firstLevel = false;
                            } else {
                                batch.set(levelDocRef, { completed: false });
                            }
                        });
                    }
                }

                await batch.commit();

                const payload = {
                    uid: userCredential.user.uid,
                    username: lowercaseIdentifier,
                    email: email,
                };

                const token = jwt.sign(payload, secretKey, { expiresIn: "336h" });

                res
                    .status(200)
                    .send({ token: token, username: userCredential.user.uid });
            })
            .catch((error) => {
                console.error("Error:", error.message);
                console.error(email, password);
                res.status(400).send({ error: error.message });
            });
    } else {
        // User not found by username, attempt to sign in with the identifier as email.
        signInWithEmailAndPassword(auth, lowercaseIdentifier, password)
            .then(async (userCredential) => {
                console.log("User logged in successfully");

                // Get the username corresponding to this email.
                getDoc(doc(db, "emailToUsername", lowercaseIdentifier))
                    .then(async (docSnapshot) => {
                        if (docSnapshot.exists()) {
                            const username = docSnapshot.data().username;

                            // Here we start to check and add missing movie collections
                            const moviesRef = collection(db, "movies");
                            const moviesSnapshot = await getDocs(moviesRef);

                            const batch = writeBatch(db);

                            for (const movieDoc of moviesSnapshot.docs) {
                                const movieName = movieDoc.id;
                                const userMovieCollectionRef = collection(db, "users", username, movieName);
                                const userMovieCollectionSnapshot = await getDocs(userMovieCollectionRef);

                                // If the user movie collection does not exist or is empty, create it.
                                if (!userMovieCollectionSnapshot.exists || userMovieCollectionSnapshot.empty) {
                                    const levelsRef = collection(db, "movies", movieName, "levels");
                                    const levelsSnapshot = await getDocs(levelsRef);
                                    let firstLevel = true;
                                    levelsSnapshot.forEach((levelDoc) => {
                                        const levelDocRef = doc(userMovieCollectionRef, levelDoc.id);
                                        if (firstLevel) {
                                            batch.set(levelDocRef, { completed: true });
                                            firstLevel = false;
                                        } else {
                                            batch.set(levelDocRef, { completed: false });
                                        }
                                    });
                                }
                            }

                            await batch.commit();

                            const payload = {
                                uid: userCredential.user.uid,
                                username: username,
                                email: lowercaseIdentifier,
                            };

                            const token = jwt.sign(payload, secretKey, { expiresIn: "336h" });

                            res.status(200).send({ token: token, username: username });
                        } else {
                            // Handle the case where no username was found for this email.
                            // This should ideally never happen if your signup code is working correctly.
                        }
                    })
                    .catch((error) => {
                        console.error("Error getting username from email:", error);
                        res.status(500).send({ error: error.message });
                    });
            })
            .catch((error) => {
                console.error("Error:", error.message);
                console.error(lowercaseIdentifier, password);
                res.status(400).send({ error: error.message });
            });
    }
});

app.post("/validate", async (req, res) => {
  const token = req.body.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      res.status(200).send({ valid: true, username: decoded.username });
    } catch (e) {
      res.status(401).send({ valid: false, error: e.message });
    }
  } else {
    res.status(400).send({ valid: false, error: "No token provided" });
  }
});

export default app;
