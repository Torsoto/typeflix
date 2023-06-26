# Typeflix

Welcome to Typeflix! This is a theme-based typewriting game that tests your typing speed and accuracy with different levels of difficulty.

## Features
- Theme-based: We have different themes based on your favourite TV-Shows, Movies and Animes!
- Typing speed: The game measures your typing speed in words per minute (WPM) and puts your best score on the globla and theme leadboard.
- Difficulty levels: As you progress through the levels, the difficulty increases, providing a greater challenge.

## How to Play
1. Select a theme and choose level(if its your first time you will have to start at level 1).
2. Type the words that appear on the screen as quickly and accurately as possible.
3. Your typing speed will be displayed at the end of each level.

## Installation
1. Run ```npm install``` in each directory (3 times), namely in /, /client, and /server.
2. Navigate back to the root directory /.
3. Execute ```npm run dev```.

## Endpoints
http://localhost:3000/ (some endpoints are only meant to manipulate the database and require a body in the request so here are only the ones you can easily request on the browser)
All of these Endpoints can return the data as either json or xml -> add new query r=xml to get xml data 
example: /movies/Breaking%20Bad?r=xml or /getAvatar?username=tolga&r=xml

1. /movies
2. /movies/:themename | /movies/Breaking%20Bad
3. /movies/:themename/levels/:levelindex | /movies/Breaking%20Bad/levels/1
4. /getLeaderBoard | returns globabl leaderboard
5. /getThemeLevelLeaderboard | /getThemeLevelLeaderboard?theme=Bleach&levelIndex=1
6. /weather/vienna | returns weather information about vienna which we log on login
7. /time/vienna | returns time information about vienna which we log on login
8. /levelsOpened/:username/:movie | /levelsOpened/tolga/Breaking%20Bad
9. /getomdbi | returns data from the ombdi api for each theme we currently display.
10. /training | returns 200 random words from a random-word-api
11. /user/:username | /user/tolga | returns all data of the user
12. /getAvatar | /getAvatar?username=tolga | returns current avatar from the dicebear api
13. /getFollowing | /getFollowing?username=tolga | returns list of people who the user is following

Copyright (c) 2023 FH Campus Wien

This project, Typeflix, is the property of FH Campus Wien and is protected by copyright laws. It is made available on GitHub for educational and reference purposes only. Any unauthorized use, reproduction, or distribution of this project is strictly prohibited.
