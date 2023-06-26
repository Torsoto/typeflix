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
1. `/movies`: Returns movie collection.
2. `/movies/:themename`: Returns theme collection.
3. `/movies/:themename/levels/:levelindex`: Returns text of specified level of specified (theme).
4. `/unlockNextLevel`: Unlocks the next level in a theme and handles changing bosses if the boss level has been completed or if the last theme sets themeComplete to true for the specified user.

### Leaderboard
5. `/getLeaderBoard`: Returns global leaderboard.
6. `/getThemeLevelLeaderboard`: Returns leaderboard for a specific theme and level.
7. `/updateLeaderboard`: Updates global leaderboard and sorts it.
8. `/updateThemeLevelLeaderboard`: Updates leaderboard for a specific theme and level and sorts it.

### Weather and Time
9. `/weather/vienna`: Returns weather information about Vienna, which is logged on login.
10. `/time/vienna`: Returns time information about Vienna, which is logged on login.

### User-related
11. `/levelsOpened/:username/:movie`: Returns opened levels of a specific user for a given movie.
12. `/user/:username`: Returns all data of the user.
13. `/getAvatar`: Returns current avatar from the DiceBear API for a specific user.
14. `/getFollowing`: Returns a list of people whom the user is following.
15. `/signup`: Sign Up using Firebase + Firestore.
16. `/login`: Login using Firebase + Firestore (Email or Username and password).
17. `/validate`: Checks if the JWT token is still valid.
18. `/updateavatar`: Updates the avatar of a specific user.
19. `/follow`: Adds a username to the list of followers for the specified user.
20. `/unfollow`: Unfollows a username from the list of followers for the specified user.
21. `/getFollowers`: Returns a list of all followers of a specified username.
22. `/getFollowersCount`: Returns the number of followers for a specified username.
23. `/checkUserExists`: Checks if a user with the specified username exists.
24. `/deleteAccount`: Deletes the account from Firestore and Firebase.
25. `/setLastActivity`: Adds the latest played theme to the lastActivity array of length 3.
26. `/reset-password`: Sends user an email for password reset.

### API Integration
27. `/getomdbi`: Returns data from the OMDB API for each theme currently displayed.

### Miscellaneous
28. `/training`: Returns 200 random words from the Random-Word-API.
29. `/weather/vienna`: Returns weather information about Vienna.
30. `/time/vienna`: Returns local time in Vienna.

Copyright (c) 2023 FH Campus Wien

This project, Typeflix, is the property of FH Campus Wien and is protected by copyright laws. It is made available on GitHub for educational and reference purposes only. Any unauthorized use, reproduction, or distribution of this project is strictly prohibited.
