import express from "express";
import "./db/firebase.mjs";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import lastActivityRoutes from "./routes/lastActivity.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import themesRoutes from "./routes/themes.js";
import restRoutes from "./routes/restAPI.js";
import trainingRoutes from "./routes/training.js";

const app = express();
const developmentMode = true;

// Allow access only from localhost:5173 if is not in developmentMode
if (!developmentMode) {
  app.use((req, res, next) => {
    const host = req.get('host');
    const origin = req.get('origin');
    if (host !== 'localhost:5173' && origin !== 'http://localhost:5173') {
      res.status(403).send('Access only from http://localhost:5173');
    } else {
      next();
    }
  });
}

app.use(express.json({
  type: ['application/json', 'text/plain']
}));

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173" }));

//Routes
app.use(authRoutes);
app.use(userRoutes);
app.use(lastActivityRoutes);
app.use(leaderboardRoutes);
app.use(themesRoutes);
app.use(restRoutes);
app.use(trainingRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
