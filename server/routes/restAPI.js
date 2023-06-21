import express from "express";
import "../db/firebase.mjs";
import https from "https";

const app = express.Router();

app.get("/weather/vienna", async (req, res) => {
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

app.get("/time/vienna", async (req, res) => {
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
export default app;
