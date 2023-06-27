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
import xmlbuilder from "xmlbuilder";

// update global leaderboard
app.post("/updateLeaderboard", async (req, res) => {
    try {
        const { username, wpm } = req.body;

        const leaderboardDocRef = doc(db, "leaderboard", "global");
        const leaderboardDocSnap = await getDoc(leaderboardDocRef);
        const userDocRef = doc(db, "users", username);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            return res.status(404).json({ error: "User not found" });
        }

        let userDocData = userDocSnap.data();
        let leaderboardData = [];

        // update bestwpm if wpm is greater
        if (wpm > userDocData.bestwpm) {
            userDocData.bestwpm = wpm;
        }

        // update avgwpm
        if (userDocData.gamesplayed > 0) {
            userDocData.cumulativeWpm = userDocData.cumulativeWpm + wpm;
            userDocData.gamesplayed += 1;
            userDocData.avgwpm = userDocData.cumulativeWpm / userDocData.gamesplayed;
        } else {
            userDocData.cumulativeWpm = wpm;
            userDocData.gamesplayed = 1;
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
        res.status(200).json({ message: "Leaderboard and user stats updated successfully" });

    } catch (error) {
        console.log("Error updating leaderboard:", error);
        res.status(500).json({ error: error.message });
    }
});

// get global leaderboard
app.get("/getLeaderboard", async (req, res) => {
    const { r } = req.query;
    try {
        const leaderboardDocRef = doc(db, "leaderboard", "global");
        const leaderboardDocSnap = await getDoc(leaderboardDocRef);

        if (!leaderboardDocSnap.exists()) {
            console.log("Leaderboard does not exist");
            if (r === "xml") {
                // Convert the error message to an XML string
                const xml = xmlbuilder
                    .create({ error: "Leaderboard does not exist" })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(404).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(404).json({ error: "Leaderboard does not exist" });
            }
            return;
        }

        const leaderboardData = leaderboardDocSnap.data().leaderboard;

        // Convert the array to an object with usernames as keys and wpm as values
        const leaderboardObject = {};
        for (const user of leaderboardData) {
            leaderboardObject[user.username] = user.wpm;
        }

        if (r === "xml") {
            // Convert the leaderboard object to an XML string
            const xml = xmlbuilder
                .create({ leaderboard: leaderboardObject })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(200).send(xml);
        } else {
            // If the r parameter is not "xml", send JSON in the response
            res.status(200).json(leaderboardObject);
        }
    } catch (e) {
        console.log("Error retrieving leaderboard:", e);
        if (r === "xml") {
            // Convert the error message to an XML string
            const xml = xmlbuilder
                .create({ error: e.message })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send(xml);
        } else {
            // If the r parameter is not "xml", send JSON in the response
            res.status(500).json({ error: e.message });
        }
    }
});

// update theme's leaderboard
app.post("/updateThemeLevelLeaderboard", async (req, res) => {
    try {
        const { username, wpm, theme, levelIndex } = req.body;

        // Document reference is now based on the theme, not "global"
        const leaderboardDocRef = doc(db, "leaderboard", theme);
        const leaderboardDocSnap = await getDoc(leaderboardDocRef);

        let leaderboardData = {};

        if (leaderboardDocSnap.exists()) {
            // Leaderboard exists
            leaderboardData = leaderboardDocSnap.data();
            const levelLeaderboard = leaderboardData[`lvl${levelIndex}`] || [];
            const existingUserIndex = levelLeaderboard.findIndex(
                (user) => user.username === username
            );

            if (existingUserIndex !== -1) {
                // User exists in leaderboard
                if (wpm > levelLeaderboard[existingUserIndex].wpm) {
                    // If the new wpm is higher, update it
                    levelLeaderboard[existingUserIndex].wpm = wpm;
                }
            } else {
                // User does not exist in leaderboard, add new user
                levelLeaderboard.push({ username, wpm });
            }

            // Sort the level leaderboard by wpm in descending order
            levelLeaderboard.sort((a, b) => b.wpm - a.wpm);

            // Update the level leaderboard in the leaderboard data
            leaderboardData[`lvl${levelIndex}`] = levelLeaderboard;
        } else {
            // Leaderboard does not exist, create new doc with first user in the level leaderboard
            leaderboardData[`lvl${levelIndex}`] = [{ username, wpm }];
        }

        // Update the leaderboard in Firestore
        await setDoc(leaderboardDocRef, leaderboardData);
        res.status(200).json({ message: "Leaderboard updated successfully." });
    } catch (e) {
        console.log("Error updating leaderboard:", e);
        res.status(500).json({ error: e.message });
    }
});

// get theme's leaderboard
app.get("/getThemeLevelLeaderboard", async (req, res) => {
    const { r } = req.query;
    try {
        const { theme, levelIndex } = req.query;

        const leaderboardDocRef = doc(db, "leaderboard", theme);
        const leaderboardDocSnap = await getDoc(leaderboardDocRef);

        if (!leaderboardDocSnap.exists()) {
            console.log("Leaderboard does not exist");
            if (r === "xml") {
                // Convert the error message to an XML string
                const xml = xmlbuilder
                    .create({ error: "Leaderboard does not exist" })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(404).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(404).json({ error: "Leaderboard does not exist" });
            }
            return;
        }

        const leaderboardData = leaderboardDocSnap.data();
        const levelLeaderboard = leaderboardData[`lvl${levelIndex}`] || [];

        // Convert the array to an object with usernames as keys and wpm as values
        const leaderboardObject = {};
        for (const user of levelLeaderboard) {
            leaderboardObject[user.username] = user.wpm;
        }

        if (r === "xml") {
            // Convert the leaderboard object to an XML string
            const xml = xmlbuilder
                .create({ leaderboard: leaderboardObject })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(200).send(xml);
        } else {
            // If the r parameter is not "xml", send JSON in the response
            res.status(200).json(leaderboardObject);
        }
    } catch (e) {
        console.log("Error retrieving leaderboard:", e);
        if (r === "xml") {
            // Convert the error message to an XML string
            const xml = xmlbuilder
                .create({ error: e.message })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");

            // Send the XML string in the response
            res.status(500).send(xml);
        } else {
            // If the r parameter is not "xml", send JSON in the response
            res.status(500).json({ error: e.message });
        }
    }
});


export default app;
