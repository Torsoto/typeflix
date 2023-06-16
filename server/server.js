import express from "express";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  deleteUser,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import "./db/firebase.mjs";
import cors from "cors";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import * as https from "https";

const app = express();
const auth = getAuth();
const db = getFirestore();
const batch = writeBatch(db);
const secretKey = crypto.randomBytes(64).toString("hex");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

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
          .then((userRecord) => {
            console.log("Successfully created new user:", userRecord.user.uid);

            const userDoc = doc(db, "users", lowercaseUsername);
            const emailToUsernameDoc = doc(db, "emailToUsername", email);

            const batch = writeBatch(db);
            batch.set(userDoc, {
              username: lowercaseUsername,
              email: email,
              userid: userRecord.user.uid,
              friends: [],
              avatar: `https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=${lowercaseUsername}`,
              bestwpm: 0,
              levels: [],
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
      .then((userCredential) => {
        console.log("User logged in successfully");

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
      .then((userCredential) => {
        console.log("User logged in successfully");

        // Get the username corresponding to this email.
        getDoc(doc(db, "emailToUsername", lowercaseIdentifier))
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const username = docSnapshot.data().username;

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

app.put("/updateavatar", async (req, res) => {
  const { token, newAvatar } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);
    const { username } = decoded;

    // Get the user documents from Firestore
    const userDoc = await getDoc(doc(db, "users", username));

    if (!userDoc.exists()) {
      res.status(404).send({ error: "User not found" });
      return;
    }

    // Update the avatar field in the user's document
    const updatedUser = { ...userDoc.data(), avatar: newAvatar };
    await setDoc(doc(db, "users", username), updatedUser);

    res.status(200).send({ message: "Avatar updated successfully" });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/movies", async (req, res) => {
  try {
    const moviesRef = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesRef);

    const moviesList = [];
    moviesSnapshot.forEach((doc) => {
      const movieData = {
        title: doc.id,
        poster: doc.data().poster,
      };
      moviesList.push(movieData);
    });

    res.status(200).json(moviesList);
  } catch (error) {
    console.error("Error retrieving movie list:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/movies/:movie", async (req, res) => {
  try {
    const { movie } = req.params;
    const movieRef = doc(db, `movies/${movie}`);
    const movieSnapshot = await getDoc(movieRef);

    if (!movieSnapshot.exists()) {
      res.status(404).send({ error: `Movie ${movie} not found` });
      return;
    }

    const gradientColor = movieSnapshot.data().gradientColor;

    const levelsRef = collection(db, `movies/${movie}/levels`);
    const levelsSnapshot = await getDocs(levelsRef);
    const levelsCount = levelsSnapshot.size;

    res.status(200).json({ count: levelsCount, color: gradientColor });
  } catch (error) {
    console.error(
      `Error retrieving levels or gradient color for movie ${movie}:`,
      error
    );
    res.status(500).send({ error: error.message });
  }
});

function decodeMovieName(encodedMovieName) {
  let decodedMovieName = "";
  try {
    decodedMovieName = decodeURIComponent(encodedMovieName);
  } catch (error) {
    // Handle any decoding errors here
    console.error("Error decoding movie name:", error);
  }
  return decodedMovieName;
}

app.get("/movies/:movie/levels/:level", async (req, res) => {
  try {
    const { movie, level } = req.params;
    const decodedMovieName = decodeMovieName(movie);
    const levelRef = doc(db, `movies/${decodedMovieName}/levels/lvl${level}`);
    const levelSnapshot = await getDoc(levelRef);

    if (!levelSnapshot.exists()) {
      res.status(404).send({ error: "Level not found" });
      return;
    }

    const levelData = levelSnapshot.data();
    const text = levelData.text || "There is no text for this level yet";
    const img = levelData.img || "https://i.imgur.com/7byaekD.png";
    const time = levelData.time || 60;

    if (!text) {
      res.status(404).send({ error: "Text field not found" });
      return;
    }

    if (!img) {
      res.status(404).send({ error: "Img field not found" });
      return;
    }

    if (!time) {
      res.status(404).send({ error: "Time field not found" });
    }

    res.status(200).json({ text: text, img: img, time: time });
  } catch (error) {
    console.error(`Error retrieving level for movie: `, error);
    res.status(500).send({ error: error.message });
  }
});
app.get("/training", (req, res) => {
  const options = {
    hostname: "random-word-api.herokuapp.com",
    path: "/word?number=200",
    method: "GET",
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const words = JSON.parse(data);
      res.status(200).json({ words });
    });
  });

  request.on("error", (error) => {
    console.error("Error retrieving random words:", error);
    res.status(500).send({ error: error.message });
  });

  request.end();
});

//for changing user data
app.post("/edit", async (req, res) => {
  const { token, username, email, password } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);
    const { uid } = decoded;

    // Update user profile
    await updateProfile(auth.currentUser, {
      displayName: username,
    });

    // Update user email
    if (email) {
      await updateEmail(auth.currentUser, email);
    }

    // Update user password
    if (password) {
      await updatePassword(auth.currentUser, password);
    }

    // Update user document in Firestore
    await setDoc(doc(db, "users", uid), {
      username: username.toLowerCase(),
      email: email || decoded.email,
      userid: uid,
    });

    res.status(200).send({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send({ error: error.message });
  }
});

//for deleting user account
app.delete("/delete", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);
    const { uid } = decoded;

    // Delete user document from Firestore
    await deleteDoc(doc(db, "users", uid));

    // Delete user account
    await deleteUser(auth.currentUser);

    res.status(200).send({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).send({ error: error.message });
  }
});

app.get("/weather/vienna", (req, res) => {
  const options = {
    hostname: "weather.visualcrossing.com",
    path: "/VisualCrossingWebServices/rest/services/timeline/Vienna?unitGroup=metric&key=UKYSD9QUBK9XXZVU3JVK9VTFG&contentType=json",
    method: "GET",
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const weatherData = JSON.parse(data);
      const currentConditions = weatherData.days[0].conditions;
      const temperature = weatherData.days[0].temp;
      const description = weatherData.days[0].description;

      res.status(200).json({ currentConditions, temperature, description });
    });
  });

  request.on("error", (error) => {
    console.error("Error retrieving weather data:", error);
    res.status(500).send({ error: error.message });
  });

  request.end();
});

app.get("/time/vienna", (req, res) => {
  const options = {
    hostname: "worldtimeapi.org",
    path: "/api/timezone/Europe/Vienna",
    method: "GET",
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const timeData = JSON.parse(data);
      const datetime = timeData.datetime;

      res.status(200).json({ datetime });
    });
  });

  request.on("error", (error) => {
    console.error("Error retrieving time data:", error);
    res.status(500).send({ error: error.message });
  });

  request.end();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});

app.get("/:username", async (req, res) => {
  const { username } = req.params;
  const lowercaseUsername = username.toLowerCase();

  try {
    // Get the user documents from Firestore
    const userDocs = await getDocs(collection(db, "users"));
    let userData = null;

    userDocs.forEach((doc) => {
      if (doc.data().username === lowercaseUsername) {
        userData = doc.data();
      }
    });

    if (userData) {
      // Sort the properties of the userData object
      const sortedUserData = {};
      Object.keys(userData)
        .sort()
        .forEach((key) => {
          sortedUserData[key] = userData[key];
        });

      // If the user exists, send their data in the response
      res.status(200).json(sortedUserData);
    } else {
      // If the user doesn't exist, send a 404 error
      res
        .status(404)
        .send({
          error:
            "User not found (You are sending request to /:username Endpoint)",
        });
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).send({ error: error.message });
  }
});
