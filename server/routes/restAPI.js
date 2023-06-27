import express from "express";
import "../db/firebase.mjs";
import https from "https";
import xmlbuilder from "xmlbuilder";
import {
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

const app = express.Router();
const db = getFirestore();
const omdbiApiKey = "f455c145";

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

// get info about each movie from getomdbi api
app.get("/getomdbi", async (req, res) => {
  const { r } = req.query;
  try {
    // Fetch the list of movies from the database
    const moviesRef = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesRef);

    const moviesList = [];
    moviesSnapshot.forEach((doc) => {
      const movieData = {
        title: doc.id,
        poster: doc.data().poster,
      };
      moviesList.push(movieData);
    });

    // Fetch data about each movie from the OMDb API
    const promises = moviesList.map(async (movie) => {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${encodeURIComponent(
          movie.title
        )}&apikey=${omdbiApiKey}&r=${r}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data for movie ${movie.title}`);
      }

      if (r === "xml") {
        let xml = await response.text();
        // Remove the XML declaration from the response
        xml = xml.replace(/<\?xml.*?\?>/, "");
        return xml;
      } else {
        return await response.json();
      }
    });

    const data = await Promise.all(promises);

    if (r === "xml") {
      // Convert the data to an XML string
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += "<movies>";
      data.forEach((movieXml) => {
        xml += movieXml;
      });
      xml += "</movies>";

      // Set the Content-Type header to "application/xml"
      res.setHeader("Content-Type", "application/xml");

      // Send the XML string in the response
      res.status(200).send(xml);
    } else {
      // If the r parameter is not "xml", send JSON in the response
      res.status(200).json(data);
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
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
      // If the query is not xml, send JSON in the response
      res.status(500).json({ error: error.message });
    }
  }
});

// get random 150 words from Random Word API
app.get("/training", async (req, res) => {
  const { r } = req.query;
  const options = {
    hostname: "random-word-api.herokuapp.com",
    path: "/word?number=150",
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
