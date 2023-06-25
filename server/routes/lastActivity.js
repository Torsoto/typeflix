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


app.post("/setLastActivity", async (req, res) => {
    const acceptHeader = req.headers["accept"];
    try {
        const { username, movie, level, wpm } = req.body;

        if (!username || typeof username !== 'string') {
            if (acceptHeadeacceptHeader === "application/xml") {
                // Convert the error message to an XML string
                const xml = xmlbuilder
                    .create({ error: "Invalid or missing username" })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(400).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(400).json({ error: "Invalid or missing username" });
            }
            return;
        }

        const userDocRef = doc(db, "users", username);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            console.log("404")
            if (acceptHeader === "applicaton/xml") {
                // Convert the error message to an XML string
                const xml = xmlbuilder
                    .create({ error: "User not found" })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");

                // Send the XML string in the response
                res.status(404).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(404).json({ error: "User not found" });
            }
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
                if (acceptHeader === "application/xml") {
                    // Convert the success message to an XML string
                    const xml = xmlbuilder
                        .create({
                            message: "User's last activity updated successfully.",
                        })
                        .end({ pretty: true });

                    // Set the Content-Type header to "application/xml"
                    res.setHeader("Content-Type", "application/xml");

                    // Send the XML string in the response
                    res.status(200).send(xml);
                } else {
                    // If the r parameter is not "xml", send JSON in the response
                    res.status(200).json({
                        message: "User's last activity updated successfully.",
                    });
                }
            })
            .catch((e) => {
                console.log("Error updating user's last activity:", e);
                if (acceptHeader === "application/xml") {
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
            });
    } catch (e) {
        console.log("Error updating user's last activity:", e);
        if (acceptHeader === "application/xml") {
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