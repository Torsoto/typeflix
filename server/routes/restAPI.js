import express from "express";
import "../db/firebase.mjs";
import https from "https";
import xmlbuilder from "xmlbuilder";

const app = express.Router();

app.get("/weather/vienna", async (req, res) => {
  const { r } = req.query;

  const options = {
    hostname: "weather.visualcrossing.com",
    path:
      "/VisualCrossingWebServices/rest/services/timeline/Vienna?unitGroup=metric&key=UKYSD9QUBK9XXZVU3JVK9VTFG&contentType=json",
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

      // Check the Accept header
      if (r === "xml") {
        // Convert the data to an XML string
        const xml = xmlbuilder
          .create({
            weather: {
              currentConditions: currentConditions,
              temperature: temperature,
              description: description,
            },
          })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        res.status(200).send(xml);
      } else {
        // If the Accept header is not "application/xml", send JSON in the response
        res.status(200).json({
          currentConditions,
          temperature,
          description,
        });
      }
    });
  });

  request.on("error", (error) => {
    console.error("Error retrieving weather data:", error);

    // Check the Accept header
    if (r === "xml") {
      // Convert the error message to an XML string
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
      // If the Accept header is not "application/xml", send JSON in the response
      res.status(500).json({ error: error.message });
    }
  });

  request.end();
});

app.get("/time/vienna", async (req, res) => {
  const { r } = req.query;

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

      // Check the Accept header
      if (r === "xml") {
        // Convert the data to an XML string
        const xml = xmlbuilder
          .create({
            time: { datetime: datetime },
          })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        res.status(200).send(xml);
      } else {
        // If the Accept header is not "application/xml", send JSON in the response
        res.status(200).json({ datetime });
      }
    });
  });

  request.on("error", (error) => {
    console.error("Error retrieving time data:", error);

    // Check the Accept header
    if (r === "xml") {
      // Convert the error message to an XML string
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
      // If the Accept header is not "application/xml", send JSON in the response
      res.status(500).json({ error: error.message });
    }
  });

  request.end();
});

export default app;
