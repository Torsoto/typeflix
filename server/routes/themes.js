import express from "express";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    collection,
    getDocs,
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

        // Retrieve user data
        const userDocRef = doc(db, "users", lowercaseUsername);
        const userDocSnap = await getDoc(userDocRef);

        // If user does not exist
        if (!userDocSnap.exists()) {
            console.log("User does not exist in /levelsOpened");
            return res
                .status(404)
                .send({ error: "User does not exist /levelsOpened" });
        }

        const userData = userDocSnap.data();

        // If the user hasn't started on the specified movie yet
        if (!(movie in userData.themes)) {
            console.log("User has not started on this movie");
            return res
                .status(404)
                .send({ error: "User has not started on this movie" });
        }

        // Count the number of opened levels
        let openedLevels = 0;
        const levels = userData.themes[movie].levels;
        for (let level in levels) {
            if (levels[level] === true) {
                openedLevels++;
            }
        }

        res.status(200).send({ openedLevels: openedLevels });
    } catch (e) {
        console.log("Error retrieving levels:", e);
        res.status(500).send({ error: e.message });
    }
});

app.patch("/setNextLevel/:username/:movie/:currentLevel", async (req, res) => {
    try {
        const { username, movie, currentLevel } = req.params;
        const lowercaseUsername = username.toLowerCase();

        // Retrieve user data
        const userDocRef = doc(db, "users", lowercaseUsername);
        const userDocSnap = await getDoc(userDocRef);

        // If user does not exist
        if (!userDocSnap.exists()) {
            console.log("User does not exist in /setNextLevel");
            return res
                .status(404)
                .send({ error: "User does not exist /setNextLevel" });
        }

        const userData = userDocSnap.data();

        // If the user hasn't started on the specified movie yet
        if (!(movie in userData.themes)) {
            console.log("User has not started on this movie");
            return res
                .status(404)
                .send({ error: "User has not started on this movie" });
        }

        // Get the next level based on the current level
        const nextLevel = "lvl" + (Number(currentLevel.replace("lvl", "")) + 1);
        const levels = userData.themes[movie].levels;

        // If nextLevel is already opened or there's no such level
        if (levels[nextLevel] === true || !levels.hasOwnProperty(nextLevel)) {
            console.log(`Level ${nextLevel} is already opened or does not exist`);
            return res.status(200).send({
                message: `Level ${nextLevel} is already opened or does not exist`,
            });
        }

        // Open the next level
        await updateDoc(userDocRef, {
            [`themes.${movie}.levels.${nextLevel}`]: true,
        });

        res.status(200).send({ message: `Level ${nextLevel} has been opened` });
    } catch (e) {
        console.log("Error setting next level:", e);
        res.status(500).send({ error: e.message });
    }
});
export default app;
