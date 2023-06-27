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
import xmlbuilder from "xmlbuilder";

const db = getFirestore();
const auth = getAuth();
const app = express.Router();

// get data about user
app.get("/user/:username", async (req, res) => {
    const { r } = req.query;
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

            if (r === "xml") {
                // Convert the data to an XML string
                const xml = xmlbuilder
                    .create({ user: sortedUserData })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(200).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(200).json(sortedUserData);
            }
        } else {
            // If the user doesn't exist, send a 404 error
            if (r === "xml") {
                // Convert the data to an XML string
                const xml = xmlbuilder
                    .create({ error: "User not found (You are sending request to /:username Endpoint)" })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(404).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(404).json({ error: "User not found (You are sending request to /:username Endpoint)" });
            }
        }
    } catch (error) {
        console.error("Error getting user data:", error);
        if (r === "xml") {
            const xml = xmlbuilder
                .create({
                    message: `${error.message}`,
                })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send({ error: xml });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// update user's avatar
app.put("/updateavatar", async (req, res) => {
    const { token, newAvatar } = req.body;

    try {
        // decodes jwt to get username of jwt
        const decoded = jwt.verify(token, secretKey);
        const { username } = decoded;

        // get user's document
        const userDoc = await getDoc(doc(db, "users", username));

        if (!userDoc.exists()) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // get user's data and update its avatar
        const updatedUser = { ...userDoc.data(), avatar: newAvatar };
        await setDoc(doc(db, "users", username), updatedUser);
        res.status(200).json({ message: "Avatar updated successfully" });
    } catch (error) {
        console.error("Error updating avatar:", error);
        res.status(500).json({ error: error.message })
    }
});

// get user's avatar
app.get("/getAvatar", async (req, res) => {
    const { r } = req.query;
    try {
        const { username } = req.query;

        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            if (r === "xml") {
                const xml = xmlbuilder
                    .create({
                        error: `User does not exist`,
                    })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(404).send(xml);
            } else {
                res.status(404).json({ error: `User does not exist` });
            }
        } else {
            const userData = userDoc.data();

            if (r === "xml") {
                // Convert the data to an XML string
                const xml = xmlbuilder
                    .create({ avatar: userData.avatar })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(200).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(200).json({ avatar: userData.avatar });
            }
        }
    } catch (error) {
        if (r === "xml") {
            const xml = xmlbuilder
                .create({
                    message: `${error.message}`,
                })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send({ error: xml });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// follow somebody
app.post("/follow", async (req, res) => {
    try {
        const { username, toFollowUsername } = req.body;

        // username's doc
        const userDoc = doc(db, "users", username);
        const userSnapshot = await getDoc(userDoc);
        if (!userSnapshot.exists()) {
            res.status(404).json({ error: `User not found` });
        } else {

            //username's data
            const userData = userSnapshot.data();

            // check if "usernames" array of following has the nickname of "toFollowUsername"
            if (userData.following.includes(toFollowUsername)) {
                res.status(409).json({ message: "Following already added" });
            } else {
                // "username" starts following "toFollowUsername" and is added to "username's" following array
                userData.following.push(toFollowUsername);
                await updateDoc(userDoc, { following: userData.following });

                // "toFollowUsername" gets a new follower inside his followers array
                const toFollowUserDoc = doc(db, "users", toFollowUsername);
                const toFollowUserSnapshot = await getDoc(toFollowUserDoc);
                const toFollowUserData = toFollowUserSnapshot.data();
                toFollowUserData.followers.push(username);
                await updateDoc(toFollowUserDoc, {
                    followers: toFollowUserData.followers,
                });
                res.status(200).json({ message: "Following added successfully" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// unfollow somebody
app.post("/unfollow", async (req, res) => {
    try {
        const { username, toUnfollowUsername } = req.body;

        const userDoc = doc(db, "users", username);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
            res.status(404).json({ error: `User not found` });
        } else {
            const userData = userSnapshot.data();

            // Check if the "username" is already following the "toUnfollowUsername"
            if (!userData.following.includes(toUnfollowUsername)) {
                res.status(409).json({ message: "User not found" });
            } else {
                const updatedFollowing = userData.following.filter(
                    (friend) => friend !== toUnfollowUsername
                );
                await updateDoc(userDoc, { following: updatedFollowing });

                // Remove the "username" from the "toUnfollowUsername's" followers array
                const toUnfollowUserDoc = doc(db, "users", toUnfollowUsername);
                const toUnfollowUserSnapshot = await getDoc(toUnfollowUserDoc);
                const toUnfollowUserData = toUnfollowUserSnapshot.data();
                const updatedFollowers = toUnfollowUserData.followers.filter(
                    (follower) => follower !== username
                );
                await updateDoc(toUnfollowUserDoc, { followers: updatedFollowers });
                res.status(200).json({ message: "Friend removed successfully" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get all followERS of user somebody
app.get("/getFollowers", async (req, res) => {
    const { r } = req.query;
    try {
        const { username } = req.query;

        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            if (r === "xml") {
                const xml = xmlbuilder
                    .create({
                        error: `User does not exist`,
                    })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(404).send(xml);
            } else {
                res.status(404).json({ error: "User does not exist" });
            }
        } else {
            //get followers list
            const userData = userDoc.data();

            if (r === "xml") {
                // Convert the data to an XML string
                const xml = xmlbuilder
                    .create({ followers: { follower: userData.followers } })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(200).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(200).json(userData.followers);
            }
        }
    } catch (error) {
        if (r === "xml") {
            const xml = xmlbuilder
                .create({
                    error: `${error.message}`,
                })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send(xml);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// get all followERS count
app.get("/getFollowersCount", async (req, res) => {
    const { r } = req.query;
    try {
        const { username } = req.query;

        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            res.status(404).send({ error: "User does not exist" });
        } else {
            const userData = userDoc.data();

            if (r === "xml") {
                // Convert the data to an XML string
                const xml = xmlbuilder
                    .create({ count: userData.followers.length })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(200).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(200).json({ count: userData.followers.length });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// get all followING count
app.get("/getFollowing", async (req, res) => {
    const { r } = req.query;
    try {
        const { username } = req.query;

        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            res.status(404).send({ error: "User does not exist" });
        } else {
            const userData = userDoc.data();

            if (r === "xml") {
                // Convert the data to an XML string
                const xml = xmlbuilder
                    .create({ following: { user: userData.following } })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(200).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(200).json(userData.following);
            }
        }
    } catch (error) {
        if (r === "xml") {
            const xml = xmlbuilder
                .create({
                    message: `${error.message}`,
                })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send({ error: xml });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// check if user's account still exists
app.get("/checkUserExists", async (req, res) => {
    const { r } = req.query;
    const { username } = req.query;

    try {
        const userDocRef = doc(db, "users", username);
        const userDoc = await getDoc(userDocRef);

        if (r === "xml") {
            // Convert the data to an XML string
            const xml = xmlbuilder
                .create({ exists: userDoc.exists() })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(200).send(xml);
        } else {
            // If the r parameter is not "xml", send JSON in the response
            res.status(200).json({ exists: userDoc.exists() });
        }
    } catch (error) {
        if (r === "xml") {
            const xml = xmlbuilder
                .create({
                    message: `${error.message}`,
                })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send({ error: xml });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});

// delete user's account
app.delete("/deleteAccount", async (req, res) => {
    try {
        const { token, password, username, email } = req.body;

        if (!jwt.verify(token, secretKey)) {
            res.status(403).json({ error: "Invalid JWT" });
            return;
        }

        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        if (!userCredential) {
            res.status(403).json({ error: "Invalid credentials" });
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
        res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: error.message });
    }
});




export default app;
