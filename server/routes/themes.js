import express from "express";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  setDoc,
} from "firebase/firestore";
import "../db/firebase.mjs";
import xmlbuilder from "xmlbuilder";
const db = getFirestore();
const app = express.Router();
const omdbiApiKey = "f455c145";

// get all movies
app.get("/movies", async (req, res) => {
  const { r } = req.query;

  try {
    const moviesRef = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesRef);

    //throw new Error("Test error"); <- test for error

    const moviesList = [];
    moviesSnapshot.forEach((doc) => {
      const movieData = {
        title: doc.id,
        poster: doc.data().poster,
      };
      moviesList.push(movieData);
    });

    if (r === "xml") {
      // Convert the moviesList array to an XML string
      const xml = xmlbuilder
        .create({ movies: { movie: moviesList } })
        .end({ pretty: true });

      // Set the Content-Type header to "application/xml"
      res.setHeader("Content-Type", "application/xml");

      // Send the XML string in the response
      res.status(200).send(xml);
    } else {
      // If the r parameter is not "xml", send JSON in the response
      res.status(200).json(moviesList);
    }
  } catch (error) {
    console.error("Error retrieving movie list:", error);
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

// get count of levels of movie
app.get("/movies/:movie", async (req, res) => {
  const { r } = req.query;
  const { movie } = req.params;
  try {
    const movieRef = doc(db, `movies/${movie}`);
    const movieSnapshot = await getDoc(movieRef);

    if (!movieSnapshot.exists()) {
      if (r === "xml") {
        // Convert the error message to an XML string
        const xml = xmlbuilder
          .create({
            error: `Movie ${movie} not found`,
          })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        res.status(400).send(xml);
      } else {
        // If the query is not xml, send JSON in the response
        res.status(400).json({ error: "Movie ${movie} not found" });
        return;
      }
    }

    const gradientColor = movieSnapshot.data().gradientColor;

    const levelsRef = collection(db, `movies/${movie}/levels`);
    const levelsSnapshot = await getDocs(levelsRef);
    const levelsCount = levelsSnapshot.size;

    if (r === "xml") {
      // Convert the data to an XML string
      const xml = xmlbuilder
        .create({ response: { count: levelsCount, color: gradientColor } })
        .end({ pretty: true });

      // Set the Content-Type header to "application/xml"
      res.setHeader("Content-Type", "application/xml");

      // Send the XML string in the response
      res.status(200).send(xml);
    } else {
      // If the r parameter is not "xml", send JSON in the response
      res.status(200).json({ count: levelsCount, color: gradientColor });
    }
  } catch (error) {
    console.error(
      `Error retrieving levels or gradient color for movie ${movie}:`,
      error
    );
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
      res.status(400).send(xml);
    } else {
      // If the query is not xml, send JSON in the response
      res.status(500).json({ error: error.message });
    }
  }
});

function decodeMovieName(encodedMovieName) {
  let decodedMovieName = "";
  try {
    decodedMovieName = decodeURIComponent(encodedMovieName);
  } catch (error) {
    // Handle any decoding errors here
    console.error("Error decoding movie name:", error);
  }
  return decodedMovieName;
}

// get time, text and img of level
app.get("/movies/:movie/levels/:level", async (req, res) => {
  const { r } = req.query;

  try {
    const { movie, level } = req.params;
    const decodedMovieName = decodeMovieName(movie);
    const levelRef = doc(db, `movies/${decodedMovieName}/levels/lvl${level}`);
    const levelSnapshot = await getDoc(levelRef);

    if (!levelSnapshot.exists()) {
      if (r === "xml") {
        // Convert the error message to an XML string
        const xml = xmlbuilder
          .create({
            error: `Level not found`,
          })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        res.status(404).send(xml);
      } else {
        // If the query is not xml, send JSON in the response
        res.status(404).json({ error: "Level not found" });
        return;
      }
    }

    const levelData = levelSnapshot.data();
    const text = levelData.text || "There is no text for this level yet";
    const img = levelData.img || "https://i.imgur.com/7byaekD.png";
    const time = levelData.time || 60;

    if (!text) {
      // Check the query
      if (r === "xml") {
        // Convert the error message to an XML string
        const xml = xmlbuilder
          .create({
            error: `Text field not found`,
          })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        res.status(404).send(xml);
      } else {
        // If the query is not xml, send JSON in the response
        res.status(404).json({ error: "Text field not found" });
      }
      return;
    }

    if (!img) {
      // Check the query
      if (r === "xml") {
        // Convert the error message to an XML string
        const xml = xmlbuilder
          .create({
            error: `Img field not found`,
          })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        res.status(404).send(xml);
      } else {
        // If the query is not xml, send JSON in the response
        res.status(404).json({ error: "Img field not found" });
      }
      return;
    }

    if (!time) {
      // Check the query
      if (r === "xml") {
        // Convert the error message to an XML string
        const xml = xmlbuilder
          .create({
            error: `Time field not found`,
          })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        res.status(404).send(xml);
      } else {
        // If the query is not xml, send JSON in the response
        res.status(404).json({ error: "Time field not found" });
      }
    }

    if (r === "xml") {
      // Convert the data to an XML string
      const xml = xmlbuilder
        .create({
          level: { text: text, img: img, time: time },
        })
        .end({ pretty: true });

      // Set the Content-Type header to "application/xml"
      res.setHeader("Content-Type", "application/xml");

      // Send the XML string in the response
      res.status(200).send(xml);
    } else {
      // If the r parameter is not "xml", send JSON in the response
      res.status(200).json({ text: text, img: img, time: time });
    }
  } catch (error) {
    console.error(`Error retrieving level for movie: `, error);
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

// count how many levels user has opened
app.get("/levelsOpened/:username/:movie", async (req, res) => {
  try {
    const { r } = req.query;
    const { username, movie } = req.params;
    const lowercaseUsername = username.toLowerCase();

    // Reference to the movie collection
    const movieCollectionRef = collection(
      db,
      "users",
      lowercaseUsername,
      movie
    );

    // Get all level documents in the movie collection
    const levelDocsSnapshot = await getDocs(movieCollectionRef);

    // If the user hasn't started on the specified movie yet
    if (levelDocsSnapshot.empty) {
      console.log("User has not started on this movie");
      if (r === "xml") {
        // Convert the data to an XML string
        const xml = xmlbuilder
          .create({ error: "User has not started on this movie" })
          .end({ pretty: true });

        // Set the Content-Type header to "application/xml"
        res.setHeader("Content-Type", "application/xml");

        // Send the XML string in the response
        return res.status(404).send(xml);
      } else {
        // If the r parameter is not "xml", send JSON in the response
        return res
          .status(404)
          .send({ error: "User has not started on this movie" });
      }
    }

    // Count the number of opened levels
    let openedLevels = 0;
    levelDocsSnapshot.forEach((levelDoc) => {
      if (levelDoc.data().completed === true) {
        openedLevels++;
      }
    });

    if (r === "xml") {
      // Convert the data to an XML string
      const xml = xmlbuilder
        .create({ levels: { openedLevels: openedLevels } })
        .end({ pretty: true });

      // Set the Content-Type header to "application/xml"
      res.setHeader("Content-Type", "application/xml");

      // Send the XML string in the response
      res.status(200).send(xml);
    } else {
      // If the r parameter is not "xml", send JSON in the response
      res.status(200).json({ openedLevels: openedLevels });
    }
  } catch (error) {
    console.log("Error retrieving levels:", error);
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

// unlock next level for user and handle bosses won and themesComplete
app.patch("/unlockNextLevel", async (req, res) => {
  try {
    const { username, movie, selectedLevelIndex } = req.body;
    const lowercaseUsername = username.toLowerCase();
    const level = String("lvl" + (selectedLevelIndex + 1));

    const levelDocRef = doc(db, "users", lowercaseUsername, movie, level);

    await updateDoc(levelDocRef, {
      completed: true,
    });

    const userDoc = doc(db, "users", lowercaseUsername);
    const userSnapshot = await getDoc(userDoc);
    let userData = userSnapshot.data();

    // check if level is a boss level to grant user bosses complete and themes complete in profile
    if ([3, 6, 9, 10].includes(selectedLevelIndex)) {
      const currentLevel = String("lvl" + selectedLevelIndex);
      const currentLevelDocRef = doc(
        db,
        "users",
        lowercaseUsername,
        movie,
        currentLevel
      );
      const currentLevelSnapshot = await getDoc(currentLevelDocRef);
      const currentLevelData = currentLevelSnapshot.data();

      // check if the boss has already been defeated
      if (!currentLevelData.bossWon) {
        await updateDoc(currentLevelDocRef, {
          completed: true,
          bossWon: true,
        });

        userData.bosses++;
        await updateDoc(userDoc, userData);
      }

      // check if the theme has already been completed
      if (selectedLevelIndex === 10 && !currentLevelData.themeCompleted) {
        userData.themescompleted++;
        await updateDoc(currentLevelDocRef, {
          themeCompleted: true,
        });
        await updateDoc(userDoc, userData);
      }
    }

    console.log(
      `Successfully updated level: ${level} for movie: ${movie} and user: ${username}`
    );
    res
      .status(200)
      .send({
        message: `Successfully updated level: ${level} for movie: ${movie} and user: ${username}`,
      });
  } catch (error) {
    console.log("Error updating level:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
