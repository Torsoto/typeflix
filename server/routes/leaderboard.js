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

app.post("/updateLeaderboard", async (req, res) => {
    try {
        const { username, wpm } = req.body;

        const leaderboardDocRef = doc(db, "leaderboard", "global");
        const leaderboardDocSnap = await getDoc(leaderboardDocRef);
        const userDocRef = doc(db, "users", username);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            res.status(404).send({ error: "User not found" });
            return;
        }

        let userDocData = userDocSnap.data();
        let leaderboardData = [];

        // update bestwpm if wpm is greater
        if (wpm > userDocData.bestwpm) {
            userDocData.bestwpm = wpm;
        }

        // update avgwpm
        if (userDocData.totalTests > 0) {
            userDocData.totalWpm = userDocData.totalWpm + wpm;
            userDocData.totalTests += 1;
            userDocData.avgwpm = userDocData.totalWpm / userDocData.totalTests;
        } else {
            userDocData.totalWpm = wpm;
            userDocData.totalTests = 1;
            userDocData.avgwpm = wpm;
        }


        // save the updated user data back to Firestore
        await setDoc(userDocRef, userDocData);

        if (leaderboardDocSnap.exists()) {
            // Leaderboard exists
            leaderboardData = leaderboardDocSnap.data().leaderboard;
            const existingUserIndex = leaderboardData.findIndex(
                (user) => user.username === username
            );

            if (existingUserIndex !== -1) {
                // User exists in leaderboard
                if (wpm > leaderboardData[existingUserIndex].wpm) {
                    // If the new wpm is higher, update it
                    leaderboardData[existingUserIndex].wpm = wpm;
                }
            } else {
                // User does not exist in leaderboard, add new user
                leaderboardData.push({ username, wpm });
            }
        } else {
            // Leaderboard does not exist, create new doc with first user
            leaderboardData = [{ username, wpm }];
        }

        // Sort the leaderboard by wpm in descending order
        leaderboardData.sort((a, b) => b.wpm - a.wpm);

        // Update the leaderboard in Firestore
        await setDoc(leaderboardDocRef, { leaderboard: leaderboardData });

        res
            .status(200)
            .send({ message: "Leaderboard and user stats updated successfully." });
    } catch (e) {
        console.log("Error updating leaderboard:", e);
        res.status(500).send({ error: e.message });
    }
});

app.get("/getLeaderboard", async (req, res) => {
    try {
        const leaderboardDocRef = doc(db, "leaderboard", "global");
        const leaderboardDocSnap = await getDoc(leaderboardDocRef);

        if (!leaderboardDocSnap.exists()) {
            console.log("Leaderboard does not exist");
            return res.status(404).send({ error: "Leaderboard does not exist" });
        }

        const leaderboardData = leaderboardDocSnap.data().leaderboard;

        // Convert the array to an object with usernames as keys and wpm as values
        const leaderboardObject = {};
        for (const user of leaderboardData) {
            leaderboardObject[user.username] = user.wpm;
        }

        res.status(200).send(leaderboardObject);
    } catch (e) {
        console.log("Error retrieving leaderboard:", e);
        res.status(500).send({ error: e.message });
    }
});
export default app;
