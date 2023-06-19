import express from "express";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import {
  deleteUser,
  getAuth,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";

import "../db/firebase.mjs";
import secretKey from "./secretKey.js";
import jwt from "jsonwebtoken";

const db = getFirestore();
const auth = getAuth();
const app = express.Router();

app.get("/user/:username", async (req, res) => {
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
      res.status(404).send({
        error:
          "User not found (You are sending request to /:username Endpoint)",
      });
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    res.status(500).send({ error: error.message });
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

app.get("/getAvatar", async (req, res) => {
  try {
    const { username } = req.query;

    const userDocRef = doc(db, "users", username);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      res.status(404).send({ error: "User does not exist" });
    } else {
      const userData = userDoc.data();
      res.status(200).send(userData.avatar);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.post("/follow", async (req, res) => {
  const { username, toFollowUsername } = req.body;

  try {
    const userDoc = doc(db, "users", username);
    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) {
      res.status(404).send({ error: "User not found" });
    } else {
      const userData = userSnapshot.data();
      if (userData.following.includes(toFollowUsername)) {
        res.status(409).send({ message: "Following already added" });
      } else {
        userData.following.push(toFollowUsername);
        await updateDoc(userDoc, { following: userData.following });
        res.status(200).send({ message: "Following added successfully" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/unfollow", async (req, res) => {
  const { username, toUnfollowUsername } = req.body;

  try {
    const userDoc = doc(db, "users", username);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      res.status(404).send({ error: "User not found" });
    } else {
      const userData = userSnapshot.data();

      if (!userData.following.includes(toUnfollowUsername)) {
        res.status(409).send({ message: "User not found" });
      } else {
        const updatedFollowing = userData.following.filter(
          (friend) => friend !== toUnfollowUsername
        );
        await updateDoc(userDoc, { following: updatedFollowing });
        res.status(200).send({ message: "Friend removed successfully" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/getFollowing", async (req, res) => {
  try {
    const { username } = req.query;

    const userDocRef = doc(db, "users", username);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      res.status(404).send({ error: "User does not exist" });
    } else {
      const userData = userDoc.data();
      res.status(200).send(userData.following);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

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

app.delete("/delete", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);
    const { username } = decoded;

    // Delete user document from Firestore
    await deleteDoc(doc(db, "users", username));

    // Delete user account
    await deleteUser(auth.currentUser);

    res.status(200).send({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).send({ error: error.message });
  }
});
export default app;
