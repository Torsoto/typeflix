# Typeflix

Welcome to Typeflix! This is a theme-based typewriting game that tests your typing speed and accuracy with different levels of difficulty.

# Features
- Theme-based: We have different themes based on your favourite TV-Shows, Movies and Animes!
- Typing speed: The game measures your typing speed in words per minute (WPM) and puts your best score on the globla and theme leadboard.
- Difficulty levels: As you progress through the levels, the difficulty increases, providing a greater challenge.

# How to Play
1. Select a theme and choose level(if its your first time you will have to start at level 1).
2. Type the words that appear on the screen as quickly and accurately as possible.
3. Your typing speed will be displayed at the end of each level.

# Installation
1. Run ```npm install``` in each directory (3 times), namely in /, /client, and /server.
2. Navigate back to the root directory /.
3. Execute ```npm run dev```.

# Endpoints
http://localhost:3000/
This is the base URL for the API. Some endpoints are only meant to manipulate the database and require a request body, so only the endpoints that can be easily requested from a browser are listed below.

All of these endpoints can return data in either JSON or XML format. To request XML data, add the query parameter `r=xml` to the URL. For example, `/movies/Breaking%20Bad?r=xml` or `/getAvatar?username=tolga&r=xml`.

Note: The examples provided assume a local development server at `http://localhost:3000/`.

### Movies
- `/movies`: Returns movie collection.
-  `/movies/:themename`: Returns theme collection.
- `/movies/:themename/levels/:levelindex`: Returns text of specified level of specified (theme).

### Leaderboard
- `/getLeaderBoard`: Returns global leaderboard.
- `/getThemeLevelLeaderboard`: Returns leaderboard for a specific theme and level.

### Weather and Time
- `/weather/vienna`: Returns weather information about Vienna, which is logged on login.
- `/time/vienna`: Returns time information about Vienna, which is logged on login.

### User-related
- `/levelsOpened/:username/:movie`: Returns opened levels of a specific user for a given movie.
- `/user/:username`: Returns all data of the user.
- `/getAvatar`: Returns current avatar from the DiceBear API for a specific user.
- `/getFollowing`: Returns a list of people whom the user is following.
- `/getFollowers`: Returns a list of all followers of a specified username.
- `/getFollowersCount`: Returns the number of followers for a specified username.
- `/checkUserExists`: Checks if a user with the specified username exists.

### ThemeDB
- `/getomdbi`: Returns data from the OMDB API for each theme currently displayed.

### Miscellaneous
- `/training`: Returns 200 random words from the Random-Word-API.

Copyright (c) 2023 FH Campus Wien

This project, Typeflix, is the property of FH Campus Wien and is protected by copyright laws. It is made available on GitHub for educational and reference purposes only. Any unauthorized use, reproduction, or distribution of this project is strictly prohibited.
