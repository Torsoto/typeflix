import express from "express";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  collection,
  writeBatch,
} from "firebase/firestore";
import {
  deleteUser,
  getAuth,
  signInWithEmailAndPassword,
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

        // Add the username to the toFollowUsername's followers array
        const toFollowUserDoc = doc(db, "users", toFollowUsername);
        const toFollowUserSnapshot = await getDoc(toFollowUserDoc);
        const toFollowUserData = toFollowUserSnapshot.data();
        toFollowUserData.followers.push(username);
        await updateDoc(toFollowUserDoc, {
          followers: toFollowUserData.followers,
        });

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

        // Remove the username from the toUnfollowUsername's followers array
        const toUnfollowUserDoc = doc(db, "users", toUnfollowUsername);
        const toUnfollowUserSnapshot = await getDoc(toUnfollowUserDoc);
        const toUnfollowUserData = toUnfollowUserSnapshot.data();
        const updatedFollowers = toUnfollowUserData.followers.filter(
          (follower) => follower !== username
        );
        await updateDoc(toUnfollowUserDoc, { followers: updatedFollowers });

        res.status(200).send({ message: "Friend removed successfully" });
      }
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/getFollowers", async (req, res) => {
  const { username } = req.query;

  try {
    const userDocRef = doc(db, "users", username);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      res.status(404).send({ error: "User does not exist" });
    } else {
      const userData = userDoc.data();
      res.status(200).send(userData.followers);
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.get("/getFollowersCount", async (req, res) => {
  const { username } = req.query;

  try {
    const userDocRef = doc(db, "users", username);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      res.status(404).send({ error: "User does not exist" });
    } else {
      const userData = userDoc.data();
      res.status(200).send({ count: userData.followers.length });
    }
  } catch (e) {
    res.status(500).send({ error: e.message });
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
  /*const { token, username, password } = req.body;

  try {
    const decoded = jwt.verify(token, secretKey);
    const { uid } = decoded;

    // Update user profile
    await updateProfile(auth.currentUser, {
      displayName: username,
    });

    // Update user document in Firestor
    await setDoc(doc(db, "users", uid), {
      username: username.toLowerCase(),
      email: email || decoded.email,
      userid: uid,
    });

    res.status(200).send({ message: "User data updated successfully" });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send({ error: error.message });
  }*/
});

app.get("/checkUserExists", async (req, res) => {
  const { username } = req.query;

  try {
    const userDocRef = doc(db, "users", username);
    const userDoc = await getDoc(userDocRef);

    res.status(200).send({ exists: userDoc.exists() });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

app.delete("/deleteAccount", async (req, res) => {
  try {
    const { token, password, username, email } = req.body;

    if (!jwt.verify(token, secretKey)) {
      res.status(403).send({ error: "Invalid JWT" });
      return;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (!userCredential) {
      res.status(403).send({ error: "Invalid credentials" });
      return;
    }

    // Get the user's followers and following
    const userDocRef = doc(db, "users", username);
    const userDocSnap = await getDoc(userDocRef);
    const { followers = [], following = [] } = userDocSnap.data();

    // Update the followers' following field
    for (const follower of followers) {
      const followerDocRef = doc(db, "users", follower);
      const followerDocSnap = await getDoc(followerDocRef);
      const { following: followerFollowing = [] } = followerDocSnap.data();
      const updatedFollowing = followerFollowing.filter((u) => u !== username);
      await updateDoc(followerDocRef, { following: updatedFollowing });
    }

    // Update the following's followers field
    for (const followed of following) {
      const followedDocRef = doc(db, "users", followed);
      const followedDocSnap = await getDoc(followedDocRef);
      const { followers: followedFollowers = [] } = followedDocSnap.data();
      const updatedFollowers = followedFollowers.filter((u) => u !== username);
      await updateDoc(followedDocRef, { followers: updatedFollowers });
    }

    await deleteUser(userCredential.user);
    console.log("User deleted successfully");

    const userDoc = doc(db, "users", username);
    const emailToUsernameDoc = doc(db, "emailToUsername", email);
    const leaderboardDocRef = doc(db, "leaderboard", "global");
    const leaderboardDocSnap = await getDoc(leaderboardDocRef);

    const batch = writeBatch(db);

    batch.delete(userDoc);
    batch.delete(emailToUsernameDoc);

    // Delete all movie collections
    const moviesCollectionRef = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesCollectionRef);
    for (const movieDoc of moviesSnapshot.docs) {
      const movieCollectionRef = collection(db, "users", username, movieDoc.id);
      const movieCollectionSnapshot = await getDocs(movieCollectionRef);
      movieCollectionSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
    }

    if (leaderboardDocSnap.exists()) {
      // Leaderboard exists
      let leaderboardData = leaderboardDocSnap.data().leaderboard;
      const existingUserIndex = leaderboardData.findIndex(
        (user) => user.username === username
      );

      if (existingUserIndex !== -1) {
        // User exists in leaderboard, remove them
        leaderboardData.splice(existingUserIndex, 1);
        // Sort the leaderboard by wpm in descending order
        leaderboardData.sort((a, b) => b.wpm - a.wpm);
        // Update the leaderboard in Firestore
        await setDoc(leaderboardDocRef, { leaderboard: leaderboardData });
      }
    }

    await batch.commit();
    console.log("User data deleted from Firestore");

    res.status(200).send({ message: "Account deleted successfully" });
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).send({ error: e.message });
  }
});

export default app;
