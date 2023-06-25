import express from "express";
import "../db/firebase.mjs";
import https from "https";
import xmlbuilder from "xmlbuilder";

const app = express.Router();

app.get("/training", async (req, res) => {
    const { r } = req.query;
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

            if (r === "xml") {
                // Convert the data to an XML string
                const xml = xmlbuilder
                    .create({ words: { word: words } })
                    .end({ pretty: true });

                // Set the Content-Type header to "application/xml"
                res.setHeader("Content-Type", "application/xml");
                

                // Send the XML string in the response
                res.status(200).send(xml);
            } else {
                // If the r parameter is not "xml", send JSON in the response
                res.status(200).json({ words });
            }
        });
    });

    request.on("error", (error) => {
        console.error("Error retrieving random words:", error);
        if (r === "xml") {
            // Convert the data to an XML string
            const xml = xmlbuilder
                .create({ error: error.message })
                .end({ pretty: true });

            // Set the Content-Type header to "application/xml"
            res.setHeader("Content-Type", "application/xml");
            

            // Send the XML string in the response
            res.status(500).send(xml);
        } else {
            // If the r parameter is not "xml", send JSON in the response
            res.status(500).json({ error: error.message });
        }
    });

    request.end();
});

export default app;
