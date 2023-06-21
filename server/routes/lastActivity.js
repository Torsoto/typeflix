import express from "express";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";
import "../db/firebase.mjs";

const db = getFirestore();
const app = express.Router();


app.post("/setLastActivity", async (req, res) => {
    try {
        const { username, movie, level, wpm } = req.body;

        if (!username || typeof username !== 'string') {
            res.status(400).send({ error: "Invalid or missing username" });
            return;
        }

        const userDocRef = doc(db, "users", username);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            console.log("404")
            res.status(404).send({ error: "User not found" });
            return;
        }

        let userDocData = userDocSnap.data();
        let lastActivity = userDocData.lastActivity || [];

        // Add new activity to lastActivity array
        lastActivity.unshift({ movie, level, wpm }); // unshift will add the new activity at the start

        // Keep only the first two activities
        lastActivity = lastActivity.slice(0, 3);

        userDocData.lastActivity = lastActivity;

        // Save the updated user data back to Firestore
        await setDoc(userDocRef, userDocData)
            .then(() => {
                console.log("User's last activity updated successfully.");
                res.status(200).send({ message: "User's last activity updated successfully." });
            })
            .catch((e) => {
                console.log("Error updating user's last activity:", e);
                res.status(500).send({ error: e.message });
            });
    } catch (e) {
        console.log("Error updating user's last activity:", e);
        res.status(500).send({ error: e.message });
    }
});

export default app;