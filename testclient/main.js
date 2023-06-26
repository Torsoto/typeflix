import './style.css'

const app = document.getElementById('app');

// Fetch data from the /movies endpoint
fetch('http://localhost:3000/movies')
  .then(response => response.json())
  .then(data => {
    const moviesList = document.getElementById('movies-list');
    data.forEach(movie => {
      const movieItem = document.createElement('li');
      movieItem.textContent = movie.title;
      moviesList.appendChild(movieItem);
    });
  });

// Fetch data from the /user/:username endpoint
const username = 'tolga'; // Replace with the desired username

fetch(`http://localhost:3000/user/${username}`)
  .then(response => response.json())
  .then(data => {
    const userData = document.getElementById('user-data');
    Object.keys(data).forEach(key => {
      const dataItem = document.createElement('li');
      if (key === 'lastActivity') {
        let lastActivityStr = 'lastActivity: ';
        data[key].forEach((activity, index) => {
          lastActivityStr += `${activity.movie} (wpm: ${activity.wpm}, level: ${activity.level})`;
          if (index < data[key].length - 1) {
            lastActivityStr += ', ';
          }
        });
        dataItem.textContent = lastActivityStr;
      } else if (key === 'followers' && data[key].length === 0) {
        dataItem.textContent = 'followers: empty';
      } else if (key === 'avatar') {
        const avatarImg = document.createElement('img');
        avatarImg.src = data[key];
        avatarImg.alt = `${username}'s avatar`;
        avatarImg.width = 64;
        avatarImg.height = 64;
        dataItem.appendChild(avatarImg);
      } else {
        dataItem.textContent = `${key}: ${data[key]}`;
      }
      userData.appendChild(dataItem);
    });
  });

// Fetch data from the /getLeaderboard endpoint
fetch('http://localhost:3000/getLeaderboard')
  .then(response => response.json())
  .then(data => {
    const leaderboard = document.getElementById('leaderboard');
    Object.keys(data).forEach(key => {
      const leaderboardItem = document.createElement('li');
      leaderboardItem.textContent = `${key}: ${data[key]}`;
      leaderboard.appendChild(leaderboardItem);
    });
  });
