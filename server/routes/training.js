import express from "express";
import "../db/firebase.mjs";
import https from "https";

const app = express.Router();

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

export default app;
