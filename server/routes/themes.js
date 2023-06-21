import express from "express";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    collection,
    getDocs, setDoc,
} from "firebase/firestore";
import "../db/firebase.mjs";

const db = getFirestore();
const app = express.Router();

app.get("/movies", async (req, res) => {
    try {
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

        res.status(200).json(moviesList);
    } catch (error) {
        console.error("Error retrieving movie list:", error);
        res.status(500).send({ error: error.message });
    }
});

app.get("/movies/:movie", async (req, res) => {
    try {
        const { movie } = req.params;
        const movieRef = doc(db, `movies/${movie}`);
        const movieSnapshot = await getDoc(movieRef);

        if (!movieSnapshot.exists()) {
            res.status(404).send({ error: `Movie ${movie} not found` });
            return;
        }

        const gradientColor = movieSnapshot.data().gradientColor;

        const levelsRef = collection(db, `movies/${movie}/levels`);
        const levelsSnapshot = await getDocs(levelsRef);
        const levelsCount = levelsSnapshot.size;

        res.status(200).json({ count: levelsCount, color: gradientColor });
    } catch (error) {
        console.error(
            `Error retrieving levels or gradient color for movie ${movie}:`,
            error
        );
        res.status(500).send({ error: error.message });
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

app.get("/movies/:movie/levels/:level", async (req, res) => {
    try {
        const { movie, level } = req.params;
        const decodedMovieName = decodeMovieName(movie);
        const levelRef = doc(db, `movies/${decodedMovieName}/levels/lvl${level}`);
        const levelSnapshot = await getDoc(levelRef);

        if (!levelSnapshot.exists()) {
            res.status(404).send({ error: "Level not found" });
            return;
        }

        const levelData = levelSnapshot.data();
        const text = levelData.text || "There is no text for this level yet";
        const img = levelData.img || "https://i.imgur.com/7byaekD.png";
        const time = levelData.time || 60;

        if (!text) {
            res.status(404).send({ error: "Text field not found" });
            return;
        }

        if (!img) {
            res.status(404).send({ error: "Img field not found" });
            return;
        }

        if (!time) {
            res.status(404).send({ error: "Time field not found" });
        }

        res.status(200).json({ text: text, img: img, time: time });
    } catch (error) {
        console.error(`Error retrieving level for movie: `, error);
        res.status(500).send({ error: error.message });
    }
});

app.get("/levelsOpened/:username/:movie", async (req, res) => {
    try {
        const { username, movie } = req.params;
        const lowercaseUsername = username.toLowerCase();

        // Reference to the movie collection
        const movieCollectionRef = collection(db, "users", lowercaseUsername, movie);

        // Get all level documents in the movie collection
        const levelDocsSnapshot = await getDocs(movieCollectionRef);

        // If the user hasn't started on the specified movie yet
        if (levelDocsSnapshot.empty) {
            console.log("User has not started on this movie");
            return res
                .status(404)
                .send({ error: "User has not started on this movie" });
        }

        // Count the number of opened levels
        let openedLevels = 0;
        levelDocsSnapshot.forEach(levelDoc => {
            if (levelDoc.data().completed === true) {
                openedLevels++;
            }
        });

        res.status(200).send({ openedLevels: openedLevels });
    } catch (e) {
        console.log("Error retrieving levels:", e);
        res.status(500).send({ error: e.message });
    }
});


app.patch("/unlockNextLevel", async (req, res) => {
    try {
        const { username, movie, selectedLevelIndex } = req.body;
        const lowercaseUsername = username.toLowerCase();
        const level = String("lvl" +  (selectedLevelIndex + 1));

        console.log(level)
        // Reference to the level document
        const levelDocRef = doc(db, "users", lowercaseUsername, movie, level);

        // Update the 'completed' field to true
        await updateDoc(levelDocRef, {
            completed: true
        });

        console.log(`Successfully updated level: ${level} for movie: ${movie} and user: ${username}`);

        res.status(200).send({ message: `Successfully updated level: ${level} for movie: ${movie} and user: ${username}` });

    } catch (e) {
        console.log("Error updating level:", e);
        res.status(500).send({ error: e.message });
    }
});


export default app;
