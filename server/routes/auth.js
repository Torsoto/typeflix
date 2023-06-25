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
import xmlparser from 'express-xml-bodyparser'
import xmlbuilder from "xmlbuilder";

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
    // Here we start to check and add missing movie collections
    const moviesRef = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesRef);

    for (const movieDoc of moviesSnapshot.docs) {
        const movieName = movieDoc.id;
        const userMovieCollectionRef = collection(db, "users", username, movieName);
        const userMovieCollectionSnapshot = await getDocs(userMovieCollectionRef);

        // If the user movie collection does not exist or is empty, create it.
        if (userMovieCollectionSnapshot.empty) {
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
};

const handleLogin = async (email, username, password, res, acceptHeader) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in successfully");

        const batch = writeBatch(db);
        await createThemesCollection(username, batch);
        console.log("Themes collections recreated successfully");

        const token = generateToken(userCredential.user, username, email);

        if (acceptHeader === "application/xml") {
            // Convert the data to an XML string
            const xml = xmlbuilder
                .create({ token: token, username: userCredential.user.uid })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(200).send(xml);
        } else {
            // If the Accept header is not "application/xml", send JSON in the response
            res.status(200).json({ token: token, username: userCredential.user.uid });
        }
    } catch (error) {
        console.error("Error:", error.message);
        console.error(email, password);

        if (acceptHeader === "application/xml") {
            // Convert the error message to an XML string
            const xml = xmlbuilder
                .create({ error: error.message })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(400).send(xml);
        } else {
            // If the Accept header is not "application/xml", send JSON in the response
            res.status(400).json({ error: error.message });
        }
    }
};


app.post("/signup", async (req, res) => {
    const acceptHeader = req.headers["accept"];
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
            if (acceptHeader === "application/xml") {
                // Convert the error message to an XML string
                const xml = xmlbuilder
                    .create({ error: "Username already exists" })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(401).send(xml);
            } else {
                // If the Accept header is not "application/xml", send JSON in the response
                res.status(401).json({ error: "Username already exists" });
            }
        } else {
            try {
                createUserWithEmailAndPassword(auth, email, password)
                    .then(async (userRecord) => {
                        console.log("Successfully created new user:", userRecord.user.uid);

                        const userDoc = doc(db, "users", lowercaseUsername);
                        const emailToUsernameDoc = doc(db, "emailToUsername", email);

                        const batch = writeBatch(db);

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
                            lastActivity: [],
                        });

                        batch.set(emailToUsernameDoc, {
                            username: lowercaseUsername,
                        });

                        createThemesCollection(lowercaseUsername, batch).then(() => {
                            console.log("User data stored in Firestore");
                            const token = generateToken(userRecord.user, lowercaseUsername, email);
                            if (acceptHeader === "application/xml") {
                                // Convert the success message to an XML string
                                const xml = xmlbuilder
                                    .create({
                                        token: token,
                                        uid: userRecord.user.uid,
                                    })
                                    .end({ pretty: true });

                                // Set the Content-Type header to "application/xml"
                                res.setHeader("Content-Type", "application/xml");

                                // Send the XML string in the response
                                res.status(200).send(xml);
                            } else {
                                // If the Accept header is not "application/xml", send JSON in the response
                                res.status(200).json({
                                    token: token,
                                    uid: userRecord.user.uid,
                                });
                            }
                        });
                    })
                    .catch((error) => {
                        console.log("Error creating new user:", error);
                        if (acceptHeader === "application/xml") {
                            // Convert the error message to an XML string
                            const xml = xmlbuilder
                                .create({ error: error.message })
                                .end({ pretty: true });

                            // Set the Content-Type header to "application/xml"
                            res.setHeader("Content-Type", "application/xml");

                            // Send the XML string in the response
                            res.status(500).send(xml);
                        } else {
                            // If the Accept header is not "application/xml", send JSON in the response
                            res.status(500).json({ error: error.message });
                        }
                    });
            } catch (e) {
                if (acceptHeader === "application/xml") {
                    // Convert the error message to an XML string
                    const xml = xmlbuilder
                        .create({ error: error.message })
                        .end({ pretty: true });

                    // Set the Content-Type header to "application/xml"
                    res.setHeader("Content-Type", "application/xml");

                    // Send the XML string in the response
                    res.status(500).send(xml);
                } else {
                    // If the Accept header is not "application/xml", send JSON in the response
                    res.status(500).json({ error: error.message });
                }
            }
        }
    } catch (e) {
        if (acceptHeader === "application/xml") {
            // Convert the error message to an XML string
            const xml = xmlbuilder
                .create({ error: error.message })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send(xml);
        } else {
            // If the Accept header is not "application/xml", send JSON in the response
            res.status(500).json({ error: error.message });
        }
    }
});

app.post("/login", async (req, res) => {
    const acceptHeader = req.headers["accept"];
    const { identifier, password } = req.body;
    const lowercaseIdentifier = identifier.toLowerCase();

    const userDoc = await getDocs(collection(db, "users"));
    let email;

    console.log(identifier, lowercaseIdentifier, password);

    userDoc.forEach((doc) => {
        if (doc.data().username === lowercaseIdentifier) {
            email = doc.data().email;
            console.log("try");
        }
        console.log("try");
    });

    if (email) {
        // User found by username
        await handleLogin(email, lowercaseIdentifier, password, res, acceptHeader);
    } else {
        console.log("try2")
        // User not found by username, attempt to sign in with the identifier as email
        try {
            const docSnapshot = await getDoc(doc(db, "emailToUsername", lowercaseIdentifier));
            const username = docSnapshot.data().username;
            await handleLogin(lowercaseIdentifier, username, password, res, acceptHeader);
        } catch (error) {
            console.error("Error getting username from email:", error);
            if (acceptHeader === "application/xml") {
                // Convert the error message to an XML string
                const xml = xmlbuilder
                    .create({ error: error.message })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(500).send(xml);
            } else {
                // If the Accept header is not "application/xml", send JSON in the response
                res.status(500).json({ error: error.message });
            }
        }
    }
});


app.post("/validate", async (req, res) => {
    const acceptHeader = req.headers["accept"];
    const token = req.body.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, secretKey);
            if (acceptHeader === "application/xml") {
                // Convert the success message to an XML string
                const xml = xmlbuilder
                    .create({
                        valid: true,
                        username: decoded.username,
                    })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(200).send(xml);
            } else {
                // If the Accept header is not "application/xml", send JSON in the response
                res.status(200).json({ valid: true, username: decoded.username });
            }
        } catch (e) {
            if (acceptHeader === "application/xml") {
                // Convert the error message to an XML string
                const xml = xmlbuilder
                    .create({ valid: false, error: e.message })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(401).send(xml);
            } else {
                // If the Accept header is not "application/xml", send JSON in the response
                res.status(401).json({ valid: false, error: e.message });
            }
        }
    } else {
        if (acceptHeader === "application/xml") {
            // Convert the error message to an XML string
            const xml = xmlbuilder
                .create({ valid: false, error: "No token provided" })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(400).send(xml);
        } else {
            // If the Accept header is not "application/xml", send JSON in the response
            res.status(400).json({ valid: false, error: "No token provided" });
        }
    }
});


export default app;
